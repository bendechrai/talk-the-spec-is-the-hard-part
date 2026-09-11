import path from "node:path";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { openDb } from "@/db/client";
import { applySeed, type SeedData } from "@/lib/seed-fixture";
import seedJson from "../../seed.json";

export function createTestDb() {
  const { db, sqlite } = openDb(":memory:");
  migrate(db, { migrationsFolder: path.resolve(__dirname, "../../migrations") });
  return { db, sqlite };
}

export function createSeededTestDb() {
  const { db, sqlite } = createTestDb();
  applySeed(db, seedJson as SeedData);
  return { db, sqlite };
}
