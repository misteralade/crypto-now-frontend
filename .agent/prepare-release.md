---
description: Prepare release notes and gather issues for the next release
---

1. **Identify Release Number**:
   - Check for an open Pull Request from `dev` (or similar development branch) to `main`.
   - The PR title should contain the release number (e.g., "Release 1.2.3").
   - If no such PR exists, ask the user for the target release number.

2. **Find Issues**:
   - Use `gh issue list` to find all closed issues assigned to the Milestone matching the release number.
   - Point releases use x.x.x.x format (e.g., "1.4.2.2").
   - Example: `gh issue list --state closed --milestone "1.4.2.2"`

3. **Generate Summary**:
   - Create a markdown summary of the issues found.
   - Group them by type (e.g., Features, Bug Fixes) if possible based on labels.
   - Format: `- #<issue_number> <issue_title>`

4. **Update Release PR (Optional)**:
   - If a Release PR exists, propose updating its description to include the generated summary.
   - Use `gh pr edit <pr_number> --body "..."` (be careful not to overwrite existing important info, append or insert).
