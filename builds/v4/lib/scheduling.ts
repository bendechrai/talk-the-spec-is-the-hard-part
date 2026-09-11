import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { days, placements, rooms, slots, talkSpeakers, talks } from "@/db/schema";
import { NotFoundError, SchedulingError } from "./errors";
import {
  findPlacementByRoomSlot,
  findPlacementByTalk,
  getConflictingSlotIds,
  getPlacementsForSlotIds,
  getPlacementsInRoom,
  loadRoom,
  loadSlot,
  loadSpeakerName,
  loadTalk,
  type Db,
  type PlacementRecord,
  type RoomRecord,
  type SlotRecord,
  type TalkRecord,
} from "./repo";
import { slotLengthMinutes, toMinutes } from "./time";

function formatSlot(slot: SlotRecord): string {
  return `${slot.day.date} ${slot.start}-${slot.end}`;
}

function assertFits(talk: Pick<TalkRecord, "title" | "lengthMinutes">, slot: SlotRecord): void {
  if (slot.kind === "break") {
    throw new SchedulingError(
      `Cannot place talk "${talk.title}" into break slot${slot.label ? ` "${slot.label}"` : ""} (${formatSlot(slot)}).`,
    );
  }
  const slotLen = slotLengthMinutes(slot.start, slot.end);
  if (slotLen < talk.lengthMinutes) {
    throw new SchedulingError(
      `Talk "${talk.title}" is ${talk.lengthMinutes} minutes long, which does not fit in the ${slotLen}-minute slot ${formatSlot(slot)}.`,
    );
  }
}

function assertCapacity(
  talk: Pick<TalkRecord, "title" | "expectedAudience">,
  room: RoomRecord,
): void {
  if (room.capacity < talk.expectedAudience) {
    throw new SchedulingError(
      `Room "${room.name}" has capacity ${room.capacity}, which is less than the expected audience of ${talk.expectedAudience} for talk "${talk.title}".`,
    );
  }
}

function assertNoConflicts(
  db: Db,
  talk: Pick<TalkRecord, "id" | "title" | "track" | "speakerIds">,
  slot: SlotRecord,
  excludePlacementId?: string,
): void {
  const conflictingSlotIds = getConflictingSlotIds(db, slot);
  const otherPlacements = getPlacementsForSlotIds(db, conflictingSlotIds, excludePlacementId).filter(
    (p) => p.talkId !== talk.id,
  );

  for (const placement of otherPlacements) {
    const otherTalk = loadTalk(db, placement.talkId);
    if (!otherTalk) continue;
    const otherSlot = loadSlot(db, placement.slotId);
    if (!otherSlot) continue;

    const sharedSpeakerId = otherTalk.speakerIds.find((id) => talk.speakerIds.includes(id));
    if (sharedSpeakerId) {
      const speakerName = loadSpeakerName(db, sharedSpeakerId) ?? sharedSpeakerId;
      throw new SchedulingError(
        `Cannot place talk "${talk.title}" at ${formatSlot(slot)}: speaker "${speakerName}" is already speaking in talk "${otherTalk.title}" at the conflicting slot ${formatSlot(otherSlot)}.`,
      );
    }

    if (otherTalk.track === talk.track) {
      throw new SchedulingError(
        `Cannot place talk "${talk.title}" at ${formatSlot(slot)}: track "${talk.track}" already has talk "${otherTalk.title}" scheduled at the conflicting slot ${formatSlot(otherSlot)}.`,
      );
    }
  }
}

function requireTalk(db: Db, talkId: string): TalkRecord {
  const talk = loadTalk(db, talkId);
  if (!talk) throw new NotFoundError(`Talk "${talkId}" does not exist.`);
  return talk;
}

function requireRoom(db: Db, roomId: string): RoomRecord {
  const room = loadRoom(db, roomId);
  if (!room) throw new NotFoundError(`Room "${roomId}" does not exist.`);
  return room;
}

function requireSlot(db: Db, slotId: string): SlotRecord {
  const slot = loadSlot(db, slotId);
  if (!slot) throw new NotFoundError(`Slot "${slotId}" does not exist.`);
  return slot;
}

export function placeTalk(
  db: Db,
  params: { talkId: string; roomId: string; slotId: string },
): PlacementRecord {
  return db.transaction((tx) => {
    const talk = requireTalk(tx, params.talkId);
    const room = requireRoom(tx, params.roomId);
    const slot = requireSlot(tx, params.slotId);

    assertFits(talk, slot);
    assertCapacity(talk, room);

    const existingForTalk = findPlacementByTalk(tx, talk.id);
    if (existingForTalk) {
      const existingSlot = requireSlot(tx, existingForTalk.slotId);
      const existingRoom = requireRoom(tx, existingForTalk.roomId);
      throw new SchedulingError(
        `Talk "${talk.title}" is already placed in room "${existingRoom.name}" at ${formatSlot(existingSlot)}.`,
      );
    }

    const existingForRoomSlot = findPlacementByRoomSlot(tx, room.id, slot.id);
    if (existingForRoomSlot) {
      const otherTalk = requireTalk(tx, existingForRoomSlot.talkId);
      throw new SchedulingError(
        `Room "${room.name}" at ${formatSlot(slot)} is already occupied by talk "${otherTalk.title}".`,
      );
    }

    assertNoConflicts(tx, talk, slot);

    const id = randomUUID();
    tx.insert(placements).values({ id, talkId: talk.id, roomId: room.id, slotId: slot.id }).run();
    return { id, talkId: talk.id, roomId: room.id, slotId: slot.id };
  });
}

export function unplaceTalk(db: Db, talkId: string): void {
  db.transaction((tx) => {
    const talk = requireTalk(tx, talkId);
    const existing = findPlacementByTalk(tx, talk.id);
    if (!existing) {
      throw new NotFoundError(`Talk "${talk.title}" is not currently placed.`);
    }
    tx.delete(placements).where(eq(placements.id, existing.id)).run();
  });
}

export interface CreateSlotInput {
  id: string;
  dayId: string;
  start: string;
  end: string;
  kind: "session" | "break";
  label?: string | null;
}

export function createSlot(db: Db, input: CreateSlotInput): SlotRecord {
  return db.transaction((tx) => {
    const day = tx.select().from(days).where(eq(days.id, input.dayId)).get();
    if (!day) throw new NotFoundError(`Day "${input.dayId}" does not exist.`);

    if (toMinutes(input.start) >= toMinutes(input.end)) {
      throw new SchedulingError(`Slot start ${input.start} must be before end ${input.end}.`);
    }

    if (toMinutes(input.start) < toMinutes(day.dayStart) || toMinutes(input.end) > toMinutes(day.dayEnd)) {
      throw new SchedulingError(
        `Slot ${input.start}-${input.end} on ${day.date} falls outside the conference day (${day.dayStart}-${day.dayEnd}).`,
      );
    }

    tx.insert(slots)
      .values({
        id: input.id,
        dayId: input.dayId,
        start: input.start,
        end: input.end,
        kind: input.kind,
        label: input.label ?? null,
      })
      .run();

    return { ...input, label: input.label ?? null, day };
  });
}

export function deleteSlot(db: Db, slotId: string): void {
  db.transaction((tx) => {
    const slot = requireSlot(tx, slotId);
    const existing = getPlacementsForSlotIds(tx, [slotId]);
    if (existing.length > 0) {
      throw new SchedulingError(
        `Cannot delete slot ${formatSlot(slot)}: it has ${existing.length} placement(s). Remove them first.`,
      );
    }
    tx.delete(slots).where(eq(slots.id, slotId)).run();
  });
}

export function deleteRoom(db: Db, roomId: string): void {
  db.transaction((tx) => {
    const room = requireRoom(tx, roomId);
    const existing = getPlacementsInRoom(tx, roomId);
    if (existing.length > 0) {
      throw new SchedulingError(
        `Cannot delete room "${room.name}": it has ${existing.length} placement(s). Remove them first.`,
      );
    }
    tx.delete(rooms).where(eq(rooms.id, roomId)).run();
  });
}

export interface UpdateRoomInput {
  name?: string;
  capacity?: number;
}

export function updateRoom(db: Db, roomId: string, patch: UpdateRoomInput): RoomRecord {
  return db.transaction((tx) => {
    const current = requireRoom(tx, roomId);
    const updated = { ...current, ...patch };

    if (patch.capacity !== undefined && patch.capacity < current.capacity) {
      const roomPlacements = getPlacementsInRoom(tx, roomId);
      for (const placement of roomPlacements) {
        const talk = requireTalk(tx, placement.talkId);
        if (updated.capacity < talk.expectedAudience) {
          const slot = requireSlot(tx, placement.slotId);
          throw new SchedulingError(
            `Cannot reduce capacity of room "${current.name}" to ${updated.capacity}: placement of talk "${talk.title}" (audience ${talk.expectedAudience}) in room "${current.name}" at ${formatSlot(slot)} would then violate room capacity.`,
          );
        }
      }
    }

    tx.update(rooms).set(patch).where(eq(rooms.id, roomId)).run();
    return updated;
  });
}

export interface UpdateTalkInput {
  title?: string;
  lengthMinutes?: number;
  track?: string;
  expectedAudience?: number;
  speakerIds?: string[];
}

export function updateTalk(db: Db, talkId: string, patch: UpdateTalkInput): TalkRecord {
  return db.transaction((tx) => {
    const current = requireTalk(tx, talkId);
    const updated: TalkRecord = { ...current, ...patch };

    const existing = findPlacementByTalk(tx, talkId);
    if (existing) {
      const room = requireRoom(tx, existing.roomId);
      const slot = requireSlot(tx, existing.slotId);
      try {
        assertFits(updated, slot);
        assertCapacity(updated, room);
        assertNoConflicts(tx, updated, slot, existing.id);
      } catch (err) {
        if (err instanceof SchedulingError) {
          throw new SchedulingError(
            `Cannot update talk "${current.title}": its placement in room "${room.name}" at ${formatSlot(slot)} would become invalid (${err.message})`,
          );
        }
        throw err;
      }
    }

    const { speakerIds, ...talkFields } = patch;
    if (Object.keys(talkFields).length > 0) {
      tx.update(talks).set(talkFields).where(eq(talks.id, talkId)).run();
    }
    if (speakerIds) {
      tx.delete(talkSpeakers).where(eq(talkSpeakers.talkId, talkId)).run();
      for (const speakerId of speakerIds) {
        tx.insert(talkSpeakers).values({ talkId, speakerId }).run();
      }
    }

    return updated;
  });
}
