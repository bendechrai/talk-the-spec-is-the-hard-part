import { __setTestConnection } from "@/db";
import { applySeed, type SeedData } from "@/lib/seed-fixture";
import seedJson from "../../seed.json";
import { createTestDb } from "./db";

/**
 * Points the app's shared `db` binding at a fresh, seeded in-memory database
 * so API route handlers (imported normally, exactly as production does) run
 * against isolated test data.
 */
export function setUpApiTestDb() {
  const { db, sqlite } = createTestDb();
  applySeed(db, seedJson as SeedData);
  __setTestConnection({ db, sqlite });
  return db;
}
