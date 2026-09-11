import { describe, expect, it } from "vitest";
import { placeTalk } from "@/lib/scheduling";
import { SchedulingError } from "@/lib/errors";
import { createSeededTestDb } from "../helpers/db";

describe("same-track conflict", () => {
  it("rejects t3 (Data) at d1-1400 in Room B when t10 (Data) already occupies d1-1400 in Room C", () => {
    const { db } = createSeededTestDb();

    placeTalk(db, { talkId: "t10", roomId: "c", slotId: "d1-1400" });

    try {
      placeTalk(db, { talkId: "t3", roomId: "b", slotId: "d1-1400" });
      expect.fail("expected placeTalk to throw");
    } catch (err) {
      expect(err).toBeInstanceOf(SchedulingError);
      expect((err as Error).message).toContain("Data");
    }
  });
});
