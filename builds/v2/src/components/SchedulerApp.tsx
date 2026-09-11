"use client";

import { useMemo, useState } from "react";
import type { ScheduleData } from "@/db/queries";
import { validateAssignment, type ConflictReason } from "@/lib/scheduling";

type Assignment = ScheduleData["assignments"][number];
type Talk = ScheduleData["talks"][number];
type Slot = ScheduleData["slots"][number];

function formatDay(day: string): string {
  return new Date(`${day}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function SchedulerApp({ initialData }: { initialData: ScheduleData }) {
  const { conference, rooms, slots, speakers, talks } = initialData;
  const [assignments, setAssignments] = useState<Assignment[]>(initialData.assignments);
  const [error, setError] = useState<string | null>(null);
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const speakerById = useMemo(() => new Map(speakers.map((s) => [s.id, s.name])), [speakers]);
  const talkById = useMemo(() => new Map(talks.map((t) => [t.id, t])), [talks]);
  const assignmentByTalk = useMemo(() => new Map(assignments.map((a) => [a.talkId, a])), [assignments]);
  const assignmentByRoomSlot = useMemo(
    () => new Map(assignments.map((a) => [`${a.roomId}:${a.slotId}`, a])),
    [assignments],
  );

  const days = useMemo(() => Array.from(new Set(slots.map((s) => s.day))).sort(), [slots]);

  const unscheduledTalks = useMemo(
    () => talks.filter((t) => !assignmentByTalk.has(t.id)),
    [talks, assignmentByTalk],
  );

  async function scheduleTalk(talkId: string, roomId: string, slotId: string) {
    const key = `${roomId}:${slotId}`;
    setPendingKey(key);
    setError(null);
    try {
      const response = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ talkId, roomId, slotId }),
      });
      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        setError(body.error ?? "Could not schedule that talk.");
        return;
      }
      setAssignments((prev) => [...prev.filter((a) => a.talkId !== talkId), { talkId, roomId, slotId }]);
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setPendingKey(null);
    }
  }

  async function unscheduleTalk(talkId: string) {
    setError(null);
    try {
      const response = await fetch("/api/schedule", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ talkId }),
      });
      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        setError(body.error ?? "Could not unschedule that talk.");
        return;
      }
      setAssignments((prev) => prev.filter((a) => a.talkId !== talkId));
    } catch {
      setError("Could not reach the server. Please try again.");
    }
  }

  function optionsForCell(roomId: string, slotId: string): { talk: Talk; reason?: ConflictReason }[] {
    const slot = slots.find((s) => s.id === slotId);
    if (!slot) return [];
    return unscheduledTalks
      .map((talk) => {
        const validation = validateAssignment(
          { talkId: talk.id, roomId, slotId },
          { talks, rooms, slots, assignments },
        );
        return { talk, reason: validation.ok ? undefined : validation.reason };
      })
      .filter((entry) => entry.reason === undefined);
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">{conference?.name ?? "Conference Scheduler"}</h1>
        {conference && (
          <p className="mt-1 text-sm text-slate-500">
            Daily hours {conference.dayStart}-{conference.dayEnd}
          </p>
        )}
      </header>

      {error && (
        <div
          role="alert"
          className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="ml-4 shrink-0 font-medium text-red-700 underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
        <div className="space-y-10">
          {days.map((day) => (
            <DayGrid
              key={day}
              day={day}
              rooms={rooms}
              slots={slots.filter((s) => s.day === day).sort((a, b) => a.start.localeCompare(b.start))}
              assignmentByRoomSlot={assignmentByRoomSlot}
              talkById={talkById}
              speakerById={speakerById}
              pendingKey={pendingKey}
              optionsForCell={optionsForCell}
              onSchedule={scheduleTalk}
              onUnschedule={unscheduleTalk}
            />
          ))}
        </div>

        <aside className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Unscheduled talks ({unscheduledTalks.length})
          </h2>
          {unscheduledTalks.length === 0 ? (
            <p className="text-sm text-slate-500">Every talk has been scheduled.</p>
          ) : (
            <ul className="space-y-2">
              {unscheduledTalks.map((talk) => (
                <li key={talk.id} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                  <p className="font-medium text-slate-900">{talk.title}</p>
                  <p className="text-xs text-slate-500">
                    {speakerById.get(talk.speakerId) ?? "Unknown speaker"} - {talk.lengthMinutes} min
                  </p>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </div>
  );
}

function DayGrid({
  day,
  rooms,
  slots,
  assignmentByRoomSlot,
  talkById,
  speakerById,
  pendingKey,
  optionsForCell,
  onSchedule,
  onUnschedule,
}: {
  day: string;
  rooms: ScheduleData["rooms"];
  slots: Slot[];
  assignmentByRoomSlot: Map<string, Assignment>;
  talkById: Map<string, Talk>;
  speakerById: Map<string, string>;
  pendingKey: string | null;
  optionsForCell: (roomId: string, slotId: string) => { talk: Talk; reason?: ConflictReason }[];
  onSchedule: (talkId: string, roomId: string, slotId: string) => void;
  onUnschedule: (talkId: string) => void;
}) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-slate-800">{formatDay(day)}</h2>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[640px] table-fixed border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="w-28 border-b border-slate-200 px-3 py-2">Time</th>
              {rooms.map((room) => (
                <th key={room.id} className="border-b border-slate-200 px-3 py-2">
                  {room.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => {
              if (slot.label) {
                return (
                  <tr key={slot.id} className="bg-slate-100">
                    <td colSpan={rooms.length + 1} className="px-3 py-2 text-center text-xs font-medium text-slate-500">
                      {slot.start} - {slot.end} · {slot.label}
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={slot.id} className="align-top">
                  <td className="border-b border-slate-100 px-3 py-2 text-xs font-medium text-slate-500">
                    {slot.start} - {slot.end}
                  </td>
                  {rooms.map((room) => {
                    const assignment = assignmentByRoomSlot.get(`${room.id}:${slot.id}`);
                    const cellKey = `${room.id}:${slot.id}`;
                    const isPending = pendingKey === cellKey;

                    if (assignment) {
                      const talk = talkById.get(assignment.talkId);
                      if (!talk) return <td key={room.id} className="border-b border-slate-100 px-3 py-2" />;
                      return (
                        <td key={room.id} className="border-b border-slate-100 px-2 py-2">
                          <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-2">
                            <p className="text-sm font-medium text-indigo-900">{talk.title}</p>
                            <p className="text-xs text-indigo-600">
                              {speakerById.get(talk.speakerId) ?? "Unknown speaker"} · {talk.lengthMinutes} min
                            </p>
                            <button
                              type="button"
                              onClick={() => onUnschedule(talk.id)}
                              className="mt-2 text-xs font-medium text-indigo-700 underline hover:no-underline"
                            >
                              Unschedule
                            </button>
                          </div>
                        </td>
                      );
                    }

                    const options = optionsForCell(room.id, slot.id);
                    return (
                      <td key={room.id} className="border-b border-slate-100 px-2 py-2">
                        <select
                          className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-600 disabled:opacity-50"
                          value=""
                          disabled={isPending}
                          onChange={(event) => {
                            const talkId = event.target.value;
                            if (talkId) onSchedule(talkId, room.id, slot.id);
                          }}
                        >
                          <option value="">{options.length === 0 ? "No talks fit" : "+ Add talk"}</option>
                          {options.map(({ talk }) => (
                            <option key={talk.id} value={talk.id}>
                              {talk.title} ({talk.lengthMinutes}m)
                            </option>
                          ))}
                        </select>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
