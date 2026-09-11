"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ScheduleData } from "../src/db/queries";

interface Props {
  data: ScheduleData;
}

type PendingSelection = Record<string, { roomId: string; slotId: string }>;

export function ScheduleBoard({ data }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [pendingSelections, setPendingSelections] = useState<PendingSelection>({});

  const talksById = useMemo(() => new Map(data.talks.map((t) => [t.id, t])), [data.talks]);

  const assignmentByCell = useMemo(() => {
    const map = new Map<string, string>();
    for (const talk of data.talks) {
      if (talk.assignment) {
        map.set(`${talk.assignment.roomId}::${talk.assignment.slotId}`, talk.id);
      }
    }
    return map;
  }, [data.talks]);

  const slotsByDay = useMemo(() => {
    const map = new Map<string, ScheduleData["slots"]>();
    for (const slot of data.slots) {
      const existing = map.get(slot.day) ?? [];
      existing.push(slot);
      map.set(slot.day, existing);
    }
    return map;
  }, [data.slots]);

  const unscheduledTalks = data.talks.filter((t) => !t.assignment);

  async function submitAssignment(talkId: string, roomId: string, slotId: string) {
    setError(null);
    const response = await fetch("/api/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ talkId, roomId, slotId }),
    });

    if (!response.ok) {
      const payload: unknown = await response.json().catch(() => null);
      const message =
        payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string"
          ? payload.error
          : "Could not schedule that talk.";
      setError(message);
      return;
    }

    startTransition(() => router.refresh());
  }

  async function unassign(talkId: string) {
    setError(null);
    const response = await fetch("/api/assignments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ talkId }),
    });

    if (!response.ok) {
      setError("Could not unschedule that talk.");
      return;
    }

    startTransition(() => router.refresh());
  }

  return (
    <div className="mt-8 space-y-10">
      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <section>
        <h2 className="text-lg font-semibold">Schedule</h2>
        <div className="mt-4 space-y-8">
          {[...slotsByDay.entries()].map(([day, slots]) => (
            <div key={day}>
              <h3 className="mb-2 text-sm font-medium text-slate-600">{day}</h3>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full min-w-[600px] border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border-b border-slate-200 px-3 py-2 text-left font-medium text-slate-600">
                        Time
                      </th>
                      {data.rooms.map((room) => (
                        <th
                          key={room.id}
                          className="border-b border-slate-200 px-3 py-2 text-left font-medium text-slate-600"
                        >
                          {room.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {slots.map((slot) => (
                      <tr key={slot.id} className="border-b border-slate-100 last:border-0">
                        <td className="px-3 py-2 align-top text-slate-500">
                          {slot.start}-{slot.end}
                          {slot.label && (
                            <div className="text-xs uppercase tracking-wide text-slate-400">
                              {slot.label}
                            </div>
                          )}
                        </td>
                        {data.rooms.map((room) => {
                          const talkId = assignmentByCell.get(`${room.id}::${slot.id}`);
                          const talk = talkId ? talksById.get(talkId) : undefined;
                          return (
                            <td key={room.id} className="px-3 py-2 align-top">
                              {talk ? (
                                <div className="rounded-md bg-emerald-50 px-2 py-1">
                                  <div className="font-medium text-emerald-900">{talk.title}</div>
                                  <div className="text-xs text-emerald-700">
                                    {talk.speakerName} - {talk.lengthMinutes} min
                                  </div>
                                  <button
                                    type="button"
                                    disabled={isPending}
                                    onClick={() => unassign(talk.id)}
                                    className="mt-1 text-xs text-emerald-800 underline hover:no-underline disabled:opacity-50"
                                  >
                                    Unassign
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs text-slate-300">-</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Unscheduled talks</h2>
        {unscheduledTalks.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">All talks are scheduled.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {unscheduledTalks.map((talk) => {
              const selection = pendingSelections[talk.id] ?? {
                roomId: data.rooms[0]?.id ?? "",
                slotId: data.slots[0]?.id ?? "",
              };
              return (
                <li
                  key={talk.id}
                  className="flex flex-wrap items-center gap-3 rounded-md border border-slate-200 bg-white px-4 py-3"
                >
                  <div className="min-w-[220px] flex-1">
                    <div className="font-medium">{talk.title}</div>
                    <div className="text-xs text-slate-500">
                      {talk.speakerName} - {talk.lengthMinutes} min
                    </div>
                  </div>
                  <select
                    className="rounded-md border border-slate-300 px-2 py-1 text-sm"
                    value={selection.roomId}
                    onChange={(e) =>
                      setPendingSelections((prev) => ({
                        ...prev,
                        [talk.id]: { ...selection, roomId: e.target.value },
                      }))
                    }
                  >
                    {data.rooms.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.name}
                      </option>
                    ))}
                  </select>
                  <select
                    className="rounded-md border border-slate-300 px-2 py-1 text-sm"
                    value={selection.slotId}
                    onChange={(e) =>
                      setPendingSelections((prev) => ({
                        ...prev,
                        [talk.id]: { ...selection, slotId: e.target.value },
                      }))
                    }
                  >
                    {data.slots.map((slot) => (
                      <option key={slot.id} value={slot.id}>
                        {slot.day} {slot.start}-{slot.end}
                        {slot.label ? ` (${slot.label})` : ""}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => submitAssignment(talk.id, selection.roomId, selection.slotId)}
                    className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
                  >
                    Schedule
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
