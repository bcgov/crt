---
id: TC-TS-DETAIL-10
title: Status Comments add and view with 2000 char limit
source_plan: 04-project-search-details
source_scenario: TS-DETAIL-10
covers_ac: [AC-status-comments]
persona: Application User (MANAGER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@projects", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-DETAIL-10 — Status Comments add and view with 2000 char limit

## 1. Context
Verifies that Status Comments can be added to a project, records the date and user, enforces a 2000-character limit, and older comments are accessible.

**Source**: Test Plan 04, scenario TS-DETAIL-10 ([CRPDB-106]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project exists (e.g., project ID 79 — "Another test project").
- **Starting URL**: `${BASE_URL}/projects/79`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Comment Text | `CRT-AUTO status comment for testing purposes` |
| Max Length Comment | A 2000-character string (`{{COMMENT_TEXT_2000}}`) |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the project details page for project "79"

# Add a status comment
When  I click the button "Add Status Comments"
Then  I see a dialog or form for adding status comments
When  I fill the textarea "comment" with "CRT-AUTO status comment for testing purposes"
And   I click the button "Submit"
Then  the comment "CRT-AUTO status comment for testing purposes" appears in the Status Comments table
And   the row shows today's date in the "Date Added" column
And   the row shows the current user's name in the "User" column

# View older comments
When  I click the button "Show all Status Comments"
Then  I see all previously added status comments with date and user information
```

## 5. Expected Results
- A new status comment is added successfully.
- The comment table displays: Date Added (today), User (current user's name), Comment text.
- The "Show all Status Comments" button reveals the full comment history.

## 6. Postconditions / Cleanup
- The added comment remains in the system (comments are typically not deletable).
- Use a recognizable prefix (`CRT-AUTO`) for easy identification.

## 7. Examples (character limit validation)

| Example | Comment Length | Expected Outcome |
|---------|---------------|------------------|
| 1 | 50 chars | Saved successfully |
| 2 | 2000 chars | Saved successfully (at limit) |
| 3 | 2001 chars | Field prevents entry beyond 2000 or validation error |

## 8. Notes for the Playwright Agent
- The textarea has `id="comment"` and `name="comment"` with placeholder "Insert Comment Here".
- Submit button is disabled until text is entered.
- The close button (X) has `aria-label="Close"`.
- Comment table columns: Date Added, User, Comment.
