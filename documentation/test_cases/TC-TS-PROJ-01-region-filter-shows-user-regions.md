---
id: TC-TS-PROJ-01
title: Region filter shows only user's assigned regions
source_plan: 04-project-search-details
source_scenario: TS-PROJ-01
covers_ac: [AC-region-filter]
persona: Application User (MANAGER)
priority: High
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@projects", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-PROJ-01 — Region filter shows only user's assigned regions

## 1. Context
Verifies that the Regions dropdown on the Project Search page only displays regions assigned to the logged-in user. A user assigned to `1-South Coast` should not see regions they are not associated with. This ensures proper data isolation by region.

**Source**: Test Plan 04, scenario TS-PROJ-01 ([CRPDB-105]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, assigned to region `1-South Coast` only.
- **Data**: User account exists with a single region assignment (`1-South Coast`).
- **Starting URL**: `${BASE_URL}/projects`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| User Region | `1-South Coast` |
| All Possible Regions | `0-Headquarters`, `1-South Coast`, `2-Southern Interior`, `3-Northern` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER" assigned to region "1-South Coast"
And   I am on the "Projects" page
When  I click the button "Regions"
Then  I see the option "1-South Coast" in the dropdown
And   I do not see the option "0-Headquarters" in the dropdown
And   I do not see the option "2-Southern Interior" in the dropdown
And   I do not see the option "3-Northern" in the dropdown
```

## 5. Expected Results
- The Regions dropdown opens and displays only `1-South Coast`.
- Regions not assigned to the user (`0-Headquarters`, `2-Southern Interior`, `3-Northern`) are not present in the dropdown.

## 6. Postconditions / Cleanup
- No data was created; no cleanup required.

## 7. Notes for the Playwright Agent
- The Regions dropdown is a multi-select button dropdown (not a native `<select>`).
- After clicking the button "Regions", the options appear in a dropdown menu.
- Verify option presence/absence by checking for list items or checkboxes within the dropdown.
