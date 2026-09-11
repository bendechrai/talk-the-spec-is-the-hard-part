import { NextRequest } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(process.cwd(), "..");

// The fixture a stage's build was given: specs/vN/seed.json if it exists,
// otherwise the shared one. Shown on the "what the app was given" slide.
export async function GET(req: NextRequest) {
  const stage = req.nextUrl.searchParams.get("stage") ?? "2";
  if (!/^[1-4]$/.test(stage)) return new Response("bad stage", { status: 400 });
  for (const p of [path.join(ROOT, "specs", `v${stage}`, "seed.json"), path.join(ROOT, "specs", "shared", "seed.json")]) {
    try {
      const text = await readFile(p, "utf8");
      return new Response(text, { headers: { "content-type": "application/json" } });
    } catch {
      // try next
    }
  }
  return new Response("{}", { status: 404 });
}
