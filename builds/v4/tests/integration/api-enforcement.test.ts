import { beforeEach, describe, expect, it } from "vitest";
import { POST as placePost } from "@/app/api/placements/route";
import { setUpApiTestDb } from "../helpers/api-db";
import { jsonRequest } from "../helpers/request";

/**
 * The UI (components/ScheduleBoard.tsx) contains no validation logic of its
 * own: it posts straight to POST /api/placements and renders whatever error
 * comes back. These requests simulate a client that skips the UI entirely
 * (e.g. curl) to prove the constraint engine (lib/scheduling.ts) is enforced
 * by the API route itself, not by client-side JavaScript.
 */
describe("constraints are enforced by the API, independent of any UI", () => {
  beforeEach(() => {
    setUpApiTestDb();
  });

  it("rejects a raw POST that violates the break-slot rule", async () => {
    const response = await placePost(
      jsonRequest("http://localhost/api/placements", "POST", {
        talkId: "t1",
        roomId: "main",
        slotId: "d1-1130",
      }),
    );
    expect(response.status).toBe(409);
    const body = (await response.json()) as { error: string };
    expect(body.error).toMatch(/break/i);
  });

  it("rejects a raw POST that violates the room-capacity rule", async () => {
    const response = await placePost(
      jsonRequest("http://localhost/api/placements", "POST", {
        talkId: "t1",
        roomId: "c",
        slotId: "d1-1000",
      }),
    );
    expect(response.status).toBe(409);
    const body = (await response.json()) as { error: string };
    expect(body.error).toContain("Room C");
  });
});
