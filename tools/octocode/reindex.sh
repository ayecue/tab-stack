#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname "$0")" && pwd)

"$SCRIPT_DIR/run.sh" clear
"$SCRIPT_DIR/run.sh" index --no-git