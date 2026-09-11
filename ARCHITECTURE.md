# Framework for the talk

Delivery: KCDC, 10-11 Sep 2026. The word-for-word script is `SCRIPT.md`;
the narrative and the transcript research are kept outside this repo,
with the talk notes. This file is how the deck, the demo and the fallbacks fit
together, and the order to build them in.

## The three surfaces

Everything the room sees is one of three things, and all three live in
one browser window so there is no window switching on stage:

1. **Slides.** Reveal.js inside a Next.js app, same as
   `talk-rock-solid-encryption`. Few words per slide, one photo where a
   photo says it better, speaker notes in the data file. Around 30 slides.
2. **Demo panes, embedded in slides.** A slide whose body is one of four
   React components:
   - `SpecDiff` renders the diff between two spec stages, read from
     `specs/` at request time. Two tabs: the product spec and the process
     spec (CLAUDE.md). This is the "diff on screen" moment, four times.
   - `AppFrame` is an iframe onto a running scheduler build. Which build
     (live or fallback) comes from a runtime switch, not from the slide.
   - `Terminal` is an iframe onto ttyd serving a tmux session. The build
     is kicked off in it live, and the tests are run in it at Reveal 3.
     The tmux session is also attached in a real terminal on the second
     screen as the fallback view.
   - `Critic` shows the saved critic result for spec v3 with a button that
     streams a fresh run through an API route. Hotkey `c` inserts the saved
     result if the live one is slow.
3. **The builds.** Four runnable scheduler apps, one per spec stage.
   Fallbacks are committed in `builds/v1..v4`. Live builds happen in
   `live/vN` (gitignored). Each stage has a fixed port so the iframe never
   needs to change: 3101 to 3104. A switch decides whether that port is
   served by the live directory or the fallback.

## Repository layout

```
talk-the-spec-is-the-hard-part/
  ARCHITECTURE.md         this file
  RUNBOOK.md              stage-day operations: ports, hotkeys, what to do when X fails
  TODO.md                 prep checklist
  specs/
    v1/spec.md            the naive prompt, verbatim
    v1/CLAUDE.md          empty or near-empty
    v2/spec.md            plus four constraint sentences
    v2/CLAUDE.md
    v3/spec.md            done-when rewritten into imaginable tests
    v3/CLAUDE.md          contains the bare prohibition ("all gates must pass")
    v4/spec.md            v3 after the critic
    v4/CLAUDE.md          contains the recipe ("if the e2e suite cannot run...")
    critic/prompt.md      the attack instruction
    critic/v3-result.md   saved output, for the hotkey
  builds/
    v1/ v2/ v3/ v4/       committed fallbacks, each a self-contained app
  live/                   gitignored, created by scripts/kickoff.sh
  deck/                   Next.js + Reveal.js, port 4747
    src/lib/slides.ts     sections -> slides -> {text, image, notes, demo}
    src/components/demo/  SpecDiff, AppFrame, Terminal, Critic
    src/app/api/spec/     reads specs/ for SpecDiff
    src/app/api/critic/   streams a critic run (Anthropic API)
    src/app/api/switch/   live-or-fallback per stage, persisted to a json file
  scripts/
    up.sh                 starts deck, ttyd, tmux session, all four fallbacks
    kickoff.sh N          copies specs/vN into live/vN, opens a tmux window, launches claude with the spec
    serve.sh N live|fb    (re)starts port 310N from live/vN or builds/vN
    switch.sh N live|fb   flips the iframe target without touching the slide
    test.sh N             runs the unit suite for stage N in the tmux window
```

## Source of truth: SCRIPT.md

`SCRIPT.md` is the word-for-word script with `[SLIDE: ...]`, `[DEMO: ...]`
and `[TERMINAL]` cues. `scripts/slides-from-script.py` turns it into
`deck/src/lib/slides.generated.ts`; the spoken text between cues becomes
each slide's speaker notes, so the notes view is the script. Edit the
script, rerun the generator, never edit the generated file. `RUNBOOK.md`
holds the exact clicks and commands the `[DEMO: ...]` cues refer to.

## Slide authoring model

Three levels, matching how the narrative is already written:

- **Section**: one of the sixteen blocks of the talk. A section
  is a horizontal position in Reveal; its slides stack vertically. The
  progress bar and the section title in the corner come from this.
- **Beat**: one idea the section must land. Most sections have two to
  four. A beat is a comment in the data file, not a slide.
- **Slide**: one beat, one surface. Either text (three to eight words),
  a photo with at most a caption, a verbatim quote with a date, or a demo
  pane. Never a bullet list. If a beat needs more than one slide, split
  it; if it needs bullets, it is speaker notes.

The data shape:

```ts
type Slide =
  | { kind: "text"; text: string; notes?: string; bg?: string }
  | { kind: "photo"; image: string; caption?: string; notes?: string }
  | { kind: "quote"; text: string; who: string; when: string; notes?: string }
  | { kind: "demo"; demo: "spec-diff" | "app" | "terminal" | "critic"; from?: 1|2|3; to?: 2|3|4; stage?: 1|2|3|4; notes?: string };

type Section = { id: string; title: string; minutes: number; slides: Slide[] };
```

Speaker notes carry the script, block by block, so
the notes view is the run sheet. The `minutes` field drives a small
elapsed-versus-planned indicator in the notes view, which matters with
four timed builds.

## The scheduler builds

Stack: Next.js, SQLite via Drizzle, Vitest. No Playwright installed in the
live environment. That is deliberate: v3's CLAUDE.md says all gates
including e2e must pass, the e2e suite cannot run without a browser, and
the agent will waive it and say so. That waiver line is what Reveal 3
reads aloud. v4's CLAUDE.md turns the prohibition into the recipe.

Each build directory is self-contained: its own package.json, its own
SQLite file, seeded from a per-stage fixture so the reveals are
reproducible. The fixture grows with the spec (decided 9 Sep after the
first builds): v1 carries only what the one-sentence prompt names (title,
speaker, length, rooms, slots; lunch is a plain slot with a label), v2
adds capacity, track and audience as data with no rule stated, v3 and v4
use the full fixture with break kinds. A rich fixture in v1 leaked the
constraints and the model enforced them unasked.

Model: Sonnet for every build, live and fallback, set as the default in
`kickoff.sh` (`MODEL=` overrides). Reason: five-minute builds, and the
default model infers every universal rule from the naive prompt, which
leaves nothing visible to reveal. Sonnet still infers the speaker clash;
what it leaves are the organiser-specific ones (lunch, over-length).

The kickoff script points `PLAYWRIGHT_BROWSERS_PATH` at an empty
directory so no cached browser is visible, mirroring a clean CI runner. The reveal scripts in
`RUNBOOK.md` say which clicks find which bug at each stage.

Fallbacks are produced by running the real kickoff against each spec
ahead of time and committing the result. They are not hand-written, so
they are honest. If a live build stalls, `switch.sh N fb` points the
iframe at the fallback and nobody can tell.

## The live pipeline

`kickoff.sh N` does, in one tmux window:

1. `rm -rf live/vN && mkdir live/vN && cp specs/vN/* live/vN/`
2. `cd live/vN && claude -p "$(cat spec.md)"` with the model and
   permission mode fixed in a project settings file so nothing is typed
   live except the prompt itself. The prompt is typed on stage for Build
   1 only, for the theatre of it; Builds 2 to 4 launch from the file.
3. On exit, `serve.sh N live` starts the app on port 310N.

The Terminal slide shows the tmux window. Builds run while the theory
slides are up. If a build finishes early, nothing changes on screen until
the reveal slide.

## Stage-day switches

- `switch.sh N live|fb`: which directory serves port 310N.
- Hotkey `c` on the Critic slide: swap in the saved result.
- Hotkey `t` on any slide: jump to the Terminal slide and back.
- A `demo.config.json` written by `switch.sh` and read by the deck every
  few seconds, so no rebuild or reload is needed to flip a stage.

## Offline story

The deck, ttyd, and the four fallbacks run entirely on the laptop. The
only network dependency is the agent itself (live builds and the live
critic). If the venue network is hostile: fallbacks for all four builds,
saved critic result, and the terminal slide shows a replay of a recorded
tmux session (`asciinema` cast piped into the same pane) so the kickoff
still looks live. Rehearse the hotspot; decide on the local-model fallback
only if the hotspot fails too.

## Build order

The specs are on the critical path for everything, and the fallback
builds run unattended once the specs exist. So:

1. **Specs v1 to v4** and the two CLAUDE.md variants. Show the diffs
   before building anything.
2. **Kick off the four fallback builds** in the background, sequentially
   (v1 first). While they run:
3. **Deck skeleton**: Next.js + Reveal, the four demo components, the
   switch, ttyd + tmux, `up.sh`. Verify an iframe onto a fallback build
   and a terminal pane both render inside a slide.
4. **Slide content** from the script, section by section, notes
   included.
5. **Reveal scripts and the critic**: which clicks find which bug at each
   stage; run the critic on v3 and save the result.
6. **Dry run** end to end on the hotspot, timed. Then rehearse to 55.
