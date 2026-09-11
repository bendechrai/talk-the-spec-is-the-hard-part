"use client";
import { useEffect, useRef, useState } from "react";

type Info = { prompt: string; specChars: number; model: string };

// The critic writes findings as "**N. [Category] Title.** body". Render those as
// blocks with the category as a tag; anything else stays plain text.
// Inline markdown, just enough: **bold**, *italic*, `code`.
function Inline({ s }: { s: string }) {
  const parts = s.split(/(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("**") && p.endsWith("**")) return <strong key={i}>{p.slice(2, -2)}</strong>;
        if (p.startsWith("*") && p.endsWith("*") && p.length > 2) return <em key={i}>{p.slice(1, -1)}</em>;
        if (p.startsWith("`") && p.endsWith("`")) return <code key={i}>{p.slice(1, -1)}</code>;
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}

function Findings({ text }: { text: string }) {
  const paras = text.split(/\n\s*\n/);
  return (
    <div className="critic-findings">
      {paras.map((para, i) => {
        if (!para.trim()) return null;
        const m = para.match(/^\*\*(\d+)\.\s*\[([^\]]+)\]\s*([\s\S]*?)\*\*\s*([\s\S]*)$/);
        if (m) {
          const [, n, cat, title, body] = m;
          return (
            <div key={i} className="finding">
              <div className="finding-head">
                <span className="finding-n">{n}</span>
                <span className={`finding-tag ${cat.toLowerCase().replace(/[^a-z]+/g, "-")}`}>{cat}</span>
                <span className="finding-title"><Inline s={title} /></span>
              </div>
              {body && <p className="finding-body"><Inline s={body} /></p>}
            </div>
          );
        }
        // Anything else: headings become labels, the rest is a paragraph with inline markdown.
        const h = para.match(/^#{1,6}\s+(.*)$/m);
        if (h && para.trim().split("\n").length === 1) return <div key={i} className="critic-label">{h[1]}</div>;
        return <p key={i} className="critic-plain"><Inline s={para.replace(/^#{1,6}\s+/gm, "")} /></p>;
      })}
    </div>
  );
}

export default function Critic({ stage }: { stage: number }) {
  const [text, setText] = useState("");        // the live run's output, kept across view switches
  const [cached, setCached] = useState("");    // the saved result
  const [view, setView] = useState<"live" | "cached">("cached");
  const [started, setStarted] = useState(false);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [info, setInfo] = useState<Info | null>(null);
  const [thinking, setThinking] = useState(0);
  const [err, setErr] = useState("");
  const abort = useRef<AbortController | null>(null);
  const bottom = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch(`/api/critic?stage=${stage}&what=prompt`).then((r) => r.json()).then(setInfo).catch(() => setInfo(null));
  }, [stage]);

  useEffect(() => {
    if (!running) return;
    const t0 = Date.now();
    setElapsed(0);
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - t0) / 1000)), 500);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (running && view === "live") bottom.current?.scrollIntoView({ block: "end" });
  }, [text, running, view]);

  // c: show the saved result. The live run, if any, keeps going underneath.
  const loadSaved = async () => {
    setView("cached");
    if (cached) return;
    const r = await fetch(`/api/critic?stage=${stage}`);
    setCached(await r.text());
  };

  // a: show the live run; start one only if none has been started.
  // Restart (button only) abandons the current run and starts again.
  const showLive = () => {
    setView("live");
    if (!started) runLive();
  };

  const runLive = async () => {
    abort.current?.abort();
    const ac = new AbortController();
    abort.current = ac;
    setView("live");
    setStarted(true);
    setText("");
    setThinking(0);
    setErr("");
    setRunning(true);
    try {
      const r = await fetch(`/api/critic?stage=${stage}`, { method: "POST", signal: ac.signal });
      const reader = r.body?.getReader();
      const dec = new TextDecoder();
      let buf = "";
      const handle = (line: string) => {
        if (!line.trim()) return;
        try {
          const m = JSON.parse(line) as { t: string; v?: string; n?: number };
          if (m.t === "text" && m.v) setText((t) => t + m.v);
          else if (m.t === "think" && m.n) setThinking(m.n);
          else if (m.t === "err" && m.v) setErr((e) => e + m.v + "\n");
        } catch {
          setErr((e) => e + line + "\n");
        }
      };
      while (reader) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        lines.forEach(handle);
      }
      if (buf) handle(buf);
    } catch {
      // aborted or failed; saved result is one keypress away
    } finally {
      // Only the run that is still current may switch the clock off.
      if (abort.current === ac) setRunning(false);
    }
  };

  // The key listener below is registered once; route through a ref so it
  // always calls the handlers from the latest render, not the first one.
  const handlers = useRef({ loadSaved, showLive });
  handlers.current = { loadSaved, showLive };

  useEffect(() => {
    // Keys are owned by the deck (see Presentation.tsx): a = attack live, c = cached result.
    const onCritic = (e: Event) => {
      const which = (e as CustomEvent<string>).detail;
      if (which === "saved") handlers.current.loadSaved();
      if (which === "live") handlers.current.showLive();
    };
    window.addEventListener("critic", onCritic);
    return () => window.removeEventListener("critic", onCritic);
  }, []);

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <div className="demo-pane critic-pane">
      <div className="demo-tabs">
        <button onClick={showLive} className={view === "live" ? "on" : ""}>Attack (a)</button>
        <button onClick={loadSaved} className={view === "cached" ? "on" : ""}>Cached result (c)</button>
        {started && <span className={`critic-clock${running ? " on" : ""}`}>{mm}:{ss}</span>}
        {started && !running && <button onClick={runLive} className="critic-restart">Restart</button>}
        <span className="demo-tab-label">spec v{stage}{info?.model ? ` · ${info.model} · no tools` : ""}</span>
      </div>
      <div className="critic-split">
        <div className={`critic-left${running ? " sending" : ""}`}>
          <div className="critic-label">The instruction</div>
          <pre className="critic-prompt">{info?.prompt ?? "loading the prompt..."}</pre>
        </div>
        <div className="critic-right">
          {view === "cached" ? (
            <>
              <div className="critic-label">Findings, saved run</div>
              {cached ? <Findings text={cached} /> : <p className="critic-plain muted">loading the saved result...</p>}
            </>
          ) : (
            <>
              <div className="critic-label">{running ? "Findings, as they arrive" : "Findings, live run"}</div>
              {text ? (
                <Findings text={text} />
              ) : (
                <p className="critic-plain muted">
                  {running ? (thinking ? `thinking... ${thinking.toLocaleString()} characters so far` : "sending...") : "press a to attack"}
                </p>
              )}
              {err && <pre className="critic-err">{err}</pre>}
            </>
          )}
          <div ref={bottom} />
        </div>
      </div>
    </div>
  );
}
