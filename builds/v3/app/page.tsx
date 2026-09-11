import { getDb } from "@/db/client";
import { getScheduleView } from "@/lib/schedule-service";
import { ScheduleBoard } from "@/components/schedule-board";

export const dynamic = "force-dynamic";

export default function Home() {
  const db = getDb();
  const schedule = getScheduleView(db);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Conference Scheduler</h1>
      <ScheduleBoard initialSchedule={schedule} />
    </main>
  );
}
