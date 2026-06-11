import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pool from "./index.js";
import { ensureSchema, seedAdminUser } from "./bootstrap.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const legacyDataPath = path.join(rootDir, "storage", "portfolio-data.json");

const parseEnvFile = async () => {
  const envPath = path.join(rootDir, ".env");

  try {
    const content = await fs.readFile(envPath, "utf8");
    content.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) return;
      const key = trimmed.slice(0, separatorIndex).trim();
      let value = trimmed.slice(separatorIndex + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    });
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
};

const run = async () => {
  await parseEnvFile();
  console.log("Starting database migration...");

  await ensureSchema();
  console.log("Schema applied successfully.");

  try {
    const legacyData = JSON.parse(await fs.readFile(legacyDataPath, "utf8"));
    const sections = Object.entries(legacyData);

    for (const [sectionName, content] of sections) {
      await pool.query(
        `INSERT INTO portfolio_sections (section_name, content, updated_at)
         VALUES ($1, $2::jsonb, NOW())
         ON CONFLICT (section_name)
         DO UPDATE SET content = EXCLUDED.content, updated_at = NOW()`,
        [sectionName, JSON.stringify(content)],
      );
    }

    console.log(`Seeded ${sections.length} portfolio sections from JSON.`);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log("No legacy storage/portfolio-data.json found. Skipping seed.");
    } else {
      throw error;
    }
  }

  await seedAdminUser();

  console.log("Migration completed successfully.");
};

run()
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
