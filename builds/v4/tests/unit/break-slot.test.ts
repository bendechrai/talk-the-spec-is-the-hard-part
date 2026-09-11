import { describe, expect, it } from "vitest";
import { placeTalk } from "@/lib/scheduling";
import { SchedulingError } from "@/lib/errors";
import { createSeededTestDb } from "../helpers/db";

describe("break slots", () => {
  it("rejects placing any talk into a break slot", () => {
    const { db } = createSeededTestDb();

    expect(() => placeTalk(db, { talkId: "t1", roomId: "main", slotId: "d1-1130" })).toThrow(
      SchedulingError,
    );

    try {
      placeTalk(db, { talkId: "t5", roomId: "b", slotId: "d1-1130" });
      expect.fail("expected placeTalk to throw");
    } catch (err) {
      expect(err).toBeInstanceOf(SchedulingError);
      expect((err as Error).message).toMatch(/break|lunch/i);
    }
  });
});
