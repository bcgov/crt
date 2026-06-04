---
id: TC-TS-QTY-01
title: Fiscal year filter defaults and multi-select
source_plan: 05-financial-planning
source_scenario: TS-QTY-01
covers_ac: [AC-qty-fiscal-filter]
persona: Application User (MANAGER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@quantities", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-QTY-01 — Fiscal year filter defaults and multi-select

## 1. Context
Verifies that the fiscal year filter on the Quantities/Accomplishments section defaults to showing all fiscal years ("Choose All"), and supports selecting multiple specific years.

**Source**: Test Plan 05, scenario TS-QTY-01 ([CRPDB-112]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project (e.g., project ID 79) with at least one Qty/Accmp entry across multiple fiscal years.
- **Starting URL**: `${BASE_URL}/projects/79/projecttender`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data
None required beyond existing entries.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the tender page for project "79"

# Verify default shows all fiscal years
Then  the button "Show All Fiscal Years" is visible
And   the Quantities/Accomplishments table shows entries from all fiscal years

# Filter by specific fiscal year
When  I click the button "Show All Fiscal Years"
Then  a fiscal year filter or toggle is activated
And   I can select a specific fiscal year to narrow results
```

## 5. Expected Results
- By default, all fiscal years are shown (no filter applied).
- The "Show All Fiscal Years" button toggles the fiscal year view.
- Selecting a specific year filters the table to show only entries for that year.

## 6. Postconditions / Cleanup
- No data was created; no cleanup required.

## 7. Notes for the Playwright Agent
- The "Show All Fiscal Years" button is in the Quantities/Accomplishments section header.
- This is a toggle button — clicking it may show/hide a filter dropdown or switch between filtered/unfiltered views.
