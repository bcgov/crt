---
id: TC-TS-COMMENT-02
title: Comments sorted latest first
source_plan: 08-ui-enhancements
source_scenario: TS-COMMENT-02
covers_ac: [AC-comment-sort]
persona: Application User (APP_USER)
priority: Low
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@comments", "@project-details", "@persona-user"]
last_updated: 2026-06-03
---

# TC-TS-COMMENT-02 — Comments sorted latest first

## 1. Context
Verifies that comments are sorted chronologically with the most recent comment displayed first.

**Source**: Test Plan 08, scenario TS-COMMENT-02.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}`.
- **Data**: A project with at least two existing status comments or ability to create them.
- **Starting URL**: `${BASE_URL}/projects/{id}`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Comment 1 (older) | `First comment - older` |
| Comment 2 (newer) | `Second comment - newer` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}"
And   I am on the Project Details page

# Add first comment
When  I add a status comment "First comment - older"
And   I wait briefly for the save to complete

# Add second comment
When  I add a status comment "Second comment - newer"

# Check sort order
When  I expand the comment history section
Then  "Second comment - newer" appears before "First comment - older" in the list
And   the comments are ordered from newest to oldest
```

## 5. Expected Results
- The most recently added comment appears at the top.
- Older comments follow in descending chronological order.

## 6. Postconditions / Cleanup
- Delete both test comments.

## 7. Notes for the Playwright Agent
- "First" in the list means closest to the top of the comment history container.
- May need to expand/toggle the comment section to see all comments.
