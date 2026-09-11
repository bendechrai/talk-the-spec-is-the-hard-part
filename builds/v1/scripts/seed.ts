import { readFileSync } from "node:fs";
import { db } from "../src/db/client";
import { rooms, slots, speakers, talks, assignments } from "../src/db/schema";

interface SeedData {
  rooms: { id: string; name: string }[];
  slots: { id: string; day: string; start: string; end: string; label?: string }[];
  speakers: { id: string; name: string }[];
  talks: { id: string; title: string; speaker: string; lengthMinutes: number }[];
}

const raw = readFileSync(new URL("../seed.json", import.meta.url), "utf-8");
const data = JSON.parse(raw) as SeedData;

db.delete(assignments).run();
db.delete(talks).run();
db.delete(slots).run();
db.delete(rooms).run();
db.delete(speakers).run();

for (const room of data.rooms) {
  db.insert(rooms).values(room).run();
}

for (const slot of data.slots) {
  db.insert(slots).values(slot).run();
}

for (const speaker of data.speakers) {
  db.insert(speakers).values(speaker).run();
}

for (const talk of data.talks) {
  db.insert(talks)
    .values({
      id: talk.id,
      title: talk.title,
      speakerId: talk.speaker,
      lengthMinutes: talk.lengthMinutes,
    })
    .run();
}

console.log(
  `Seeded ${data.rooms.length} rooms, ${data.slots.length} slots, ${data.speakers.length} speakers, ${data.talks.length} talks.`,
);
