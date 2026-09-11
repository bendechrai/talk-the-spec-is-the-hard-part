import { beforeEach, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { slots } from "@/db/schema";
import { POST as placePost } from "@/app/api/placements/route";
import { DELETE as unplaceDelete } from "@/app/api/placements/[talkId]/route";
import { DELETE as slotDelete } from "@/app/api/slots/[id]/route";
import { setUpApiTestDb } from "../helpers/api-db";
import { jsonRequest } from "../helpers/request";

describe("deleting a slot with placements", () => {
  let db: ReturnType<typeof setUpApiTestDb>;

  beforeEach(() => {
    db = setUpApiTestDb();
  });

  it("is rejected until the placement is removed, then succeeds", async () => {
    const placeResponse = await placePost(
      jsonRequest("http://localhost/api/placements", "POST", {
        talkId: "t1",
        roomId: "main",
        slotId: "d1-1000",
      }),
    );
    expect(placeResponse.status).toBe(201);

    const firstDelete = await slotDelete(
      jsonRequest("http://localhost/api/slots/d1-1000", "DELETE"),
      { params: { id: "d1-1000" } },
    );
    expect(firstDelete.status).toBe(409);
    expect(db.select().from(slots).where(eq(slots.id, "d1-1000")).get()).toBeDefined();

    await unplaceDelete(jsonRequest("http://localhost/api/placements/t1", "DELETE"), {
      params: { talkId: "t1" },
    });

    const secondDelete = await slotDelete(
      jsonRequest("http://localhost/api/slots/d1-1000", "DELETE"),
      { params: { id: "d1-1000" } },
    );
    expect(secondDelete.status).toBe(200);
    expect(db.select().from(slots).where(eq(slots.id, "d1-1000")).get()).toBeUndefined();
  });
});
