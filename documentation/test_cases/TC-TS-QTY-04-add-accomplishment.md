---
id: TC-TS-QTY-04
title: Add Accomplishment record with 3 decimal precision
source_plan: 05-financial-planning
source_scenario: TS-QTY-04
covers_ac: [AC-add-accomplishment]
persona: Application User (MANAGER)
priority: High
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@quantities", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-QTY-04 — Add Accomplishment record with 3 decimal precision

## 1. Context
Verifies that an Accomplishment record can be added with Forecast, Actual, and Comment fields, and that numeric values support up to 3 decimal places precision.

**Source**: Test Plan 05, scenario TS-QTY-04 ([CRPDB-112]).

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
| Forecast | `12.345` |
| Actual | `11.678` |
| Comment | `CRT-AUTO accomplishment test entry` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the tender page for project "79"

When  I click the second button "+ Add" in the Quantities/Accomplishments section
Then  I see a dialog "Add Quantities and Accomplishments"

When  I select "2024/2025" from the dropdown "Fiscal Year"
And   I select "Accomplishment" from the dropdown "Quantity or Accomplishment"
And   I fill the field "Forecast" with "12.345"
And   I fill the field "Actual" with "11.678"
And   I fill the textarea "Comment" with "CRT-AUTO accomplishment test entry"
And   I click the button "Submit"

Then  the row containing "2024/2025" appears in the Quantities/Accomplishments table
And   the row shows "Accomplishment" in the type column
And   the row shows "12.345" in the Forecast column
And   the row shows "11.678" in the Actual column
And   the row shows "CRT-AUTO accomplishment test entry" in the Comment column
```

## 5. Expected Results
- The Accomplishment record is created successfully.
- Forecast and Actual fields accept values with up to 3 decimal places.
- The Schedule 7 field is NOT present for Accomplishment records.
- All values display correctly in the table.

## 6. Postconditions / Cleanup
- Delete the created Accomplishment entry using the Delete button.

## 7. Notes for the Playwright Agent
- The "+ Add" button for Qty/Accmp is the SECOND "+ Add" button on the Tender page (the first is for tender records).
- After selecting "Accomplishment" from the category dropdown, additional fields (Forecast, Actual, Comment) appear.
- The Schedule 7 field should NOT appear for Accomplishments.
- Numeric precision: up to 3 decimal places (per §0.8).
