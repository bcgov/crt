---
id: TC-TS-FIN-07
title: Delete financial planning entry with confirmation
source_plan: 05-financial-planning
source_scenario: TS-FIN-07
covers_ac: [AC-fin-delete-entry]
persona: Application User (MANAGER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@financial", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-FIN-07 — Delete financial planning entry with confirmation

## 1. Context
Verifies that deleting a financial planning entry requires confirmation via an "Are you sure?" prompt. Canceling the prompt retains the record; confirming removes it.

**Source**: Test Plan 05, scenario TS-FIN-07 ([CRPDB-111]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project (e.g., project ID 79) with at least one financial planning entry.
- **Starting URL**: `${BASE_URL}/projects/79/projectplan`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data
A pre-existing financial target entry in the table (or create one as a setup step).

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the financial plan page for project "79"
And   at least one financial target entry exists in the table

# Attempt delete and cancel
When  I click the button "Delete Record" on an entry row
Then  I see a dialog with text "Are you sure?"
And   I see the button "Cancel" in the dialog
And   I see a confirm/delete button in the dialog

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
- Clicking the confirm button removes the record from the table.

## 6. Postconditions / Cleanup
- If a test-created entry was deleted, no further cleanup needed.
- If an existing entry was deleted, re-create it.

## 7. Notes for the Playwright Agent
- The delete confirmation uses the exact text "Are you sure?" (per §0.8 conventions).
- The Delete Record button has a trash icon.
- After deletion, the Total Project Funding should recalculate.
