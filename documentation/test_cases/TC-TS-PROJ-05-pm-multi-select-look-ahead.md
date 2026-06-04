---
id: TC-TS-PROJ-05
title: PM multi-select with look-ahead filtering
source_plan: 04-project-search-details
source_scenario: TS-PROJ-05
covers_ac: [AC-pm-multi-select]
persona: Application User (MANAGER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@projects", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-PROJ-05 — PM multi-select with look-ahead filtering

## 1. Context
Verifies that the Project Manager dropdown on the Project Search page allows multiple PMs to be selected and supports type-ahead filtering as the user types.

**Source**: Test Plan 04, scenario TS-PROJ-05 ([CRPDB-105]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: At least two Project Managers exist in the user's region.
- **Starting URL**: `${BASE_URL}/projects`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| PM Search Term | `Dev` |
| Expected PM Match | `Devashish Bhargava` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the "Projects" page
When  I click the button "Project Manager"
Then  I see a list of available Project Managers

# Type-ahead filtering
When  I type "Dev" into the filter input in the dropdown
Then  the list is filtered to show only PMs matching "Dev"
And   I see the option "Devashish Bhargava" in the dropdown

# Multi-select
When  I check the checkbox "Devashish Bhargava" in the dropdown
Then  the checkbox "Devashish Bhargava" is checked
When  I check a second PM in the dropdown
Then  both PM checkboxes are checked
```

## 5. Expected Results
- The Project Manager dropdown opens showing a list of PMs.
- Typing a partial name filters the list to matching PMs only.
- Multiple PMs can be selected simultaneously (checkboxes).
- Selected PMs remain checked while selecting additional ones.

## 6. Postconditions / Cleanup
- No data was created; no cleanup required.

## 7. Notes for the Playwright Agent
- The PM dropdown is a multi-select button dropdown similar to the Regions dropdown.
- Type-ahead filtering may use an input field within the dropdown menu.
- Verify multiple selections by checking that more than one checkbox is in the checked state.
