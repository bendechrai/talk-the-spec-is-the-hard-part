import path from "node:path";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { openDb } from "../db/client";

const DATABASE_PATH = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data.db");

const { db, sqlite } = openDb(DATABASE_PATH);
migrate(db, { migrationsFolder: path.join(process.cwd(), "migrations") });
sqlite.close();

console.log(`Migrations applied to ${DATABASE_PATH}`);
