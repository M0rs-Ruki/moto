#!/usr/bin/env node
/**
 * Backup PostgreSQL database to a SQL file in backend/BACKUP/.
 * Uses pg_dump (requires PostgreSQL client tools: postgresql-client or libpq).
 * Run from repo root: pnpm backup
 * Or from backend: pnpm run backup
 */

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const backendDir = path.resolve(__dirname, "..");
const envPath = path.join(backendDir, ".env");
const backupDir = path.join(backendDir, "BACKUP");

function loadEnv() {
  if (!fs.existsSync(envPath)) {
    console.error("Error: .env not found at", envPath);
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, "utf8");
  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const eq = trimmed.indexOf("=");
    if (eq === -1) return;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  });
}

function ensureBackupDir() {
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
}

function runBackup() {
  loadEnv();
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl || !databaseUrl.startsWith("postgresql")) {
    console.error("Error: DATABASE_URL not set or not a PostgreSQL URL in backend/.env");
    process.exit(1);
  }

  ensureBackupDir();
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const filename = `backup-${timestamp}.sql`;
  const filepath = path.join(backupDir, filename);

  console.log("Backing up database to", filepath);
  const out = fs.createWriteStream(filepath);

  const pgDump = spawn("pg_dump", [databaseUrl], {
    stdio: ["ignore", "pipe", "inherit"],
    shell: false,
  });

  pgDump.stdout.pipe(out);

  pgDump.on("error", (err) => {
    console.error("Error running pg_dump:", err.message);
    console.error("Make sure PostgreSQL client tools are installed (e.g. postgresql-client, libpq).");
    process.exit(1);
  });

  pgDump.on("close", (code) => {
    out.end();
    if (code !== 0) {
      console.error("pg_dump exited with code", code);
      try { fs.unlinkSync(filepath); } catch (_) {}
      process.exit(1);
    }
    console.log("Backup written to", filepath);
  });
}

runBackup();
