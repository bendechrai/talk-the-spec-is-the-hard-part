import { eq } from "drizzle-orm";
import { days, placements, rooms, slots, speakers, talkSpeakers, talks } from "@/db/schema";
import type { Db } from "./repo";

export interface TalkView {
  id: string;
  title: string;
  lengthMinutes: number;
  track: string;
  expectedAudience: number;
  speakerNames: string[];
}

export interface SlotView {
  id: string;
  start: string;
  end: string;
  kind: "session" | "break";
  label: string | null;
  placementsByRoom: Record<string, TalkView | null>;
}

export interface DayView {
  id: string;
  date: string;
  dayStart: string;
  dayEnd: string;
  slots: SlotView[];
}

export interface RoomView {
  id: string;
  name: string;
  capacity: number;
}

export interface ScheduleView {
  rooms: RoomView[];
  days: DayView[];
  unplacedTalks: TalkView[];
}

export function getFullSchedule(db: Db): ScheduleView {
  const roomRows = db.select().from(rooms).all();
  const dayRows = db.select().from(days).all();
  const slotRows = db.select().from(slots).all();
  const talkRows = db.select().from(talks).all();
  const placementRows = db.select().from(placements).all();

  const speakerNamesByTalkId = new Map<string, string[]>();
  const talkSpeakerRows = db
    .select({
      talkId: talkSpeakers.talkId,
      speakerName: speakers.name,
    })
    .from(talkSpeakers)
    .innerJoin(speakers, eq(talkSpeakers.speakerId, speakers.id))
    .all();
  for (const row of talkSpeakerRows) {
    const list = speakerNamesByTalkId.get(row.talkId) ?? [];
    list.push(row.speakerName);
    speakerNamesByTalkId.set(row.talkId, list);
  }

  function toTalkView(talk: (typeof talkRows)[number]): TalkView {
    return {
      id: talk.id,
      title: talk.title,
      lengthMinutes: talk.lengthMinutes,
      track: talk.track,
      expectedAudience: talk.expectedAudience,
      speakerNames: speakerNamesByTalkId.get(talk.id) ?? [],
    };
  }

  const talkViewsById = new Map(talkRows.map((t) => [t.id, toTalkView(t)]));
  const placementBySlotRoom = new Map<string, string>();
  const placedTalkIds = new Set<string>();
  for (const placement of placementRows) {
    placementBySlotRoom.set(`${placement.slotId}:${placement.roomId}`, placement.talkId);
    placedTalkIds.add(placement.talkId);
  }

  const slotsByDay = new Map<string, SlotView[]>();
  for (const slot of [...slotRows].sort((a, b) => a.start.localeCompare(b.start))) {
    const placementsByRoom: Record<string, TalkView | null> = {};
    for (const room of roomRows) {
      const talkId = placementBySlotRoom.get(`${slot.id}:${room.id}`);
      placementsByRoom[room.id] = talkId ? talkViewsById.get(talkId) ?? null : null;
    }
    const view: SlotView = {
      id: slot.id,
      start: slot.start,
      end: slot.end,
      kind: slot.kind,
      label: slot.label,
      placementsByRoom,
    };
    const list = slotsByDay.get(slot.dayId) ?? [];
    list.push(view);
    slotsByDay.set(slot.dayId, list);
  }

  const dayViews: DayView[] = [...dayRows]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((day) => ({
      id: day.id,
      date: day.date,
      dayStart: day.dayStart,
      dayEnd: day.dayEnd,
      slots: slotsByDay.get(day.id) ?? [],
    }));

  const unplacedTalks = talkRows
    .filter((t) => !placedTalkIds.has(t.id))
    .map((t) => talkViewsById.get(t.id))
    .filter((t): t is TalkView => Boolean(t))
    .sort((a, b) => a.title.localeCompare(b.title));

  return {
    rooms: roomRows.map((r) => ({ id: r.id, name: r.name, capacity: r.capacity })),
    days: dayViews,
    unplacedTalks,
  };
}
