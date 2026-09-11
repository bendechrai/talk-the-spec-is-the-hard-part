import { getScheduleData } from "../src/db/queries";
import { ScheduleBoard } from "./ScheduleBoard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getScheduleData();

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Conference Scheduler</h1>
      <p className="mt-1 text-sm text-slate-600">
        Assign talks to rooms and time slots, and see the full schedule at a glance.
      </p>
      <ScheduleBoard data={data} />
    </main>
  );
}
