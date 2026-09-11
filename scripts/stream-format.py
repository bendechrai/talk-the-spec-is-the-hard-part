#!/usr/bin/env python3
"""Turn `claude -p --output-format stream-json --verbose` into a readable
live log for the stage terminal: one line per tool call as it happens, the
model's prose as it arrives, and the final result in full. Everything
printed also goes to the file named in argv[1] (the build.log)."""
import json, sys, time, os

log = open(sys.argv[1], "a") if len(sys.argv) > 1 else None
start = time.time()

def out(s):
    line = s.rstrip("\n")
    print(line, flush=True)
    if log:
        log.write(line + "\n"); log.flush()

def stamp():
    return time.strftime("%M:%S", time.gmtime(time.time() - start))

def short(s, n=110):
    s = " ".join(str(s).split())
    return s if len(s) <= n else s[: n - 3] + "..."

for raw in sys.stdin:
    raw = raw.strip()
    if not raw:
        continue
    try:
        ev = json.loads(raw)
    except json.JSONDecodeError:
        out(raw)
        continue
    t = ev.get("type")
    if t == "assistant":
        for block in ev.get("message", {}).get("content", []):
            bt = block.get("type")
            if bt == "text" and block.get("text", "").strip():
                out(f"[{stamp()}] {block['text'].strip()}")
            elif bt == "tool_use":
                name = block.get("name", "")
                inp = block.get("input", {}) or {}
                if name == "Bash":
                    detail = inp.get("command", "")
                elif name in ("Write", "Edit", "Read"):
                    detail = os.path.relpath(inp.get("file_path", ""), os.getcwd()) if inp.get("file_path") else ""
                elif name == "Agent":
                    detail = inp.get("description", "")
                else:
                    detail = inp.get("pattern") or inp.get("query") or ""
                out(f"[{stamp()}] > {name}: {short(detail)}")
    elif t == "result":
        out("")
        out("=" * 72)
        out(ev.get("result", "").strip())
        out("=" * 72)
        dur = ev.get("duration_ms", 0) / 1000
        out(f"[done in {dur:.0f}s, {ev.get('num_turns', '?')} turns]")
    # system, user (tool results), rate limit: silent
