import { beforeEach, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { placements } from "@/db/schema";
import { POST as placePost } from "@/app/api/placements/route";
import { DELETE as unplaceDelete } from "@/app/api/placements/[talkId]/route";
import { setUpApiTestDb } from "../helpers/api-db";
import { jsonRequest } from "../helpers/request";

describe("unplacing then re-placing a talk", () => {
  let db: ReturnType<typeof setUpApiTestDb>;

  beforeEach(() => {
    db = setUpApiTestDb();
  });

  it("removes the talk from the schedule and allows placing it again afterwards", async () => {
    const place = await placePost(
      jsonRequest("http://localhost/api/placements", "POST", {
        talkId: "t1",
        roomId: "main",
        slotId: "d1-1000",
      }),
    );
    expect(place.status).toBe(201);

    const unplace = await unplaceDelete(
      jsonRequest("http://localhost/api/placements/t1", "DELETE"),
      { params: { talkId: "t1" } },
    );
    expect(unplace.status).toBe(200);
    expect(db.select().from(placements).where(eq(placements.talkId, "t1")).get()).toBeUndefined();

    const replace = await placePost(
      jsonRequest("http://localhost/api/placements", "POST", {
        talkId: "t1",
        roomId: "main",
        slotId: "d1-1300",
      }),
    );
    expect(replace.status).toBe(201);
    const placement = db.select().from(placements).where(eq(placements.talkId, "t1")).get();
    expect(placement?.roomId).toBe("main");
    expect(placement?.slotId).toBe("d1-1300");
  });
});
