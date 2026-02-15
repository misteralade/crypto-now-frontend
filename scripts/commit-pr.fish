#!/usr/bin/env fish
# Commits current branch, pushes, and opens a PR to master.

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
    git commit -m "$msg"
    git push -u origin "$branch"
    gh pr create --base master --title "$msg" --body ""
else
    echo "Nothing to commit. Pushing and creating PR if needed."
    git push -u origin "$branch" 2>/dev/null; or true
    gh pr create --base master --title "$msg" --body "" 2>/dev/null; or echo "PR may already exist. Check with: gh pr list"
end
