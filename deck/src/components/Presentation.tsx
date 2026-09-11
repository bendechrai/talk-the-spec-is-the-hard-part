"use client";
import { useEffect, useRef } from "react";
import Reveal from "reveal.js";
import Notes from "reveal.js/plugin/notes";
import "reveal.js/reveal.css";
import "@/styles/theme.css";
import { sections, type Slide } from "@/lib/slides";
import SpecDiff from "@/components/demo/SpecDiff";
import AppFrame from "@/components/demo/AppFrame";
import Terminal from "@/components/demo/Terminal";
import Critic from "@/components/demo/Critic";
import SeedTable from "@/components/demo/SeedTable";
import Receipt from "@/components/Receipt";

function Body({ s }: { s: Slide }) {
  switch (s.kind) {
    case "text":
      return (
        <div className={`slide-text${s.dark ? " dark" : ""}${s.image ? (s.box ? " over box" : " over mark") : ""}`}>
          <h1><span>{s.text}</span></h1>
          {s.sub && <p className="sub"><span>{s.sub}</span></p>}
        </div>
      );
    case "photo":
      return (
        <div className="slide-photo">
          {s.caption && <p className="caption">{s.caption}</p>}
        </div>
      );
    case "quote":
      return (
        <div className="slide-quote">
          <blockquote>{s.text}</blockquote>
          <p className="who">
            {s.who}, {s.when}
          </p>
          {s.logos && (
            <div className="quote-logos">
              {s.logos.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={src} src={src} alt="" />
              ))}
            </div>
          )}
        </div>
      );
    case "lines":
      return (
        <div className={`slide-lines${s.aside ? " with-aside" : ""}`}>
          {s.aside && (
            // Title and mark at the top, on the same click as the sign-off.
            <div className="lines-head fragment" data-fragment-index={s.lines.length}>
              <div className="mini-grid" aria-hidden="true">
                <span /><span /><span /><span className="on" /><span className="on" /><span /><span /><span /><span />
              </div>
              <p>The Spec Is the Hard Part</p>
            </div>
          )}
          {s.aside && (
            <div className="lines-aside fragment" data-fragment-index={s.lines.length}>
              {s.aside.map((a, i) => (
                <p key={i}>{a}</p>
              ))}
            </div>
          )}
          {s.lines.map((l, i) =>
            l.startsWith("!! ") ? (
              // A line written as "!! text" is a sticker: a prompt bubble on the
              // accent colour, tilted, appearing as its own fragment.
              <div key={i} className="fragment sticker" aria-label={l.slice(3)} data-fragment-index={i}>
                <span className="sticker-prompt">&gt;</span>
                {l.slice(3)}
                <span className="sticker-cursor" />
              </div>
            ) : (
              <p key={i} className="fragment" data-fragment-index={i}>
                {l}
              </p>
            ),
          )}
        </div>
      );
    case "receipt":
      return (
        <div className="slide-receipt">
          {s.image && <div className="receipt-bg" style={{ backgroundImage: `url(${s.image})` }} aria-hidden />}
          <Receipt id={s.id} title={s.title} />
        </div>
      );
    case "title":
      return (
        <div className="slide-title">
          {process.env.NEXT_PUBLIC_EVENT && <p className="kicker">{process.env.NEXT_PUBLIC_EVENT}</p>}
          <h1>
            The Spec Is
            <br />
            the Hard Part
          </h1>
          <p className="byline">Ben Dechrai · @bendechrai</p>
          <div className="title-grid" aria-hidden="true">
            <span /><span /><span /><span className="on" /><span className="on" /><span /><span /><span /><span />
          </div>
        </div>
      );
    case "demo":
      return (
        <div className="slide-demo">
          {s.title && <p className="demo-title">{s.title}</p>}
          {s.demo === "spec-diff" && <SpecDiff from={s.from ?? 1} to={s.to ?? 2} tab={s.tab} />}
          {s.demo === "app" && <AppFrame stage={s.stage ?? 1} />}
          {s.demo === "terminal" && <Terminal />}
          {s.demo === "critic" && <Critic stage={s.stage ?? 3} />}
          {s.demo === "seed" && <SeedTable stage={s.stage ?? 2} />}
        </div>
      );
  }
}

const ZOOM_KEY = "demo-zoom";
function applyZoom(z: number) {
  document.documentElement.style.setProperty("--demo-zoom", String(z));
  try {
    localStorage.setItem(ZOOM_KEY, String(z));
  } catch {
    // storage unavailable; zoom still applies for this session
  }
  const badge = document.getElementById("zoom-badge");
  if (badge) {
    badge.textContent = `demo ${Math.round(z * 100)}%`;
    badge.classList.add("show");
    window.setTimeout(() => badge.classList.remove("show"), 900);
  }
}
function readZoom(): number {
  try {
    const v = parseFloat(localStorage.getItem(ZOOM_KEY) ?? "");
    return Number.isFinite(v) && v > 0.3 && v < 4 ? v : 1;
  } catch {
    return 1;
  }
}

export default function Presentation() {
  const deckRef = useRef<HTMLDivElement>(null);
  const reveal = useRef<InstanceType<typeof Reveal> | null>(null);

  useEffect(() => {
    if (!deckRef.current || reveal.current) return;
    let zoom = readZoom();
    document.documentElement.style.setProperty("--demo-zoom", String(zoom));
    const step = (d: number) => {
      zoom = Math.min(3, Math.max(0.5, Math.round((zoom + d) * 20) / 20));
      applyZoom(zoom);
    };
    const r = new Reveal(deckRef.current, {
      hash: true,
      controls: false,
      progress: true,
      transition: "fade",
      width: 1920,
      height: 1080,
      margin: 0.04,
      plugins: [Notes],
      keyboard: {
        // Deck-specific keys are handled by our own listener below so they
        // work regardless of Reveal's internal key routing.
      },
    });
    // If a click landed inside an app or terminal frame, keys go to that frame.
    // Reclaim focus ONLY in that case, and only in the top-level window: the
    // speaker view runs this deck again inside two preview iframes, and an
    // unconditional window.focus() there stole the keyboard from the speaker
    // view after the first advance, so space only moved the upcoming preview.
    r.on("slidechanged", () => {
      if (window.self !== window.top) return;
      const active = document.activeElement as HTMLElement | null;
      if (active && active.tagName === "IFRAME") {
        active.blur();
        window.focus();
      }
    });
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName ?? "").toLowerCase();
      if (tag === "input" || tag === "textarea" || e.metaKey || e.ctrlKey || e.altKey) return;
      switch (e.key) {
        case "=":
        case "+":
          step(0.1);
          break;
        case "-":
          step(-0.1);
          break;
        case "0":
          zoom = 1;
          applyZoom(1);
          break;
        case "a":
          window.dispatchEvent(new CustomEvent("critic", { detail: "live" }));
          break;
        case "c":
          window.dispatchEvent(new CustomEvent("critic", { detail: "saved" }));
          break;
        case "t": {
          const idx = r.getIndices();
          const last = sessionStorage.getItem("back");
          if (last) {
            const [h, v] = last.split(",").map(Number);
            sessionStorage.removeItem("back");
            r.slide(h, v);
            break;
          }
          const el = document.querySelector('section[data-demo="terminal"]');
          if (el) {
            sessionStorage.setItem("back", `${idx.h},${idx.v}`);
            const tt = r.getIndices(el as HTMLElement);
            r.slide(tt.h, tt.v);
          }
          break;
        }
        default:
          return;
      }
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    r.initialize();
    reveal.current = r;
    // Exposed for debugging from the browser console (window.__reveal).
    (window as unknown as { __reveal?: unknown }).__reveal = r;
  }, []);

  return (
    <div className="reveal" ref={deckRef}>
      <div className="slides">
        {sections.map((sec) => (
          // data-start-indexv: always enter a stack at its first slide. Without it
          // Reveal returns to the last-visited vertical slide, which skips the spec
          // slide on a second pass and confuses the speaker view's upcoming preview.
          <section key={sec.id} data-section={sec.id} data-start-indexv="0">
            {sec.slides.map((s, i) => (
              <section
                key={i}
                data-demo={s.kind === "demo" ? s.demo : undefined}
                data-section-title={sec.title}
                data-background-image={s.kind === "photo" ? s.image : s.kind === "text" ? s.image : undefined}
                data-background-size={s.kind === "photo" ? (s.fit ?? "cover") : s.kind === "text" && s.image ? "cover" : undefined}
                data-background-color={s.kind === "photo" || (s.kind === "text" && s.image) ? "#0e0f11" : undefined}
                data-background-opacity={s.kind === "text" && s.image ? "0.45" : undefined}
              >
                <Body s={s} />
                {(s.notes || s.glance) && (
                  <aside className="notes">
                    {/* Inline styles: the speaker window has its own stylesheet and never sees the deck's CSS. */}
                    {s.glance && (
                      <ul style={{ fontSize: "1.25em", fontWeight: 600, lineHeight: 1.35, margin: "0 0 0.4em 0", paddingLeft: "1.1em" }}>
                        {s.glance.map((g, j) => (
                          <li key={j} style={{ margin: "0.25em 0" }}>
                            {g}
                          </li>
                        ))}
                      </ul>
                    )}
                    {s.glance && s.notes && <hr style={{ border: 0, borderTop: "1px solid #666", margin: "0.5em 0" }} />}
                    {s.notes && (
                      <p style={{ fontSize: "0.85em", lineHeight: 1.4, color: "#9a9a9a", whiteSpace: "pre-wrap", margin: 0 }}>{s.notes}</p>
                    )}
                  </aside>
                )}
              </section>
            ))}
          </section>
        ))}
      </div>
      <div id="zoom-badge" className="zoom-badge" />
    </div>
  );
}
