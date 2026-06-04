---
id: TC-TS-CLONE-02
title: Clone record in Financial Planning
source_plan: 07-data-maintenance
source_scenario: TS-CLONE-02
covers_ac: [AC-clone-financial]
persona: Application User (APP_USER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@clone", "@financial-planning", "@persona-user"]
last_updated: 2026-06-03
---

# TC-TS-CLONE-02 — Clone record in Financial Planning

## 1. Context
Verifies that an existing Financial Planning entry can be cloned, creating a new row with copied data (element, funding type, phase, etc.) that can be modified before saving.

**Source**: Test Plan 07, scenario TS-CLONE-02.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with project edit permissions.
- **Data**: A project exists with at least one Financial Planning entry.
- **Starting URL**: `${BASE_URL}/projects/{id}/projectplan`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Original | Cloned (Modified) |
|-------|----------|-------------------|
| Fiscal Year | `2024/2025` | `2025/2026` |
| Amount | `1000000` | `1500000` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with project edit permissions
And   I am on the Financial Planning page for a project with existing entries

When  I click the button "Clone Record" on an existing financial planning row
Then  a new dialog opens pre-filled with data from the source row (element, funding type, phase, etc.)

When  I change the dropdown "Fiscal Year" to "2025/2026"
And   I change the field "Amount" to "1500000"
And   I click the button "Submit"

Then  the new financial planning entry is saved
And   the table shows the new row with fiscal year "2025/2026" and amount "$1,500,000"
And   the original row remains unchanged
```

## 5. Expected Results
- Clone opens the Add dialog pre-populated with source row data.
- Modifications can be made before submitting.
- Both original and cloned entries exist after save.

## 6. Postconditions / Cleanup
- Delete the cloned financial planning entry.

## 7. Notes for the Playwright Agent
- The "Clone Record" button is per-row in the Financial Planning table.
- Clone opens the same Add/Edit dialog pre-filled with source values.
- Amount displays as currency (no decimals per convention).
