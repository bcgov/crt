---
id: TC-TS-DETAIL-08
title: PM dropdown dependent on region selection
source_plan: 04-project-search-details
source_scenario: TS-DETAIL-08
covers_ac: [AC-pm-region-dependency]
persona: Application User (MANAGER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@projects", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-DETAIL-08 — PM dropdown dependent on region selection

## 1. Context
Verifies that the Project Manager dropdown on the Add/Edit Project form is dependent on the MoTI Region selection:
- When no region is selected, the PM dropdown is disabled.
- When a region is selected, the PM dropdown is enabled and shows only PMs for that region.

**Source**: Test Plan 04, scenario TS-DETAIL-08 ([CRPDB-106]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: At least one PM exists in region `1-South Coast`.
- **Starting URL**: `${BASE_URL}/projects`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Region | `1-South Coast` |
| Expected PM | A PM assigned to `1-South Coast` (e.g., `Devashish Bhargava`) |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the "Projects" page
When  I click the button "Add Project"
Then  I see the heading "Add Project"

# PM dropdown should be disabled without region
Then  the dropdown "Project Manager" is disabled

# Select a region
When  I select "1-South Coast" from the dropdown "MoTI Region*"
Then  the dropdown "Project Manager" is enabled

# PM dropdown shows region-specific PMs
When  I click the dropdown "Project Manager"
Then  I see the option "Devashish Bhargava" in the dropdown

# Clear region → PM disabled again
When  I clear the dropdown "MoTI Region*"
Then  the dropdown "Project Manager" is disabled
```

## 5. Expected Results
- The PM dropdown is disabled when no region is selected.
- After selecting a region, the PM dropdown becomes enabled.
- The PM dropdown shows only PMs associated with the selected region.
- Clearing the region disables the PM dropdown again.

## 6. Postconditions / Cleanup
- No data was created (form was not submitted); no cleanup required.

## 7. Notes for the Playwright Agent
- The PM dropdown in the Add Project form is separate from the PM filter on the search page.
- Test the disabled state with `await expect(locator).toBeDisabled()`.
- The PM list is filtered by the currently selected region value.
