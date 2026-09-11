import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { placements } from "@/db/schema";
import { createTestDb, minimalSeed, seedTestDb, type TestDb } from "@/test/db-helpers";
import { getScheduleView, scheduleTalk, unscheduleTalk } from "./schedule-service";

describe("schedule-service (integration, real database)", () => {
  let testDb: TestDb;

  beforeEach(() => {
    testDb = createTestDb();
    seedTestDb(testDb.db, minimalSeed);
  });

  afterEach(() => {
    testDb.cleanup();
  });

  it("rejects double-booking a speaker across rooms in the same slot and persists nothing extra", () => {
    const first = scheduleTalk(testDb.db, { talkId: "t1", slotId: "d1-1000", roomId: "main" });
    expect(first.ok).toBe(true);

    const second = scheduleTalk(testDb.db, { talkId: "t2", slotId: "d1-1000", roomId: "b" });
    expect(second.ok).toBe(false);
    if (!second.ok) {
      expect(second.error).toContain("The Spec Is the Hard Part");
      expect(second.error).toContain("Ten Key Steps");
    }

    const rows = testDb.db.select().from(placements).all();
    expect(rows).toHaveLength(1);
    expect(rows[0]?.talkId).toBe("t1");
  });

  it("rejects scheduling the same talk into a second slot, leaving the first placement unchanged", () => {
    const first = scheduleTalk(testDb.db, { talkId: "t1", slotId: "d1-1000", roomId: "main" });
    expect(first.ok).toBe(true);

    const second = scheduleTalk(testDb.db, { talkId: "t1", slotId: "d1-1100", roomId: "b" });
    expect(second.ok).toBe(false);

    const rows = testDb.db.select().from(placements).where(eq(placements.talkId, "t1")).all();
    expect(rows).toHaveLength(1);
    expect(rows[0]?.slotId).toBe("d1-1000");
  });

  it("frees the slot on unschedule and allows rescheduling afterwards", () => {
    const placed = scheduleTalk(testDb.db, { talkId: "t1", slotId: "d1-1000", roomId: "main" });
    expect(placed.ok).toBe(true);

    const removed = unscheduleTalk(testDb.db, "t1");
    expect(removed.ok).toBe(true);

    const rowsAfterRemoval = testDb.db.select().from(placements).where(eq(placements.talkId, "t1")).all();
    expect(rowsAfterRemoval).toHaveLength(0);

    const rescheduled = scheduleTalk(testDb.db, { talkId: "t1", slotId: "d1-1000", roomId: "main" });
    expect(rescheduled.ok).toBe(true);

    const view = getScheduleView(testDb.db);
    const day = view.days.find((d) => d.day === "2026-09-10");
    const slot = day?.slots.find((s) => s.slotId === "d1-1000");
    const cell = slot?.cells.find((c) => c.roomId === "main");
    expect(cell?.placement?.talkId).toBe("t1");
  });
});
