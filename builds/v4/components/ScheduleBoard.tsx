"use client";

import { useMemo, useState } from "react";
import type { ScheduleView, TalkView } from "@/lib/schedule-view";

interface Props {
  initialSchedule: ScheduleView;
}

interface SlotOption {
  id: string;
  label: string;
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body: unknown = await response.json();
    if (body && typeof body === "object" && "error" in body && typeof body.error === "string") {
      return body.error;
    }
  } catch {
    // ignore JSON parse failures below
  }
  return `Request failed with status ${response.status}.`;
}

function PlaceForm({
  talk,
  rooms,
  slotOptions,
  onPlace,
}: {
  talk: TalkView;
  rooms: ScheduleView["rooms"];
  slotOptions: SlotOption[];
  onPlace: (talkId: string, roomId: string, slotId: string) => void;
}) {
  const [roomId, setRoomId] = useState(rooms[0]?.id ?? "");
  const [slotId, setSlotId] = useState(slotOptions[0]?.id ?? "");

  return (
    <form
      className="flex flex-wrap items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        onPlace(talk.id, roomId, slotId);
      }}
    >
      <select
        aria-label={`Room for ${talk.title}`}
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="rounded border border-slate-300 px-2 py-1 text-sm"
      >
        {rooms.map((room) => (
          <option key={room.id} value={room.id}>
            {room.name}
          </option>
        ))}
      </select>
      <select
        aria-label={`Slot for ${talk.title}`}
        value={slotId}
        onChange={(e) => setSlotId(e.target.value)}
        className="rounded border border-slate-300 px-2 py-1 text-sm"
      >
        {slotOptions.map((slot) => (
          <option key={slot.id} value={slot.id}>
            {slot.label}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="rounded bg-slate-900 px-3 py-1 text-sm text-white hover:bg-slate-700"
      >
        Place
      </button>
    </form>
  );
}

export function ScheduleBoard({ initialSchedule }: Props) {
  const [schedule, setSchedule] = useState<ScheduleView>(initialSchedule);
  const [error, setError] = useState<string | null>(null);

  const slotOptions = useMemo<SlotOption[]>(
    () =>
      schedule.days.flatMap((day) =>
        day.slots
          .filter((slot) => slot.kind === "session")
          .map((slot) => ({ id: slot.id, label: `${day.date} ${slot.start}-${slot.end}` })),
      ),
    [schedule],
  );

  async function refresh() {
    const response = await fetch("/api/schedule");
    const data: ScheduleView = await response.json();
    setSchedule(data);
  }

  async function handlePlace(talkId: string, roomId: string, slotId: string) {
    setError(null);
    const response = await fetch("/api/placements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ talkId, roomId, slotId }),
    });
    if (!response.ok) {
      setError(await readErrorMessage(response));
      return;
    }
    await refresh();
  }

  async function handleUnplace(talkId: string) {
    setError(null);
    const response = await fetch(`/api/placements/${talkId}`, { method: "DELETE" });
    if (!response.ok) {
      setError(await readErrorMessage(response));
      return;
    }
    await refresh();
  }

  return (
    <div className="flex flex-col gap-8">
      {error && (
        <div role="alert" className="rounded border border-red-300 bg-red-50 p-3 text-red-800">
          {error}
        </div>
      )}

      {schedule.days.map((day) => (
        <section key={day.id}>
          <h2 className="mb-2 text-lg font-semibold">{day.date}</h2>
          <table className="w-full table-fixed border-collapse border border-slate-300">
            <thead>
              <tr>
                <th className="border border-slate-300 bg-slate-100 p-2 text-left">Time</th>
                {schedule.rooms.map((room) => (
                  <th key={room.id} className="border border-slate-300 bg-slate-100 p-2 text-left">
                    {room.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {day.slots.map((slot) => (
                <tr key={slot.id}>
                  <td className="border border-slate-300 p-2 align-top text-sm text-slate-600">
                    {slot.start}-{slot.end}
                  </td>
                  {slot.kind === "break" ? (
                    <td
                      colSpan={schedule.rooms.length}
                      className="border border-slate-300 bg-slate-100 p-2 text-center italic text-slate-500"
                    >
                      {slot.label ?? "Break"}
                    </td>
                  ) : (
                    schedule.rooms.map((room) => {
                      const talk = slot.placementsByRoom[room.id];
                      return (
                        <td
                          key={room.id}
                          data-testid={`cell-${slot.id}-${room.id}`}
                          className="border border-slate-300 p-2 align-top"
                        >
                          {talk ? (
                            <div className="flex flex-col gap-1">
                              <span className="font-medium">{talk.title}</span>
                              <span className="text-xs text-slate-600">
                                {talk.speakerNames.join(", ")}
                              </span>
                              <button
                                onClick={() => handleUnplace(talk.id)}
                                className="self-start text-xs text-red-700 underline"
                              >
                                Unplace
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                      );
                    })
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}

      <section aria-label="Unplaced talks">
        <h2 className="mb-2 text-lg font-semibold">Unplaced talks</h2>
        {schedule.unplacedTalks.length === 0 ? (
          <p className="text-sm text-slate-500">All talks are scheduled.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {schedule.unplacedTalks.map((talk) => (
              <li
                key={talk.id}
                data-testid={`unplaced-${talk.id}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded border border-slate-200 bg-white p-3"
              >
                <div>
                  <div className="font-medium">{talk.title}</div>
                  <div className="text-xs text-slate-600">{talk.speakerNames.join(", ")}</div>
                </div>
                <PlaceForm
                  talk={talk}
                  rooms={schedule.rooms}
                  slotOptions={slotOptions}
                  onPlace={handlePlace}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
