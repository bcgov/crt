---
id: TC-TS-TEND-03
title: Tender table display and default sorting
source_plan: 05-financial-planning
source_scenario: TS-TEND-03
covers_ac: [AC-tender-table-sort]
persona: Application User (MANAGER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@tender", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-TEND-03 — Tender table display and default sorting

## 1. Context
Verifies that the tender table displays entries sorted by tender number by default, and includes Edit/Delete actions per row.

**Source**: Test Plan 05, scenario TS-TEND-03 ([CRPDB-113]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project with at least two tender entries to verify sort order.
- **Starting URL**: `${BASE_URL}/projects/{id}/projecttender`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data
At least two tender records with different tender numbers (e.g., "T-001" and "T-002").

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the tender page for a project with multiple tender entries

Then  the Project Tender Details table shows columns: Tender #, Planned Date, Actual Date, Ministry Estimate, Winning Contractor, Winning Bid, %Min.Est., Comment
And   the table rows are sorted by Tender # in ascending order by default
And   each row has a button "Edit Record"
And   each row has a button "Delete Record"
```

## 5. Expected Results
- The table displays all expected columns.
- Rows are sorted by Tender # in ascending order.
- Each row has Edit and Delete action buttons.

## 6. Postconditions / Cleanup
- No data was created; no cleanup required.

## 7. Notes for the Playwright Agent
- Verify sort order by comparing Tender # values in adjacent rows.
- The %Min.Est. column shows the ratio of winning bid to ministry estimate as a percentage.
- Column headers per exploration: Tender #, Planned Date, Actual Date, Ministry Estimate, Winning Contractor, Winning Bid, %Min.Est., Comment.
