import type { DbClient } from "@/db/client";
import { placements, rooms, slots, speakers, talkSpeakers, talks } from "@/db/schema";
import type { SeedData } from "./seed-data";

export function seedDatabase(db: DbClient, data: SeedData): void {
  db.transaction((tx) => {
    tx.delete(placements).run();
    tx.delete(talkSpeakers).run();
    tx.delete(talks).run();
    tx.delete(slots).run();
    tx.delete(rooms).run();
    tx.delete(speakers).run();

    for (const room of data.rooms) {
      tx.insert(rooms)
        .values({ id: room.id, name: room.name, capacity: room.capacity, wing: room.wing ?? null })
        .run();
    }

    for (const speaker of data.speakers) {
      tx.insert(speakers).values({ id: speaker.id, name: speaker.name }).run();
    }

    for (const slot of data.slots) {
      tx.insert(slots)
        .values({
          id: slot.id,
          day: slot.day,
          start: slot.start,
          end: slot.end,
          kind: slot.kind,
          label: slot.label ?? null,
        })
        .run();
    }

    for (const talk of data.talks) {
      tx.insert(talks)
        .values({
          id: talk.id,
          title: talk.title,
          lengthMinutes: talk.lengthMinutes,
          track: talk.track,
          expectedAudience: talk.expectedAudience,
        })
        .run();

      for (const speakerId of talk.speakers) {
        tx.insert(talkSpeakers).values({ talkId: talk.id, speakerId }).run();
      }
    }
  });
}
