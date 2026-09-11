import path from "node:path";
import type Database from "better-sqlite3";
import { openDb, type AppDatabase } from "./client";

const DATABASE_PATH = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data.db");

let connection = openDb(DATABASE_PATH);

export let db: AppDatabase = connection.db;
export let sqlite: Database.Database = connection.sqlite;

/**
 * Test-only hook: swaps the module-level db/sqlite bindings so route handlers
 * (which import `db` by live ESM binding) operate against an isolated test
 * database instead of the process-wide one.
 */
export function __setTestConnection(next: { db: AppDatabase; sqlite: Database.Database }): void {
  connection = next;
  db = next.db;
  sqlite = next.sqlite;
}
