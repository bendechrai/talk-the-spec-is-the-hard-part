"use client";

import { useState } from "react";
import type { ScheduleView } from "@/lib/schedule-service";

interface ScheduleApiResponse {
  ok: boolean;
  error?: string;
  schedule?: ScheduleView;
}

async function refetchSchedule(): Promise<ScheduleView | null> {
  const res = await fetch("/api/schedule");
  const data = (await res.json()) as ScheduleApiResponse;
  return data.schedule ?? null;
}

export function ScheduleBoard({ initialSchedule }: { initialSchedule: ScheduleView }) {
  const [schedule, setSchedule] = useState<ScheduleView>(initialSchedule);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSchedule(talkId: string, slotId: string, roomId: string) {
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ talkId, slotId, roomId }),
      });
      const data = (await res.json()) as ScheduleApiResponse;
      if (!data.ok) {
        setError(data.error ?? "Could not schedule this talk.");
        return;
      }
      const fresh = await refetchSchedule();
      if (fresh) setSchedule(fresh);
    } finally {
      setPending(false);
    }
  }

  async function handleUnschedule(talkId: string) {
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/schedule", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ talkId }),
      });
      const data = (await res.json()) as ScheduleApiResponse;
      if (!data.ok) {
        setError(data.error ?? "Could not unschedule this talk.");
        return;
      }
      const fresh = await refetchSchedule();
      if (fresh) setSchedule(fresh);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-6 space-y-10">
      {error ? (
        <p role="alert" className="rounded border border-red-400 bg-red-50 px-4 py-3 text-red-800">
          {error}
        </p>
      ) : null}

      {schedule.days.map((day) => (
        <section key={day.day} aria-label={`Schedule for ${day.day}`}>
          <h2 className="text-lg font-semibold">{day.day}</h2>
          <div className="mt-3 space-y-3">
            {day.slots.map((slot) => (
              <div key={slot.slotId} data-testid={`slot-${slot.slotId}`} className="rounded border border-slate-200 p-4">
                <div className="text-sm font-medium text-slate-600">
                  {slot.start} - {slot.end}
                </div>
                {slot.kind === "break" ? (
                  <p className="mt-1 italic text-slate-500">Break: {slot.label ?? "Break"}</p>
                ) : (
                  <div className="mt-2 grid gap-3 sm:grid-cols-3">
                    {slot.cells.map((cell) => (
                      <div
                        key={cell.roomId}
                        data-testid={`cell-${slot.slotId}-${cell.roomId}`}
                        className="rounded bg-slate-100 p-3"
                      >
                        <h3 className="text-xs font-semibold uppercase text-slate-500">{cell.roomName}</h3>
                        {cell.placement ? (
                          <div className="mt-1">
                            <p className="font-medium">{cell.placement.title}</p>
                            <p className="text-sm text-slate-600">{cell.placement.speakerNames.join(", ")}</p>
                            <button
                              type="button"
                              disabled={pending}
                              onClick={() => handleUnschedule(cell.placement!.talkId)}
                              className="mt-2 text-sm text-red-700 underline disabled:opacity-50"
                            >
                              Unschedule
                            </button>
                          </div>
                        ) : (
                          <ScheduleForm
                            unscheduledTalks={schedule.unscheduledTalks}
                            pending={pending}
                            onSubmit={(talkId) => handleSchedule(talkId, slot.slotId, cell.roomId)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      <section aria-label="Unscheduled talks">
        <h2 className="text-lg font-semibold">Unscheduled talks</h2>
        {schedule.unscheduledTalks.length === 0 ? (
          <p className="mt-2 text-slate-500">All talks are scheduled.</p>
        ) : (
          <ul className="mt-2 space-y-1">
            {schedule.unscheduledTalks.map((talk) => (
              <li key={talk.id} data-testid={`unscheduled-${talk.id}`}>
                {talk.title} - {talk.speakerNames.join(", ")}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function ScheduleForm({
  unscheduledTalks,
  pending,
  onSubmit,
}: {
  unscheduledTalks: ScheduleView["unscheduledTalks"];
  pending: boolean;
  onSubmit: (talkId: string) => void;
}) {
  const [selected, setSelected] = useState(unscheduledTalks[0]?.id ?? "");

  if (unscheduledTalks.length === 0) {
    return <p className="mt-1 text-sm text-slate-400">Empty</p>;
  }

  return (
    <form
      className="mt-1 flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (selected) onSubmit(selected);
      }}
    >
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="rounded border border-slate-300 bg-white px-2 py-1 text-sm"
      >
        {unscheduledTalks.map((talk) => (
          <option key={talk.id} value={talk.id}>
            {talk.title}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-slate-800 px-2 py-1 text-sm text-white disabled:opacity-50"
      >
        Schedule
      </button>
    </form>
  );
}
