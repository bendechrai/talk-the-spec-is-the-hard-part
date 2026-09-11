"use client";
import { useEffect, useState } from "react";
import { diffLines } from "diff";

type File = "spec.md" | "CLAUDE.md";

export default function SpecDiff({ from, to, tab }: { from: number; to: number; tab?: "product" | "process" }) {
  const [file, setFile] = useState<File>(tab === "process" ? "CLAUDE.md" : "spec.md");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  useEffect(() => {
    const load = async () => {
      const [ra, rb] = await Promise.all([
        fetch(`/api/spec?stage=${from}&file=${file}`),
        fetch(`/api/spec?stage=${to}&file=${file}`),
      ]);
      setA(await ra.text());
      setB(await rb.text());
    };
    load();
  }, [from, to, file]);
  const parts = diffLines(a, b);
  return (
    <div className="demo-pane">
      <div className="demo-tabs">
        {(["spec.md", "CLAUDE.md"] as File[]).map((f) => (
          <button key={f} className={f === file ? "on" : ""} onClick={() => setFile(f)}>
            {f === "spec.md" ? "Product spec" : "Process spec"}
          </button>
        ))}
        <span className="demo-tab-label">{from === to ? `v${from} · ${file}` : `v${from} to v${to}`}</span>
      </div>
      <pre className="diff">
        {parts.map((p, i) => {
          if (p.removed) return <span key={i} className="del">{p.value}</span>;
          if (p.added) return <span key={i} className="add">{p.value}</span>;
          return <span key={i} className={from === to ? "plain" : "ctx"}>{p.value}</span>;
        })}
      </pre>
    </div>
  );
}
