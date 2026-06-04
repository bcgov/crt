---
id: TC-TS-TEND-05
title: Tender cancel with unsaved changes prompt
source_plan: 05-financial-planning
source_scenario: TS-TEND-05
covers_ac: [AC-tender-unsaved-changes]
persona: Application User (MANAGER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@tender", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-TEND-05 — Tender cancel with unsaved changes prompt

## 1. Context
Verifies that cancelling the Add Tender form with unsaved changes triggers the "You have unsaved changes" prompt with "Go Back" and "Leave" options.

**Source**: Test Plan 05, scenario TS-TEND-05 ([CRPDB-113]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project (e.g., project ID 79) accessible from the Tender page.
- **Starting URL**: `${BASE_URL}/projects/79/projecttender`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Tender Number | `CRT-AUTO-CANCEL-T001` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the tender page for project "79"
When  I click the first button "+ Add" in the Project Tender Details section
Then  I see a dialog for adding a tender record

When  I fill the textbox "Tender Number" with "CRT-AUTO-CANCEL-T001"

# Cancel with unsaved data
When  I click the button "Cancel"
Then  I see a dialog with text "You have unsaved changes"
And   I see the button "Go Back" in the dialog
And   I see the button "Leave" in the dialog

# Go Back retains data
When  I click the button "Go Back"
Then  the form is still visible
And   the textbox "Tender Number" contains "CRT-AUTO-CANCEL-T001"

# Cancel again and Leave
When  I click the button "Cancel"
Then  I see a dialog with text "You have unsaved changes"
When  I click the button "Leave"
Then  the form dialog is closed
And   no new entry was added to the tender table
```

## 5. Expected Results
- "You have unsaved changes" prompt appears when cancelling with entered data.
- "Go Back" returns to form with data intact.
- "Leave" closes the form and discards entered data.

## 6. Postconditions / Cleanup
- No data was created; no cleanup required.

## 7. Notes for the Playwright Agent
- The prompt uses exact text "You have unsaved changes" with buttons "Go Back" and "Leave" (per §0.8).
- The prompt should only trigger when data has been entered.
