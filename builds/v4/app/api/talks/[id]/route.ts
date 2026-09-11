import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { toErrorResponse } from "@/lib/api-errors";
import { updateTalk, type UpdateTalkInput } from "@/lib/scheduling";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const body = (await request.json()) as UpdateTalkInput;
  try {
    const talk = updateTalk(db, params.id, body);
    return NextResponse.json({ talk }, { status: 200 });
  } catch (err) {
    return toErrorResponse(err);
  }
}
