---
id: TC-TS-DETAIL-02
title: Project Name required validation
source_plan: 04-project-search-details
source_scenario: TS-DETAIL-02
covers_ac: [AC-project-name-required]
persona: Application User (MANAGER)
priority: High
type: Negative
level: E2E
automation_candidate: Yes
tags: ["@regression", "@projects", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-DETAIL-02 — Project Name required validation

## 1. Context
Verifies that the Project Name field is mandatory and that attempting to submit the Add Project form without a Project Name produces an inline validation error and prevents form submission.

**Source**: Test Plan 04, scenario TS-DETAIL-02 ([CRPDB-106]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Starting URL**: `${BASE_URL}/projects`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Project Number | `CRT-AUTO-VAL-001` |
| Project Name | *(left blank)* |
| MoTI Region | `1-South Coast` |
| RC Number | `55750` |
| Capital Index | `7-Capitalizable-All components>15yrs` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the "Projects" page
When  I click the button "Add Project"
Then  I see the heading "Add Project"

# Fill all required fields EXCEPT Project Name
When  I fill the textbox "Project Number*" with "CRT-AUTO-VAL-001"
And   I select "1-South Coast" from the dropdown "MoTI Region*"
And   I select "55750" from the dropdown "RC Number*"
And   I select "7-Capitalizable-All components>15yrs" from the dropdown "Capital Index*"

# Attempt to submit — Submit button should remain disabled or show validation error
Then  the button "Submit" is disabled
```

## 5. Expected Results
- The Submit button remains disabled when the required Project Name field is empty.
- No form submission occurs.
- The form stays open with the entered data intact.

## 6. Postconditions / Cleanup
- No data was created (form was not submitted); no cleanup required.

## 7. Notes for the Playwright Agent
- Per exploration, the Submit button is disabled until all required fields (marked with *) are filled.
- Required fields are: Project Number, Project Name, MoTI Region, RC Number, Capital Index.
- The validation is client-side via the disabled Submit button rather than an inline error message after clicking Submit.
