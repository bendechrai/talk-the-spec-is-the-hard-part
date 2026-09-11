import { NextRequest } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(process.cwd(), "..");

export async function GET(req: NextRequest) {
  const stage = req.nextUrl.searchParams.get("stage") ?? "1";
  const file = req.nextUrl.searchParams.get("file") === "CLAUDE.md" ? "CLAUDE.md" : "spec.md";
  if (!/^[1-4]$/.test(stage)) return new Response("bad stage", { status: 400 });
  try {
    const text = await readFile(path.join(ROOT, "specs", `v${stage}`, file), "utf8");
    return new Response(text, { headers: { "content-type": "text/plain; charset=utf-8" } });
  } catch {
    return new Response("", { status: 404 });
  }
}
