import { NextResponse } from "next/server";
import { NotFoundError, SchedulingError } from "./errors";

export function toErrorResponse(err: unknown): NextResponse {
  if (err instanceof SchedulingError) {
    return NextResponse.json({ error: err.message }, { status: 409 });
  }
  if (err instanceof NotFoundError) {
    return NextResponse.json({ error: err.message }, { status: 404 });
  }
  if (err instanceof Error) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
  return NextResponse.json({ error: "Unknown error" }, { status: 500 });
}
