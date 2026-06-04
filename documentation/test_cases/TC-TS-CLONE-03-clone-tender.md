---
id: TC-TS-CLONE-03
title: Clone record in Tender Details
source_plan: 07-data-maintenance
source_scenario: TS-CLONE-03
covers_ac: [AC-clone-tender]
persona: Application User (APP_USER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@clone", "@tender", "@persona-user"]
last_updated: 2026-06-03
---

# TC-TS-CLONE-03 — Clone record in Tender Details

## 1. Context
Verifies that an existing Tender entry can be cloned, creating a new row with copied data (tender number, bid value, contractor, etc.) that can be modified before saving.

**Source**: Test Plan 07, scenario TS-CLONE-03.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with project edit permissions.
- **Data**: A project exists with at least one Tender entry.
- **Starting URL**: `${BASE_URL}/projects/{id}/tender`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Original | Cloned (Modified) |
|-------|----------|-------------------|
| Tender Number | `T-001` | `T-002` |
| Bid Value | `500000` | `750000` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with project edit permissions
And   I am on the Tender Details page for a project with existing tender entries

When  I click the button "Clone Record" on an existing tender row
Then  a new dialog opens pre-filled with data from the source row

When  I change the field "Tender Number" to "T-002"
And   I change the field "Bid Value" to "750000"
And   I click the button "Submit"

Then  the new tender entry is saved
And   the table shows the new row with tender number "T-002" and bid value "$750,000"
And   the original row remains unchanged
```

## 5. Expected Results
- Clone opens the Add dialog pre-populated with source row data.
- Tender number and values can be modified before saving.
- Both original and cloned entries exist after save.

## 6. Postconditions / Cleanup
- Delete the cloned tender entry.

## 7. Notes for the Playwright Agent
- The "Clone Record" button is per-row in the Tender Details table.
- Amounts display as currency (no decimals per convention).
