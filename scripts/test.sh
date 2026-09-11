#!/usr/bin/env bash
# Usage: scripts/test.sh <stage> [live|fb]  - runs the stage's unit tests in the tmux window
set -euo pipefail
# Whole body in a function: bash parses it all before running, so editing this
# file while a build is in progress cannot change what the running copy does.
main() {
  N="${1:?stage}"; MODE="${2:-fb}"
  ROOT="$(cd "$(dirname "$0")/.." && pwd)"
  case "$MODE" in fb) DIR="$ROOT/builds/v$N";; live) DIR="$ROOT/live/v$N";; esac
  tmux send-keys -t build "cd '$DIR' && npm test; echo EXIT=\$?" C-m
}
main "$@"
