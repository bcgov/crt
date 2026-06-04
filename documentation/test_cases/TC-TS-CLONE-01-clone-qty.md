---
id: TC-TS-CLONE-01
title: Clone record in Qty/Accomplishment
source_plan: 07-data-maintenance
source_scenario: TS-CLONE-01
covers_ac: [AC-clone-qty]
persona: Application User (APP_USER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@clone", "@quantities", "@persona-user"]
last_updated: 2026-06-03
---

# TC-TS-CLONE-01 — Clone record in Qty/Accomplishment

## 1. Context
Verifies that an existing Qty/Accomplishment record can be cloned, creating a new row with copied data that can be modified before saving.

**Source**: Test Plan 07, scenario TS-CLONE-01.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with project edit permissions.
- **Data**: A project exists with at least one Qty/Accomplishment record.
- **Starting URL**: `${BASE_URL}/projects/{id}/qtyaccmp`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Original | Cloned (Modified) |
|-------|----------|-------------------|
| Fiscal Year | `2024/2025` | `2025/2026` |
| Forecast | `100` | `200` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with project edit permissions
And   I am on the Qty/Accomplishments page for a project with existing records

When  I click the button "Clone Record" on an existing row
Then  a new row appears in the table pre-filled with copied data from the source row

When  I modify the fiscal year on the new row to "2025/2026"
And   I modify the forecast value to "200"
And   I click the button "Submit" on the new row

Then  the new row is saved with the modified values
And   the original row remains unchanged
```

## 5. Expected Results
- Clicking Clone creates a new row with copied data.
- The new row can be modified before saving.
- The original source row is unaffected.

## 6. Postconditions / Cleanup
- Delete the cloned row.

## 7. Notes for the Playwright Agent
- The Clone Record button is per-row in the Actions column.
- The cloned row appears in edit mode with pre-filled values.
