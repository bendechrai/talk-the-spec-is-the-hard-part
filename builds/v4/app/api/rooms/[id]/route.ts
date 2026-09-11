import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { toErrorResponse } from "@/lib/api-errors";
import { deleteRoom, updateRoom, type UpdateRoomInput } from "@/lib/scheduling";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const body = (await request.json()) as UpdateRoomInput;
  try {
    const room = updateRoom(db, params.id, body);
    return NextResponse.json({ room }, { status: 200 });
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    deleteRoom(db, params.id);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    return toErrorResponse(err);
  }
}
