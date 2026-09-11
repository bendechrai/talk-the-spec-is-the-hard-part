import { beforeEach, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { placements } from "@/db/schema";
import { POST as placePost } from "@/app/api/placements/route";
import { setUpApiTestDb } from "../helpers/api-db";
import { jsonRequest } from "../helpers/request";

describe("placing an already-placed talk into a second slot", () => {
  let db: ReturnType<typeof setUpApiTestDb>;

  beforeEach(() => {
    db = setUpApiTestDb();
  });

  it("is rejected and leaves the first placement unchanged", async () => {
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
        talkId: "t1",
        roomId: "main",
        slotId: "d1-1300",
      }),
    );
    expect(second.status).toBe(409);
    const body = (await second.json()) as { error: string };
    expect(body.error).toContain("already placed");

    const placement = db.select().from(placements).where(eq(placements.talkId, "t1")).get();
    expect(placement?.roomId).toBe("main");
    expect(placement?.slotId).toBe("d1-1000");
  });
});
