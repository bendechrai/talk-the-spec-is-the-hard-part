import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { getScheduleView, scheduleTalk, unscheduleTalk } from "@/lib/schedule-service";

interface SchedulePostBody {
  talkId: string;
  slotId: string;
  roomId: string;
}

interface ScheduleDeleteBody {
  talkId: string;
}

function isSchedulePostBody(value: unknown): value is SchedulePostBody {
  if (typeof value !== "object" || value === null) return false;
  const body = value as Record<string, unknown>;
  return (
    typeof body.talkId === "string" &&
    typeof body.slotId === "string" &&
    typeof body.roomId === "string"
  );
}

function isScheduleDeleteBody(value: unknown): value is ScheduleDeleteBody {
  if (typeof value !== "object" || value === null) return false;
  const body = value as Record<string, unknown>;
  return typeof body.talkId === "string";
}

export async function GET(): Promise<NextResponse> {
  const db = getDb();
  const schedule = getScheduleView(db);
  return NextResponse.json({ ok: true, schedule }, { status: 200 });
}

export async function POST(request: Request): Promise<NextResponse> {
  const json: unknown = await request.json().catch(() => null);
  if (!isSchedulePostBody(json)) {
    return NextResponse.json({ ok: false, error: "Request must include talkId, slotId, and roomId." }, { status: 400 });
  }

  const db = getDb();
  const result = scheduleTalk(db, json);

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 409 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function DELETE(request: Request): Promise<NextResponse> {
  const json: unknown = await request.json().catch(() => null);
  if (!isScheduleDeleteBody(json)) {
    return NextResponse.json({ ok: false, error: "Request must include talkId." }, { status: 400 });
  }

  const db = getDb();
  const result = unscheduleTalk(db, json.talkId);

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 404 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
