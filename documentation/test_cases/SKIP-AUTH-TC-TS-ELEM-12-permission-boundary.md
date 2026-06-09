---
id: TC-TS-ELEM-12
title: Permission boundary — Code Read only cannot modify
source_plan: 07-data-maintenance
source_scenario: TS-ELEM-12
covers_ac: [AC-elem-permission-boundary]
persona: Application User (READ_ONLY with Code Read)
priority: High
type: Security
level: E2E
automation_candidate: Yes
tags: ["@regression", "@admin", "@elements", "@persona-readonly", "@security"]
last_updated: 2026-06-03
---

# TC-TS-ELEM-12 — Permission boundary — Code Read only cannot modify

## 1. Context
Verifies that a user with Code Read but NOT Code Write can view the Elements screen but cannot add, edit, disable, or delete elements.

**Source**: Test Plan 07, scenario TS-ELEM-12.

## 2. Preconditions
- **User**: Authenticated with a role that has `Code Read` but NOT `Code Write`.
- **Starting URL**: `${BASE_URL}/admin/elements`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data
None required.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in with a role having "Code Read" but NOT "Code Write"
And   I am on the "Elements Management" page

Then  the elements table is visible with data
And   I do not see the button "Add New Element"
And   I do not see any "Edit Record" buttons in the table rows
And   I do not see any "Delete Record" buttons in the table rows
And   I do not see any "Disable Record" buttons in the table rows
```

## 5. Expected Results
- The Elements page loads and displays element data (read access works).
- No modification actions are available (Add, Edit, Disable, Delete buttons are absent).

## 6. Postconditions / Cleanup
- No data was created; no cleanup required.

## 7. Notes for the Playwright Agent
- This requires a specific test user with Code Read but not Code Write.
- Assert hidden/absent state for all action buttons.
