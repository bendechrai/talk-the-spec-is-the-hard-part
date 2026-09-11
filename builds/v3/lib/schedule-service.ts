import { eq } from "drizzle-orm";
import type { DbClient } from "@/db/client";
import { placements, rooms, slots, speakers, talkSpeakers, talks } from "@/db/schema";
import { validateScheduling, type ExistingPlacement, type TalkInfo } from "./scheduling-rules";

export interface ScheduleTalkParams {
  talkId: string;
  slotId: string;
  roomId: string;
}

export type ScheduleTalkResult = { ok: true } | { ok: false; error: string };

type Queryable = { select: DbClient["select"] };

function loadTalksById(db: Queryable): Map<string, TalkInfo> {
  const allTalks = db.select().from(talks).all();
  const allTalkSpeakers = db.select().from(talkSpeakers).all();

  const speakersByTalk = new Map<string, string[]>();
  for (const row of allTalkSpeakers) {
    const list = speakersByTalk.get(row.talkId) ?? [];
    list.push(row.speakerId);
    speakersByTalk.set(row.talkId, list);
  }

  const map = new Map<string, TalkInfo>();
  for (const t of allTalks) {
    map.set(t.id, {
      id: t.id,
      title: t.title,
      speakerIds: speakersByTalk.get(t.id) ?? [],
      lengthMinutes: t.lengthMinutes,
      track: t.track,
      expectedAudience: t.expectedAudience,
    });
  }
  return map;
}

export function scheduleTalk(db: DbClient, params: ScheduleTalkParams): ScheduleTalkResult {
  return db.transaction((tx) => {
    const talkRow = tx.select().from(talks).where(eq(talks.id, params.talkId)).get();
    const slotRow = tx.select().from(slots).where(eq(slots.id, params.slotId)).get();
    const roomRow = tx.select().from(rooms).where(eq(rooms.id, params.roomId)).get();

    if (!talkRow) {
      return { ok: false, error: `Unknown talk "${params.talkId}".` };
    }
    if (!slotRow) {
      return { ok: false, error: `Unknown slot "${params.slotId}".` };
    }
    if (!roomRow) {
      return { ok: false, error: `Unknown room "${params.roomId}".` };
    }

    const talksById = loadTalksById(tx);
    const talkInfo = talksById.get(talkRow.id);
    if (!talkInfo) {
      return { ok: false, error: `Unknown talk "${params.talkId}".` };
    }

    const existingPlacementRows = tx.select().from(placements).all();
    const existingPlacements: ExistingPlacement[] = existingPlacementRows.map((p) => ({
      talkId: p.talkId,
      slotId: p.slotId,
      roomId: p.roomId,
    }));

    const result = validateScheduling({
      talk: talkInfo,
      slot: slotRow,
      room: roomRow,
      talksById,
      existingPlacements,
    });

    if (!result.ok) {
      return result;
    }

    tx.insert(placements)
      .values({ talkId: params.talkId, slotId: params.slotId, roomId: params.roomId })
      .run();

    return { ok: true };
  });
}

export function unscheduleTalk(db: DbClient, talkId: string): { ok: true } | { ok: false; error: string } {
  return db.transaction((tx) => {
    const existing = tx.select().from(placements).where(eq(placements.talkId, talkId)).get();
    if (!existing) {
      return { ok: false, error: `"${talkId}" is not currently scheduled.` };
    }
    tx.delete(placements).where(eq(placements.talkId, talkId)).run();
    return { ok: true };
  });
}

export interface ScheduleCell {
  roomId: string;
  roomName: string;
  placement: {
    talkId: string;
    title: string;
    speakerNames: string[];
  } | null;
}

export interface ScheduleSlotView {
  slotId: string;
  day: string;
  start: string;
  end: string;
  kind: "session" | "break";
  label: string | null;
  cells: ScheduleCell[];
}

export interface ScheduleDayView {
  day: string;
  slots: ScheduleSlotView[];
}

export interface UnscheduledTalkView {
  id: string;
  title: string;
  speakerNames: string[];
  lengthMinutes: number;
  track: string;
  expectedAudience: number;
}

export interface ScheduleView {
  days: ScheduleDayView[];
  unscheduledTalks: UnscheduledTalkView[];
  rooms: { id: string; name: string; capacity: number }[];
}

export function getScheduleView(db: DbClient): ScheduleView {
  const allRooms = db.select().from(rooms).all();
  const allSlots = db.select().from(slots).all().sort((a, b) => {
    if (a.day !== b.day) return a.day.localeCompare(b.day);
    return a.start.localeCompare(b.start);
  });
  const allTalks = db.select().from(talks).all();
  const allSpeakers = db.select().from(speakers).all();
  const allTalkSpeakers = db.select().from(talkSpeakers).all();
  const allPlacements = db.select().from(placements).all();

  const speakerNameById = new Map(allSpeakers.map((s) => [s.id, s.name]));
  const speakerNamesByTalk = new Map<string, string[]>();
  for (const row of allTalkSpeakers) {
    const list = speakerNamesByTalk.get(row.talkId) ?? [];
    const name = speakerNameById.get(row.speakerId);
    if (name) list.push(name);
    speakerNamesByTalk.set(row.talkId, list);
  }

  const talkById = new Map(allTalks.map((t) => [t.id, t]));
  const placementByTalkId = new Map(allPlacements.map((p) => [p.talkId, p]));
  const placementByRoomSlot = new Map(allPlacements.map((p) => [`${p.roomId}:${p.slotId}`, p]));

  const dayOrder: string[] = [];
  for (const slot of allSlots) {
    if (!dayOrder.includes(slot.day)) dayOrder.push(slot.day);
  }

  const days: ScheduleDayView[] = dayOrder.map((day) => ({
    day,
    slots: allSlots
      .filter((s) => s.day === day)
      .map((slot) => ({
        slotId: slot.id,
        day: slot.day,
        start: slot.start,
        end: slot.end,
        kind: slot.kind,
        label: slot.label,
        cells:
          slot.kind === "break"
            ? []
            : allRooms.map((room) => {
                const placement = placementByRoomSlot.get(`${room.id}:${slot.id}`);
                const talk = placement ? talkById.get(placement.talkId) : undefined;
                return {
                  roomId: room.id,
                  roomName: room.name,
                  placement:
                    placement && talk
                      ? {
                          talkId: talk.id,
                          title: talk.title,
                          speakerNames: speakerNamesByTalk.get(talk.id) ?? [],
                        }
                      : null,
                };
              }),
      })),
  }));

  const unscheduledTalks: UnscheduledTalkView[] = allTalks
    .filter((t) => !placementByTalkId.has(t.id))
    .map((t) => ({
      id: t.id,
      title: t.title,
      speakerNames: speakerNamesByTalk.get(t.id) ?? [],
      lengthMinutes: t.lengthMinutes,
      track: t.track,
      expectedAudience: t.expectedAudience,
    }));

  return {
    days,
    unscheduledTalks,
    rooms: allRooms.map((r) => ({ id: r.id, name: r.name, capacity: r.capacity })),
  };
}
