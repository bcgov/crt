---
id: TC-TS-FIN-02
title: Add financial planning entry with all fields
source_plan: 05-financial-planning
source_scenario: TS-FIN-02
covers_ac: [AC-fin-add-entry]
persona: Application User (MANAGER)
priority: High
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@financial", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-FIN-02 — Add financial planning entry with all fields

## 1. Context
Verifies that a user can add a financial planning target entry with all required and optional fields (Fiscal Year, Phase, Element, Funding Type, Amount, Description) and that mandatory fields are validated.

**Source**: Test Plan 05, scenario TS-FIN-02 ([CRPDB-111]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project (e.g., project ID 79) with the Financial Plan screen accessible.
- **Starting URL**: `${BASE_URL}/projects/79/projectplan`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Fiscal Year | `2024/2025` |
| Phase | `P-Plan` |
| Forecasted Amount | `500000` |
| Element | `Gp-General Paving` |
| Funding Type | `Allocation` |
| Description | `CRT-AUTO financial target test entry` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the financial plan page for project "79"
When  I click the button "+ Add"
Then  I see a dialog for adding a financial target

When  I select "2024/2025" from the dropdown "Fiscal Year"
And   I select "P-Plan" from the dropdown "Phase"
And   I fill the currency field "Forecasted Amount" with "500000"
And   I select "Gp-General Paving" from the dropdown "Element"
And   I select "Allocation" from the dropdown "Funding Type"
And   I fill the textarea "Description" with "CRT-AUTO financial target test entry"
And   I click the button "Submit"

Then  the row containing "2024/2025" appears in the Financial Planning Targets table
And   the row shows "P-Plan" in the Phase column
And   the row shows "$500,000" in the Amount column
And   the row shows "Gp" in the Element column
And   the row shows "Allocation" in the Funding Type column
```

## 5. Expected Results
- The financial target entry is created successfully.
- All field values appear correctly in the table row.
- The amount displays as formatted currency ($500,000) without decimals.

## 6. Postconditions / Cleanup
- Delete the created financial target entry using the Delete Record button.

## 7. Notes for the Playwright Agent
- The "+ Add" button opens a modal dialog.
- The Submit button is disabled until required fields (Fiscal Year at minimum) are filled.
- Currency fields accept integers only (no decimals per Sprint 6 rule).
- After submission, verify the new row appears in the table.
