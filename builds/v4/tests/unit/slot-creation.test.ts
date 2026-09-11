import { describe, expect, it } from "vitest";
import { createSlot } from "@/lib/scheduling";
import { SchedulingError } from "@/lib/errors";
import { createSeededTestDb } from "../helpers/db";

describe("slot creation bounds", () => {
  it("rejects a slot from 16:30 to 17:30 on a day that ends at 17:00", () => {
    const { db } = createSeededTestDb();

    expect(() =>
      createSlot(db, {
        id: "d1-1630",
        dayId: "2026-09-10",
        start: "16:30",
        end: "17:30",
        kind: "session",
      }),
    ).toThrow(SchedulingError);
  });

  it("accepts a slot fully inside the conference day", () => {
    const { db } = createSeededTestDb();

    const slot = createSlot(db, {
      id: "d1-1600",
      dayId: "2026-09-10",
      start: "16:00",
      end: "16:45",
      kind: "session",
    });

    expect(slot.id).toBe("d1-1600");
  });
});
