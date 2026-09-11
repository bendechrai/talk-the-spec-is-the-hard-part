import { sqliteTable, text, integer, primaryKey, unique } from "drizzle-orm/sqlite-core";

export const days = sqliteTable("days", {
  id: text("id").primaryKey(),
  date: text("date").notNull().unique(),
  dayStart: text("day_start").notNull(),
  dayEnd: text("day_end").notNull(),
});

export const rooms = sqliteTable("rooms", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  capacity: integer("capacity").notNull(),
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
      .references(() => talks.id, { onDelete: "cascade" }),
    speakerId: text("speaker_id")
      .notNull()
      .references(() => speakers.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.talkId, table.speakerId] }),
  }),
);

export const slots = sqliteTable("slots", {
  id: text("id").primaryKey(),
  dayId: text("day_id")
    .notNull()
    .references(() => days.id, { onDelete: "cascade" }),
  start: text("start").notNull(),
  end: text("end").notNull(),
  kind: text("kind", { enum: ["session", "break"] }).notNull(),
  label: text("label"),
});

export const placements = sqliteTable(
  "placements",
  {
    id: text("id").primaryKey(),
    talkId: text("talk_id")
      .notNull()
      .unique()
      .references(() => talks.id, { onDelete: "cascade" }),
    roomId: text("room_id")
      .notNull()
      .references(() => rooms.id, { onDelete: "cascade" }),
    slotId: text("slot_id")
      .notNull()
      .references(() => slots.id, { onDelete: "cascade" }),
  },
  (table) => ({
    roomSlotUnique: unique().on(table.roomId, table.slotId),
  }),
);
