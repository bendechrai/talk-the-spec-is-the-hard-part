#!/usr/bin/env bash
# Usage: scripts/serve.sh <stage 1-4> [live|fb|<dir under live/>]
# (Re)starts the stage's app on port 310N in production mode (next build +
# next start) so no dev overlay appears on stage. Pass DEV=1 to use next dev.
set -euo pipefail
# Whole body in a function: bash parses it all before running, so editing this
# file while a build is in progress cannot change what the running copy does.
main() {
  N="${1:?stage}"; MODE="${2:-fb}"
  ROOT="$(cd "$(dirname "$0")/.." && pwd)"
  case "$MODE" in fb) DIR="$ROOT/builds/v$N";; live) DIR="$ROOT/live/v$N";; *) DIR="$ROOT/live/$MODE";; esac
  PORT="310$N"
  mkdir -p "$ROOT/.run"
  if [ -f "$ROOT/.run/v$N.pid" ]; then kill "$(cat "$ROOT/.run/v$N.pid")" 2>/dev/null || true; fi
  for pid in $(lsof -ti tcp:$PORT -sTCP:LISTEN 2>/dev/null); do kill "$pid" 2>/dev/null || true; done
  sleep 1
  cd "$DIR"
  [ -d node_modules ] || npm install --no-audit --no-fund
  [ -f data.db ] || npm run seed
  if [ "${DEV:-0}" = "1" ]; then
    PORT=$PORT nohup npm run dev > "$ROOT/.run/v$N.log" 2>&1 &
  else
    npm run build > "$ROOT/.run/v$N.build.log" 2>&1 || { echo "[serve] build failed, see .run/v$N.build.log; falling back to next dev"; PORT=$PORT nohup npm run dev > "$ROOT/.run/v$N.log" 2>&1 & echo $! > "$ROOT/.run/v$N.pid"; exit 0; }
    PORT=$PORT nohup npx next start -p "$PORT" > "$ROOT/.run/v$N.log" 2>&1 &
  fi
  echo $! > "$ROOT/.run/v$N.pid"
  echo "{\"stage\":$N,\"mode\":\"$MODE\",\"port\":$PORT}" > "$ROOT/.run/v$N.json"
  echo "[serve] v$N ($MODE) on http://localhost:$PORT pid $(cat "$ROOT/.run/v$N.pid")"
}
main "$@"
