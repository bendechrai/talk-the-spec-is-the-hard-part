import { readFileSync } from "node:fs";
import { getDb } from "@/db/client";
import { seedDatabase } from "@/lib/seed";
import type { SeedData } from "@/lib/seed-data";

const raw = readFileSync(new URL("../seed.json", import.meta.url), "utf-8");
const data = JSON.parse(raw) as SeedData;

const db = getDb();
seedDatabase(db, data);
console.log(`Seeded ${data.talks.length} talks, ${data.rooms.length} rooms, ${data.slots.length} slots.`);
