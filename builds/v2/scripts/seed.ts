import { readFileSync } from "node:fs";
import path from "node:path";
import { db } from "../src/db/client";
import { assignments, conference, rooms, slots, speakers, talks } from "../src/db/schema";
import { isSlotWithinDay } from "../src/lib/scheduling";

type SeedData = {
  conference: { name: string; days: string[]; dayStart: string; dayEnd: string };
  rooms: { id: string; name: string; capacity: number; wing?: string }[];
  slots: { id: string; day: string; start: string; end: string; label?: string }[];
  speakers: { id: string; name: string }[];
  talks: {
    id: string;
    title: string;
    speaker: string;
    lengthMinutes: number;
    track?: string;
    expectedAudience?: number;
  }[];
};

function main() {
  const seedPath = path.join(process.cwd(), "seed.json");
  const seed = JSON.parse(readFileSync(seedPath, "utf-8")) as SeedData;

  for (const slot of seed.slots) {
    if (!seed.conference.days.includes(slot.day)) {
      throw new Error(`Slot ${slot.id} falls on day ${slot.day}, which is not a conference day.`);
    }
    if (!isSlotWithinDay(slot, seed.conference.dayStart, seed.conference.dayEnd)) {
      throw new Error(
        `Slot ${slot.id} (${slot.start}-${slot.end}) falls outside the conference day bounds ${seed.conference.dayStart}-${seed.conference.dayEnd}.`,
      );
    }
  }

  db.delete(assignments).run();
  db.delete(talks).run();
  db.delete(speakers).run();
  db.delete(slots).run();
  db.delete(rooms).run();
  db.delete(conference).run();

  db.insert(conference)
    .values({ name: seed.conference.name, dayStart: seed.conference.dayStart, dayEnd: seed.conference.dayEnd })
    .run();

  for (const room of seed.rooms) {
    db.insert(rooms).values(room).run();
  }

  for (const speaker of seed.speakers) {
    db.insert(speakers).values(speaker).run();
  }

  for (const slot of seed.slots) {
    db.insert(slots).values(slot).run();
  }

  for (const talk of seed.talks) {
    db.insert(talks)
      .values({
        id: talk.id,
        title: talk.title,
        speakerId: talk.speaker,
        lengthMinutes: talk.lengthMinutes,
        track: talk.track,
        expectedAudience: talk.expectedAudience,
      })
      .run();
  }

  console.log(
    `Seeded ${seed.rooms.length} rooms, ${seed.slots.length} slots, ${seed.speakers.length} speakers, ${seed.talks.length} talks.`,
  );
}

main();
