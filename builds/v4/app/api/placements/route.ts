import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { toErrorResponse } from "@/lib/api-errors";
import { placeTalk } from "@/lib/scheduling";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body: unknown = await request.json();
  if (
    typeof body !== "object" ||
    body === null ||
    !("talkId" in body) ||
    !("roomId" in body) ||
    !("slotId" in body)
  ) {
    return NextResponse.json({ error: "talkId, roomId and slotId are required." }, { status: 400 });
  }
  const { talkId, roomId, slotId } = body as { talkId: unknown; roomId: unknown; slotId: unknown };
  if (typeof talkId !== "string" || typeof roomId !== "string" || typeof slotId !== "string") {
    return NextResponse.json({ error: "talkId, roomId and slotId must be strings." }, { status: 400 });
  }

  try {
    const placement = placeTalk(db, { talkId, roomId, slotId });
    return NextResponse.json({ placement }, { status: 201 });
  } catch (err) {
    return toErrorResponse(err);
  }
}
