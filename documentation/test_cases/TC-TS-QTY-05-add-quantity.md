---
id: TC-TS-QTY-05
title: Add Quantity record with Schedule 7 field
source_plan: 05-financial-planning
source_scenario: TS-QTY-05
covers_ac: [AC-add-quantity]
persona: Application User (MANAGER)
priority: High
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@quantities", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-QTY-05 — Add Quantity record with Schedule 7 field

## 1. Context
Verifies that a Quantity record can be added with Forecast, Schedule 7, Actual, and Comment fields. The Schedule 7 field is only available for Quantity records (not Accomplishments).

**Source**: Test Plan 05, scenario TS-QTY-05 ([CRPDB-112]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project (e.g., project ID 79) accessible from the Tender page.
- **Starting URL**: `${BASE_URL}/projects/79/projecttender`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Fiscal Year | `2024/2025` |
| Category | `Quantity` |
| Forecast | `500.250` |
| Schedule 7 | `475.100` |
| Actual | `490.750` |
| Comment | `CRT-AUTO quantity test entry` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the tender page for project "79"

When  I click the second button "+ Add" in the Quantities/Accomplishments section
Then  I see a dialog "Add Quantities and Accomplishments"

When  I select "2024/2025" from the dropdown "Fiscal Year"
And   I select "Quantity" from the dropdown "Quantity or Accomplishment"
Then  I see the field "Schedule 7" in the form

When  I fill the field "Forecast" with "500.250"
And   I fill the field "Schedule 7" with "475.100"
And   I fill the field "Actual" with "490.750"
And   I fill the textarea "Comment" with "CRT-AUTO quantity test entry"
And   I click the button "Submit"

Then  the row containing "2024/2025" appears in the Quantities/Accomplishments table
And   the row shows "Quantity" in the type column
And   the row shows "500.250" in the Forecast column
And   the row shows "475.100" in the Schedule7 column
And   the row shows "490.750" in the Actual column
```

## 5. Expected Results
- The Quantity record is created successfully with all fields.
- The Schedule 7 field IS available when "Quantity" is selected.
- All numeric fields support up to 3 decimal places.
- Values display correctly in the table row.

## 6. Postconditions / Cleanup
- Delete the created Quantity entry using the Delete button.

## 7. Notes for the Playwright Agent
- The Schedule 7 field appears only after selecting "Quantity" from the category dropdown.
- This is the key difference from Accomplishment records (TC-TS-QTY-04).
- Verify the Schedule 7 field is present before filling it.
