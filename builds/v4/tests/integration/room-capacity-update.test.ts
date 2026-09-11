import { beforeEach, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { rooms } from "@/db/schema";
import { POST as placePost } from "@/app/api/placements/route";
import { PATCH as roomPatch } from "@/app/api/rooms/[id]/route";
import { setUpApiTestDb } from "../helpers/api-db";
import { jsonRequest } from "../helpers/request";

describe("reducing room capacity below a placed talk's audience", () => {
  let db: ReturnType<typeof setUpApiTestDb>;

  beforeEach(() => {
    db = setUpApiTestDb();
  });

  it("is rejected, naming the placement, and leaves the capacity unchanged", async () => {
    const placeResponse = await placePost(
      jsonRequest("http://localhost/api/placements", "POST", {
        talkId: "t1",
        roomId: "main",
        slotId: "d1-1000",
      }),
    );
    expect(placeResponse.status).toBe(201);

    const patchResponse = await roomPatch(
      jsonRequest("http://localhost/api/rooms/main", "PATCH", { capacity: 200 }),
      { params: { id: "main" } },
    );
    expect(patchResponse.status).toBe(409);
    const body = (await patchResponse.json()) as { error: string };
    expect(body.error).toContain("Main Hall");
    expect(body.error).toContain("The Spec Is the Hard Part");
    expect(body.error).toContain("2026-09-10");

    const room = db.select().from(rooms).where(eq(rooms.id, "main")).get();
    expect(room?.capacity).toBe(300);
  });
});
