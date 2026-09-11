import { NextRequest } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(process.cwd(), "..");

// Reports which directory (live or fb) is serving a stage's port, as
// written by scripts/serve.sh. Shown as a small badge for the speaker.
export async function GET(req: NextRequest) {
  const stage = req.nextUrl.searchParams.get("stage") ?? "1";
  if (!/^[1-4]$/.test(stage)) return Response.json({ mode: "", alive: false });
  let mode = "";
  try {
    const text = await readFile(path.join(ROOT, ".run", `v${stage}.json`), "utf8");
    mode = (JSON.parse(text) as { mode?: string }).mode ?? "";
  } catch {
    mode = "";
  }
  let alive = false;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 1500);
    const r = await fetch(`http://localhost:310${stage}/`, { signal: ctrl.signal, cache: "no-store" });
    clearTimeout(timer);
    alive = r.ok;
  } catch {
    alive = false;
  }
  return Response.json({ mode, alive });
}
