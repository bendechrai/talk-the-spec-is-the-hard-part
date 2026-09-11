import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { assignments, rooms, slots, talks } from "@/db/schema";
import { CONFLICT_MESSAGES, validateAssignment } from "@/lib/scheduling";

type ScheduleBody = {
  talkId?: unknown;
  roomId?: unknown;
  slotId?: unknown;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

export async function POST(request: Request) {
  const body = (await request.json()) as ScheduleBody;
  const { talkId, roomId, slotId } = body;

  if (!isNonEmptyString(talkId) || !isNonEmptyString(roomId) || !isNonEmptyString(slotId)) {
    return NextResponse.json({ error: "talkId, roomId and slotId are required." }, { status: 400 });
  }

  const result = db.transaction((tx) => {
    const talkRows = tx.select().from(talks).all();
    const roomRows = tx.select().from(rooms).all();
    const slotRows = tx.select().from(slots).all();
    const existingAssignments = tx.select().from(assignments).all();

    const otherAssignments = existingAssignments.filter((a) => a.talkId !== talkId);

    const validation = validateAssignment(
      { talkId, roomId, slotId },
      { talks: talkRows, rooms: roomRows, slots: slotRows, assignments: otherAssignments },
    );

    if (!validation.ok) {
      return validation;
    }

    tx.delete(assignments).where(eq(assignments.talkId, talkId)).run();
    tx.insert(assignments).values({ talkId, roomId, slotId }).run();
    return { ok: true as const };
  });

  if (!result.ok) {
    return NextResponse.json({ error: CONFLICT_MESSAGES[result.reason], reason: result.reason }, { status: 409 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const body = (await request.json()) as ScheduleBody;
  const { talkId } = body;

  if (!isNonEmptyString(talkId)) {
    return NextResponse.json({ error: "talkId is required." }, { status: 400 });
  }

  db.delete(assignments).where(eq(assignments.talkId, talkId)).run();

  return NextResponse.json({ ok: true });
}

export function GET() {
  return NextResponse.json({ error: "Not supported." }, { status: 405 });
}
