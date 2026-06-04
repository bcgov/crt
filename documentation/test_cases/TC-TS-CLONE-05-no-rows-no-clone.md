---
id: TC-TS-CLONE-05
title: Clone button not available when no rows exist
source_plan: 07-data-maintenance
source_scenario: TS-CLONE-05
covers_ac: [AC-clone-requires-row]
persona: Application User (APP_USER)
priority: Low
type: Edge Case
level: E2E
automation_candidate: Yes
tags: ["@regression", "@clone", "@persona-user"]
last_updated: 2026-06-03
---

# TC-TS-CLONE-05 — Clone button not available when no rows exist

## 1. Context
Verifies that the Clone button is not available when a project tab has no existing records — clone requires a source row.

**Source**: Test Plan 07, scenario TS-CLONE-05.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with project edit permissions.
- **Data**: A project exists with NO Financial Planning entries (or use a new project).
- **Starting URL**: `${BASE_URL}/projects/{id}/projectplan`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data
None required — an empty table is the test condition.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with project edit permissions
And   I am on the Financial Planning page for a project with no entries
Then  the table shows no data (empty state)
And   no "Clone Record" button is visible on the page

When  I navigate to the Tender Details page for the same project
And   the Tender table has no entries
Then  no "Clone Record" button is visible on the page

When  I navigate to the Qty/Accomplishments page for the same project
And   the Qty table has no entries
Then  no "Clone Record" button is visible on the page
```

## 5. Expected Results
- Clone Record buttons only appear on existing data rows.
- When a table is empty, no Clone buttons are visible.
- The "+ Add" button is still available for creating the first entry.

## 6. Postconditions / Cleanup
- No data was created; no cleanup required.

## 7. Notes for the Playwright Agent
- Clone is a per-row action — no rows means no clone buttons.
- The "+ Add" button should still be visible for initial data entry.
