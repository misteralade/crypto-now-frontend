#!/usr/bin/env fish
# Creates and merges a PR into master from dev.

set -l branch "dev"
set -l msg "Merged dev into master"
test (count $argv) -gt 0 && set msg (string join " " $argv)

if test (git branch --show-current) != "dev"
    echo "Error: Must be on branch 'dev'. Checkout dev first."
    exit 1
end

git add -A
git status --short

if not git diff --cached --quiet
    git commit -m "$msg"
end

git push -u origin dev

# Find an open PR from dev into master.
set -l pr (gh pr list --head dev --base master --state open --json number -q '.[0].number' 2>/dev/null)

if test -z "$pr"
    gh pr create --base master --title "$msg" --body ""
    set pr (gh pr list --head dev --base master --state open --json number -q '.[0].number' 2>/dev/null)
end

if test -z "$pr"
    echo "Error: Could not find or create an open PR from 'dev' into master."
    exit 1
end

gh pr merge $pr --merge
