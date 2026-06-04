---
id: TC-TS-FIN-05
title: Amount field accepts negative values without decimals
source_plan: 05-financial-planning
source_scenario: TS-FIN-05
covers_ac: [AC-negative-amount]
persona: Application User (MANAGER)
priority: Medium
type: Edge Case
level: E2E
automation_candidate: Yes
tags: ["@regression", "@financial", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-FIN-05 — Amount field accepts negative values without decimals

## 1. Context
Verifies that the Forecasted Amount field on the Financial Planning form accepts negative integer values. Per Sprint 6 rule (§0.8), no decimals are allowed in currency fields.

**Source**: Test Plan 05, scenario TS-FIN-05 ([CRPDB-111]).

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
| Forecasted Amount | `-50000` |
| Element | `Gp-General Paving` |
| Funding Type | `Allocation` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the financial plan page for project "79"
When  I click the button "+ Add"
Then  I see a dialog for adding a financial target

When  I select "2024/2025" from the dropdown "Fiscal Year"
And   I select "P-Plan" from the dropdown "Phase"
And   I fill the currency field "Forecasted Amount" with "-50000"
And   I select "Gp-General Paving" from the dropdown "Element"
And   I select "Allocation" from the dropdown "Funding Type"
And   I click the button "Submit"

Then  the row containing "2024/2025" appears in the Financial Planning Targets table
And   the row shows "-$50,000" or "($50,000)" in the Amount column
```

## 5. Expected Results
- Negative integer values are accepted in the Amount field.
- The entry is saved successfully with the negative amount.
- The negative value displays correctly in the table.

## 6. Postconditions / Cleanup
- Delete the created financial target entry using the Delete Record button.

## 7. Notes for the Playwright Agent
- Currency field may format negative values as "-$50,000" or "($50,000)".
- Verify that decimals are NOT accepted (e.g., "-50000.50" should be rejected or truncated).
- The currency input may use a masked/formatted input — use `.fill()` with just the numeric value.
