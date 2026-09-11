import { describe, expect, it } from "vitest";
import { placeTalk } from "@/lib/scheduling";
import { SchedulingError } from "@/lib/errors";
import { createSeededTestDb } from "../helpers/db";

describe("talk length vs slot length", () => {
  it("rejects a 60-minute talk into a 45-minute slot, naming both lengths", () => {
    const { db } = createSeededTestDb();

    expect(() => placeTalk(db, { talkId: "t4", roomId: "main", slotId: "d1-0900" })).toThrow(
      SchedulingError,
    );
    try {
      placeTalk(db, { talkId: "t4", roomId: "main", slotId: "d1-0900" });
      expect.fail("expected placeTalk to throw");
    } catch (err) {
      expect(err).toBeInstanceOf(SchedulingError);
      const message = (err as Error).message;
      expect(message).toContain("60");
      expect(message).toContain("45");
    }
  });

  it("accepts a 45-minute talk into a 45-minute slot", () => {
    const { db } = createSeededTestDb();

    const placement = placeTalk(db, { talkId: "t1", roomId: "main", slotId: "d1-1300" });

    expect(placement.talkId).toBe("t1");
    expect(placement.slotId).toBe("d1-1300");
  });
});
