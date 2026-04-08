#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
REPO_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/../.." && pwd)

exec "$SCRIPT_DIR/run.sh" mcp --path "$REPO_ROOT" --no-git "$@"