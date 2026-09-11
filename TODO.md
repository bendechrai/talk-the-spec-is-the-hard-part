# Prep checklist

Order matters; see ARCHITECTURE.md "Build order".

## 1. Specs (critical path)
- [x] specs/v1/spec.md - the naive prompt, verbatim
- [x] specs/v2/spec.md - plus ~4 constraint sentences (speaker uniqueness, talk fits slot, day bounds, cardinality)
- [x] specs/v3/spec.md - done-when rewritten into imaginable-test criteria
- [x] specs/v3/CLAUDE.md - bare prohibition about gates (so the agent waives e2e and says so)
- [x] specs/v4/spec.md - v3 after the critic
- [x] specs/v4/CLAUDE.md - the recipe for the unavoidable case
- [x] specs/critic/prompt.md
- [x] Review all four diffs on screen before any build

## 2. Fallback builds (unattended, sequential)
- [x] builds/v1 from specs/v1 - double booking rejected (model infers it); lunch slot accepted, that is the reveal
- [x] builds/v2 - double booking, over-length, lunch all handled; 250 into a 40-seat room and two Data talks side by side accepted
- [x] builds/v3 - constraints hold with named errors; tests are honest (no shallow one); summary says Build complete with the un-run e2e gate at the bottom
- [x] builds/v4 - Waived line first; sabotage-tested a constraint; 19 tests one per criterion
- [ ] Commit all four (node_modules and sqlite ignored; seed script committed)

## 3. Deck skeleton
- [x] deck/ Next.js + Reveal.js, theme, notes view
- [x] SpecDiff component + /api/spec
- [x] AppFrame component + demo.config.json switch
- [x] Terminal component (ttyd + tmux)
- [x] Critic component + /api/critic streaming + hotkey for saved result
- [x] scripts/up.sh, kickoff.sh, serve.sh, switch.sh, test.sh
- [x] Verify an iframe onto builds/v1 and a terminal pane both render inside a slide

## 4. Slides (generated from SCRIPT.md; edit the script)
- [x] Sections and beats from the narrative into slides.ts (first pass)
- [x] Hook (the numbers)
- [x] Theory 1 incl. the 25 Aug quote slide
- [x] Theory 2 incl. remaining-vs-used and not-disclosed-vs-not-requested
- [x] Theory 3 incl. the grep slide
- [x] Theory 4 incl. critic-as-stranger and the STOP key
- [x] The third spec: three-specs slide, three-failures slide, the single-line slide
- [x] Horizon: staging-was-prod, window cleaner, Tessl / Warp dated
- [x] Monday slide
- [x] Close: seven lines
- [ ] Photos chosen for the photo slides (none required by the script; optional)

## 5. Reveal scripts and critic
- [x] RUNBOOK.md: which clicks find which bug at each stage
- [x] Run critic on v3, save to specs/critic/v3-result.md
- [ ] Fabricated-reviews screenshot from the real run

## 6. Rehearsal
- [ ] Dry run on phone hotspot, timed, all four builds live
- [ ] Decide offline story (asciinema replay for kickoff; local model or not)
- [ ] Rehearse to 55 min
