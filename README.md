# The Spec Is the Hard Part

Materials for the talk by Ben Dechrai (@bendechrai). One conference
scheduler, built four times by a coding agent, each time from a
better spec. The talk is the four specs, the four builds, and what changed
between them.

## What is here

- `specs/v1` to `specs/v4`: the four specs. Each folder has `spec.md` (what
  should exist and what proves it) and `CLAUDE.md` (how the agent should
  work). Read them in order; the diffs are the talk.
- `specs/critic`: the one-paragraph prompt that attacks a spec, and the
  saved result of running it against v3.
- `builds/v1` to `builds/v4`: what Claude Code built from each spec, unedited,
  including its own build log and summary.
- `deck`: the slides (Reveal.js inside Next.js) with the demo panes embedded.
- `scripts`: start and stop everything, serve the builds, run a fresh live
  build on stage.
- `SCRIPT.md`: the word-for-word script with slide and demo cues. The speaker
  notes in the deck are generated from it.
- `RUNBOOK.md`: how to run the talk, click by click.
- `ARCHITECTURE.md`: how the pieces fit together.

## Try it yourself

You need Node 22 or later, and Claude Code logged in. No API key is used.

```
scripts/up.sh          # builds and serves the four fallback apps, starts the deck
scripts/reset-live.sh  # lays out live/v1..v4 with the specs and agent settings
```

Then, in a terminal:

```
cd live/v1
claude
> Read spec.md and build it.
```

Do the same for v2, v3 and v4 and compare what comes out. The deck is at
http://localhost:4747/ and the runbook says which clicks reveal which bug
at each stage.

## Licence

Code (the deck, the scripts and the four builds) is MIT. The specs, the
script and the slide text are CC BY 4.0. See `LICENSE.md`. Photos are from
Unsplash under the Unsplash licence (`deck/public/images/ATTRIBUTION.md`);
the Warp and Tessl marks belong to their owners.
