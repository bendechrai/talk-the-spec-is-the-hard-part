import { randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { toErrorResponse } from "@/lib/api-errors";
import { createSlot, type CreateSlotInput } from "@/lib/scheduling";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as Partial<CreateSlotInput>;
  if (!body.dayId || !body.start || !body.end || !body.kind) {
    return NextResponse.json(
      { error: "dayId, start, end and kind are required." },
      { status: 400 },
    );
  }
  try {
    const slot = createSlot(db, {
      id: body.id ?? randomUUID(),
      dayId: body.dayId,
      start: body.start,
      end: body.end,
      kind: body.kind,
      label: body.label ?? null,
    });
    return NextResponse.json({ slot }, { status: 201 });
  } catch (err) {
    return toErrorResponse(err);
  }
}
