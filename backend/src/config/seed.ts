import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";
import { config } from "../config";

/**
 * Runs db.schema.sql on server start.
 * The file should only contain idempotent statements
 * (CREATE DATABASE IF NOT EXISTS / CREATE TABLE IF NOT EXISTS).
 */
export async function seedDatabase() {
  const schemaPath = path.resolve(process.cwd(), "./src/config/db.schema.sql");
  const schemaSql = fs.readFileSync(schemaPath, "utf8");

  const conn = await mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.name,
    multipleStatements: true,
  });

  try {
    await conn.query(schemaSql);
    console.log("✅ Database schema ensured.");
  } catch (err) {
    console.error("❌ Failed to seed database:", err);
    throw err;
  } finally {
    await conn.end();
  }
}
