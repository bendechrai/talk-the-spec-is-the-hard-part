import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const speakers = sqliteTable("speakers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});

export const rooms = sqliteTable("rooms", {
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
});

export const assignments = sqliteTable(
  "assignments",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    talkId: text("talk_id")
      .notNull()
      .unique()
      .references(() => talks.id),
    roomId: text("room_id")
      .notNull()
      .references(() => rooms.id),
    slotId: text("slot_id")
      .notNull()
      .references(() => slots.id),
  },
  (table) => [uniqueIndex("room_slot_unique").on(table.roomId, table.slotId)],
);

export const speakersRelations = relations(speakers, ({ many }) => ({
  talks: many(talks),
}));

export const talksRelations = relations(talks, ({ one }) => ({
  speaker: one(speakers, {
    fields: [talks.speakerId],
    references: [speakers.id],
  }),
  assignment: one(assignments, {
    fields: [talks.id],
    references: [assignments.talkId],
  }),
}));

export const assignmentsRelations = relations(assignments, ({ one }) => ({
  talk: one(talks, {
    fields: [assignments.talkId],
    references: [talks.id],
  }),
  room: one(rooms, {
    fields: [assignments.roomId],
    references: [rooms.id],
  }),
  slot: one(slots, {
    fields: [assignments.slotId],
    references: [slots.id],
  }),
}));
