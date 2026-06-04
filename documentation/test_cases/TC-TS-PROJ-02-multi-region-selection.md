---
id: TC-TS-PROJ-02
title: Multi-region selection in filter
source_plan: 04-project-search-details
source_scenario: TS-PROJ-02
covers_ac: [AC-region-multi-select]
persona: Application User (MANAGER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@projects", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-PROJ-02 — Multi-region selection in filter

## 1. Context
Verifies that the Regions dropdown on the Project Search page allows multiple regions to be selected simultaneously. This test requires a user with access to multiple regions.

**Source**: Test Plan 04, scenario TS-PROJ-02 ([CRPDB-105]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` with role `SYSTEM_ADMIN`, assigned to all regions.
- **Data**: User account exists with multiple region assignments.
- **Starting URL**: `${BASE_URL}/projects`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Region 1 | `1-South Coast` |
| Region 2 | `2-Southern Interior` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with role "SYSTEM_ADMIN"
And   I am on the "Projects" page
When  I click the button "Regions"
And   I check the checkbox "1-South Coast" in the dropdown
And   I check the checkbox "2-Southern Interior" in the dropdown
Then  the checkbox "1-South Coast" is checked
And   the checkbox "2-Southern Interior" is checked
When  I click the button "Search"
Then  the table "Projects" shows projects from region "1-South Coast" and "2-Southern Interior"
And   the table "Projects" does not show projects from region "0-Headquarters"
And   the table "Projects" does not show projects from region "3-Northern"
```

## 5. Expected Results
- Both `1-South Coast` and `2-Southern Interior` can be selected at the same time.
- After searching, results include projects from both selected regions.
- Results do not include projects from unselected regions.

## 6. Postconditions / Cleanup
- No data was created; no cleanup required.

## 7. Notes for the Playwright Agent
- The Regions dropdown is a multi-select with checkboxes.
- After selecting regions, click the "Search" button to apply the filter.
- Verify region filtering by checking the "Region" column in results.
