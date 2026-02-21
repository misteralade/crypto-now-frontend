#!/usr/bin/env fish
# Creates and merges a PR into dev from the current branch.

set -l branch (git branch --show-current)
set -l msg "Merged from $branch"
test (count $argv) -gt 0 && set msg (string join " " $argv)

if test -z "$branch"
    echo "Error: Not in a git repo or no branch."
    exit 1
end

git add -A
git status --short

if not git diff --cached --quiet
    # Commit staged changes with provided or default message.
    git commit -m "$msg"
end

# Push current branch (create upstream if needed).
git push -u origin "$branch"

# Ensure remote refs are up to date so gh can resolve base/head.
git fetch origin

# Try to find an open PR from this branch into dev.
set -l pr (gh pr list --head "$branch" --base dev --state open --json number -q '.[0].number' 2>/dev/null)

# If no open PR exists, create one now.
if test -z "$pr"
    gh pr create --head "$branch" --base dev --title "$msg" --body ""
    # Re-fetch PR number for the newly created PR.
    set pr (gh pr list --head "$branch" --base dev --state open --json number -q '.[0].number' 2>/dev/null)
end

if test -z "$pr"
    echo "Error: Could not find or create an open PR from branch '$branch' into dev."
    exit 1
end

# Merge the PR into dev using a merge commit.
gh pr merge $pr --merge

