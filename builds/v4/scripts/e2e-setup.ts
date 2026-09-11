import fs from "node:fs";
import path from "node:path";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { openDb } from "../db/client";
import { applySeed, type SeedData } from "../lib/seed-fixture";

const DATABASE_PATH = process.env.DATABASE_PATH ?? path.join(process.cwd(), "e2e", "e2e-test.db");
const SEED_PATH = process.env.SEED_PATH ?? path.join(process.cwd(), "seed.json");

fs.mkdirSync(path.dirname(DATABASE_PATH), { recursive: true });
if (fs.existsSync(DATABASE_PATH)) fs.rmSync(DATABASE_PATH);

const seedData: SeedData = JSON.parse(fs.readFileSync(SEED_PATH, "utf-8"));
const { db, sqlite } = openDb(DATABASE_PATH);
migrate(db, { migrationsFolder: path.join(process.cwd(), "migrations") });
applySeed(db, seedData);
sqlite.close();

console.log(`e2e database prepared at ${DATABASE_PATH}`);
