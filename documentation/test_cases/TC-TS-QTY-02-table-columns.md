---
id: TC-TS-QTY-02
title: Quantities table displays correct columns
source_plan: 05-financial-planning
source_scenario: TS-QTY-02
covers_ac: [AC-qty-table-columns]
persona: Application User (MANAGER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@quantities", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-QTY-02 — Quantities table displays correct columns

## 1. Context
Verifies that the Quantities/Accomplishments data table displays the correct columns: Fiscal Year, Accomplishment/Quantity, Forecast, Schedule 7, Actual, Comment, and action buttons (Add/Edit/Delete).

**Source**: Test Plan 05, scenario TS-QTY-02 ([CRPDB-112]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project (e.g., project ID 79) with at least one Qty/Accmp entry.
- **Starting URL**: `${BASE_URL}/projects/79/projecttender`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data
None required beyond existing entries.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the tender page for project "79"
And   at least one Quantities/Accomplishments entry exists

Then  the Quantities/Accomplishments table has a column header "Fiscal Year"
And   the table has a column header "Accomplishment/Quantity"
And   the table has a column header "Forecast"
And   the table has a column header "Schedule7"
And   the table has a column header "Actual"
And   the table has a column header "Comment"
And   each row has action buttons for Edit and Delete
```

## 5. Expected Results
- All six data columns are present: Fiscal Year, Accomplishment/Quantity, Forecast, Schedule7, Actual, Comment.
- Each data row has Edit and Delete action buttons.
- The "+ Add" button is available in the section header.

## 6. Postconditions / Cleanup
- No data was created; no cleanup required.

## 7. Notes for the Playwright Agent
- The table is in the "Quantities/Accomplishments" section of the Tender page.
- Column headers can be verified using `page.getByRole('columnheader', { name: '...' })`.
- "Schedule7" is the column name (may also appear as "Schedule 7").
