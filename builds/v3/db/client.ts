import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

export type DbClient = ReturnType<typeof drizzle<typeof schema>>;

let cachedPath: string | null = null;
let cachedDb: DbClient | null = null;

export function getDb(): DbClient {
  const path = process.env.DATABASE_URL ?? "./data.db";
  if (!cachedDb || cachedPath !== path) {
    const sqlite = new Database(path);
    sqlite.pragma("journal_mode = WAL");
    sqlite.pragma("foreign_keys = ON");
    cachedDb = drizzle(sqlite, { schema });
    cachedPath = path;
  }
  return cachedDb;
}
