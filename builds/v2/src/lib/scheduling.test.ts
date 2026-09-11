import { describe, expect, it } from "vitest";
import {
  isSlotWithinDay,
  slotDurationMinutes,
  slotsOverlap,
  timeToMinutes,
  validateAssignment,
  type Assignment,
  type Room,
  type Slot,
  type Talk,
} from "./scheduling";

const talks: Talk[] = [
  { id: "t1", title: "Talk One", speakerId: "ben", lengthMinutes: 45 },
  { id: "t2", title: "Talk Two", speakerId: "ben", lengthMinutes: 30 },
  { id: "t3", title: "Talk Three", speakerId: "priya", lengthMinutes: 60 },
];

const rooms: Room[] = [
  { id: "main", name: "Main Hall" },
  { id: "b", name: "Room B" },
];

const slots: Slot[] = [
  { id: "s0900", day: "2026-09-10", start: "09:00", end: "09:45" },
  { id: "s0930", day: "2026-09-10", start: "09:30", end: "10:15" },
  { id: "s1000", day: "2026-09-10", start: "10:00", end: "10:45" },
  { id: "s1000-d2", day: "2026-09-11", start: "10:00", end: "10:45" },
];

describe("timeToMinutes", () => {
  it("converts HH:MM to minutes since midnight", () => {
    expect(timeToMinutes("09:00")).toBe(540);
    expect(timeToMinutes("00:00")).toBe(0);
    expect(timeToMinutes("23:59")).toBe(1439);
  });
});

describe("slotDurationMinutes", () => {
  it("computes duration in minutes", () => {
    expect(slotDurationMinutes({ id: "x", day: "d", start: "09:00", end: "09:45" })).toBe(45);
    expect(slotDurationMinutes({ id: "x", day: "d", start: "11:00", end: "12:30" })).toBe(90);
  });
});

describe("slotsOverlap", () => {
  it("returns false for slots on different days", () => {
    expect(slotsOverlap(slots[0]!, slots[3]!)).toBe(false);
  });

  it("returns true for overlapping ranges on the same day", () => {
    expect(slotsOverlap(slots[0]!, slots[1]!)).toBe(true);
  });

  it("returns false for back-to-back, non-overlapping ranges", () => {
    const a: Slot = { id: "a", day: "d", start: "09:00", end: "10:00" };
    const b: Slot = { id: "b", day: "d", start: "10:00", end: "11:00" };
    expect(slotsOverlap(a, b)).toBe(false);
  });

  it("returns true when one slot fully contains another", () => {
    const a: Slot = { id: "a", day: "d", start: "09:00", end: "12:00" };
    const b: Slot = { id: "b", day: "d", start: "10:00", end: "10:30" };
    expect(slotsOverlap(a, b)).toBe(true);
  });
});

describe("isSlotWithinDay", () => {
  it("accepts a slot inside the day bounds", () => {
    expect(isSlotWithinDay({ id: "x", day: "d", start: "09:00", end: "09:45" }, "09:00", "17:00")).toBe(true);
  });

  it("rejects a slot starting before the day starts", () => {
    expect(isSlotWithinDay({ id: "x", day: "d", start: "08:00", end: "09:00" }, "09:00", "17:00")).toBe(false);
  });

  it("rejects a slot ending after the day ends", () => {
    expect(isSlotWithinDay({ id: "x", day: "d", start: "16:30", end: "17:30" }, "09:00", "17:00")).toBe(false);
  });
});

describe("validateAssignment", () => {
  it("accepts a valid placement with no existing assignments", () => {
    const result = validateAssignment(
      { talkId: "t1", roomId: "main", slotId: "s0900" },
      { talks, rooms, slots, assignments: [] },
    );
    expect(result).toEqual({ ok: true });
  });

  it("rejects an unknown talk", () => {
    const result = validateAssignment(
      { talkId: "nope", roomId: "main", slotId: "s0900" },
      { talks, rooms, slots, assignments: [] },
    );
    expect(result).toEqual({ ok: false, reason: "TALK_NOT_FOUND" });
  });

  it("rejects an unknown room", () => {
    const result = validateAssignment(
      { talkId: "t1", roomId: "nope", slotId: "s0900" },
      { talks, rooms, slots, assignments: [] },
    );
    expect(result).toEqual({ ok: false, reason: "ROOM_NOT_FOUND" });
  });

  it("rejects an unknown slot", () => {
    const result = validateAssignment(
      { talkId: "t1", roomId: "main", slotId: "nope" },
      { talks, rooms, slots, assignments: [] },
    );
    expect(result).toEqual({ ok: false, reason: "SLOT_NOT_FOUND" });
  });

  it("rejects a talk longer than the slot", () => {
    const result = validateAssignment(
      { talkId: "t3", roomId: "main", slotId: "s0900" },
      { talks, rooms, slots, assignments: [] },
    );
    expect(result).toEqual({ ok: false, reason: "TALK_TOO_LONG_FOR_SLOT" });
  });

  it("rejects a room already booked for that exact slot", () => {
    const assignments: Assignment[] = [{ talkId: "t3", roomId: "main", slotId: "s1000" }];
    const result = validateAssignment(
      { talkId: "t2", roomId: "main", slotId: "s1000" },
      { talks, rooms, slots, assignments },
    );
    expect(result).toEqual({ ok: false, reason: "ROOM_ALREADY_BOOKED" });
  });

  it("allows a different room at the same slot", () => {
    const assignments: Assignment[] = [{ talkId: "t3", roomId: "main", slotId: "s1000" }];
    const result = validateAssignment(
      { talkId: "t2", roomId: "b", slotId: "s1000" },
      { talks, rooms, slots, assignments },
    );
    expect(result).toEqual({ ok: true });
  });

  it("rejects a speaker already booked in an overlapping slot elsewhere", () => {
    const assignments: Assignment[] = [{ talkId: "t1", roomId: "main", slotId: "s0900" }];
    const result = validateAssignment(
      { talkId: "t2", roomId: "b", slotId: "s0930" },
      { talks, rooms, slots, assignments },
    );
    expect(result).toEqual({ ok: false, reason: "SPEAKER_DOUBLE_BOOKED" });
  });

  it("allows the same speaker in non-overlapping slots", () => {
    const assignments: Assignment[] = [{ talkId: "t1", roomId: "main", slotId: "s0900" }];
    const result = validateAssignment(
      { talkId: "t2", roomId: "b", slotId: "s1000" },
      { talks, rooms, slots, assignments },
    );
    expect(result).toEqual({ ok: true });
  });

  it("does not conflict a talk with its own existing assignment", () => {
    const assignments: Assignment[] = [{ talkId: "t1", roomId: "main", slotId: "s0900" }];
    const result = validateAssignment(
      { talkId: "t1", roomId: "main", slotId: "s0900" },
      { talks, rooms, slots, assignments },
    );
    expect(result).toEqual({ ok: true });
  });
});
