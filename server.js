import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "node:path";
import { randomInt, randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import pool, { query, withTransaction } from "./db/index.js";
import { ensureDatabaseReady } from "./db/bootstrap.js";
import { requireAdmin } from "./middleware/auth.js";
import {
  sendAdminOtpEmail,
  sendBruteForceWarningEmail,
  sendContactMessageEmail,
  sendLoginAttemptEmail,
} from "./utils/mailer.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, "dist");
const PORT = Number(process.env.PORT || 5000);
const OTP_RECIPIENT =
  process.env.OTP_EMAIL || process.env.ADMIN_EMAIL || "sampc4469@gmail.com";
const OTP_TTL_MINUTES = Math.max(
  Number(process.env.OTP_TTL_MINUTES || 10),
  1,
);
const failedLoginAttempts = new Map();

const app = express();
app.set("trust proxy", 1);

const parseAllowedOrigins = () =>
  new Set(
    (process.env.ALLOWED_ORIGINS || process.env.ALLOWED_ORIGIN || "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
  );

const isLocalDevOrigin = (origin) => {
  if (process.env.NODE_ENV === "production") return false;

  try {
    const { hostname, protocol } = new URL(origin);
    return (
      (protocol === "http:" || protocol === "https:") &&
      ["localhost", "127.0.0.1", "::1", "[::1]"].includes(hostname)
    );
  } catch {
    return false;
  }
};

const corsOptionsDelegate = (req, callback) => {
  const origin = req.get("origin");
  const sameHostOrigin = `${req.protocol}://${req.get("host")}`;
  const allowedOrigins = parseAllowedOrigins();

  if (
    !origin ||
    origin === sameHostOrigin ||
    allowedOrigins.has(origin) ||
    isLocalDevOrigin(origin)
  ) {
    callback(null, {
      origin: origin || false,
      credentials: true,
    });
    return;
  }

  callback(new Error("CORS origin not allowed"));
};

app.use((req, res, next) => {
  if (req.path.startsWith("/storage")) {
    res.status(404).send("Not found");
    return;
  }
  next();
});

app.use(helmet());
app.use(cors(corsOptionsDelegate));
app.use(express.json({ limit: "1mb" }));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

const getCookieOptions = () => ({
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
  path: "/",
});

const getRequestMeta = (req) => ({
  ipAddress: req.ip,
  userAgent: req.get("user-agent") || "",
});

const isValidEmailAddress = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const logAudit = async ({
  eventCategory,
  adminUsername,
  action,
  section = null,
  oldValue = null,
  newValue = null,
  ipAddress = null,
  userAgent = null,
  status = null,
}) => {
  await query(
    `INSERT INTO audit_logs
     (event_category, admin_username, action, section, old_value, new_value, ip_address, user_agent, status)
     VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb, $7, $8, $9)`,
    [
      eventCategory,
      adminUsername,
      action,
      section,
      oldValue === null ? null : JSON.stringify(oldValue),
      newValue === null ? null : JSON.stringify(newValue),
      ipAddress,
      userAgent,
      status,
    ],
  );
};

const trackFailedLogin = async (ipAddress) => {
  const now = Date.now();
  const windowStart = now - 10 * 60 * 1000;
  const attempts = (failedLoginAttempts.get(ipAddress) || []).filter(
    (timestamp) => timestamp >= windowStart,
  );
  attempts.push(now);
  failedLoginAttempts.set(ipAddress, attempts);

  if (attempts.length >= 3) {
    await sendBruteForceWarningEmail({
      ipAddress,
      attempts: attempts.length,
    });
  }
};

const generateOtp = () => String(randomInt(100000, 1000000));

const createOtpChallenge = async ({ username, ipAddress, userAgent }) => {
  const id = randomUUID();
  const otp = generateOtp();
  const hashedOtp = await bcrypt.hash(otp, 12);
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  await withTransaction(async (client) => {
    await client.query(
      `UPDATE admin_login_otps
       SET consumed_at = NOW()
       WHERE username = $1 AND consumed_at IS NULL`,
      [username],
    );
    await client.query(
      `INSERT INTO admin_login_otps
       (id, username, hashed_otp, ip_address, user_agent, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, username, hashedOtp, ipAddress, userAgent, expiresAt],
    );
  });

  return { id, otp, expiresAt };
};

const issueAdminSession = (res, username) => {
  const token = jwt.sign(
    { username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "8h" },
  );

  res.cookie("admin_session", token, getCookieOptions());
};

app.get("/api/portfolio", async (_req, res, next) => {
  try {
    const { rows } = await query(
      "SELECT section_name, content FROM portfolio_sections ORDER BY id ASC",
    );
    const data = Object.fromEntries(
      rows.map((row) => [row.section_name, row.content]),
    );
    res.json({ data });
  } catch (error) {
    next(error);
  }
});

app.put("/api/portfolio/:section", requireAdmin, async (req, res, next) => {
  const section = req.params.section;
  const nextContent = req.body?.content;
  const { ipAddress, userAgent } = getRequestMeta(req);

  if (!section || nextContent === undefined) {
    res.status(400).json({ error: "Section name and content are required." });
    return;
  }

  try {
    const result = await withTransaction(async (client) => {
      const existing = await client.query(
        "SELECT content FROM portfolio_sections WHERE section_name = $1 FOR UPDATE",
        [section],
      );

      if (!existing.rowCount) {
        const error = new Error("Portfolio section not found.");
        error.status = 404;
        throw error;
      }

      const oldContent = existing.rows[0].content;
      await client.query(
        `INSERT INTO portfolio_backups (section_name, snapshot, saved_by)
         VALUES ($1, $2::jsonb, $3)`,
        [section, JSON.stringify(oldContent), req.admin.username],
      );
      const updated = await client.query(
        `UPDATE portfolio_sections
         SET content = $2::jsonb, updated_at = NOW()
         WHERE section_name = $1
         RETURNING section_name, content, updated_at`,
        [section, JSON.stringify(nextContent)],
      );
      await client.query(
        `INSERT INTO audit_logs
         (event_category, admin_username, action, section, old_value, new_value, ip_address, user_agent, status)
         VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb, $7, $8, $9)`,
        [
          "ACTION",
          req.admin.username,
          "UPDATE",
          section,
          JSON.stringify(oldContent),
          JSON.stringify(nextContent),
          ipAddress,
          userAgent,
          "SUCCESS",
        ],
      );

      return updated.rows[0];
    });

    res.json({ section: result.section_name, content: result.content });
  } catch (error) {
    next(error);
  }
});

app.post("/api/contact", contactLimiter, async (req, res, next) => {
  const name = String(req.body?.name || "").trim();
  const email = String(req.body?.email || "").trim();
  const subject = String(req.body?.subject || "").trim();
  const message = String(req.body?.message || "").trim();

  if (!name || !email || !subject || !message) {
    res.status(400).json({ error: "All contact fields are required." });
    return;
  }

  if (!isValidEmailAddress(email)) {
    res.status(400).json({ error: "Enter a valid email address." });
    return;
  }

  try {
    const sent = await sendContactMessageEmail({
      name,
      email,
      subject,
      message,
    });

    if (!sent) {
      res.status(503).json({ error: "Email is not configured." });
      return;
    }

    res.json({ sent: true });
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/login", loginLimiter, async (req, res, next) => {
  const { username, password } = req.body || {};
  const attemptedUsername = String(username || "");
  const { ipAddress, userAgent } = getRequestMeta(req);
  const timestamp = new Date().toISOString();

  try {
    const { rows } = await query(
      "SELECT username, hashed_password FROM admin_users WHERE username = $1",
      [attemptedUsername],
    );
    const user = rows[0];
    const isValid =
      user && (await bcrypt.compare(String(password || ""), user.hashed_password));

    if (!isValid) {
      await logAudit({
        eventCategory: "ACCESS",
        adminUsername: attemptedUsername || null,
        action: "LOGIN_FAIL",
        ipAddress,
        userAgent,
        status: "FAILURE",
      });
      await sendLoginAttemptEmail({
        status: "FAILURE",
        username: attemptedUsername,
        ipAddress,
        userAgent,
        timestamp,
      });
      await trackFailedLogin(ipAddress);
      res.status(401).json({ error: "Invalid username or password." });
      return;
    }

    const challenge = await createOtpChallenge({
      username: user.username,
      ipAddress,
      userAgent,
    });
    let sent = false;
    try {
      sent = await sendAdminOtpEmail({
        recipient: OTP_RECIPIENT,
        username: user.username,
        otp: challenge.otp,
        expiresInMinutes: OTP_TTL_MINUTES,
        ipAddress,
        userAgent,
        timestamp,
      });
    } catch (error) {
      console.error("Unable to send admin OTP email:", error.message);
    }

    if (!sent) {
      await query(
        "UPDATE admin_login_otps SET consumed_at = NOW() WHERE id = $1",
        [challenge.id],
      );
      await logAudit({
        eventCategory: "ACCESS",
        adminUsername: user.username,
        action: "LOGIN_OTP_SEND_FAIL",
        ipAddress,
        userAgent,
        status: "FAILURE",
      });
      res.status(503).json({ error: "Unable to send OTP email." });
      return;
    }

    await logAudit({
      eventCategory: "ACCESS",
      adminUsername: user.username,
      action: "LOGIN_OTP_SENT",
      ipAddress,
      userAgent,
      status: "SUCCESS",
    });
    await sendLoginAttemptEmail({
      status: "PASSWORD_SUCCESS_OTP_SENT",
      username: user.username,
      ipAddress,
      userAgent,
      timestamp,
    });

    res.json({
      authenticated: false,
      otpRequired: true,
      challengeId: challenge.id,
      username: user.username,
      recipientHint: OTP_RECIPIENT.replace(/^(.{2}).*(@.*)$/, "$1***$2"),
      expiresInMinutes: OTP_TTL_MINUTES,
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/verify-otp", loginLimiter, async (req, res, next) => {
  const challengeId = String(req.body?.challengeId || "").trim();
  const otp = String(req.body?.otp || "").replace(/\D/g, "");
  const { ipAddress, userAgent } = getRequestMeta(req);
  const timestamp = new Date().toISOString();

  if (!challengeId || otp.length !== 6) {
    res.status(400).json({ error: "Enter the 6-digit verification code." });
    return;
  }

  try {
    const { rows } = await query(
      `SELECT id, username, hashed_otp, expires_at, consumed_at
       FROM admin_login_otps
       WHERE id = $1`,
      [challengeId],
    );
    const challenge = rows[0];

    const isExpired =
      !challenge || challenge.consumed_at || new Date(challenge.expires_at) <= new Date();
    const isValid =
      !isExpired && (await bcrypt.compare(otp, challenge.hashed_otp));

    if (!isValid) {
      await logAudit({
        eventCategory: "ACCESS",
        adminUsername: challenge?.username || null,
        action: isExpired ? "LOGIN_OTP_EXPIRED" : "LOGIN_OTP_FAIL",
        ipAddress,
        userAgent,
        status: "FAILURE",
      });
      await trackFailedLogin(ipAddress);
      res.status(401).json({ error: "Invalid or expired verification code." });
      return;
    }

    await query(
      "UPDATE admin_login_otps SET consumed_at = NOW() WHERE id = $1",
      [challenge.id],
    );
    issueAdminSession(res, challenge.username);
    await logAudit({
      eventCategory: "ACCESS",
      adminUsername: challenge.username,
      action: "LOGIN_SUCCESS",
      ipAddress,
      userAgent,
      status: "SUCCESS",
    });
    await sendLoginAttemptEmail({
      status: "SUCCESS",
      username: challenge.username,
      ipAddress,
      userAgent,
      timestamp,
    });

    res.json({ authenticated: true, username: challenge.username });
  } catch (error) {
    next(error);
  }
});

app.get("/api/auth/session", async (req, res) => {
  const cookieHeader = req.headers.cookie || "";
  const adminSession = cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("admin_session="));

  if (!adminSession) {
    res.json({ authenticated: false, username: null });
    return;
  }

  try {
    const token = decodeURIComponent(adminSession.split("=").slice(1).join("="));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ authenticated: true, username: decoded.username });
  } catch {
    res.json({ authenticated: false, username: null });
  }
});

app.post("/api/auth/logout", requireAdmin, async (req, res, next) => {
  const { ipAddress, userAgent } = getRequestMeta(req);

  try {
    res.clearCookie("admin_session", getCookieOptions());
    await logAudit({
      eventCategory: "ACCESS",
      adminUsername: req.admin.username,
      action: "LOGOUT",
      ipAddress,
      userAgent,
      status: "SUCCESS",
    });
    res.json({ authenticated: false });
  } catch (error) {
    next(error);
  }
});

app.use("/api/admin", adminLimiter, requireAdmin);

app.get("/api/admin/backups", async (_req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT id, section_name, snapshot, saved_by, created_at
       FROM portfolio_backups
       ORDER BY created_at DESC
       LIMIT 20`,
    );
    res.json({ backups: rows });
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/backups/restore/:id", async (req, res, next) => {
  const { ipAddress, userAgent } = getRequestMeta(req);

  try {
    const result = await withTransaction(async (client) => {
      const backup = await client.query(
        "SELECT id, section_name, snapshot FROM portfolio_backups WHERE id = $1",
        [req.params.id],
      );
      if (!backup.rowCount) {
        const error = new Error("Backup not found.");
        error.status = 404;
        throw error;
      }

      const { section_name: section, snapshot } = backup.rows[0];
      const existing = await client.query(
        "SELECT content FROM portfolio_sections WHERE section_name = $1 FOR UPDATE",
        [section],
      );
      if (!existing.rowCount) {
        const error = new Error("Portfolio section not found.");
        error.status = 404;
        throw error;
      }

      const oldContent = existing.rows[0].content;
      await client.query(
        `INSERT INTO portfolio_backups (section_name, snapshot, saved_by)
         VALUES ($1, $2::jsonb, $3)`,
        [section, JSON.stringify(oldContent), req.admin.username],
      );
      const restored = await client.query(
        `UPDATE portfolio_sections
         SET content = $2::jsonb, updated_at = NOW()
         WHERE section_name = $1
         RETURNING section_name, content`,
        [section, JSON.stringify(snapshot)],
      );
      await client.query(
        `INSERT INTO audit_logs
         (event_category, admin_username, action, section, old_value, new_value, ip_address, user_agent, status)
         VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb, $7, $8, $9)`,
        [
          "ACTION",
          req.admin.username,
          "RESTORE",
          section,
          JSON.stringify(oldContent),
          JSON.stringify(snapshot),
          ipAddress,
          userAgent,
          "SUCCESS",
        ],
      );

      return restored.rows[0];
    });

    res.json({ section: result.section_name, content: result.content });
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/audit-logs", async (req, res, next) => {
  const filters = [];
  const values = [];

  const addFilter = (sql, value) => {
    values.push(value);
    filters.push(sql.replace("?", `$${values.length}`));
  };

  if (req.query.category) {
    addFilter("event_category = ?", req.query.category);
  }
  if (req.query.action) {
    addFilter("action = ?", req.query.action);
  }
  if (req.query.from) {
    addFilter("timestamp >= ?", req.query.from);
  }
  if (req.query.to) {
    addFilter("timestamp <= ?", `${req.query.to} 23:59:59`);
  }

  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit || 50), 1), 50);
  const offset = (page - 1) * limit;
  const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  try {
    values.push(limit, offset);
    const { rows } = await query(
      `SELECT id, event_category, admin_username, action, section, old_value,
              new_value, ip_address, user_agent, status, timestamp
       FROM audit_logs
       ${where}
       ORDER BY timestamp DESC
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values,
    );
    res.json({ logs: rows, page, limit });
  } catch (error) {
    next(error);
  }
});

app.use(express.static(DIST_DIR));

app.use((req, res, next) => {
  if (req.method !== "GET") {
    next();
    return;
  }

  res.sendFile(path.join(DIST_DIR, "index.html"));
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({
    error: error.message || "Server error.",
  });
});

let server;

const startServer = async () => {
  await ensureDatabaseReady();

  server = app.listen(PORT, () => {
    console.log(`Samuel portfolio server running at https://samuelmwambua-1.onrender.com:${PORT}`);
  });
};

startServer().catch(async (error) => {
  console.error("Server startup failed:", error);
  await pool.end();
  process.exit(1);
});

process.on("SIGTERM", async () => {
  if (server) server.close();
  await pool.end();
  process.exit(0);
});
