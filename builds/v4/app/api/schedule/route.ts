import { NextResponse } from "next/server";
import { db } from "@/db";
import { getFullSchedule } from "@/lib/schedule-view";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const schedule = getFullSchedule(db);
  return NextResponse.json(schedule, { status: 200 });
}
