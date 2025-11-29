---
description: Complete workflow for agents to interact with GitHub for pull request management
---

# GitHub Pull Request Workflow for Agents

This document defines the end-to-end process for agents to interact with GitHub when managing pull requests, from creation through merge and cleanup.

## 🤖 For Agents Reading This File

**You are an AI agent (Claude Code) and you can execute this workflow to create PRs.**

---

## ⚡ Simple Prompts to Execute This Workflow

**Just tell the agent:**

> "Open a PR for the current changes and branch, generate a simple commit message based on the change"

> "Create a PR for these changes"

> "Open a MR for the current branch"

**The agent will automatically:**
1. ✅ Check if you're on `dev` branch
2. ✅ Create a feature branch if needed (feature/, bugfix/, hotfix/, etc.)
3. ✅ Analyze your changes
4. ✅ Generate an appropriate commit message
5. ✅ Commit and push
6. ✅ Create the PR with title and description
7. ✅ Report the branch name, PR number, and URL

**The agent will NOT:**
- ❌ Merge PRs (you do this manually)
- ❌ Approve PRs (requires human review)

---

### How It Works

When the user says any variation of "create/open a PR/MR":

**Execute this workflow:**

1. **Check current branch** - If on `dev`, create a feature branch first!
   - Analyze changes to determine branch type (feature/, bugfix/, hotfix/, docs/, etc.)
   - Create branch with format: `type/brief-description`
   - Checkout to new branch

2. Check git status and identify changed files
3. Analyze the diff to understand what changed
4. Generate a commit message based on the changes (use Conventional Commits format)
5. Stage and commit the changes
6. Push to remote (request `all` permission)
7. Create PR with auto-generated title and body (request `all` permission)
8. Report branch name (if created), PR number, and URL to user

**Safety Rule:** Never commit directly to `dev`. Always use a feature branch.

**You do NOT merge PRs.** Only create them. The user will merge manually after review.

### Agent Execution Checklist

1. **Check Current Branch (CRITICAL)**
   - Get current branch: `git branch --show-current`
   - **If on `dev` branch:** Create a new feature branch automatically
   - Analyze changes to determine branch type
   - Create branch with format: `type/brief-description`

2. **Verify Prerequisites**
   - Check git status: `git status`
   - Identify changed files
   - Ensure not committing directly to `dev`

3. **Analyze Changes**
   - Review what files were modified: `git diff --name-only`
   - Review actual changes: `git diff`
   - Determine the type of change:
     - `feature/` - New features or enhancements
     - `bugfix/` - Bug fixes
     - `hotfix/` - Critical/urgent fixes
     - `docs/` - Documentation only
     - `refactor/` - Code refactoring
     - `test/` - Test additions/changes

4. **Create Branch if Needed**
   - If on `dev`, create new branch: `git checkout -b type/description`
   - Use descriptive name based on changes
   - Inform user about branch creation

5. **Generate Commit Message**
   - Based on changed files and diff, create a Conventional Commits message
   - Format: `type(scope): brief description`
   - Include bullet points of key changes in body

6. **Stage and Commit**
   - Stage files: `git add <files>` (requires `git_write`)
   - Commit: `git commit -m "message"` (requires `all` for pre-commit hooks)

7. **Push to Remote**
   - Push: `git push -u origin <branch-name>` (requires `all` for SSH keys)

8. **Create Pull Request**
   - Use non-interactive command (requires `all`)
   - Auto-generate title from commit message
   - Auto-generate body with changes summary
   - Always set `--base dev`
   - Add appropriate labels if possible

9. **Report to User**
   - Provide branch name (if created)
   - Provide PR number
   - Provide PR URL
   - Summarize what was done

**Note: Agents do NOT merge PRs. User will review and merge manually.**

### Agent Decision Tree

```
User Request → Check Branch → Analyze Changes → Create Branch if Needed → Execute → Report

┌──────────────────────────────────────────────────────────┐
│ User: "Open a PR/MR for current changes"                 │
└────────────────────┬─────────────────────────────────────┘
                     ↓
            ┌──────────────────┐
            │ git branch       │
            │ --show-current   │
            └────────┬─────────┘
                     ↓
         ┌───────────────────┐
         │ Current branch?   │
         └──┬──────────────┬─┘
            │ dev          │ feature/*
            ↓              ↓
    ┌───────────────┐   ┌──────────────┐
    │ ⚠️  On dev!    │   │ Good - on    │
    │ Must create   │   │ feature      │
    │ feature branch│   │ branch       │
    └───────┬───────┘   └──────┬───────┘
            ↓                  │
    ┌───────────────────┐      │
    │ Analyze changes   │      │
    │ git diff          │      │
    └────────┬──────────┘      │
             ↓                 │
    ┌────────────────────┐     │
    │ Determine type:    │     │
    │ feature/bugfix/    │     │
    │ hotfix/docs/etc    │     │
    └────────┬───────────┘     │
             ↓                 │
    ┌────────────────────┐     │
    │ Create branch:     │     │
    │ git checkout -b    │     │
    │ type/description   │     │
    └────────┬───────────┘     │
             │                 │
             └────────┬────────┘
                      ↓
         ┌────────────────────────┐
         │ Generate commit message│
         │ (Conventional Commits) │
         └────────┬───────────────┘
                  ↓
         ┌──────────────┐
         │  git add     │
         │  git commit  │
         └──────┬───────┘
                ↓
         ┌──────────────┐
         │  git push    │
         │  -u origin   │
         └──────┬───────┘
                ↓
         ┌──────────────┐
         │ gh pr create │
         │ --base dev   │
         └──────┬───────┘
                ↓
         ┌───────────────────┐
         │ Report:           │
         │ - Branch created  │
         │ - PR #<num>       │
         │ - URL: <pr-url>   │
         └───────────────────┘

Agent STOPS here. User reviews and merges manually.
```

### Quick Start for Agents

When user says: **"Open a PR/MR for the current changes"**

```bash
# STEP 1: Check current branch (CRITICAL - Don't commit to dev!)
CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: $CURRENT_BRANCH"

# STEP 2: If on dev, create a feature branch
if [ "$CURRENT_BRANCH" = "dev" ]; then
  echo "⚠️  Currently on dev branch. Creating feature branch..."
  
  # Analyze changes to determine branch type
  git status
  git diff --name-only
  git diff
  
  # Determine change type by analyzing files and changes
  # Look for patterns:
  # - New features: feature/
  # - Bug fixes: bugfix/
  # - Hot fixes: hotfix/
  # - Docs only: docs/
  # - Refactoring: refactor/
  # - Tests: test/
  
  # Example: If adding new endpoint to keyword router
  # Type: feature (new functionality)
  # Files: backend/app/keyword/router.py
  # Branch: feature/add-keyword-export
  
  # Generate branch name
  # Format: type/brief-description (use kebab-case)
  BRANCH_TYPE="feature"  # or bugfix, hotfix, docs, refactor, test
  DESCRIPTION="add-keyword-export"  # brief, descriptive, kebab-case
  NEW_BRANCH="${BRANCH_TYPE}/${DESCRIPTION}"
  
  # Create and switch to new branch
  git checkout -b $NEW_BRANCH  # Requires: git_write
  
  echo "✅ Created and switched to branch: $NEW_BRANCH"
  CURRENT_BRANCH=$NEW_BRANCH
else
  echo "✅ Already on feature branch: $CURRENT_BRANCH"
fi

# STEP 3: Analyze changes
git status
git diff --name-only
git diff

# STEP 4: Generate commit message based on changes
# Example: If changes are in backend/app/keyword/router.py
# Type: feat, fix, docs, refactor, etc.
# Scope: keyword, campaign, auth, etc.
# Message: brief description

# STEP 5: Stage and commit
git add .
git commit -m "type(scope): description

- Detail 1
- Detail 2
- Detail 3"  # Requires: all

# STEP 6: Push to remote
git push -u origin $CURRENT_BRANCH  # Requires: all

# STEP 7: Create PR (non-interactive)
gh pr create \
  --title "Brief descriptive title from commit" \
  --body "## Changes
- Summary of changes

## Testing
- ✅ Linting passed
- ✅ Tests passing (if applicable)

## Files Changed
- List key files" \
  --base dev  # Requires: all

# STEP 8: Get PR info and report
PR_INFO=$(gh pr view --json number,url,title)
echo "$PR_INFO"

# STEP 9: Report to user
echo ""
echo "✅ PR created successfully!"
if [ "$NEW_BRANCH" ]; then
  echo "📁 Created branch: $NEW_BRANCH"
fi
echo "🔗 PR #<number>: <title>"
echo "🌐 URL: <url>"
echo ""
echo "⏳ Waiting for review..."
echo "👤 You will merge manually via GitHub UI after review."
```

**That's it! Agent stops here. User reviews and merges manually.**

---

## Prerequisites

Before starting any GitHub workflow:
- Ensure you have the GitHub CLI (`gh`) installed and authenticated
- Verify you have the necessary permissions for the repository
- Check the current branch and working tree status with `git status`
- Confirm the `dev` branch exists and is up to date

### For Agents (Claude Code, AI Assistants)

When running these workflows as an automated agent:

**Required Setup:**
- GitHub CLI (`gh`) must be installed and authenticated: `gh auth status`
- Git configured with user name and email
- SSH keys or tokens configured for push access

**Permission Requirements:**
- **Git write permissions** (`git_write`): For commits, staging, branch operations
- **Network permissions** (`network`): For push, pull, pr create, pr merge operations
- **All permissions** (`all`): May be needed for pre-commit hooks

**Pre-commit Hook Handling:**
```bash
# If pre-commit hooks fail due to sandbox restrictions,
# you may need to run with --no-verify (only when necessary)
git commit -m "message" --no-verify

# Or request 'all' permissions to run outside sandbox
```

**Non-Interactive Mode:**
- Always provide all required flags (`--title`, `--body`, `--base`) to avoid interactive prompts
- Use `--yes` or `--no-confirm` flags where available
- Never rely on interactive editors for commit messages or PR bodies

## Branch Strategy

**GlitchAds uses a feature-branch workflow:**

- **`dev`** - Primary development branch
  - All feature branches are created from `dev`
  - All feature PRs merge back into `dev`
  - This is where all development happens
  - Automatically deploys to staging environment
  - Protected branch - requires PR approval

**Workflow:**
```
feature/my-feature → dev
      ↓              ↓
  development    staging
```

## Workflow Overview

1. **Create a Feature Branch** (from `dev`)
2. **Make and Commit Changes**
3. **Push Branch to Remote**
4. **Open a Pull Request** (to `dev`)
5. **Review and Update PR (if needed)**

**Note: Agents do NOT merge PRs. Users review and merge manually through GitHub UI.**

---

## 1. Create a Feature Branch

Before making changes, create a descriptive feature branch from `dev`:

```bash
# Ensure you're on the dev branch (primary development branch)
git checkout dev
git pull origin dev

# Create and switch to a new feature branch
git checkout -b feature/descriptive-name
```

**Note:** All development work should branch from and merge back into `dev`.

### Branch Naming Conventions

**Format:** `type/brief-description` (use kebab-case)

- **Features**: `feature/short-description` 
  - Example: `feature/add-keyword-filters`
  - Use for: New functionality, enhancements, new endpoints

- **Bug Fixes**: `bugfix/issue-description`
  - Example: `bugfix/fix-campaign-refresh`
  - Use for: Bug fixes, error corrections

- **Hotfixes**: `hotfix/critical-issue`
  - Example: `hotfix/auth-token-expiry`
  - Use for: Urgent/critical fixes needed in production

- **Refactoring**: `refactor/component-name`
  - Example: `refactor/recommendation-service`
  - Use for: Code refactoring, performance improvements

- **Documentation**: `docs/topic`
  - Example: `docs/api-guidelines`
  - Use for: Documentation-only changes

- **Tests**: `test/description`
  - Example: `test/add-keyword-tests`
  - Use for: Adding or updating tests

- **CI/CD**: `ci/description`
  - Example: `ci/update-github-actions`
  - Use for: CI/CD pipeline changes

### Automatic Branch Creation Logic (For Agents)

When on `dev` branch, agents analyze changes to determine branch type:

**Indicators for branch type:**

```
feature/ → New files, new functions/endpoints, added functionality
bugfix/  → Fixes to existing code, error handling improvements
hotfix/  → Critical fixes, security patches
docs/    → Only .md files changed, or docstrings
refactor/→ Code restructuring without new features
test/    → Test files (test_*.py, *.test.ts, etc.)
```

**Example analysis:**
- Files changed: `backend/app/keyword/router.py`
- Changes: Added new `export_keywords` function
- Type: New functionality → `feature/`
- Branch: `feature/add-keyword-export`

---

## 2. Make and Commit Changes

Make your code changes and commit them with clear, descriptive messages:

```bash
# Stage specific files
git add path/to/modified/file.py

# Or stage all changes (use with caution)
git add .

# Commit with a descriptive message
git commit -m "feat: add keyword filtering functionality

- Implement keyword filter API endpoint
- Add frontend filtering UI components
- Update keyword router with new filters
- Add unit tests for filter logic"
```

### Commit Message Format

Follow the Conventional Commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (dependencies, build config)
- `perf`: Performance improvements
- `ci`: CI/CD changes

**Example:**
```
feat(keyword): add advanced filtering options

- Implement match type filtering
- Add quality score range filter
- Add status filter (enabled/paused)
- Update query-options for filter persistence

Closes #123
```

---

## 3. Push Branch to Remote

Push your feature branch to the remote repository:

```bash
# First time pushing a new branch
git push -u origin feature/descriptive-name

# Subsequent pushes to the same branch
git push
```

If you need to force push (use with caution):

```bash
# Force push with lease (safer - checks remote state)
git push --force-with-lease

# Only use --force if you're absolutely certain
git push --force
```

**⚠️ Critical Warnings:** 
- **NEVER** commit directly to the `dev` branch
- **NEVER** force push to the `dev` branch
- **ALWAYS** create a feature branch when on `dev`
- Only force push to your own feature branches when absolutely necessary
- Always use `--force-with-lease` instead of `--force` for safety

**For Agents:**
If `git branch --show-current` returns `dev`, you MUST create a feature branch before committing!

---

## 4. Open a Pull Request

Use the GitHub CLI to create a pull request:

### Basic PR Creation

```bash
# Interactive PR creation (will prompt for details)
gh pr create

# Create PR with inline details (to dev branch)
gh pr create \
  --title "Add keyword filtering functionality" \
  --body "## Changes

- Implemented keyword filter API endpoint in backend
- Added frontend filtering UI components
- Updated keyword router with new filters
- Added comprehensive unit tests

## Testing
- ✅ All tests passing
- ✅ Backend linting passed
- ✅ Frontend TypeScript build successful

## Related Issues
Closes #123" \
  --base dev \
  --head feature/add-keyword-filters
```

**Note:** Always use `--base dev` for all PRs.

### PR Creation with Assignees and Labels

```bash
gh pr create \
  --title "Fix: Campaign refresh bug" \
  --body "## Problem
Campaign data was not refreshing after updates.

## Solution
Updated the query invalidation logic in campaign mutations.

## Testing
- ✅ Manual testing confirmed
- ✅ Added regression test
- ✅ CI pipeline passing

Fixes #456" \
  --base dev \
  --head bugfix/campaign-refresh \
  --assignee @me \
  --label "bug,backend" \
  --reviewer username
```

### PR Template Best Practices

**Title:** Clear, concise description of the change
- ✅ Good: "Add keyword filtering to campaign management"
- ❌ Bad: "Updates"

**Body Structure:**
```markdown
## Changes
- List of key changes made
- Keep it concise but complete

## Why
Brief explanation of why these changes were needed

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests passing
- [ ] Manual testing completed
- [ ] CI/CD pipeline passing

## Screenshots (if UI changes)
[Add screenshots or recordings if relevant]

## Related Issues
Closes #123
Relates to #456

## Deployment Notes
[Any special deployment considerations]
```

---

## 5. Review and Update PR (if needed)

### Check PR Status

```bash
# View your open PRs
gh pr list

# View specific PR details
gh pr view <pr-number>

# View PR checks status
gh pr checks <pr-number>

# View PR in browser
gh pr view <pr-number> --web
```

### Update PR Based on Feedback

If changes are requested:

```bash
# Make the requested changes
# ... edit files ...

# Commit the changes
git add .
git commit -m "fix: address PR feedback

- Update error handling in keyword router
- Add missing type annotations
- Fix linting issues"

# Push to update the PR
git push
```

### Update PR Description or Title

```bash
# Edit PR title and/or body
gh pr edit <pr-number> --title "New Title"
gh pr edit <pr-number> --body "Updated description"

# Add/remove labels
gh pr edit <pr-number> --add-label "enhancement"
gh pr edit <pr-number> --remove-label "WIP"

# Add/remove reviewers
gh pr edit <pr-number> --add-reviewer username
```

---

## 6. After PR Creation (For Reference)

Once the PR is created, the workflow pauses for human review. Here's what happens next:

### What the User Will Do (Manual Steps)

1. **Review the PR** - User or team reviews code changes
2. **CI/CD Runs** - Automated tests and checks execute
3. **Address Feedback** - If changes requested, you may need to update
4. **Approval** - Reviewer approves the PR
5. **Merge** - User merges via GitHub UI (squash merge recommended)
6. **Cleanup** - GitHub auto-deletes branch (if enabled)

### Monitoring PR Status (Agent Can Do This)

```bash
# Check overall PR status
gh pr status

# View specific PR details
gh pr view <pr-number>

# Check CI/CD status
gh pr checks <pr-number>

# View PR in browser
gh pr view <pr-number> --web
```

### If Updates Are Needed

If the reviewer requests changes, you can update the PR:

```bash
# Make the requested changes
# ... edit files ...

# Commit and push
git add <files>
git commit -m "fix: address PR feedback"
git push

# PR automatically updates
```

### Update Branch if Conflicts Arise

If dev branch has changed and conflicts occur:

```bash
# Update your feature branch with latest from dev
git checkout feature/your-branch
git fetch origin
git merge origin/dev

# Resolve any conflicts if they occur
# ... resolve conflicts ...
git add .
git commit -m "merge: resolve conflicts with dev"
git push
```

**Note: Agents create and update PRs. Users review and merge manually.**

---

## 7. Branch Cleanup (After User Merges)

After the user merges the PR through GitHub, you can help clean up locally:

### Local Branch Cleanup

```bash
# Delete remote branch
gh pr close <pr-number> --delete-branch

# Or use git directly
git push origin --delete feature/your-branch

# Delete local branch
git checkout dev
git branch -d feature/your-branch

# Force delete if needed (unmerged changes)
git branch -D feature/your-branch
```

### Complete Cleanup Commands

```bash
# After merge, run this sequence:

# 1. Switch to dev branch
git checkout dev

# 2. Pull latest changes (includes your merged PR)
git pull origin dev

# 3. Delete local feature branch
git branch -d feature/your-branch

# 4. Prune deleted remote branches
git fetch --prune

# 5. List remaining branches to verify
git branch -a
```

---

## Complete Example Workflow

### For Human Developers

Here's a full example from start to finish:

```bash
# 1. Create feature branch from dev
git checkout dev
git pull origin dev
git checkout -b feature/add-keyword-export

# 2. Make changes
# ... edit files ...

# 3. Commit changes
git add backend/app/keyword/router.py backend/app/keyword/services.py
git commit -m "feat(keyword): add CSV export functionality

- Add export_keywords endpoint
- Implement CSV formatting service
- Add export button to frontend
- Add unit tests for export logic"

# 4. Push to remote
git push -u origin feature/add-keyword-export

# 5. Create PR to dev branch
gh pr create \
  --title "Add keyword CSV export functionality" \
  --body "## Changes
- New API endpoint for keyword export
- CSV formatting with all keyword metrics
- Frontend export button with download

## Testing
- ✅ Unit tests added
- ✅ Manual export tested with 1000+ keywords
- ✅ CSV format validated in Excel

Closes #789" \
  --base dev \
  --assignee @me \
  --label "feature,backend,frontend"

# 6. User reviews and merges via GitHub UI (not automated)
# ... user approves and merges ...

# 7. After user merges, clean up local branches (optional)
git checkout dev
git pull origin dev
git branch -d feature/add-keyword-export
git fetch --prune
```

### For Agents (Claude Code)

Here's the same workflow with permission annotations and agent-safe commands:

```bash
# 1. Create feature branch from dev
# Requires: git_write permissions
git checkout dev
git pull origin dev  # Requires: network permissions
git checkout -b feature/add-keyword-export

# 2. Make changes
# ... edit files using write/search_replace tools ...

# 3. Stage changes
# Requires: git_write permissions
git add backend/app/keyword/router.py backend/app/keyword/services.py

# 4. Commit changes
# Requires: git_write permissions
# May require: all permissions (if pre-commit hooks need system access)
git commit -m "feat(keyword): add CSV export functionality

- Add export_keywords endpoint
- Implement CSV formatting service
- Add export button to frontend
- Add unit tests for export logic"

# If pre-commit hooks fail with permission errors:
# Option 1: Request 'all' permissions
# Option 2: Skip hooks for non-code changes
# git commit -m "message" --no-verify

# 5. Push to remote
# Requires: network permissions
git push -u origin feature/add-keyword-export

# 6. Create PR to dev branch (non-interactive)
# Requires: network permissions
gh pr create \
  --title "Add keyword CSV export functionality" \
  --body "## Changes
- New API endpoint for keyword export
- CSV formatting with all keyword metrics
- Frontend export button with download

## Testing
- ✅ Unit tests added
- ✅ Manual export tested with 1000+ keywords
- ✅ CSV format validated in Excel

Closes #789" \
  --base dev \
  --assignee @me \
  --label "feature,backend,frontend"

# 7. Get PR details and report to user
# Requires: all permissions
gh pr view --json number,url,title

# Example output:
# {
#   "number": 123,
#   "url": "https://github.com/user/repo/pull/123",
#   "title": "Add keyword CSV export functionality"
# }

# 8. Report to user
echo "✅ PR #123 created successfully!"
echo "URL: https://github.com/user/repo/pull/123"
echo "Title: Add keyword CSV export functionality"
echo ""
echo "⏳ Waiting for review and approval..."
echo "👤 User will merge via GitHub UI after review."
```

**Agent stops here. User reviews, approves, and merges manually.**

**Agent Permission Summary:**
- Most git operations: `git_write` permission
- Push/pull operations: Require `all` permission (SSH keys)
- GitHub CLI (gh pr create): Require `all` permission
- Pre-commit hooks: May need `all` permission

**Optional: After user merges, agent can help cleanup:**
```bash
# Clean up local branches (only after user has merged via GitHub)
git checkout dev  # Requires: git_write
git pull origin dev  # Requires: all
git branch -d feature/add-keyword-export  # Requires: git_write
git fetch --prune  # Requires: all
```

---

## Troubleshooting Common Issues

### Agent-Specific Issues

#### Issue: Pre-commit Hook Permission Error

```bash
# Error: PermissionError during git commit with pre-commit hooks
# Solution 1: Run with 'all' permissions to escape sandbox
# Solution 2: Skip hooks if safe to do so
git commit -m "message" --no-verify
```

**When to skip hooks:**
- ✅ Documentation-only changes
- ✅ Configuration file updates
- ❌ Code changes (hooks should run)

#### Issue: Interactive Prompt During Command

```bash
# Problem: Command hangs waiting for input
# Solution: Always use explicit flags

# Bad (may prompt):
gh pr create

# Good (non-interactive):
gh pr create --title "Title" --body "Body" --base dev
```

#### Issue: Network Permission Denied

```bash
# Error: Network access blocked during push/pull
# Solution: Request network permissions when running commands
# In Claude Code, this means using required_permissions: ['network']
```

#### Issue: Authentication Required

```bash
# Check GitHub CLI authentication
gh auth status

# If not authenticated, login (may need human for OAuth)
gh auth login
```

### General Issues

### Issue: PR Has Conflicts

```bash
# Update your branch with latest from dev
git checkout feature/your-branch
git fetch origin
git merge origin/dev

# Resolve conflicts in your editor
# ... fix conflicts ...

git add .
git commit -m "merge: resolve conflicts with dev"
git push
```

### Issue: Need to Update PR After CI Failure

```bash
# Fix the issues locally
# ... make changes ...

git add .
git commit -m "fix: resolve linting errors"
git push

# PR will automatically update and re-run CI
```

### Issue: Wrong Base Branch

```bash
# Change the base branch of an open PR
gh pr edit <pr-number> --base dev
```

### Issue: Need to Undo Last Commit

```bash
# Soft reset (keeps changes staged)
git reset --soft HEAD~1

# Mixed reset (keeps changes unstaged)
git reset HEAD~1

# Hard reset (discards changes - careful!)
git reset --hard HEAD~1
```

### Issue: Accidentally Pushed to Wrong Branch

```bash
# Delete the commit from remote
git push origin +HEAD~1:branch-name

# Or create a new branch from the correct commit
git checkout -b correct-branch <commit-hash>
git push -u origin correct-branch
```

---

## Best Practices for Agents

### Agent-Specific Workflow Considerations

**What Agents CAN Do:**
- ✅ Create and switch branches
- ✅ Stage and commit changes (with appropriate permissions)
- ✅ Push to remote (with network permissions)
- ✅ Create PRs with full details (non-interactive)
- ✅ Check PR status and CI results
- ✅ Update PRs based on feedback
- ✅ Clean up local branches after user merges
- ✅ Run linting and tests

**What Agents CANNOT Do:**
- ❌ Merge PRs (user must merge manually)
- ❌ Approve PRs (requires human review)
- ❌ Override branch protection rules

**What May Require Special Handling:**
- ⚠️ Pre-commit hooks (may need `all` permissions or `--no-verify`)
- ⚠️ Interactive prompts (always use full flag syntax)
- ⚠️ GPG signing (may need to be disabled for agent commits)
- ⚠️ Merge conflict resolution (complex conflicts may need human review)

**Agent-Optimized Commands:**

```bash
# Commit with all flags (no interactive editor)
git commit -m "feat: add feature" -m "Detailed description here"

# Push with explicit upstream (no prompts)
git push -u origin feature/branch-name

# Create PR with all details (no interactive prompts)
gh pr create \
  --title "Complete Title" \
  --body "Complete body text" \
  --base dev \
  --head feature/branch-name

# Check status programmatically
gh pr status --json state,title,url
gh pr view <pr-number> --json number,title,url,state

# NOTE: Agents do NOT merge PRs - user merges via GitHub UI
```

### Before Creating a PR

1. **Run Local Checks:**
   ```bash
   # Backend
   cd backend
   uv run ruff check
   uv run mypy
   uv run pytest
   
   # Frontend
   cd frontend
   bun run lint
   bun run build
   ```

2. **Review Your Changes:**
   ```bash
   # See what's changed
   git diff
   
   # See commit history
   git log --oneline
   ```

3. **Keep PRs Focused:**
   - One feature/fix per PR
   - Avoid mixing unrelated changes
   - Keep PRs reasonably sized (< 500 lines changed when possible)

### During PR Review

1. **Be Responsive:**
   - Address feedback promptly
   - Ask for clarification if needed
   - Update PR description if scope changes

2. **Keep PR Updated:**
   - Regularly merge/rebase from base branch
   - Re-run tests after updates
   - Keep CI passing

### After Merge

1. **Verify Deployment:**
   - Check that changes are deployed to staging (after merge to `dev`)
   - Verify CI/CD pipelines completed successfully
   - Monitor for any issues in staging environment

2. **Close Related Issues:**
   - Ensure linked issues are closed
   - Update project boards if applicable

3. **Clean Up:**
   - Delete merged branches
   - Prune local branch references
   - Update local `dev` branch: `git checkout dev && git pull origin dev`

---

## GitHub CLI Quick Reference

### PR Commands

```bash
# List PRs
gh pr list
gh pr list --state merged
gh pr list --author @me

# View PR
gh pr view <pr-number>
gh pr view <pr-number> --web
gh pr view <pr-number> --json title,body,state

# Create PR
gh pr create
gh pr create --draft
gh pr create --fill  # Use commit info

# Edit PR
gh pr edit <pr-number>
gh pr edit <pr-number> --add-reviewer username
gh pr edit <pr-number> --add-label bug

# Close/Reopen PR
gh pr close <pr-number>
gh pr reopen <pr-number>

# Note: Agents should NOT merge PRs
# Users merge via GitHub UI after review

# Checkout PR locally
gh pr checkout <pr-number>


# Review PR
gh pr review <pr-number> --approve
gh pr review <pr-number> --request-changes
gh pr review <pr-number> --comment

# PR checks
gh pr checks <pr-number>
```

### Branch Commands

```bash
# List branches
git branch                  # Local branches
git branch -r              # Remote branches
git branch -a              # All branches

# Delete branches
git branch -d <branch>     # Delete local (safe)
git branch -D <branch>     # Force delete local
git push origin --delete <branch>  # Delete remote

# Prune deleted remote branches
git fetch --prune
git remote prune origin
```

---

## CI/CD Integration

The repository has automated CI/CD workflows that run on PR creation:

### Backend CI (backend-ci.yml)
- Triggers on PRs to `dev` affecting `backend/**`
- Runs linting (ruff, mypy)
- Checks Alembic migrations
- Runs full test suite with PostgreSQL
- Reports coverage

### Frontend CI (frontend-ci.yml)
- Triggers on PRs to `dev` affecting `frontend/**`
- Runs ESLint
- Type checks TypeScript
- Runs build
- Runs tests

### Deployment Workflows
- **Staging Deployment**: Automatic on merge to `dev`

### PR Checks Must Pass

Before merging, ensure:
- ✅ All GitHub Actions workflows pass
- ✅ Code coverage requirements met
- ✅ No linting or type errors
- ✅ All tests passing
- ✅ Required reviews approved

---

## Agent Interaction Patterns

### Complete Workflow Example

**User says:** "Open a PR for the current changes and branch, generate a simple commit message based on the change"

**Agent executes:**

```bash
# Step 1: Check current branch (CRITICAL!)
CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: $CURRENT_BRANCH"
# Output: dev

# Step 2: On dev branch - must create feature branch!
if [ "$CURRENT_BRANCH" = "dev" ]; then
  echo "⚠️  On dev branch - creating feature branch..."
  
  # Analyze what changed
  git status
  # Output: modified: backend/app/keyword/router.py
  
  git diff --name-only
  # Output: backend/app/keyword/router.py
  
  git diff backend/app/keyword/router.py
  # Review: Added export_keywords endpoint
  
  # Determine branch type and name
  # Change: New endpoint (feature)
  # Scope: keyword
  # Description: add CSV export
  
  BRANCH_TYPE="feature"
  DESCRIPTION="add-keyword-csv-export"
  NEW_BRANCH="${BRANCH_TYPE}/${DESCRIPTION}"
  
  # Create branch
  git checkout -b $NEW_BRANCH
  echo "✅ Created branch: $NEW_BRANCH"
  
  CURRENT_BRANCH=$NEW_BRANCH
else
  echo "✅ Already on feature branch: $CURRENT_BRANCH"
fi

# Step 3: Generate commit message
# Changed files: backend/app/keyword/router.py
# Type of change: New feature (endpoint added)
# Scope: keyword
# Message: "feat(keyword): add CSV export endpoint"

# Step 4: Stage and commit
git add backend/app/keyword/router.py
git commit -m "feat(keyword): add CSV export endpoint

- Add export_keywords route handler
- Implement CSV formatting for keyword data
- Add endpoint documentation"

# Step 5: Push (request 'all' permission from user)
git push -u origin $CURRENT_BRANCH

# Step 6: Create PR (request 'all' permission from user)
gh pr create \
  --title "Add keyword CSV export endpoint" \
  --body "## Changes
- Added new \`/export-keywords\` endpoint to keyword router
- Implements CSV formatting for keyword data export
- Includes proper error handling and response formatting

## Testing
- ✅ Endpoint tested manually
- ✅ Linting passed

## Files Changed
- \`backend/app/keyword/router.py\`" \
  --base dev \
  --label "feature,backend"

# Step 7: Get PR details
PR_INFO=$(gh pr view --json number,url,title)
echo $PR_INFO

# Step 8: Report to user
echo ""
echo "✅ PR created successfully!"
echo "📁 Branch: $CURRENT_BRANCH"
echo "🔗 PR #42: Add keyword CSV export endpoint"
echo "🌐 URL: https://github.com/user/repo/pull/42"
echo ""
echo "⏳ Ready for review..."
```

**Agent stops here. User will review and merge manually.**

### Branch Creation Helper (For Agents)

When on `dev`, agents should:
1. Analyze `git diff` and `git diff --name-only`
2. Determine change type based on patterns
3. Create descriptive branch name
4. Checkout to new branch

**Quick heuristics for branch type:**
- New functions/endpoints → `feature/`
- Fixing bugs/errors → `bugfix/`
- Only .md files → `docs/`
- Test files only → `test/`
- Refactoring without new features → `refactor/`
- Critical/urgent → `hotfix/`

**Example:**
```bash
# Files: backend/app/keyword/router.py
# Changes: +def export_keywords() [new function]
# Branch: feature/add-keyword-export
```

### Handling Errors

**Error: Pre-commit hook fails**
```bash
# First attempt
git commit -m "message"
# Error: PermissionError with pre-commit hooks

# Solution: Request 'all' permission
# Retry with user approval for 'all' permission
```

**Error: Push rejected (branch protection)**
```bash
# Error: remote rejected, branch protected

# Solution: Verify you're not pushing to dev directly
git branch --show-current
# Make sure you're on a feature branch, not dev

# If accidentally on dev, create feature branch
git checkout -b feature/my-feature
git push -u origin feature/my-feature
```

**Error: PR already exists**
```bash
# Error: A pull request already exists

# Solution: Get existing PR number
gh pr list --head <branch-name>

# Report to user with existing PR details
gh pr view <pr-number>
```

## Using This Workflow with Claude Code

Claude Code (AI coding agents) can execute this entire workflow with the following considerations:

### Prerequisites Check

Before starting, verify:
```bash
# Check git is configured
git config user.name
git config user.email

# Check GitHub CLI authentication
gh auth status

# Check current branch
git status
```

### Typical Agent Workflow

1. **Analyze Changes**: Review git diff and changed files
2. **Generate Message**: Create Conventional Commits formatted message
3. **Stage Changes**: `git add <files>` (requires `git_write`)
4. **Commit**: `git commit -m "message"` (may require `all` for hooks)
5. **Push**: `git push -u origin <branch>` (requires `all` for SSH)
6. **Create PR**: `gh pr create --title "..." --body "..." --base dev` (requires `all`)
7. **Report**: Provide PR number and URL to user

### Permission Strategy

**Start conservative:**
1. Try with `git_write` for local git operations
2. Add `network` when needed for remote operations
3. Escalate to `all` only if pre-commit hooks fail

**Example:**
```
# First attempt (will likely fail on commit due to hooks)
run_terminal_cmd(command="git commit -m 'message'", required_permissions=["git_write"])

# If pre-commit hook fails with permission error
run_terminal_cmd(command="git commit -m 'message'", required_permissions=["all"])

# For push/PR operations
run_terminal_cmd(command="git push", required_permissions=["network"])
```

### What Agents Can Fully Automate

✅ **Fully Automated:**
- Analyzing code changes and generating commit messages
- Branch creation and switching
- File modifications
- Staging and committing
- Pushing to remote
- Creating PRs with complete details
- Checking PR status and CI results
- Updating PRs based on feedback
- Local branch cleanup after merge

⚠️ **Requires Human Action:**
- Initial GitHub authentication (`gh auth login`)
- **PR Review and Approval** (human must review)
- **Merging PRs** (user merges via GitHub UI)
- Complex merge conflict resolution
- Reviewing failed tests and determining fixes

### Agent Best Practices

1. **Always check status first**: `git status` before making changes
2. **Use explicit branches**: Always specify `--base dev` in PR creation
3. **Provide complete PR details**: Never rely on interactive prompts
4. **Verify CI before merge**: Check `gh pr checks` before merging
5. **Clean up after**: Delete branches and prune references

### Debugging Agent Issues

```bash
# If command fails, check:
# 1. Permissions
# 2. Authentication
gh auth status

# 3. Branch status
git status
git branch -a

# 4. Remote status
git remote -v
gh pr list

# 5. Detailed error info
git fetch --verbose
gh pr create --help
```

## Additional Resources

- **GitHub CLI Docs**: https://cli.github.com/manual/
- **Conventional Commits**: https://www.conventionalcommits.org/
- **Git Documentation**: https://git-scm.com/doc
- **GlitchAds Repo Guidelines**: See `CLAUDE.md` in root, frontend, and backend directories
- **Claude Code Docs**: Cursor AI documentation for agent workflows

---

## Summary Checklist

### For Agents: Creating a PR

**Agent Executes:**
- [ ] Check git status and analyze changes
- [ ] Generate appropriate commit message
- [ ] Stage and commit changes
- [ ] Push branch to remote
- [ ] Create PR with clear title and description
- [ ] Set base branch to `dev`
- [ ] Report PR number and URL to user

**Agent Stops Here** ✋

### For Users: Reviewing and Merging

**User Actions (Manual):**
- [ ] Review code changes
- [ ] Check CI/CD status (automatic)
- [ ] Request changes if needed
- [ ] Approve PR when satisfied
- [ ] Merge via GitHub UI (squash merge recommended)
- [ ] Verify staging deployment (automatic)

**Optional: Agent Can Help with Cleanup:**
- [ ] Delete local branch: `git branch -d <branch>`
- [ ] Update local dev: `git checkout dev && git pull`
- [ ] Prune references: `git fetch --prune`

