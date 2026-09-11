import { beforeEach, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { rooms } from "@/db/schema";
import { POST as placePost } from "@/app/api/placements/route";
import { DELETE as unplaceDelete } from "@/app/api/placements/[talkId]/route";
import { DELETE as roomDelete } from "@/app/api/rooms/[id]/route";
import { setUpApiTestDb } from "../helpers/api-db";
import { jsonRequest } from "../helpers/request";

describe("deleting a room with placements", () => {
  let db: ReturnType<typeof setUpApiTestDb>;

  beforeEach(() => {
    db = setUpApiTestDb();
  });

  it("is rejected until the placement is removed, then succeeds", async () => {
    const placeResponse = await placePost(
      jsonRequest("http://localhost/api/placements", "POST", {
        talkId: "t3",
        roomId: "b",
        slotId: "d1-1300",
      }),
    );
    expect(placeResponse.status).toBe(201);

    const firstDelete = await roomDelete(jsonRequest("http://localhost/api/rooms/b", "DELETE"), {
      params: { id: "b" },
    });
    expect(firstDelete.status).toBe(409);
    expect(db.select().from(rooms).where(eq(rooms.id, "b")).get()).toBeDefined();

    const unplace = await unplaceDelete(
      jsonRequest("http://localhost/api/placements/t3", "DELETE"),
      { params: { talkId: "t3" } },
    );
    expect(unplace.status).toBe(200);

    const secondDelete = await roomDelete(jsonRequest("http://localhost/api/rooms/b", "DELETE"), {
      params: { id: "b" },
    });
    expect(secondDelete.status).toBe(200);
    expect(db.select().from(rooms).where(eq(rooms.id, "b")).get()).toBeUndefined();
  });
});
