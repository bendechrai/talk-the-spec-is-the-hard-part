export interface TalkInfo {
  id: string;
  title: string;
  speakerIds: string[];
  lengthMinutes: number;
  track: string;
  expectedAudience: number;
}

export interface SlotInfo {
  id: string;
  day: string;
  start: string;
  end: string;
  kind: "session" | "break";
  label: string | null;
}

export interface RoomInfo {
  id: string;
  name: string;
  capacity: number;
}

export interface ExistingPlacement {
  talkId: string;
  slotId: string;
  roomId: string;
}

export interface ValidateSchedulingParams {
  talk: TalkInfo;
  slot: SlotInfo;
  room: RoomInfo;
  talksById: Map<string, TalkInfo>;
  existingPlacements: ExistingPlacement[];
}

export type SchedulingResult = { ok: true } | { ok: false; error: string };

function toMinutes(time: string): number {
  const parts = time.split(":");
  const hours = Number(parts[0] ?? 0);
  const minutes = Number(parts[1] ?? 0);
  return hours * 60 + minutes;
}

function slotDurationMinutes(slot: SlotInfo): number {
  return toMinutes(slot.end) - toMinutes(slot.start);
}

export function validateScheduling(params: ValidateSchedulingParams): SchedulingResult {
  const { talk, slot, room, talksById, existingPlacements } = params;

  if (slot.kind === "break") {
    return {
      ok: false,
      error: `Cannot schedule "${talk.title}" into ${slot.label ?? "a break"} slot.`,
    };
  }

  const duration = slotDurationMinutes(slot);
  if (talk.lengthMinutes > duration) {
    return {
      ok: false,
      error: `"${talk.title}" is ${talk.lengthMinutes} minutes long, which does not fit in a ${duration}-minute slot.`,
    };
  }

  if (talk.expectedAudience > room.capacity) {
    return {
      ok: false,
      error: `${room.name} has capacity ${room.capacity}, which is too small for "${talk.title}" (expected audience ${talk.expectedAudience}).`,
    };
  }

  const alreadyScheduled = existingPlacements.find((p) => p.talkId === talk.id);
  if (alreadyScheduled) {
    const existingSlot = alreadyScheduled.slotId;
    return {
      ok: false,
      error: `"${talk.title}" is already scheduled in slot ${existingSlot}.`,
    };
  }

  const roomTaken = existingPlacements.find(
    (p) => p.roomId === room.id && p.slotId === slot.id,
  );
  if (roomTaken) {
    const otherTalk = talksById.get(roomTaken.talkId);
    return {
      ok: false,
      error: `${room.name} already has "${otherTalk?.title ?? roomTaken.talkId}" scheduled in this slot.`,
    };
  }

  const placementsInSlot = existingPlacements.filter((p) => p.slotId === slot.id);

  for (const placement of placementsInSlot) {
    const otherTalk = talksById.get(placement.talkId);
    if (!otherTalk) continue;
    const sharedSpeaker = otherTalk.speakerIds.find((id) => talk.speakerIds.includes(id));
    if (sharedSpeaker) {
      return {
        ok: false,
        error: `Cannot schedule "${talk.title}" because its speaker is already scheduled for "${otherTalk.title}" in this slot.`,
      };
    }
  }

  for (const placement of placementsInSlot) {
    const otherTalk = talksById.get(placement.talkId);
    if (!otherTalk) continue;
    if (otherTalk.track === talk.track) {
      return {
        ok: false,
        error: `Cannot schedule "${talk.title}" because "${otherTalk.title}" is already scheduled in the ${talk.track} track for this slot.`,
      };
    }
  }

  return { ok: true };
}
