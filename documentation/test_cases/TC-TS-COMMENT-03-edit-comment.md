---
id: TC-TS-COMMENT-03
title: Edit existing status comment
source_plan: 08-ui-enhancements
source_scenario: TS-COMMENT-03
covers_ac: [AC-comment-edit]
persona: Application User (APP_USER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@comments", "@project-details", "@persona-user"]
last_updated: 2026-06-03
---

# TC-TS-COMMENT-03 — Edit existing status comment

## 1. Context
Verifies that an existing status comment can be edited via the pencil icon, and the updated text is displayed.

**Source**: Test Plan 08, scenario TS-COMMENT-03.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}`.
- **Data**: A project exists with at least one status comment.
- **Starting URL**: `${BASE_URL}/projects/{id}`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Original comment | `Original status comment` |
| Updated comment | `Updated status comment text` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}"
And   I am on the Project Details page with an existing status comment

When  I expand the comment history section
And   I click the edit (pencil) icon on the comment "Original status comment"
Then  the comment becomes editable (textarea appears with current text)

When  I clear the comment textarea
And   I fill the textarea with "Updated status comment text"
And   I click the button "Submit"

Then  the comment text changes to "Updated status comment text"
And   the user name and timestamp information is preserved
```

## 5. Expected Results
- The pencil/edit icon is available on existing comments.
- Clicking it makes the comment editable.
- After submit, the updated text is shown.
- Username remains the same; timestamp may update.

## 6. Postconditions / Cleanup
- Delete or revert the edited comment.

## 7. Notes for the Playwright Agent
- The edit icon is a pencil icon per comment row.
- The textarea id remains "comment" when in edit mode.
