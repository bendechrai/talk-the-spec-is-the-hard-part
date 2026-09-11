import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getDb } from "@/db/client";
import { minimalSeed, seedTestDb, createTestDbForEnv, type EnvTestDb } from "@/test/db-helpers";
import { DELETE, GET, POST } from "./route";

function postRequest(body: unknown): Request {
  return new Request("http://localhost/api/schedule", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function deleteRequest(body: unknown): Request {
  return new Request("http://localhost/api/schedule", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("/api/schedule (integration: route + database)", () => {
  let env: EnvTestDb;

  beforeEach(() => {
    env = createTestDbForEnv();
    seedTestDb(getDb(), minimalSeed);
  });

  afterEach(() => {
    env.cleanup();
  });

  it("rejects a double-booked speaker with an error naming both talks, and persists only the first placement", async () => {
    const firstRes = await POST(postRequest({ talkId: "t1", slotId: "d1-1000", roomId: "main" }));
    expect(firstRes.status).toBe(201);

    const secondRes = await POST(postRequest({ talkId: "t2", slotId: "d1-1000", roomId: "b" }));
    expect(secondRes.status).toBe(409);
    const secondBody = (await secondRes.json()) as { ok: boolean; error: string };
    expect(secondBody.ok).toBe(false);
    expect(secondBody.error).toContain("The Spec Is the Hard Part");
    expect(secondBody.error).toContain("Ten Key Steps");

    const getRes = await GET();
    const getBody = (await getRes.json()) as { schedule: { unscheduledTalks: { id: string }[] } };
    expect(getBody.schedule.unscheduledTalks.map((t) => t.id)).toContain("t2");
    expect(getBody.schedule.unscheduledTalks.map((t) => t.id)).not.toContain("t1");
  });

  it("frees the slot on unschedule and allows rescheduling afterwards", async () => {
    await POST(postRequest({ talkId: "t1", slotId: "d1-1000", roomId: "main" }));

    const delRes = await DELETE(deleteRequest({ talkId: "t1" }));
    expect(delRes.status).toBe(200);

    const rescheduleRes = await POST(postRequest({ talkId: "t1", slotId: "d1-1000", roomId: "main" }));
    expect(rescheduleRes.status).toBe(201);
  });
});
