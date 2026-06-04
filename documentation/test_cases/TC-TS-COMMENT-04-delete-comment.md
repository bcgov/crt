---
id: TC-TS-COMMENT-04
title: Delete existing status comment
source_plan: 08-ui-enhancements
source_scenario: TS-COMMENT-04
covers_ac: [AC-comment-delete]
persona: Application User (APP_USER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@comments", "@project-details", "@persona-user"]
last_updated: 2026-06-03
---

# TC-TS-COMMENT-04 — Delete existing status comment

## 1. Context
Verifies that an existing status comment can be deleted via the trash icon with confirmation.

**Source**: Test Plan 08, scenario TS-COMMENT-04.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}`.
- **Data**: A project exists with at least one status comment.
- **Starting URL**: `${BASE_URL}/projects/{id}`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Comment to delete | `Comment to be deleted` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}"
And   I am on the Project Details page with a status comment "Comment to be deleted"

When  I expand the comment history section
And   I click the delete (trash) icon on the comment "Comment to be deleted"
Then  I see a confirmation prompt "Are you sure?"
When  I click the confirm button

Then  the comment "Comment to be deleted" is no longer visible in the comment history
And   remaining comments are still displayed correctly
```

## 5. Expected Results
- The trash/delete icon is available per comment.
- A confirmation prompt appears before deletion.
- After confirming, the comment is permanently removed.
- Other comments remain intact and correctly displayed.

## 6. Postconditions / Cleanup
- Comment permanently deleted; no cleanup required.

## 7. Notes for the Playwright Agent
- Deletion is per-comment (trash icon on each comment row).
- Confirmation text: "Are you sure?"
