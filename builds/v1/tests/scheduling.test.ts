import { describe, expect, it } from "vitest";
import { checkAssignment } from "../src/lib/scheduling";

const talks = [
  { id: "t1", speakerId: "ben", lengthMinutes: 45 },
  { id: "t2", speakerId: "ben", lengthMinutes: 30 },
  { id: "t3", speakerId: "priya", lengthMinutes: 45 },
];

const slots = [
  { id: "s1", day: "2026-09-10", start: "09:00", end: "09:45" },
  { id: "s2", day: "2026-09-10", start: "10:00", end: "10:30" },
];

describe("checkAssignment", () => {
  it("allows a talk into an empty, sufficiently long slot", () => {
    const result = checkAssignment(
      { talkId: "t1", roomId: "main", slotId: "s1" },
      { talks, slots, existingAssignments: [] },
    );
    expect(result.ok).toBe(true);
  });

  it("rejects a talk longer than the slot", () => {
    const result = checkAssignment(
      { talkId: "t1", roomId: "main", slotId: "s2" },
      { talks, slots, existingAssignments: [] },
    );
    expect(result).toEqual({
      ok: false,
      reason: "Talk is 45 minutes but the slot is only 30 minutes.",
    });
  });

  it("rejects double-booking a room in the same slot", () => {
    const result = checkAssignment(
      { talkId: "t3", roomId: "main", slotId: "s1" },
      {
        talks,
        slots,
        existingAssignments: [{ talkId: "t1", roomId: "main", slotId: "s1" }],
      },
    );
    expect(result).toEqual({
      ok: false,
      reason: "That room is already booked for that slot.",
    });
  });

  it("rejects double-booking a speaker across rooms in the same slot", () => {
    const result = checkAssignment(
      { talkId: "t2", roomId: "b", slotId: "s1" },
      {
        talks,
        slots,
        existingAssignments: [{ talkId: "t1", roomId: "main", slotId: "s1" }],
      },
    );
    expect(result).toEqual({
      ok: false,
      reason: "This speaker is already scheduled in another room for that slot.",
    });
  });

  it("allows re-assigning the same talk to a different slot in the room it already occupies", () => {
    const result = checkAssignment(
      { talkId: "t1", roomId: "main", slotId: "s1" },
      {
        talks,
        slots,
        existingAssignments: [{ talkId: "t1", roomId: "main", slotId: "s1" }],
      },
    );
    expect(result.ok).toBe(true);
  });

  it("rejects when the talk does not exist", () => {
    const result = checkAssignment(
      { talkId: "missing", roomId: "main", slotId: "s1" },
      { talks, slots, existingAssignments: [] },
    );
    expect(result).toEqual({ ok: false, reason: "Talk not found." });
  });
});
