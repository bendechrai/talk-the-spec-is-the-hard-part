import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "@/db/schema";
import type { DbClient } from "@/db/client";
import { seedDatabase } from "@/lib/seed";
import type { SeedData } from "@/lib/seed-data";

export interface TestDb {
  db: DbClient;
  path: string;
  cleanup: () => void;
}

export function createTestDb(): TestDb {
  const dir = mkdtempSync(path.join(tmpdir(), "scheduler-test-"));
  const dbPath = path.join(dir, "test.db");
  const sqlite = new Database(dbPath);
  sqlite.pragma("foreign_keys = ON");
  const db = drizzle(sqlite, { schema });
  migrate(db, { migrationsFolder: path.resolve(process.cwd(), "drizzle") });

  return {
    db,
    path: dbPath,
    cleanup: () => {
      sqlite.close();
      rmSync(dir, { recursive: true, force: true });
    },
  };
}

export function seedTestDb(db: DbClient, data: SeedData): void {
  seedDatabase(db, data);
}

export interface EnvTestDb {
  dbPath: string;
  cleanup: () => void;
}

export function createTestDbForEnv(): EnvTestDb {
  const dir = mkdtempSync(path.join(tmpdir(), "scheduler-env-test-"));
  const dbPath = path.join(dir, "test.db");
  const sqlite = new Database(dbPath);
  sqlite.pragma("foreign_keys = ON");
  const db = drizzle(sqlite, { schema });
  migrate(db, { migrationsFolder: path.resolve(process.cwd(), "drizzle") });
  sqlite.close();

  const previous = process.env.DATABASE_URL;
  process.env.DATABASE_URL = dbPath;

  return {
    dbPath,
    cleanup: () => {
      process.env.DATABASE_URL = previous;
      rmSync(dir, { recursive: true, force: true });
    },
  };
}

export const minimalSeed: SeedData = {
  conference: { name: "Test Conf", days: ["2026-09-10"], dayStart: "09:00", dayEnd: "17:00" },
  rooms: [
    { id: "main", name: "Main Hall", capacity: 300 },
    { id: "b", name: "Room B", capacity: 80 },
    { id: "c", name: "Room C", capacity: 40 },
  ],
  slots: [
    { id: "d1-1000", day: "2026-09-10", start: "10:00", end: "10:45", kind: "session" },
    { id: "d1-1100", day: "2026-09-10", start: "11:00", end: "11:45", kind: "session" },
    { id: "d1-1130", day: "2026-09-10", start: "11:30", end: "12:30", kind: "break", label: "Lunch" },
  ],
  speakers: [
    { id: "ben", name: "Ben Dechrai" },
    { id: "priya", name: "Priya Natarajan" },
  ],
  talks: [
    { id: "t1", title: "The Spec Is the Hard Part", speakers: ["ben"], lengthMinutes: 45, track: "AI", expectedAudience: 250 },
    { id: "t2", title: "Ten Key Steps", speakers: ["ben"], lengthMinutes: 45, track: "Security", expectedAudience: 70 },
    { id: "t3", title: "Postgres Is Your Message Queue", speakers: ["priya"], lengthMinutes: 60, track: "Data", expectedAudience: 60 },
  ],
};
