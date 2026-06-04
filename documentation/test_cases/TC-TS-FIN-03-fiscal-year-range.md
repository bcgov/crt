---
id: TC-TS-FIN-03
title: Fiscal Year dropdown range 2010/2011 to 2027/2028
source_plan: 05-financial-planning
source_scenario: TS-FIN-03
covers_ac: [AC-fiscal-year-range]
persona: Application User (MANAGER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@financial", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-FIN-03 — Fiscal Year dropdown range 2010/2011 to 2027/2028

## 1. Context
Verifies that the Fiscal Year dropdown in the Add Financial Target form contains the full range from 2010/2011 to 2027/2028, incrementing annually, plus a "TBD" option.

**Source**: Test Plan 05, scenario TS-FIN-03 ([CRPDB-111]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project (e.g., project ID 79) with the Financial Plan screen accessible.
- **Starting URL**: `${BASE_URL}/projects/79/projectplan`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Expected Values |
|-------|-----------------|
| First Year | `2010/2011` |
| Last Year | `2027/2028` |
| Special Value | `TBD` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the financial plan page for project "79"
When  I click the button "+ Add"
Then  I see a dialog for adding a financial target

When  I click the dropdown "Fiscal Year"
Then  I see the option "2010/2011" in the dropdown
And   I see the option "2027/2028" in the dropdown
And   I see the option "TBD" in the dropdown
And   the dropdown contains 19 fiscal year options (2010/2011 through 2027/2028 plus TBD)
```

## 5. Expected Results
- The dropdown contains consecutive fiscal years from 2010/2011 to 2027/2028 (18 years).
- A "TBD" option is also available.
- Years increment by one (e.g., 2010/2011, 2011/2012, 2012/2013, …, 2027/2028).

## 6. Postconditions / Cleanup
- No data was created; close the dialog with "Cancel".

## 7. Notes for the Playwright Agent
- The Fiscal Year dropdown is the first dropdown in the Add dialog.
- Count options to verify completeness: 18 fiscal years + 1 TBD = 19 options.
- Options use the format "YYYY/YYYY" (e.g., "2024/2025").
