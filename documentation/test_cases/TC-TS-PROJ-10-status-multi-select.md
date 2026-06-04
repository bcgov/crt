---
id: TC-TS-PROJ-10
title: Status multi-select Active and Closed
source_plan: 04-project-search-details
source_scenario: TS-PROJ-10
covers_ac: [AC-status-multi-select]
persona: Application User (MANAGER)
priority: Low
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@projects", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-PROJ-10 — Status multi-select Active and Closed

## 1. Context
Verifies that both "Active" and "Closed" status options can be selected simultaneously in the Status dropdown, allowing users to see all projects regardless of status.

**Source**: Test Plan 04, scenario TS-PROJ-10 ([CRPDB-105]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: At least one Active project and one Closed project exist in the user's region.
- **Starting URL**: `${BASE_URL}/projects`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Status Option 1 | `Active` |
| Status Option 2 | `Closed` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the "Projects" page
When  I click the button "Active"
And   I check the checkbox "Active" in the dropdown
And   I check the checkbox "Closed" in the dropdown
Then  the checkbox "Active" is checked
And   the checkbox "Closed" is checked

When  I click the button "Search"
Then  the table shows projects with status "Active"
And   the table shows projects with status "Closed"
```

## 5. Expected Results
- Both "Active" and "Closed" can be checked simultaneously.
- After searching with both selected, results include projects of both statuses.

## 6. Postconditions / Cleanup
- No data was created; no cleanup required.

## 7. Notes for the Playwright Agent
- The Status dropdown is a multi-select checkbox dropdown.
- When both are selected, the button text may change to show both values or a count.
- Verify results by checking the Status column in the projects table.
