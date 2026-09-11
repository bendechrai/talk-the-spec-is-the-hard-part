import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";

export const conference = sqliteTable("conference", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  dayStart: text("day_start").notNull(),
  dayEnd: text("day_end").notNull(),
});

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

export const slots = sqliteTable("slots", {
  id: text("id").primaryKey(),
  day: text("day").notNull(),
  start: text("start").notNull(),
  end: text("end").notNull(),
  label: text("label"),
});

export const talks = sqliteTable("talks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  speakerId: text("speaker_id")
    .notNull()
    .references(() => speakers.id),
  lengthMinutes: integer("length_minutes").notNull(),
  track: text("track"),
  expectedAudience: integer("expected_audience"),
});

export const assignments = sqliteTable(
  "assignments",
  {
    talkId: text("talk_id")
      .primaryKey()
      .references(() => talks.id),
    roomId: text("room_id")
      .notNull()
      .references(() => rooms.id),
    slotId: text("slot_id")
      .notNull()
      .references(() => slots.id),
  },
  (table) => ({
    roomSlotUnique: uniqueIndex("assignments_room_slot_unique").on(table.roomId, table.slotId),
  }),
);
