---
id: TC-TS-SEG-06
title: Delete segment with confirmation
source_plan: 06-spatial-segments-ratios
source_scenario: TS-SEG-06
covers_ac: [AC-delete-segment]
persona: Application User (MANAGER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@segments", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-SEG-06 — Delete segment with confirmation

## 1. Context
Verifies that deleting a segment requires confirmation via an "Are you sure?" prompt. Canceling retains the segment; confirming removes it.

**Source**: Test Plan 06, scenario TS-SEG-06 ([CRPDB-162]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project (e.g., project ID 79) with at least one segment.
- **Starting URL**: `${BASE_URL}/projects/79/segments`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data
A pre-existing segment in the table.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the segments page for project "79"
And   at least one segment exists in the table

# Attempt delete and cancel
When  I click the button "Delete Record" on a segment row
Then  I see a dialog with text "Are you sure?"
When  I click the button "Cancel"
Then  the segment row is still visible in the table

# Attempt delete and confirm
When  I click the button "Delete Record" on the same segment row
Then  I see a dialog with text "Are you sure?"
When  I click the confirm button in the dialog
Then  the segment row is no longer visible in the table
```

## 5. Expected Results
- Clicking Delete shows an "Are you sure?" confirmation prompt.
- Cancel dismisses the prompt and retains the segment.
- Confirming removes the segment from the table.

## 6. Postconditions / Cleanup
- If a test-critical segment was deleted, re-create it.

## 7. Notes for the Playwright Agent
- The "Delete Record" button has a trash icon per exploration docs.
- The confirmation uses exact text "Are you sure?" (per §0.8 conventions).
