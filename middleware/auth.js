import jwt from "jsonwebtoken";
import { query } from "../db/index.js";

const parseCookies = (cookieHeader = "") =>
  Object.fromEntries(
    cookieHeader
      .split(";")
      .map((cookie) => cookie.trim())
      .filter(Boolean)
      .map((cookie) => {
        const separatorIndex = cookie.indexOf("=");
        return [
          decodeURIComponent(cookie.slice(0, separatorIndex)),
          decodeURIComponent(cookie.slice(separatorIndex + 1)),
        ];
      }),
  );

const logSessionExpired = async (req, decoded) => {
  try {
    await query(
      `INSERT INTO audit_logs
       (event_category, admin_username, action, ip_address, user_agent, status)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        "ACCESS",
        decoded?.username || null,
        "SESSION_EXPIRED",
        req.ip,
        req.get("user-agent") || "",
        "FAILURE",
      ],
    );
  } catch {
    // Audit logging must not mask the auth failure response.
  }
};

export const requireAdmin = async (req, res, next) => {
  const { admin_session: token } = parseCookies(req.headers.cookie);

  if (!token) {
    res.status(401).json({ error: "Admin authentication required." });
    return;
  }

  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    const decoded = jwt.decode(token);
    if (error.name === "TokenExpiredError") {
      await logSessionExpired(req, decoded);
    }
    res.status(401).json({ error: "Admin authentication required." });
  }
};
