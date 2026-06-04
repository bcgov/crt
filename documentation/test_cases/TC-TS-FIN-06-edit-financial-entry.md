---
id: TC-TS-FIN-06
title: Edit financial planning entry with negative amount
source_plan: 05-financial-planning
source_scenario: TS-FIN-06
covers_ac: [AC-fin-edit-entry]
persona: Application User (MANAGER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@financial", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-FIN-06 — Edit financial planning entry with negative amount

## 1. Context
Verifies that an existing financial planning entry can be edited, specifically changing the amount to a negative value and having it persist correctly.

**Source**: Test Plan 05, scenario TS-FIN-06 ([CRPDB-111]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project (e.g., project ID 79) with at least one financial planning entry already created.
- **Starting URL**: `${BASE_URL}/projects/79/projectplan`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Original Amount | `100000` |
| New Amount | `-25000` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the financial plan page for project "79"
And   at least one financial target entry exists in the table

When  I click the button "Edit Record" on the first entry row
Then  I see a dialog with the existing entry values pre-filled

When  I clear the currency field "Forecasted Amount"
And   I fill the currency field "Forecasted Amount" with "-25000"
And   I click the button "Submit"

Then  the entry row shows "-$25,000" or "($25,000)" in the Amount column
```

## 5. Expected Results
- The edit dialog opens with pre-filled values from the existing entry.
- The amount can be changed to a negative value.
- After saving, the table reflects the updated negative amount.

## 6. Postconditions / Cleanup
- Revert the amount to its original value using the Edit action.

## 7. Notes for the Playwright Agent
- The Edit Record button has a pencil icon and text "Edit Record".
- The edit dialog is the same form as Add but pre-populated.
- Verify the value updates in the table after submit.
