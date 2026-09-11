"use client";
import { useEffect, useState } from "react";

type Room = { id: string; name: string; capacity?: number };
type Talk = { id: string; title: string; speaker?: string; speakers?: string[]; lengthMinutes: number; track?: string; expectedAudience?: number };
type Speaker = { id: string; name: string };
type Seed = { rooms: Room[]; talks: Talk[]; speakers: Speaker[] };

export default function SeedTable({ stage }: { stage: number }) {
  const [seed, setSeed] = useState<Seed | null>(null);
  useEffect(() => {
    fetch(`/api/seed?stage=${stage}`).then((r) => r.json()).then(setSeed).catch(() => setSeed(null));
  }, [stage]);
  if (!seed) return <div className="demo-pane" />;
  const name = (id: string) => seed.speakers.find((s) => s.id === id)?.name ?? id;
  const hasCap = seed.rooms.some((r) => r.capacity !== undefined);
  const hasAud = seed.talks.some((t) => t.expectedAudience !== undefined);
  const hasTrack = seed.talks.some((t) => t.track !== undefined);
  return (
    <div className="demo-pane seed">
      <div className="seed-col">
        <h3>Rooms</h3>
        <table>
          <tbody>
            {seed.rooms.map((r) => (
              <tr key={r.id}><td>{r.name}</td>{hasCap && <td className="num">{r.capacity}</td>}</tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="seed-col wide">
        <h3>Talks</h3>
        <table>
          <tbody>
            {seed.talks.map((t) => (
              <tr key={t.id}>
                <td>{t.title}</td>
                <td className="muted">{(t.speakers ?? [t.speaker ?? ""]).map(name).join(", ")}</td>
                <td className="num">{t.lengthMinutes} min</td>
                {hasTrack && <td className="muted">{t.track}</td>}
                {hasAud && <td className="num">{t.expectedAudience}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
