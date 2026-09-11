export type Talk = {
  id: string;
  title: string;
  speakerId: string;
  lengthMinutes: number;
};

export type Room = {
  id: string;
  name: string;
};

export type Slot = {
  id: string;
  day: string;
  start: string;
  end: string;
};

export type Assignment = {
  talkId: string;
  roomId: string;
  slotId: string;
};

export type ConflictReason =
  | "TALK_NOT_FOUND"
  | "ROOM_NOT_FOUND"
  | "SLOT_NOT_FOUND"
  | "TALK_TOO_LONG_FOR_SLOT"
  | "ROOM_ALREADY_BOOKED"
  | "SPEAKER_DOUBLE_BOOKED";

export type ScheduleResult = { ok: true } | { ok: false; reason: ConflictReason };

export function timeToMinutes(time: string): number {
  const [hoursPart, minutesPart] = time.split(":");
  return Number(hoursPart ?? 0) * 60 + Number(minutesPart ?? 0);
}

export function slotDurationMinutes(slot: Slot): number {
  return timeToMinutes(slot.end) - timeToMinutes(slot.start);
}

export function slotsOverlap(a: Slot, b: Slot): boolean {
  if (a.day !== b.day) return false;
  const aStart = timeToMinutes(a.start);
  const aEnd = timeToMinutes(a.end);
  const bStart = timeToMinutes(b.start);
  const bEnd = timeToMinutes(b.end);
  return aStart < bEnd && bStart < aEnd;
}

export function isSlotWithinDay(slot: Slot, dayStart: string, dayEnd: string): boolean {
  return timeToMinutes(slot.start) >= timeToMinutes(dayStart) && timeToMinutes(slot.end) <= timeToMinutes(dayEnd);
}

/**
 * Validates whether `talkId` can be placed into `roomId` / `slotId`, given the
 * current assignments (which must NOT already include an entry for `talkId` -
 * callers upserting a move should exclude the talk's own prior assignment first).
 */
export function validateAssignment(
  input: { talkId: string; roomId: string; slotId: string },
  data: { talks: Talk[]; rooms: Room[]; slots: Slot[]; assignments: Assignment[] },
): ScheduleResult {
  const talk = data.talks.find((t) => t.id === input.talkId);
  if (!talk) return { ok: false, reason: "TALK_NOT_FOUND" };

  const room = data.rooms.find((r) => r.id === input.roomId);
  if (!room) return { ok: false, reason: "ROOM_NOT_FOUND" };

  const slot = data.slots.find((s) => s.id === input.slotId);
  if (!slot) return { ok: false, reason: "SLOT_NOT_FOUND" };

  if (talk.lengthMinutes > slotDurationMinutes(slot)) {
    return { ok: false, reason: "TALK_TOO_LONG_FOR_SLOT" };
  }

  const roomTaken = data.assignments.some(
    (a) => a.roomId === input.roomId && a.slotId === input.slotId && a.talkId !== input.talkId,
  );
  if (roomTaken) return { ok: false, reason: "ROOM_ALREADY_BOOKED" };

  const speakerBusy = data.assignments.some((a) => {
    if (a.talkId === input.talkId) return false;
    const otherTalk = data.talks.find((t) => t.id === a.talkId);
    if (!otherTalk || otherTalk.speakerId !== talk.speakerId) return false;
    const otherSlot = data.slots.find((s) => s.id === a.slotId);
    if (!otherSlot) return false;
    return slotsOverlap(slot, otherSlot);
  });
  if (speakerBusy) return { ok: false, reason: "SPEAKER_DOUBLE_BOOKED" };

  return { ok: true };
}

export const CONFLICT_MESSAGES: Record<ConflictReason, string> = {
  TALK_NOT_FOUND: "That talk does not exist.",
  ROOM_NOT_FOUND: "That room does not exist.",
  SLOT_NOT_FOUND: "That slot does not exist.",
  TALK_TOO_LONG_FOR_SLOT: "This talk is longer than the selected slot.",
  ROOM_ALREADY_BOOKED: "This room is already booked for that slot.",
  SPEAKER_DOUBLE_BOOKED: "The speaker already has a talk at an overlapping time.",
};
