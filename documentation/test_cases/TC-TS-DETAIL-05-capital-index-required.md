---
id: TC-TS-DETAIL-05
title: Capital Index dropdown single-select required with help text
source_plan: 04-project-search-details
source_scenario: TS-DETAIL-05
covers_ac: [AC-capital-index-required]
persona: Application User (MANAGER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@projects", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-DETAIL-05 — Capital Index dropdown single-select required with help text

## 1. Context
Verifies that the Capital Index field is a single-select dropdown, is required for project creation, and has a help text tooltip on hover.

**Source**: Test Plan 04, scenario TS-DETAIL-05 ([CRPDB-106]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Starting URL**: `${BASE_URL}/projects`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Capital Index Value | `7-Capitalizable-All components>15yrs` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the "Projects" page
When  I click the button "Add Project"
Then  I see the heading "Add Project"

# Verify Capital Index is required (Submit disabled without it)
When  I fill the textbox "Project Number*" with "CRT-AUTO-CI-001"
And   I fill the textbox "Project Name*" with "Capital Index Test"
And   I select "1-South Coast" from the dropdown "MoTI Region*"
And   I select "55750" from the dropdown "RC Number*"
Then  the button "Submit" is disabled

# Select Capital Index value (single-select)
When  I select "7-Capitalizable-All components>15yrs" from the dropdown "Capital Index*"
Then  the dropdown "Capital Index*" shows "7-Capitalizable-All components>15yrs"
And   the button "Submit" is enabled

# Verify help text
When  I hover over the image near the field labeled "Capital Index"
Then  I see tooltip text describing the Capital Index field
```

## 5. Expected Results
- Capital Index is a single-select dropdown (only one value can be chosen at a time).
- The Submit button remains disabled until Capital Index (and all other required fields) are filled.
- After selecting a value, the dropdown shows the selected value.
- A help icon tooltip provides context about what Capital Index means.

## 6. Postconditions / Cleanup
- No data was created (form was not submitted); no cleanup required.

## 7. Notes for the Playwright Agent
- Capital Index options observed: values from "0-Expense-Materiality clause not met" to "10-Capitalizable-All components>40yrs".
- The dropdown shows format `<number>-<description>`.
- On the Project Details read-only page, only the number is shown with a tooltip for the description.
