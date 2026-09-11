import { eq } from "drizzle-orm";
import { db } from "./client";
import { assignments, rooms, slots, speakers, talks } from "./schema";
import { checkAssignment } from "../lib/scheduling";

export interface ScheduleData {
  rooms: { id: string; name: string }[];
  slots: { id: string; day: string; start: string; end: string; label: string | null }[];
  talks: {
    id: string;
    title: string;
    lengthMinutes: number;
    speakerId: string;
    speakerName: string;
    assignment: { roomId: string; slotId: string } | null;
  }[];
}

export async function getScheduleData(): Promise<ScheduleData> {
  const [roomRows, slotRows, talkRows, speakerRows, assignmentRows] = await Promise.all([
    db.select().from(rooms).all(),
    db.select().from(slots).all(),
    db.select().from(talks).all(),
    db.select().from(speakers).all(),
    db.select().from(assignments).all(),
  ]);

  const speakerById = new Map(speakerRows.map((s) => [s.id, s.name]));
  const assignmentByTalkId = new Map(assignmentRows.map((a) => [a.talkId, a]));

  return {
    rooms: roomRows,
    slots: slotRows.sort((a, b) => (a.day + a.start).localeCompare(b.day + b.start)),
    talks: talkRows.map((talk) => {
      const assignment = assignmentByTalkId.get(talk.id);
      return {
        id: talk.id,
        title: talk.title,
        lengthMinutes: talk.lengthMinutes,
        speakerId: talk.speakerId,
        speakerName: speakerById.get(talk.speakerId) ?? "Unknown",
        assignment: assignment ? { roomId: assignment.roomId, slotId: assignment.slotId } : null,
      };
    }),
  };
}

export type AssignResult =
  | { ok: true }
  | { ok: false; reason: string };

export async function assignTalk(input: {
  talkId: string;
  roomId: string;
  slotId: string;
}): Promise<AssignResult> {
  const [talkRows, slotRows, assignmentRows] = await Promise.all([
    db.select().from(talks).all(),
    db.select().from(slots).all(),
    db.select().from(assignments).all(),
  ]);

  const check = checkAssignment(input, {
    talks: talkRows.map((t) => ({ id: t.id, speakerId: t.speakerId, lengthMinutes: t.lengthMinutes })),
    slots: slotRows,
    existingAssignments: assignmentRows,
  });

  if (!check.ok) {
    return check;
  }

  db.insert(assignments)
    .values(input)
    .onConflictDoUpdate({
      target: assignments.talkId,
      set: { roomId: input.roomId, slotId: input.slotId },
    })
    .run();

  return { ok: true };
}

export async function unassignTalk(talkId: string): Promise<void> {
  db.delete(assignments).where(eq(assignments.talkId, talkId)).run();
}
