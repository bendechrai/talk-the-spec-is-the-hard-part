import { describe, expect, it } from "vitest";
import { placeTalk } from "@/lib/scheduling";
import { SchedulingError } from "@/lib/errors";
import { createSeededTestDb } from "../helpers/db";

describe("room capacity vs expected audience", () => {
  it("rejects t1 (audience 250) into Room C (capacity 40), naming room, 250 and 40", () => {
    const { db } = createSeededTestDb();

    try {
      placeTalk(db, { talkId: "t1", roomId: "c", slotId: "d1-1000" });
      expect.fail("expected placeTalk to throw");
    } catch (err) {
      expect(err).toBeInstanceOf(SchedulingError);
      const message = (err as Error).message;
      expect(message).toContain("Room C");
      expect(message).toContain("250");
      expect(message).toContain("40");
    }
  });

  it("accepts t1 into Main Hall (capacity 300)", () => {
    const { db } = createSeededTestDb();

    const placement = placeTalk(db, { talkId: "t1", roomId: "main", slotId: "d1-1000" });

    expect(placement.roomId).toBe("main");
  });
});
