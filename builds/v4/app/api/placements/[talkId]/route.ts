import { NextResponse } from "next/server";
import { db } from "@/db";
import { toErrorResponse } from "@/lib/api-errors";
import { unplaceTalk } from "@/lib/scheduling";

export async function DELETE(
  _request: Request,
  { params }: { params: { talkId: string } },
): Promise<NextResponse> {
  try {
    unplaceTalk(db, params.talkId);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    return toErrorResponse(err);
  }
}
