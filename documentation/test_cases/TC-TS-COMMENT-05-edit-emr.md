---
id: TC-TS-COMMENT-05
title: Edit EMR comment
source_plan: 08-ui-enhancements
source_scenario: TS-COMMENT-05
covers_ac: [AC-emr-edit]
persona: Application User (APP_USER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@comments", "@emr", "@project-details", "@persona-user"]
last_updated: 2026-06-03
---

# TC-TS-COMMENT-05 — Edit EMR comment

## 1. Context
Verifies that an existing EMR comment can be edited via the pencil icon.

**Source**: Test Plan 08, scenario TS-COMMENT-05.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}`.
- **Data**: A project exists with at least one EMR comment.
- **Starting URL**: `${BASE_URL}/projects/{id}`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Original EMR comment | `Original EMR note` |
| Updated EMR comment | `Updated EMR note text` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}"
And   I am on the Project Details page with an existing EMR comment

When  I expand the EMR comment history section
And   I click the edit (pencil) icon on the EMR comment "Original EMR note"
Then  the EMR comment becomes editable

When  I clear the comment textarea
And   I fill the textarea with "Updated EMR note text"
And   I click the button "Submit"

Then  the EMR comment text changes to "Updated EMR note text"
And   the user name is preserved
```

## 5. Expected Results
- The EMR comment edit icon works the same as status comment edit.
- After editing, the updated text is displayed.
- User information is preserved.

## 6. Postconditions / Cleanup
- Delete or revert the edited EMR comment.

## 7. Notes for the Playwright Agent
- EMR comments are in a separate section from status comments on the Project Details page.
- The edit workflow is identical to status comment editing.
