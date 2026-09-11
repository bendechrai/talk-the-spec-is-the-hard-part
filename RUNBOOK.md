# Runbook

A step-by-step procedure for presenting this talk. Written so that anyone
with this repository can run it, not only the original speaker. The
spoken words are in SCRIPT.md; this file is what to type and click.

## 0. What you need

- macOS or Linux, Node 22 or later, npm, tmux, ttyd (`brew install tmux
  ttyd`), and Claude Code installed and logged in (`claude auth status`
  says loggedIn true). Builds run on a Claude subscription; no API key.
- A `.env` file is not required. `.env.example` exists only so the
  pattern is visible; nothing in the deck reads a secret.
- Chrome or any browser for the deck. An external monitor to bring along,
  plus the cable to mirror it to the projector; the laptop screen holds
  the speaker notes.
- Network for the live builds only. Everything else runs on the laptop.

## 1. Repository layout, in the order you will touch it

```
specs/v1..v4/spec.md      the four product specs (what the agent is asked for)
specs/v1..v4/CLAUDE.md    the agent's working instructions per stage
specs/v1..v2/seed.json    per-stage fixture data; v3 and v4 use specs/shared/seed.json
specs/shared/.claude/settings.json   permissions the agent runs under (no git, no curl, no browser installs)
specs/critic/prompt.md    the critic instruction; v3-result.md is the saved critic output
builds/v1..v4             fallback builds, produced by the real agent from each spec
live/                     where stage-day builds are created (gitignored)
deck/                     the slides (Next.js + Reveal.js)
scripts/                  everything below
SCRIPT.md                 the full spoken script with slide and demo cues
```

## 2. One-time setup on the presentation machine

```
cd deck && npm install && cd ..
for n in 1 2 3 4; do (cd builds/v$n && npm install --no-audit --no-fund); done
```

Mark the repository as trusted for Claude Code so headless builds may
run shell commands. Either open `claude` interactively once in this
directory and accept the trust prompt, or set
`projects["<absolute path to this repo>"].hasTrustDialogAccepted = true`
in `~/.claude.json`.

## 3. Start everything (before the session)

```
scripts/up.sh
scripts/reset-live.sh
```

`up.sh` starts, in order: a tmux session named `build`; ttyd on port 7681
attached to it; the four fallback apps on ports 3101 to 3104 in
production mode (`next build` then `next start`, about 40 seconds each);
the deck on port 4747.

Then:

1. Displays: the laptop screen plus one external monitor on the lectern,
   with the projector mirroring that monitor. Do not mirror the laptop
   itself; switching mirror modes moves windows.
2. Open `http://localhost:4747/` in the browser, full screen, on the
   external monitor. This is the window the room sees and the one you
   click in during the reveals. Clicks and scrolling in the speaker
   view's preview never reach it; the preview is a separate copy.
3. Press `S` to open the speaker notes window; drag it to the laptop
   screen. The notes are the script.
4. Open a real terminal on the laptop display and run
   `tmux attach -t build`. This is the same session the deck's terminal
   pane shows; use it if the pane misbehaves.
5. Check each app slide once (see the keys below) so the iframes have
   loaded.
6. Set the demo zoom for the room: on any app slide press `=` until the
   text reads from the back row. Browser zoom (cmd and plus) does not
   reach the embedded pages; only the deck's own keys do. The terminal
   font can also be set at launch: `TTYD_FONT=28 scripts/up.sh`.

Ports: 4747 deck, 7681 terminal, 3101 Build 1, 3102 Build 2, 3103 Build
3, 3104 Build 4.

## 4. Keys in the deck

| Key | Does |
| --- | --- |
| space, arrows | next, previous |
| S | speaker notes window |
| t | jump to the nearest terminal slide; press again to come back |
| r | reload the app iframe on the current app slide |
| = or + | enlarge every demo pane by 10% (apps, terminal, diff, critic, data table); remembered across reloads |
| - | shrink by 10% |
| 0 | reset demo zoom to 100% |

Reveal.js also uses `h j k l` for navigation and `s` for notes, `f` for
full screen, `esc` for overview, `b` to black the screen; do not bind
those. After clicking inside an app or terminal frame, the frame holds
the keyboard: click the black margin around it, or move to the next
slide, to give the deck its keys back.
| a | run the critic live, "attack" (critic slide) |
| c | show the cached critic result (critic slide) |

## 5. The four builds

### 5.0 Before the talk: reset

```
scripts/reset-live.sh
```

Stops any agent still working in a live directory, puts the fallback
back on every port, wipes `live/v1` to `live/v4`, and lays out each one
with its spec, its CLAUDE.md, its fixture and a settings file that
carries the model (Sonnet), the permission mode (accept edits) and the
clean-runner environment. After this, plain `claude` in any of those
directories needs no flags.

### 5.1 Every build, the same two commands

The spec is on the slide before the terminal: for Build 1 a slide
showing the v1 files (process tab: the environment file; product tab:
the one-sentence prompt), for Builds 2 to 4 the diff from the previous
stage. Then, on the terminal slide, in tmux, from the repository root:

```
cd live/v1          # then cd ../v2, ../v3, ../v4
claude
```

When Claude Code opens, type the same sentence every time:

```
Read spec.md and build it.
```

Enter. Leave it running; the next build's slide starts with `cd ../v2`.
If it asks a permission question, answer y; the allow-list covers npm,
node and file edits, so this is rare. When it finishes it prints its
summary in the terminal; for a live build that is the report the Reveal
3 and 4 script reads. Ctrl-C twice leaves Claude Code, but you do not
need to leave it until the next build.

Measured on 9 September (Sonnet, this laptop, headless): v1 5 to 10
minutes, v2 7 to 9, v3 about 14, v4 about 18. The talk gives v3 nine
minutes and v4 eight, so v3 and v4 are revealed from the fallback by
default. Start them anyway; the terminal shows real work, and if one
finishes early, use it.

### 5.2 Headless builds

`scripts/kickoff.sh N fb` rebuilds a fallback headless with the spec as
the prompt, streamed to the terminal and `builds/vN/build.log`.
`HEADLESS=1 scripts/kickoff.sh N live` does the same into `live/vN`.

### 5.3 Switching a stage between live and fallback

Ports never change. What changes is which directory serves the port.

```
scripts/serve.sh N live     # serve live/vN on port 310N (builds it first, ~40 s)
scripts/serve.sh N fb       # serve builds/vN on port 310N
```

Run these from a second terminal, not the tmux window where Claude Code
is running.

`scripts/switch.sh` is the same command under another name. After
switching, press `r` on the app slide. Nothing else changes.

The dot in the top-right corner of every app frame says which is
serving: grey is the fallback, green is a live build, red means nothing
is answering on that port. It refreshes every few seconds.

### 5.4 Resetting a build's data between runs

Every build starts with an empty schedule. Anything you place during a
reveal stays placed until removed. Each app has Unschedule or Unplace
links in the grid. From the terminal, the API calls are:

```
# Build 1
curl -s -X DELETE localhost:3101/api/assignments -H 'content-type: application/json' -d '{"talkId":"t1"}'
# Build 2 and Build 3
curl -s -X DELETE localhost:3102/api/schedule -H 'content-type: application/json' -d '{"talkId":"t1"}'
curl -s -X DELETE localhost:3103/api/schedule -H 'content-type: application/json' -d '{"talkId":"t1"}'
# Build 4
curl -s -X DELETE localhost:3104/api/placements/t1
```

Repeat with each talk id you placed. To reset a fallback completely:
`cd builds/vN && rm data.db && npm run seed`, then `scripts/serve.sh N fb`.

## 6. The reveals, click by click

Talk ids used below: t1 "The Spec Is the Hard Part" (Ben Dechrai, 45
min, audience 250, AI), t2 "Ten Key Steps for Enhanced Web App
Security" (Ben Dechrai, 45 min, audience 70, Security), t3 "Postgres Is
Your Message Queue" (Priya Natarajan, 45 min, audience 60, Data), t4
"Event Sourcing Without Regret" (Priya Natarajan and Marcus Lindqvist,
60 min, Data), t10 "Lightning: SQLite in Prod" (Dele Okafor, 30 min,
Data). Rooms: Main Hall capacity 300, Room B 80, Room C 40. Day one is
2026-09-10; its slots are 09:00, 10:00, 11:00 (30 minutes), 11:30 Lunch,
13:00, 14:00, 15:00 (60 minutes).

### Reveal 1 (fallback: builds/v1)

The page has the grid at the top and an "Unscheduled talks" list below.
Each row in the list has a room dropdown, a slot dropdown and a Schedule
button. Errors appear inline in the row.

1. Row "The Spec Is the Hard Part": room Room B, slot 2026-09-10
   10:00-10:45, Schedule. Placed.
2. Row "Ten Key Steps": room Main Hall, slot 2026-09-10 10:00-10:45,
   Schedule. Expected: rejected, "speaker already scheduled". Say the
   "hands up if you wrote that rule" line.
3. Row "Event Sourcing Without Regret": room Main Hall, slot 2026-09-10
   11:00-11:30, Schedule. Fallback: rejected. A live run may accept it
   with an orange note; if so, use the "it knew, it told me, it let me"
   lines from the script, otherwise skip them.
4. Row "The Spec Is the Hard Part" (unschedule it from step 1 first via
   the grid's Unassign link): room Main Hall, slot 2026-09-10
   11:30-12:30, Schedule. Fallback: accepted. The grid shows the talk in
   the Lunch row. This is the reveal. Wait for the laugh.

### Reveal 2 (fallback: builds/v2)

Before the app: the "What the app was given" slide shows the fixture
with capacities and audiences. Read Room C, 40, and The Spec Is the Hard
Part, 250, aloud. The app itself does not display those numbers.

The page has a grid with an "+ Add talk" dropdown in every cell; the
lunch row is a break bar with no dropdown. Unscheduled talks are listed
on the right. Errors appear in a banner.

1. Cell Room B, 10:00: choose "The Spec Is the Hard Part". Placed. Cell
   Main Hall, 10:00: choose "Ten Key Steps". Expected: rejected.
2. Cell Main Hall, 11:00: choose "Event Sourcing Without Regret".
   Expected: rejected, too long.
3. Point at the Lunch row: no dropdown. It inferred that from the label.
4. Unschedule t1 (its card has an Unschedule link). Cell Room C, 10:00:
   choose "The Spec Is the Hard Part". Fallback: ACCEPTED. 250 people in
   a room for 40.
5. Cell Room B, 14:00: choose "Postgres Is Your Message Queue". Cell
   Room C, 14:00: choose "Lightning: SQLite in Prod". Fallback: both
   ACCEPTED. Two Data-track talks side by side.

### Reveal 3 (fallback: builds/v3)

The page has one card per slot with a dropdown and a Schedule button per
room. Errors appear inline.

1. Slot 10:00, Room C: "The Spec Is the Hard Part". Expected: rejected,
   "Room C has capacity 40, which is too small for The Spec Is the Hard
   Part (expected audience 250)".
2. Slot 14:00, Room C: "Lightning: SQLite in Prod" (placed). Slot 14:00,
   Room B: "Postgres Is Your Message Queue". Expected: rejected naming
   the Data track.
3. The Lunch slot has no controls; say so.
4. Terminal slide. Type `scripts/test.sh 3`. Eighteen tests pass.
5. Type `tail -30 builds/v3/build.log` (or `live/v3/build.log` if the
   live build finished). Read the first line: "Build complete." Read the
   gates line. Scroll to the last paragraph and read "What I did not do:
   npm run test:e2e cannot actually launch a browser in this sandbox...
   an environment restriction, not a code issue."
7. Optional: `cd builds/v3 && PLAYWRIGHT_BROWSERS_PATH=$PWD/.pw-browsers
   npm run test:e2e` shows the failure live: "Executable doesn't exist...
   Please run npx playwright install", 2 failed. Takes about 30 seconds.

### Reveal 4 (fallback: builds/v4)

The page has the grid with Unplace links, and an "Unplaced talks" list
with a room dropdown, a slot dropdown and a Place button per row. Errors
appear inline. Co-presented talks show both names.

1. Row "The Spec Is the Hard Part": Room C, 2026-09-10 10:00, Place.
   Expected: rejected, "Room C has capacity 40, which is less than the
   expected audience of 250 for talk The Spec Is the Hard Part."
2. Row "Event Sourcing Without Regret": Main Hall, 2026-09-10
   15:00-16:00, Place. Placed; both speakers shown. Row "Postgres Is Your
   Message Queue": Room B, 2026-09-10 15:00-16:00, Place. Expected:
   rejected, "speaker Priya Natarajan is already speaking in talk Event
   Sourcing Without Regret".
3. Next slide is a receipt with three report lines: Build 3's first and
   last lines and Build 4's first line ("Waived: test:e2e"). No terminal
   needed. If asked for the source: `head -8 builds/v4/build.log`.
4. Optional: `scripts/test.sh 4`. Nineteen tests, one file per
   criterion, named after the rule. Also in that log, for questions: `grep
   -n sabotage builds/v4/build.log` shows the agent disabling a constraint
   to confirm its tests fail, then reverting.

## 7. The critic

The critic slide shows the whole instruction (`specs/critic/prompt.md`)
on the left. Press `a`: the deck runs Claude Code headless with that
instruction followed by `specs/v3/spec.md`, no tools, thinking off, and
streams the findings into the right pane as they are written. The first
finding appears within about 5 seconds and the run finishes in about 45
seconds; a clock next to the buttons shows elapsed time.

`a` and `c` are two views of the same pane. `c` shows the saved result
(`specs/critic/v3-result.md`, produced the same way on 9 September) and
does not stop the live run; `a` switches back to it with everything it
has produced so far. A second `a` never restarts a run; the Restart
button, click only, does that once a run has finished. Read the first
three findings aloud; they are the ones the v4 diff fixed.

If the right pane says "sending" for more than 15 seconds, the model is
slow or the network is down: press `c` and carry on.

## 8. If things go wrong

- A live build stalls or breaks: `scripts/serve.sh N fb`, press `r` on
  the app slide, carry on. Say nothing unless asked; if asked, say the
  prepared build is the same spec, built the same way, an hour earlier.
- The deck dies: it restarts itself within a second; reload the page.
  The hash in the URL restores the position. If it stays down,
  `scripts/up.sh` again.
- ttyd or tmux dies: `scripts/up.sh` is idempotent; run it again.
- The critic is slow: press `c`. It streams as it writes; if the right
  pane still says "thinking" after a minute, the model is a slow one
  (CRITIC_MODEL in .env, default sonnet).
- Everything dies: each fallback is a plain Next.js app;
  `cd builds/vN && PORT=310N npx next start -p 310N`.
- Stop everything after the talk: `scripts/down.sh`.

## 9. Rebuilding the fallbacks yourself

```
scripts/kickoff.sh N fb      # rebuilds builds/vN from specs/vN with Sonnet, 5 to 18 minutes
```

The result is non-deterministic. After a rebuild, drive the reveal
clicks above and update section 6 to match what the new build does.
Keep a copy of the previous `build.log` somewhere outside the repo if it changes
the story.
