import { NextResponse } from "next/server";
import { db } from "@/db";
import { toErrorResponse } from "@/lib/api-errors";
import { deleteSlot } from "@/lib/scheduling";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    deleteSlot(db, params.id);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    return toErrorResponse(err);
  }
}
