#!/usr/bin/env bash
# Usage: scripts/switch.sh <stage> live|fb   - flips which directory serves port 310N
exec "$(dirname "$0")/serve.sh" "$@"
