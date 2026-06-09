---
id: TC-TS-QTY-06
title: Switch category clears data with confirmation
source_plan: 05-financial-planning
source_scenario: TS-QTY-06
covers_ac: [AC-qty-switch-clear]
persona: Application User (MANAGER)
priority: Medium
type: Edge Case
level: E2E
automation_candidate: Yes
tags: ["@regression", "@quantities", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-QTY-06 — Switch category clears data with confirmation

## 1. Context
Verifies that when a user enters values for one category (e.g., Quantity) and then switches to another category (e.g., Accomplishment), a confirmation prompt appears warning that data will be cleared.

**Source**: Test Plan 05, scenario TS-QTY-06 ([CRPDB-112]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project (e.g., project ID 79) accessible from the Tender page.
- **Starting URL**: `${BASE_URL}/projects/79/projecttender`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Fiscal Year | `2024/2025` |
| Initial Category | `Quantity` |
| Forecast Value | `100.500` |
| Switch To Category | `Accomplishment` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the tender page for project "79"

When  I click the second button "+ Add" in the Quantities/Accomplishments section
Then  I see a dialog "Add Quantities and Accomplishments"

# Enter data for Quantity
When  I select "2024/2025" from the dropdown "Fiscal Year"
And   I select "Quantity" from the dropdown "Quantity or Accomplishment"
And   I fill the field "Forecast" with "100.500"

# Switch to Accomplishment
When  I select "Accomplishment" from the dropdown "Quantity or Accomplishment"
Then  I see a dialog with text "This action will clear any data entered for the previous selection. Continue?"
```

## 5. Expected Results
- A confirmation prompt appears with the exact text: "This action will clear any data entered for the previous selection. Continue?"
- If confirmed, the previously entered data is cleared and the form switches to the new category.
- If cancelled, the category remains unchanged and data is preserved.

## 6. Postconditions / Cleanup
- No data was created (form was not submitted); close the dialog with "Cancel".

## 7. Notes for the Playwright Agent
- The prompt text must be asserted verbatim: "This action will clear any data entered for the previous selection. Continue?"
- The prompt should appear only when data has been entered in the current category's fields.
- After confirming the switch, the Schedule 7 field should disappear (switching from Quantity to Accomplishment).
