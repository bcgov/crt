---
id: TC-TS-QTY-08
title: Delete Qty/Accmp record with Are you sure prompt
source_plan: 05-financial-planning
source_scenario: TS-QTY-08
covers_ac: [AC-qty-delete]
persona: Application User (MANAGER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@quantities", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-QTY-08 — Delete Qty/Accmp record with "Are you sure?" prompt

## 1. Context
Verifies that deleting a Quantity/Accomplishment record requires confirmation via an "Are you sure?" prompt. Canceling retains the record; confirming removes it.

**Source**: Test Plan 05, scenario TS-QTY-08 ([CRPDB-112]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project (e.g., project ID 79) with at least one Qty/Accmp entry.
- **Starting URL**: `${BASE_URL}/projects/79/projecttender`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data
A pre-existing Qty/Accmp entry in the table (or create one as a setup step).

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the tender page for project "79"
And   at least one Quantities/Accomplishments entry exists

# Attempt delete and cancel
When  I click the button "Delete Record" on a Qty/Accmp entry row
Then  I see a dialog with text "Are you sure?"
When  I click the button "Cancel"
Then  the entry row is still visible in the table

# Attempt delete and confirm
When  I click the button "Delete Record" on the same entry row
Then  I see a dialog with text "Are you sure?"
When  I click the confirm button in the dialog
Then  the entry row is no longer visible in the table
```

## 5. Expected Results
- Clicking Delete shows an "Are you sure?" confirmation prompt.
- Clicking Cancel dismisses the prompt and retains the record.
- Clicking the confirm/delete button removes the record from the table.

## 6. Postconditions / Cleanup
- If a test-created entry was deleted, no further cleanup needed.

## 7. Notes for the Playwright Agent
- The delete confirmation uses the exact text "Are you sure?" (per §0.8 conventions).
- The confirm button text may be "Delete" or "OK" — verify in the dialog.
