#!/usr/bin/env bash
# Run before the talk. Resets live/v1..v4 so each is ready for:
#   cd live/vN && cat spec.md && claude      (then: "Read spec.md and build it.")
# Stops any agent still working in a live directory, puts the fallback back
# on every port, wipes the live directories and lays out the spec, the
# agent instructions, the fixture and the settings (model, permission mode,
# clean-runner environment), so plain `claude` needs no flags.
set -euo pipefail
main() {
  ROOT="$(cd "$(dirname "$0")/.." && pwd)"
  cd "$ROOT"
  for N in 1 2 3 4; do
    DIR="$ROOT/live/v$N"
    agents_in() { for pid in $(pgrep -f "claude" 2>/dev/null); do lsof -p "$pid" -a -d cwd -Fn 2>/dev/null | grep -qx "n$1" && echo "$pid"; done; }
    for pid in $(agents_in "$DIR"); do echo "[reset] stopping agent pid $pid in live/v$N"; kill "$pid" 2>/dev/null || true; done
    for i in $(seq 1 15); do [ -z "$(agents_in "$DIR")" ] && break; sleep 1; done
    for pid in $(agents_in "$DIR"); do kill -9 "$pid" 2>/dev/null || true; done
    if ! grep -q '"mode":"fb"' ".run/v$N.json" 2>/dev/null || ! lsof -ti tcp:310$N -sTCP:LISTEN >/dev/null 2>&1; then
      echo "[reset] putting the fallback on port 310$N"
      scripts/serve.sh "$N" fb
    fi
    rm -rf "$DIR" 2>/dev/null || { sleep 2; rm -rf "$DIR"; }
    mkdir -p "$DIR/.claude" "$DIR/.pw-browsers"
    cp "specs/v$N/spec.md" "specs/v$N/CLAUDE.md" "$DIR/"
    if [ -f "specs/v$N/seed.json" ]; then cp "specs/v$N/seed.json" "$DIR/"; else cp specs/shared/seed.json "$DIR/"; fi
    # settings: shared permissions + model + default mode + the env that hides
    # cached Playwright browsers (absolute path, so it is written per directory)
    python3 - "$DIR" <<'PY'
import json, sys
d = sys.argv[1]
s = json.load(open("specs/shared/.claude/settings.json"))
s["model"] = "sonnet"
s.setdefault("permissions", {})["defaultMode"] = "acceptEdits"
s["env"] = {"PLAYWRIGHT_BROWSERS_PATH": d + "/.pw-browsers"}
json.dump(s, open(d + "/.claude/settings.json", "w"), indent=2)
PY
    echo "[reset] live/v$N ready"
  done
  echo "[reset] on stage: cd live/vN && cat spec.md && claude   -> 'Read spec.md and build it.'"
}
main "$@"
