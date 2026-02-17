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

# Create PR to dev if one does not already exist.
if not gh pr view --json number -q .number >/dev/null 2>&1
    gh pr create --base dev --title "$msg" --body ""
end

# Fetch PR number for current branch.
set -l pr (gh pr view --json number -q .number 2>/dev/null)

if test -z "$pr"
    echo "Error: Could not find PR for current branch to merge into dev."
    exit 1
end

# Merge the PR into dev using a merge commit.
gh pr merge $pr --merge

