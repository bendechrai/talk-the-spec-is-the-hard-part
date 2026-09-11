import { db } from "@/db";
import { getFullSchedule } from "@/lib/schedule-view";
import { ScheduleBoard } from "@/components/ScheduleBoard";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const schedule = getFullSchedule(db);

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Conference Scheduler</h1>
      <ScheduleBoard initialSchedule={schedule} />
    </main>
  );
}
