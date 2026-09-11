import { sqliteTable, text, integer, primaryKey, unique } from "drizzle-orm/sqlite-core";

export const rooms = sqliteTable("rooms", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  capacity: integer("capacity").notNull(),
  wing: text("wing"),
});

export const speakers = sqliteTable("speakers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});

export const talks = sqliteTable("talks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  lengthMinutes: integer("length_minutes").notNull(),
  track: text("track").notNull(),
  expectedAudience: integer("expected_audience").notNull(),
});

export const talkSpeakers = sqliteTable(
  "talk_speakers",
  {
    talkId: text("talk_id")
      .notNull()
      .references(() => talks.id),
    speakerId: text("speaker_id")
      .notNull()
      .references(() => speakers.id),
  },
  (t) => [primaryKey({ columns: [t.talkId, t.speakerId] })],
);

export const slots = sqliteTable("slots", {
  id: text("id").primaryKey(),
  day: text("day").notNull(),
  start: text("start").notNull(),
  end: text("end").notNull(),
  kind: text("kind", { enum: ["session", "break"] }).notNull(),
  label: text("label"),
});

export const placements = sqliteTable(
  "placements",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    talkId: text("talk_id")
      .notNull()
      .unique()
      .references(() => talks.id),
    slotId: text("slot_id")
      .notNull()
      .references(() => slots.id),
    roomId: text("room_id")
      .notNull()
      .references(() => rooms.id),
  },
  (t) => [unique().on(t.roomId, t.slotId)],
);
