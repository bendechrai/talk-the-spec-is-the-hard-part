import { NextRequest } from "next/server";
import { readFile } from "node:fs/promises";
import { spawn, execSync } from "node:child_process";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const ROOT = path.resolve(process.cwd(), "..");

// Streamed so findings appear as they are written. CRITIC_MODEL in .env picks
// the model; sonnet by default because it starts writing within seconds.
const CRITIC_MODEL = process.env.CRITIC_MODEL || "sonnet";
const CLAUDE_ARGS = ["--output-format", "stream-json", "--verbose", "--include-partial-messages", "--tools", "", "--model", CRITIC_MODEL];

export async function GET(req: NextRequest) {
  const stage = req.nextUrl.searchParams.get("stage") ?? "3";
  if (req.nextUrl.searchParams.get("what") === "prompt") {
    // What the pane shows on the left: the exact instruction and how it is run.
    const raw = await readFile(path.join(ROOT, "specs", "critic", "prompt.md"), "utf8");
    // The file is hard-wrapped for git; unwrap it so the pane wraps to its own width.
    // A newline that starts a blank line or a numbered item is kept; the rest become spaces.
    const prompt = raw.replace(/(?<!\n)\n(?!\n|\s*\d+\.\s)/g, " ").replace(/[ \t]+/g, " ").trim();
    const spec = await readFile(path.join(ROOT, "specs", `v${stage}`, "spec.md"), "utf8");
    return Response.json({ prompt, specChars: spec.length, model: CRITIC_MODEL });
  }
  try {
    const text = await readFile(path.join(ROOT, "specs", "critic", `v${stage}-result.md`), "utf8");
    return new Response(text, { headers: { "content-type": "text/plain; charset=utf-8" } });
  } catch {
    return new Response("(no saved result yet)", { status: 404 });
  }
}

// Where is claude? CLAUDE_BIN, then the PATH of whatever started the deck,
// then the usual install location. No API key is involved: claude -p uses
// the same login as the terminal.
function claudeBin(): string {
  if (process.env.CLAUDE_BIN && existsSync(process.env.CLAUDE_BIN)) return process.env.CLAUDE_BIN;
  try {
    const found = execSync("command -v claude", { encoding: "utf8", shell: "/bin/zsh" }).trim();
    if (found) return found;
  } catch {
    // not on PATH
  }
  const local = path.join(os.homedir(), ".local", "bin", "claude");
  return existsSync(local) ? local : "claude";
}

// Runs Claude Code headless on the critic prompt and streams its output.
// Uses the local subscription; no API key involved.
export async function POST(req: NextRequest) {
  const stage = req.nextUrl.searchParams.get("stage") ?? "3";
  if (!/^[1-4]$/.test(stage)) return new Response("bad stage", { status: 400 });
  const prompt = await readFile(path.join(ROOT, "specs", "critic", "prompt.md"), "utf8");
  const spec = await readFile(path.join(ROOT, "specs", `v${stage}`, "spec.md"), "utf8");
  const full = `${prompt}\n\n---\n\nThe specification:\n\n${spec}`;
  const bin = claudeBin();
  const child = spawn(bin, ["-p", full, ...CLAUDE_ARGS], {
    cwd: path.join(ROOT, "specs", "critic"),
    // No extended thinking: with it on, sonnet sits silent for over a minute
    // before the first token; without it the first finding appears in seconds.
    env: { ...process.env, MAX_THINKING_TOKENS: "0" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  // The pane receives one JSON object per line: {t:"text",v} for reply text,
  // {t:"think",n} with the running count of thinking characters, {t:"err",v}.
  const enc = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (o: object) => controller.enqueue(enc.encode(JSON.stringify(o) + "\n"));
      let buf = "";
      let thought = 0;
      const handle = (line: string) => {
        if (!line.trim()) return;
        let ev: unknown;
        try {
          ev = JSON.parse(line);
        } catch {
          send({ t: "err", v: line });
          return;
        }
        const e = ev as { type?: string; event?: { type?: string; delta?: { type?: string; text?: string; thinking?: string } }; is_error?: boolean; result?: string; error?: string };
        if (e.type === "stream_event" && e.event?.type === "content_block_delta") {
          const d = e.event.delta;
          if (d?.type === "text_delta" && d.text) send({ t: "text", v: d.text });
          if (d?.type === "thinking_delta" && d.thinking) {
            thought += d.thinking.length;
            send({ t: "think", n: thought });
          }
        } else if (e.type === "result" && e.is_error) {
          send({ t: "err", v: e.result || e.error || "claude reported an error" });
        }
      };
      child.stdout.on("data", (d: Buffer) => {
        buf += d.toString();
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        lines.forEach(handle);
      });
      child.stderr.on("data", (d: Buffer) => send({ t: "err", v: d.toString() }));
      child.on("close", (code) => {
        if (buf) handle(buf);
        if (code && code !== 0) send({ t: "err", v: `claude exited with code ${code}` });
        controller.close();
      });
      child.on("error", (e) => {
        send({ t: "err", v: `Could not start claude (${bin}): ${e.message}. Set CLAUDE_BIN in .env or start the deck from a shell where 'claude' is on the PATH. Press c for the cached result.` });
        controller.close();
      });
    },
    cancel() {
      child.kill();
    },
  });
  // Belt and braces: the stream's cancel() is not always called when the
  // browser aborts, so also kill the child when the request itself is aborted.
  req.signal.addEventListener("abort", () => child.kill());
  return new Response(stream, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
