---
id: TC-TS-DETAIL-07
title: MoTI Region single-select required on save
source_plan: 04-project-search-details
source_scenario: TS-DETAIL-07
covers_ac: [AC-region-required]
persona: Application User (MANAGER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@projects", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-DETAIL-07 — MoTI Region single-select required on save

## 1. Context
Verifies that the MoTI Region field on the Add/Edit Project form is a single-select dropdown and is required for saving a project.

**Source**: Test Plan 04, scenario TS-DETAIL-07 ([CRPDB-106]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Starting URL**: `${BASE_URL}/projects`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Region Selection | `1-South Coast` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the "Projects" page
When  I click the button "Add Project"
Then  I see the heading "Add Project"

# Verify Submit is disabled without region
When  I fill the textbox "Project Number*" with "CRT-AUTO-REG-001"
And   I fill the textbox "Project Name*" with "Region Test Project"
And   I select "55750" from the dropdown "RC Number*"
And   I select "7-Capitalizable-All components>15yrs" from the dropdown "Capital Index*"
Then  the button "Submit" is disabled

# Select region — single select only
When  I select "1-South Coast" from the dropdown "MoTI Region*"
Then  the dropdown "MoTI Region*" shows "1-South Coast"
And   the button "Submit" is enabled
```

## 5. Expected Results
- The MoTI Region dropdown is single-select (one value at a time).
- The Submit button remains disabled when the Region field is not selected.
- After selecting a region, the button becomes enabled (assuming all other required fields are filled).

## 6. Postconditions / Cleanup
- No data was created (form was not submitted); no cleanup required.

## 7. Notes for the Playwright Agent
- MoTI Region options: `0-Headquarters`, `1-South Coast`, `2-Southern Interior`, `3-Northern`.
- The dropdown shows only regions available to the user's role/assignment.
