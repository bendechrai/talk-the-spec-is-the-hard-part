#!/usr/bin/env bash
# Usage: scripts/kickoff.sh <stage 1-4> [live|fb]
#   live: prepares live/vN and opens interactive Claude Code there (you type the prompt).
#         HEADLESS=1 runs it headless instead. On stage, prefer scripts/reset-live.sh
#         before the talk and then plain `cd live/vN && claude`.
#   fb:   rebuilds builds/vN headless with the spec as the prompt.
# Copies the stage's spec, CLAUDE.md, the shared fixture and permission
# settings into a fresh directory and runs Claude Code headless on it.
# fb  -> builds/vN (committed fallback)   live -> live/vN (stage day)
set -euo pipefail
# Whole body in a function: bash parses it all before running, so editing this
# file while a build is in progress cannot change what the running copy does.
main() {
  N="${1:?stage}"; MODE="${2:-live}"
  ROOT="$(cd "$(dirname "$0")/.." && pwd)"
  case "$MODE" in fb) DIR="$ROOT/builds/v$N";; live) DIR="$ROOT/live/v$N";; *) DIR="$ROOT/live/$MODE";; esac
  # Stop any agent still working in this directory, and any app server
  # serving from it, before wiping it. Running kickoff twice is then safe.
  for pid in $(pgrep -f "claude -p" 2>/dev/null); do
    if lsof -p "$pid" -a -d cwd -Fn 2>/dev/null | grep -qx "n$DIR"; then
      echo "[kickoff] stopping previous agent (pid $pid) in $DIR"; kill "$pid" 2>/dev/null || true
    fi
  done
  if [ -f "$ROOT/.run/v$N.json" ] && grep -q "\"mode\":\"$MODE\"" "$ROOT/.run/v$N.json" 2>/dev/null; then
    for pid in $(lsof -ti tcp:310$N -sTCP:LISTEN 2>/dev/null); do kill "$pid" 2>/dev/null || true; done
    rm -f "$ROOT/.run/v$N.json" "$ROOT/.run/v$N.pid"
    echo "[kickoff] stopped the app that was serving from $DIR on port 310$N (run scripts/serve.sh $N fb to put the fallback back)"
  fi
  sleep 1
  rm -rf "$DIR"; mkdir -p "$DIR/.claude"
  cp "$ROOT/specs/v$N/spec.md" "$ROOT/specs/v$N/CLAUDE.md" "$DIR/"
  if [ -f "$ROOT/specs/v$N/seed.json" ]; then cp "$ROOT/specs/v$N/seed.json" "$DIR/"; else cp "$ROOT/specs/shared/seed.json" "$DIR/"; fi
  cp "$ROOT/specs/shared/.claude/settings.json" "$DIR/.claude/"
  cd "$DIR"
  # Mirror a clean CI runner: no cached Playwright browsers, and installs are denied by .claude/settings.json.
  mkdir -p "$DIR/.pw-browsers"; export PLAYWRIGHT_BROWSERS_PATH="$DIR/.pw-browsers"
  echo "[kickoff] stage $N -> $DIR  model=${MODEL:-sonnet}  $(date -u +%FT%TZ)" | tee build.log

  if [ "$MODE" = "live" ] && [ "${HEADLESS:-0}" != "1" ]; then
    # Stage day: interactive, so the room sees the real conversation. You type
    # the prompt. Build 1: the naive prompt, word for word. Builds 2-4:
    #   Build what spec.md describes.
    echo "[kickoff] interactive. Type the prompt (see RUNBOOK 5.1/5.2). Ctrl-C twice to leave when it is done."
    exec claude --model "${MODEL:-sonnet}" --permission-mode acceptEdits
  fi

  START=$(date +%s)
  set +e
  # stream-json + the formatter so the terminal shows every file written and
  # command run as it happens; plain text mode prints nothing until the end.
  claude -p "$(cat spec.md)" \
    --permission-mode acceptEdits \
    --model "${MODEL:-sonnet}" \
    --output-format stream-json --verbose < /dev/null 2>>build.log \
    | python3 "$ROOT/scripts/stream-format.py" build.log
  RC=${PIPESTATUS[0]}
  set -e
  END=$(date +%s)
  echo "[kickoff] exit=$RC elapsed=$((END-START))s $(date -u +%FT%TZ)" | tee -a build.log
  echo "$RC" > .done
}
main "$@"
