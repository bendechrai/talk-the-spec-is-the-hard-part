import { and, eq, inArray, ne } from "drizzle-orm";
import type { AppDatabase } from "@/db/client";
import { days, placements, rooms, slots, speakers, talkSpeakers, talks } from "@/db/schema";
import { rangesOverlap } from "./time";

export type Db = AppDatabase;

export interface DayRecord {
  id: string;
  date: string;
  dayStart: string;
  dayEnd: string;
}

export interface RoomRecord {
  id: string;
  name: string;
  capacity: number;
}

export interface SlotRecord {
  id: string;
  dayId: string;
  start: string;
  end: string;
  kind: "session" | "break";
  label: string | null;
  day: DayRecord;
}

export interface TalkRecord {
  id: string;
  title: string;
  lengthMinutes: number;
  track: string;
  expectedAudience: number;
  speakerIds: string[];
}

export interface PlacementRecord {
  id: string;
  talkId: string;
  roomId: string;
  slotId: string;
}

export function loadDay(db: Db, dayId: string): DayRecord | undefined {
  return db.select().from(days).where(eq(days.id, dayId)).get();
}

export function loadRoom(db: Db, roomId: string): RoomRecord | undefined {
  return db.select().from(rooms).where(eq(rooms.id, roomId)).get();
}

export function loadSlot(db: Db, slotId: string): SlotRecord | undefined {
  const row = db
    .select({
      id: slots.id,
      dayId: slots.dayId,
      start: slots.start,
      end: slots.end,
      kind: slots.kind,
      label: slots.label,
      day: days,
    })
    .from(slots)
    .innerJoin(days, eq(slots.dayId, days.id))
    .where(eq(slots.id, slotId))
    .get();
  return row;
}

export function loadSpeakerName(db: Db, speakerId: string): string | undefined {
  return db.select().from(speakers).where(eq(speakers.id, speakerId)).get()?.name;
}

export function loadTalk(db: Db, talkId: string): TalkRecord | undefined {
  const talk = db.select().from(talks).where(eq(talks.id, talkId)).get();
  if (!talk) return undefined;
  const speakerIds = db
    .select({ speakerId: talkSpeakers.speakerId })
    .from(talkSpeakers)
    .where(eq(talkSpeakers.talkId, talkId))
    .all()
    .map((r) => r.speakerId);
  return { ...talk, speakerIds };
}

export function findPlacementByTalk(db: Db, talkId: string): PlacementRecord | undefined {
  return db.select().from(placements).where(eq(placements.talkId, talkId)).get();
}

export function findPlacementByRoomSlot(db: Db, roomId: string, slotId: string): PlacementRecord | undefined {
  return db
    .select()
    .from(placements)
    .where(and(eq(placements.roomId, roomId), eq(placements.slotId, slotId)))
    .get();
}

export function getPlacementsInRoom(db: Db, roomId: string): PlacementRecord[] {
  return db.select().from(placements).where(eq(placements.roomId, roomId)).all();
}

export function getPlacementsForSlotIds(
  db: Db,
  slotIds: string[],
  excludePlacementId?: string,
): PlacementRecord[] {
  if (slotIds.length === 0) return [];
  const condition = excludePlacementId
    ? and(inArray(placements.slotId, slotIds), ne(placements.id, excludePlacementId))
    : inArray(placements.slotId, slotIds);
  return db.select().from(placements).where(condition).all();
}

export function getConflictingSlotIds(db: Db, slot: SlotRecord): string[] {
  const sameDaySlots = db.select().from(slots).where(eq(slots.dayId, slot.dayId)).all();
  return sameDaySlots
    .filter((other) => rangesOverlap(slot.start, slot.end, other.start, other.end))
    .map((other) => other.id);
}
