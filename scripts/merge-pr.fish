#!/usr/bin/env fish
# Merges a PR using GitHub CLI. Uses current branch's PR if no number given.

set -l pr $argv[1]
if test -z "$pr"
    set pr (gh pr view --json number -q .number 2>/dev/null)
end

if test -z "$pr"
    echo "Error: No PR number and no PR found for current branch. Usage: merge-pr.fish [PR_NUMBER]"
    exit 1
end

gh pr merge $pr --merge
