import { beforeEach, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { placements } from "@/db/schema";
import { POST as placePost } from "@/app/api/placements/route";
import { createSlot } from "@/lib/scheduling";
import { setUpApiTestDb } from "../helpers/api-db";
import { jsonRequest } from "../helpers/request";

describe("speaker conflicts (API + database)", () => {
  let db: ReturnType<typeof setUpApiTestDb>;

  beforeEach(() => {
    db = setUpApiTestDb();
  });

  it("rejects placing the same speaker into an identical slot, names both talks and the speaker, and persists nothing new", async () => {
    const first = await placePost(
      jsonRequest("http://localhost/api/placements", "POST", {
        talkId: "t1",
        roomId: "main",
        slotId: "d1-1000",
      }),
    );
    expect(first.status).toBe(201);

    const second = await placePost(
      jsonRequest("http://localhost/api/placements", "POST", {
        talkId: "t2",
        roomId: "b",
        slotId: "d1-1000",
      }),
    );
    expect(second.status).toBe(409);
    const body = (await second.json()) as { error: string };
    expect(body.error).toContain("The Spec Is the Hard Part");
    expect(body.error).toContain("Ten Key Steps for Enhanced Web App Security");
    expect(body.error).toContain("Ben Dechrai");

    const allPlacements = db.select().from(placements).all();
    expect(allPlacements).toHaveLength(1);
    expect(allPlacements[0]?.talkId).toBe("t1");
  });

  it("rejects the same speaker into a slot that overlaps but is not identical to the first", async () => {
    createSlot(db, {
      id: "d1-1030",
      dayId: "2026-09-10",
      start: "10:30",
      end: "11:15",
      kind: "session",
    });

    const first = await placePost(
      jsonRequest("http://localhost/api/placements", "POST", {
        talkId: "t1",
        roomId: "main",
        slotId: "d1-1000",
      }),
    );
    expect(first.status).toBe(201);

    const second = await placePost(
      jsonRequest("http://localhost/api/placements", "POST", {
        talkId: "t2",
        roomId: "b",
        slotId: "d1-1030",
      }),
    );
    expect(second.status).toBe(409);
    const body = (await second.json()) as { error: string };
    expect(body.error).toContain("Ben Dechrai");

    const allPlacements = db.select().from(placements).all();
    expect(allPlacements).toHaveLength(1);
  });

  it("rejects a shared speaker across two multi-speaker talks, naming Priya", async () => {
    const first = await placePost(
      jsonRequest("http://localhost/api/placements", "POST", {
        talkId: "t4",
        roomId: "main",
        slotId: "d1-1500",
      }),
    );
    expect(first.status).toBe(201);

    const second = await placePost(
      jsonRequest("http://localhost/api/placements", "POST", {
        talkId: "t3",
        roomId: "b",
        slotId: "d1-1500",
      }),
    );
    expect(second.status).toBe(409);
    const body = (await second.json()) as { error: string };
    expect(body.error).toContain("Priya Natarajan");

    const t3Placement = db.select().from(placements).where(eq(placements.talkId, "t3")).get();
    expect(t3Placement).toBeUndefined();
  });
});
