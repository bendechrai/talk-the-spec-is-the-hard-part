import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { getDb } from "@/db/client";

const db = getDb();
migrate(db, { migrationsFolder: "./drizzle" });
console.log("Migrations applied.");
