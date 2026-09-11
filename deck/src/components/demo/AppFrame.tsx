"use client";
import { useEffect, useState } from "react";

export default function AppFrame({ stage }: { stage: number }) {
  const [nonce, setNonce] = useState(0);
  const [mode, setMode] = useState<string>("");
  const [alive, setAlive] = useState<boolean>(true);
  useEffect(() => {
    const tick = async () => {
      try {
        const r = await fetch(`/api/run?stage=${stage}`);
        const j = (await r.json()) as { mode?: string; alive?: boolean };
        setMode(j.mode ?? "");
        setAlive(j.alive ?? true);
      } catch {
        setMode("");
        setAlive(false);
      }
    };
    tick();
    const id = setInterval(tick, 5000);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "r") setNonce((n) => n + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearInterval(id);
      window.removeEventListener("keydown", onKey);
    };
  }, [stage]);
  return (
    <div className="demo-pane">
      <iframe
        key={nonce}
        src={`http://localhost:310${stage}/`}
        className="app-frame"
        title={`Build ${stage}`}
      />
      {/* grey = fallback build, green = live build, red = nothing answering on the port */}
      <span
        className={`mode-dot ${!alive ? "dead" : mode === "fb" ? "fb" : mode ? "live" : ""}`}
        title={!alive ? "port not answering" : mode === "fb" ? "fallback build" : mode ? `live build (${mode})` : "unknown"}
      />
    </div>
  );
}
