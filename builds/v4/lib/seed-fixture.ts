import { days, placements, rooms, slots, speakers, talkSpeakers, talks } from "@/db/schema";
import type { Db } from "./repo";

export interface SeedData {
  conference: {
    name: string;
    days: string[];
    dayStart: string;
    dayEnd: string;
  };
  rooms: { id: string; name: string; capacity: number }[];
  slots: {
    id: string;
    day: string;
    start: string;
    end: string;
    kind: "session" | "break";
    label?: string;
  }[];
  speakers: { id: string; name: string }[];
  talks: {
    id: string;
    title: string;
    speakers: string[];
    lengthMinutes: number;
    track: string;
    expectedAudience: number;
  }[];
}

export function applySeed(db: Db, seedData: SeedData): void {
  db.transaction((tx) => {
    tx.delete(placements).run();
    tx.delete(talkSpeakers).run();
    tx.delete(talks).run();
    tx.delete(slots).run();
    tx.delete(rooms).run();
    tx.delete(speakers).run();
    tx.delete(days).run();

    for (const date of seedData.conference.days) {
      tx.insert(days)
        .values({
          id: date,
          date,
          dayStart: seedData.conference.dayStart,
          dayEnd: seedData.conference.dayEnd,
        })
        .run();
    }

    for (const room of seedData.rooms) {
      tx.insert(rooms).values({ id: room.id, name: room.name, capacity: room.capacity }).run();
    }

    for (const speaker of seedData.speakers) {
      tx.insert(speakers).values({ id: speaker.id, name: speaker.name }).run();
    }

    for (const slot of seedData.slots) {
      tx.insert(slots)
        .values({
          id: slot.id,
          dayId: slot.day,
          start: slot.start,
          end: slot.end,
          kind: slot.kind,
          label: slot.label ?? null,
        })
        .run();
    }

    for (const talk of seedData.talks) {
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
