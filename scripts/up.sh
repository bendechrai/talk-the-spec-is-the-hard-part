#!/usr/bin/env bash
# Starts everything for stage day: tmux session for builds, ttyd on 7681,
# the four fallback apps on 3101-3104, and the deck on 4747.
set -euo pipefail
# Whole body in a function: bash parses it all before running, so editing this
# file while a build is in progress cannot change what the running copy does.
main() {
  ROOT="$(cd "$(dirname "$0")/.." && pwd)"
  cd "$ROOT"
  tmux has-session -t build 2>/dev/null || tmux new-session -d -s build -x 200 -y 50 -c "$ROOT" && tmux set-option -t build status off && tmux set-option -t build window-size latest
  mkdir -p .run
  if ! pgrep -f "ttyd -p 7681" >/dev/null; then
    nohup ttyd -p 7681 -W -t fontSize=${TTYD_FONT:-22} -t 'theme={"background":"#050506"}' tmux attach -t build > .run/ttyd.log 2>&1 &
    echo $! > .run/ttyd.pid
  fi
  for N in 1 2 3 4; do
    if [ -d "builds/v$N" ] && [ -f "builds/v$N/package.json" ]; then scripts/serve.sh "$N" fb; fi
  done
  if [ ! -d deck/node_modules ]; then (cd deck && npm install --no-audit --no-fund); fi
  if lsof -ti tcp:4747 -sTCP:LISTEN >/dev/null 2>&1; then
    echo "[up] deck already listening on 4747"
  else
    # Port 4747, not 3000: a live build once ran `pkill -f "next dev"` to stop
    # its own test server and took the deck with it, and several builds have
    # poked at 3000 assuming it was theirs. The loop restarts the deck within
    # a second if that ever happens again; down.sh drops the stop file first.
    rm -f .run/deck.stop
    (cd deck && PORT=4747 nohup bash -c 'while [ ! -f ../.run/deck.stop ]; do npm run dev; sleep 1; done' > "$ROOT/.run/deck.log" 2>&1 &
     echo $! > "$ROOT/.run/deck.pid")
    for i in $(seq 1 30); do lsof -ti tcp:4747 -sTCP:LISTEN >/dev/null 2>&1 && break; sleep 1; done
  fi
  echo "[up] deck http://localhost:4747  terminal http://localhost:7681  apps 3101-3104"
}
main "$@"
