import { db } from "./client";
import { assignments, conference, rooms, slots, speakers, talks } from "./schema";

export function getScheduleData() {
  const conferenceRow = db.select().from(conference).get();
  const roomRows = db.select().from(rooms).all();
  const slotRows = db.select().from(slots).all();
  const speakerRows = db.select().from(speakers).all();
  const talkRows = db.select().from(talks).all();
  const assignmentRows = db.select().from(assignments).all();

  return {
    conference: conferenceRow ?? null,
    rooms: roomRows,
    slots: slotRows,
    speakers: speakerRows,
    talks: talkRows,
    assignments: assignmentRows,
  };
}

export type ScheduleData = ReturnType<typeof getScheduleData>;
