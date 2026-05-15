# 8. UI Enhancements

> **Preconditions for this file**: Tester is logged in as `{{IDIR_VALID_USER}}`. A project (`{{PROJECT_NUMBER_EXISTING}}`) exists and the Project Details screen is reachable. Cross-cutting UI conventions (currency fields no decimals, comment 2000-char limit, exact prompt strings) are in §0.8. See [00-conventions-glossary.md](00-conventions-glossary.md).

## [CRPDB-204] Status and EMR Comments Updates

**User Story**: As an Application User, I want improved comment functionality showing user names and allowing edits.

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-COMMENT-01 | Comments show first and last name | 1. Navigate to Project Details<br>2. Enter Status and EMR comments | Comments display user's first and last name | Medium | Functional |
| TS-COMMENT-02 | Comments sorted latest first | 1. Add multiple comments<br>2. View expanded comments | Latest comment appears first | Low | Functional |
| TS-COMMENT-03 | Edit existing comment | 1. Navigate to Project Details<br>2. Expand comment history<br>3. Click edit (pencil) icon on an existing comment<br>4. Modify comment text<br>5. Submit | Comment updated; timestamp and user info preserved; updated text displayed | Medium | Functional |
| TS-COMMENT-04 | Delete existing comment | 1. Navigate to Project Details<br>2. Expand comment history<br>3. Click delete (trash) icon on a comment<br>4. Confirm deletion | Comment removed from history; remaining comments re-displayed correctly | Medium | Functional |
| TS-COMMENT-05 | Edit EMR comment | 1. Navigate to Project Details<br>2. Expand EMR comment history<br>3. Click edit icon<br>4. Modify and submit | EMR comment updated successfully | Medium | Functional |
| TS-COMMENT-06 | Delete EMR comment | 1. Navigate to Project Details<br>2. Expand EMR comment history<br>3. Click delete icon<br>4. Confirm | EMR comment removed from history | Medium | Functional |

---

## [CRPDB-217] Sprint 6 Review Feedback

**User Story**: As an Application User, I expect UI improvements from sprint review feedback.

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-UI-01 | Top navigation buttons | 1. Navigate to any project sub-screen | Navigation buttons visible at top of screen | Medium | Functional |
| TS-UI-02 | No decimals on financial amounts | 1. Navigate to Financial Plan<br>2. Attempt to enter decimal value | Decimals not allowed on Financial Plan, Announcement, C-035, Tender values | High | Functional |
| TS-UI-03 | Project status label changes | 1. Check status dropdown and labels | "In-progress" → "Active"; "Completed" → "Closed" | Medium | Functional |
| TS-UI-04 | Active project disable tooltip/label | 1. Hover over disable icon for active project<br>2. Click icon | Tooltip: "Activate/Close Project"; Button: "Close Project" | Low | Functional |
| TS-UI-05 | Closed project enable tooltip/label | 1. Hover over greyed icon for closed project<br>2. Click icon | Tooltip: "Activate/Close Project"; Button: "Activate Project" | Low | Functional |
