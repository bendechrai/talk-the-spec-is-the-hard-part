import { getScheduleData } from "@/db/queries";
import { SchedulerApp } from "@/components/SchedulerApp";

export const dynamic = "force-dynamic";

export default function Home() {
  const data = getScheduleData();

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <SchedulerApp initialData={data} />
    </main>
  );
}
