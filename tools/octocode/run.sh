#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
REPO_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/../.." && pwd)

if command -v octocode >/dev/null 2>&1; then
  OCTOCODE_BIN=$(command -v octocode)
elif [ -x "$HOME/.local/bin/octocode" ]; then
  OCTOCODE_BIN="$HOME/.local/bin/octocode"
else
  echo "Octocode is not installed. Install it with Homebrew or the upstream installer first." >&2
  exit 1
fi

cd "$REPO_ROOT"
exec "$OCTOCODE_BIN" "$@"