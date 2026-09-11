#!/usr/bin/env python3
"""Generate deck/src/lib/slides.generated.ts from SCRIPT.md.

SCRIPT.md is the source of truth. Each `## HH:MM Title (N min ...)` heading
starts a section; each [SLIDE: ...], [DEMO: <pane> ...] or [TERMINAL] cue
starts a slide; the spoken text until the next cue becomes that slide's
speaker notes. Other [DEMO: ...] and [PAUSE...] lines are folded into the
notes so the notes view is the run sheet.
"""
import json, re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
src = (ROOT / "SCRIPT.md").read_text()
body = src.split("\n---\n", 1)[1]

QUOTE_WHO = {
    "Whenever you have a choice": ("me, to an agent, at nine in the evening", "25 August 2026"),
    "My local runs had the same failure": ("the agent", "27 August 2026, 19:12"),
    "I kept restating a prohibition": ("the agent", "26 August 2026, after the tenth stranded subagent"),
    "an assumption from before real data existed": ("the agent, on why a cron queued 148 emails nobody asked for", "2 September 2026"),
    "Cloud agents manage work from triage": ("Warp, launching Warp Factories", "18 August 2026"),
}
THREE_LINES = [
    "All tests must pass, even pre-existing failures.",
    "Check the environment variables by name only.",
    "Run long test suites in the foreground.",
]
SEVEN_LINES = [
    "The most dangerous requirements are the ones too obvious to state.",
    "Write the constraint at the moment you notice yourself assuming.",
    "If you cannot imagine the test, it is not a criterion.",
    "Co-authoring makes a model agreeable. Attacking makes it useful.",
    "Deterministic gates or nothing.",
    "I never fixed the code. I fixed the request.",
    "Prohibitions decay. Procedures survive.",
]

def is_portrait(path):
    """True if the image is taller than it is wide (JPEG/PNG header read, no deps)."""
    try:
        data = path.read_bytes()
    except OSError:
        return False
    import struct
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        w, h = struct.unpack(">II", data[16:24])
        return h > w
    i = 2
    while i < len(data):
        if data[i] != 0xFF:
            i += 1
            continue
        marker = data[i + 1]
        if marker in (0xC0, 0xC1, 0xC2):
            h, w = struct.unpack(">HH", data[i + 5:i + 9])
            return h > w
        seg = struct.unpack(">H", data[i + 2:i + 4])[0]
        i += 2 + seg
    return False

sections = []
cur_sec = None
cur_slide = None
notes = []

def flush():
    global cur_slide, notes
    if cur_slide is not None:
        glance = [l.strip()[2:] for l in notes if l.strip().startswith("> ")]
        spoken = [l for l in notes if not l.strip().startswith("> ")]
        text = "\n".join(l.strip() for l in spoken).strip()
        text = re.sub(r"\n{3,}", "\n\n", text)
        cur_slide["notes"] = text
        if glance:
            cur_slide["glance"] = glance
        cur_sec["slides"].append(cur_slide)
    cur_slide = None
    notes = []

def slide_from_cue(cue, sec):
    c = cue.strip()
    if c.lower().startswith("quote,"):
        c, _, extra = c.partition(" | ")
        m = re.match(r'quote,\s*(.*?)\s*-\s*"(.*)"\s*$', c.strip(), re.S)
        prefix, text = m.group(1), m.group(2)
        who, when = next((v for k, v in QUOTE_WHO.items() if k in text), ("", prefix))
        s = {"kind": "quote", "text": text, "who": who, "when": when}
        # extras after " | ": "bg <file>" (blurred, tilted screenshot behind) and/or "logos a b".
        toks = extra.split()
        i = 0
        while i < len(toks):
            if toks[i] == "bg" and i + 1 < len(toks):
                s["image"] = "/images/" + toks[i + 1]; i += 2
            elif toks[i] == "logos":
                s["logos"] = ["/images/logos/" + f for f in toks[i + 1:]]; break
            else:
                i += 1
        return s
    if c.startswith('"') and c.endswith('"'):
        text = c.strip('"')
        who, when = next((v for k, v in QUOTE_WHO.items() if k in text), ("", ""))
        return {"kind": "quote", "text": text, "who": who, "when": when}
    if c == "title":
        return {"kind": "title"}
    if c.startswith("photo "):
        # [SLIDE: photo <file> [cover|contain] | caption]
        rest = c[len("photo "):]
        head, _, caption = rest.partition(" | ")
        parts = head.split()
        file = parts[0]
        fit = parts[1] if len(parts) > 1 and parts[1] in ("cover", "contain") else None
        if fit is None:
            fit = "contain" if is_portrait(ROOT / "deck/public/images" / file) else "cover"
        s = {"kind": "photo", "image": "/images/" + file, "fit": fit}
        if caption.strip():
            s["caption"] = caption.strip()
        return s
    if c.startswith("bg "):
        # [SLIDE: bg <file> [box] | headline / sub]
        # Text over a darkened photo. Default: headline in an accent highlighter.
        # "box" puts it in a translucent black box instead.
        rest = c[len("bg "):]
        head, _, body = rest.partition(" | ")
        parts = head.split()
        s = text_slide(body.strip())
        s["image"] = "/images/" + parts[0]
        if len(parts) > 1 and parts[1] == "box":
            s["box"] = True
        return s
    if c.startswith("receipt "):
        rest = c[len("receipt "):]
        rid, _, title = rest.partition(" | ")
        parts = rid.split()
        s = {"kind": "receipt", "id": parts[0]}
        if len(parts) >= 3 and parts[1] == "bg":
            s["image"] = "/images/" + parts[2]
        if title.strip():
            s["title"] = title.strip()
        return s
    if c.startswith("three lines"):
        return {"kind": "lines", "lines": THREE_LINES}
    if c.startswith("seven lines"):
        # [SLIDE: seven lines | Thank you. / @bendechrai] puts a sign-off on the
        # right, revealed as the final click.
        s = {"kind": "lines", "lines": SEVEN_LINES}
        _, _, aside = c.partition(" | ")
        if aside.strip():
            s["aside"] = [a.strip() for a in aside.split(" / ")]
        return s
    return text_slide(c)


def text_slide(c):
    parts = [p.strip() for p in c.split(" / ")]
    if len(parts) >= 3:
        return {"kind": "lines", "lines": parts}
    if len(parts) == 2:
        return {"kind": "text", "text": parts[0], "sub": parts[1]}
    return {"kind": "text", "text": c}

def demo_from_cue(cue, sec):
    c = cue.strip()
    m = re.match(r"app slide,\s*Build (\d)", c)
    if m:
        return {"kind": "demo", "demo": "app", "stage": int(m.group(1)), "title": f"Build {m.group(1)}"}
    m = re.match(r"spec diff,\s*v(\d) to v(\d)", c)
    if m:
        a, b = int(m.group(1)), int(m.group(2))
        title = f"Spec v{a}" if a == b else f"Spec v{a} to v{b}"
        s = {"kind": "demo", "demo": "spec-diff", "from": a, "to": b, "title": title}
        if "process tab" in c:
            s["tab"] = "process"
        return s
    if c.startswith("critic slide"):
        return {"kind": "demo", "demo": "critic", "stage": 3, "title": "Critic on spec v3"}
    if c.startswith("data slide"):
        stage = 2
        return {"kind": "demo", "demo": "seed", "stage": stage, "title": "What the app was given"}
    return None

for raw in body.split("\n"):
    line = raw.rstrip()
    m = re.match(r"^## (\d\d:\d\d) (.+?) \((\d+) min", line)
    if m:
        flush()
        cur_sec = {"id": re.sub(r"[^a-z0-9]+", "-", m.group(2).lower()).strip("-"), "title": m.group(2), "minutes": int(m.group(3)), "at": m.group(1), "slides": []}
        sections.append(cur_sec)
        continue
    if cur_sec is None:
        continue
    m = re.match(r"^\[SLIDE: (.*)\]$", line.strip(), re.S)
    if m:
        flush()
        cur_slide = slide_from_cue(m.group(1), cur_sec)
        continue
    if line.strip() == "[TERMINAL]":
        flush()
        cur_slide = {"kind": "demo", "demo": "terminal", "title": cur_sec["title"]}
        continue
    m = re.match(r"^\[DEMO: (.*)\]$", line.strip(), re.S)
    if m:
        d = demo_from_cue(m.group(1), cur_sec)
        if d:
            flush()
            cur_slide = d
            continue
        if cur_slide is None:
            cur_slide = {"kind": "demo", "demo": "terminal", "title": cur_sec["title"]}
        notes.append("DEMO: " + m.group(1))
        continue
    if cur_slide is None:
        if not line.strip():
            continue
        # spoken text before any cue in a section: attach to a placeholder text slide of the section title
        cur_slide = {"kind": "text", "text": cur_sec["title"]}
    notes.append(line)
flush()

out = "// GENERATED from SCRIPT.md by scripts/slides-from-script.py. Do not edit; edit the script.\n"
out += "import type { Section } from \"./slides\";\n\n"
out += "export const generatedSections: Section[] = " + json.dumps(sections, indent=2, ensure_ascii=False) + ";\n"
(ROOT / "deck/src/lib/slides.generated.ts").write_text(out)
n = sum(len(s["slides"]) for s in sections)
print(f"{len(sections)} sections, {n} slides, {sum(s['minutes'] for s in sections)} min")
for s in sections:
    print(f"  {s['at']} {s['title']:<38} {len(s['slides'])} slides")
