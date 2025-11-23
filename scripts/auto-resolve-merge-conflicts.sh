#!/usr/bin/env bash
set -euo pipefail

# Default to keeping the current branch (Codex-generated) changes.
MODE="ours"
if [[ "${1-}" == "--theirs" ]]; then
  MODE="theirs"
  shift
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "This script must be run inside a Git repository." >&2
  exit 1
fi

conflicted_files=$(git ls-files -u | cut -f2 | sort -u)

if [[ -z "${conflicted_files}" ]]; then
  echo "No merge conflicts detected."
  exit 0
fi

for file in ${conflicted_files}; do
  git checkout --${MODE} -- "${file}"
  git add "${file}"
  echo "Resolved ${file} using '${MODE}'."
done

count=$(wc -w <<<"${conflicted_files}" | tr -d ' ')
echo "Resolved ${count} conflicted file(s) using '${MODE}' changes."
