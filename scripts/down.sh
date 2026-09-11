#!/usr/bin/env bash
set -uo pipefail
# Whole body in a function: bash parses it all before running, so editing this
# file while a build is in progress cannot change what the running copy does.
main() {
  ROOT="$(cd "$(dirname "$0")/.." && pwd)"; cd "$ROOT"
  touch .run/deck.stop   # tell the deck restart loop not to come back
  for f in .run/*.pid; do [ -f "$f" ] && kill "$(cat "$f")" 2>/dev/null; rm -f "$f"; done
  # anything still holding our ports (deck, ttyd, the four apps)
  for port in 4747 7681 3101 3102 3103 3104; do
    for pid in $(lsof -ti tcp:$port -sTCP:LISTEN 2>/dev/null); do kill "$pid" 2>/dev/null || true; done
  done
  tmux kill-session -t build 2>/dev/null || true
  echo "[down] stopped"
}
main "$@"
