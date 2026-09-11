export interface SlotInfo {
  id: string;
  day: string;
  start: string;
  end: string;
}

export interface TalkInfo {
  id: string;
  speakerId: string;
  lengthMinutes: number;
}

export interface ExistingAssignment {
  talkId: string;
  roomId: string;
  slotId: string;
}

export type ScheduleCheck =
  | { ok: true }
  | { ok: false; reason: string };

function toMinutesSinceMidnight(time: string): number {
  const parts = time.split(":");
  const hour = Number(parts[0] ?? 0);
  const minute = Number(parts[1] ?? 0);
  return hour * 60 + minute;
}

function minutesBetween(start: string, end: string): number {
  return toMinutesSinceMidnight(end) - toMinutesSinceMidnight(start);
}

export function checkAssignment(
  request: { talkId: string; roomId: string; slotId: string },
  context: {
    talks: TalkInfo[];
    slots: SlotInfo[];
    existingAssignments: ExistingAssignment[];
  },
): ScheduleCheck {
  const talk = context.talks.find((t) => t.id === request.talkId);
  if (!talk) {
    return { ok: false, reason: "Talk not found." };
  }

  const slot = context.slots.find((s) => s.id === request.slotId);
  if (!slot) {
    return { ok: false, reason: "Slot not found." };
  }

  const slotDuration = minutesBetween(slot.start, slot.end);
  if (talk.lengthMinutes > slotDuration) {
    return {
      ok: false,
      reason: `Talk is ${talk.lengthMinutes} minutes but the slot is only ${slotDuration} minutes.`,
    };
  }

  const otherAssignments = context.existingAssignments.filter(
    (a) => a.talkId !== request.talkId,
  );

  const roomTaken = otherAssignments.find(
    (a) => a.roomId === request.roomId && a.slotId === request.slotId,
  );
  if (roomTaken) {
    return { ok: false, reason: "That room is already booked for that slot." };
  }

  const speakerBusy = otherAssignments.find((a) => {
    if (a.slotId !== request.slotId) return false;
    const otherTalk = context.talks.find((t) => t.id === a.talkId);
    return otherTalk?.speakerId === talk.speakerId;
  });
  if (speakerBusy) {
    return {
      ok: false,
      reason: "This speaker is already scheduled in another room for that slot.",
    };
  }

  return { ok: true };
}
