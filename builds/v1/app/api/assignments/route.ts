import { NextResponse } from "next/server";
import { assignTalk, unassignTalk } from "../../../src/db/queries";

interface AssignBody {
  talkId: string;
  roomId: string;
  slotId: string;
}

function isAssignBody(value: unknown): value is AssignBody {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.talkId === "string" &&
    typeof record.roomId === "string" &&
    typeof record.slotId === "string"
  );
}

export async function POST(request: Request) {
  const body: unknown = await request.json();
  if (!isAssignBody(body)) {
    return NextResponse.json({ error: "talkId, roomId and slotId are required." }, { status: 400 });
  }

  const result = await assignTalk(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.reason }, { status: 409 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const body: unknown = await request.json();
  if (typeof body !== "object" || body === null || typeof (body as Record<string, unknown>).talkId !== "string") {
    return NextResponse.json({ error: "talkId is required." }, { status: 400 });
  }

  await unassignTalk((body as { talkId: string }).talkId);
  return NextResponse.json({ ok: true });
}
