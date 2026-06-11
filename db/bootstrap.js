import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import { query } from "./index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(__dirname, "schema.sql");
const seedDataPath = path.resolve(__dirname, "..", "storage", "portfolio-data.json");
const BCRYPT_HASH_PATTERN = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

export const ensureSchema = async () => {
  const schema = await fs.readFile(schemaPath, "utf8");
  await query(schema);
  await ensureSchemaCompatibility();
};

const ensureSchemaCompatibility = async () => {
  await query(`
    ALTER TABLE audit_logs
      ADD COLUMN IF NOT EXISTS event_category VARCHAR(20),
      ADD COLUMN IF NOT EXISTS admin_username VARCHAR(100),
      ADD COLUMN IF NOT EXISTS action VARCHAR(50),
      ADD COLUMN IF NOT EXISTS section VARCHAR(100),
      ADD COLUMN IF NOT EXISTS old_value JSONB,
      ADD COLUMN IF NOT EXISTS new_value JSONB,
      ADD COLUMN IF NOT EXISTS ip_address VARCHAR(50),
      ADD COLUMN IF NOT EXISTS user_agent TEXT,
      ADD COLUMN IF NOT EXISTS status VARCHAR(20),
      ADD COLUMN IF NOT EXISTS timestamp TIMESTAMP DEFAULT NOW();

    ALTER TABLE admin_login_otps
      ADD COLUMN IF NOT EXISTS username VARCHAR(100),
      ADD COLUMN IF NOT EXISTS hashed_otp TEXT,
      ADD COLUMN IF NOT EXISTS ip_address VARCHAR(50),
      ADD COLUMN IF NOT EXISTS user_agent TEXT,
      ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS consumed_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

    CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp
      ON audit_logs (timestamp DESC);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_event_action
      ON audit_logs (event_category, action);
    CREATE INDEX IF NOT EXISTS idx_admin_login_otps_username_created
      ON admin_login_otps (username, created_at DESC);
  `);
};

const getAdminPasswordHash = async (password) => {
  if (BCRYPT_HASH_PATTERN.test(password)) {
    return password;
  }

  return bcrypt.hash(password, 12);
};

const adminPasswordMatches = async (password, storedPassword) => {
  const passwordIsHash = BCRYPT_HASH_PATTERN.test(password);
  const storedPasswordIsHash = BCRYPT_HASH_PATTERN.test(storedPassword);

  if (passwordIsHash && storedPasswordIsHash) {
    return password === storedPassword;
  }

  if (passwordIsHash) {
    return bcrypt.compare(storedPassword, password);
  }

  if (storedPasswordIsHash) {
    return bcrypt.compare(password, storedPassword);
  }

  return password === storedPassword;
};

export const seedAdminUser = async () => {
  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    console.log(
      "ADMIN_USERNAME and ADMIN_PASSWORD were not set. Skipping admin user seed.",
    );
    return;
  }

  const existing = await query(
    "SELECT hashed_password FROM admin_users WHERE username = $1",
    [username],
  );

  if (existing.rowCount) {
    const currentHash = existing.rows[0].hashed_password;
    const passwordMatches = await adminPasswordMatches(password, currentHash);

    if (passwordMatches && BCRYPT_HASH_PATTERN.test(currentHash)) {
      console.log(`Admin user "${username}" is ready.`);
      return;
    }
  }

  const hashedPassword = await getAdminPasswordHash(password);
  await query(
    `INSERT INTO admin_users (username, hashed_password)
     VALUES ($1, $2)
     ON CONFLICT (username)
     DO UPDATE SET hashed_password = EXCLUDED.hashed_password`,
    [username, hashedPassword],
  );
  console.log(`Admin user "${username}" is ready.`);
};

export const seedMissingPortfolioSections = async () => {
  try {
    const seedData = JSON.parse(await fs.readFile(seedDataPath, "utf8"));
    const sections = Object.entries(seedData);

    for (const [sectionName, content] of sections) {
      await query(
        `INSERT INTO portfolio_sections (section_name, content, updated_at)
         VALUES ($1, $2::jsonb, NOW())
         ON CONFLICT (section_name) DO NOTHING`,
        [sectionName, JSON.stringify(content)],
      );
    }

    console.log(`Portfolio sections are ready (${sections.length} checked).`);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log("No storage/portfolio-data.json found. Skipping portfolio seed.");
      return;
    }
    throw error;
  }
};

export const ensureDatabaseReady = async () => {
  await ensureSchema();
  await seedMissingPortfolioSections();
  await seedAdminUser();
};
