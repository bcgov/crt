---
id: TC-TS-QTY-07
title: Cancel with unsaved changes prompt
source_plan: 05-financial-planning
source_scenario: TS-QTY-07
covers_ac: [AC-qty-unsaved-changes]
persona: Application User (MANAGER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@quantities", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-QTY-07 — Cancel with unsaved changes prompt

## 1. Context
Verifies that cancelling the Qty/Accmp form with unsaved changes triggers a "You have unsaved changes" prompt with "Go Back" and "Leave" options.

**Source**: Test Plan 05, scenario TS-QTY-07 ([CRPDB-112]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project (e.g., project ID 79) accessible from the Tender page.
- **Starting URL**: `${BASE_URL}/projects/79/projecttender`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Fiscal Year | `2024/2025` |
| Category | `Accomplishment` |
| Forecast | `50.000` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the tender page for project "79"

When  I click the second button "+ Add" in the Quantities/Accomplishments section
Then  I see a dialog "Add Quantities and Accomplishments"

When  I select "2024/2025" from the dropdown "Fiscal Year"
And   I select "Accomplishment" from the dropdown "Quantity or Accomplishment"
And   I fill the field "Forecast" with "50.000"

# Cancel with unsaved data
When  I click the button "Cancel"
Then  I see a dialog with text "You have unsaved changes"
And   I see the button "Go Back" in the dialog
And   I see the button "Leave" in the dialog

# Go Back retains data
When  I click the button "Go Back"
Then  the form is still visible
And   the field "Forecast" still contains "50.000"

# Cancel again and Leave
When  I click the button "Cancel"
Then  I see a dialog with text "You have unsaved changes"
When  I click the button "Leave"
Then  the form dialog is closed
And   no new entry was added to the table
```

## 5. Expected Results
- Cancelling with unsaved changes shows prompt with exact text "You have unsaved changes".
- "Go Back" returns to the form with data intact.
- "Leave" closes the form and discards all entered data.

## 6. Postconditions / Cleanup
- No data was created; no cleanup required.

## 7. Notes for the Playwright Agent
- The prompt uses exact text "You have unsaved changes" with buttons "Go Back" and "Leave" (per §0.8).
- This prompt should only appear when the form has modified/entered data.
- An empty form cancelled immediately should NOT trigger this prompt.
