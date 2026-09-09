#!/usr/bin/env bash

set -Eeuo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
website_dir="$(cd -- "$script_dir/.." && pwd)"
pages_dir="${GITHUB_PAGES_DIR:-$website_dir/../crossa-script.github.io}"

if ! command -v pnpm >/dev/null 2>&1; then
  printf '%s\n' 'Error: pnpm is required to build the website.' >&2
  exit 1
fi

if [[ ! -d "$pages_dir/.git" ]]; then
  printf 'Error: GitHub Pages repository was not found at %s\n' "$pages_dir" >&2
  printf '%s\n' 'Set GITHUB_PAGES_DIR to the repository path and try again.' >&2
  exit 1
fi

printf '%s\n' 'Building website...'
(
  cd "$website_dir"
  pnpm build
)

printf 'Publishing build to %s...\n' "$pages_dir"
rsync -a --delete --exclude '.git/' "$website_dir/dist/" "$pages_dir/"

printf '%s\n' 'Build published successfully.'
printf '%s\n' 'Review the changes, then commit and push them from the GitHub Pages repository:'
printf '  cd %q && git status\n' "$pages_dir"
