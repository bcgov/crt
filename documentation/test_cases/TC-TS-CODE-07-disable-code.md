---
id: TC-TS-CODE-07
title: Disable active used code value
source_plan: 07-data-maintenance
source_scenario: TS-CODE-07
covers_ac: [AC-code-disable]
persona: Administrator (SYSTEM_ADMIN)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@admin", "@codetables", "@persona-admin"]
last_updated: 2026-06-03
---

# TC-TS-CODE-07 — Disable active used code value

## 1. Context
Verifies that an active code value that is in use can be disabled via the Disable icon with confirmation.

**Source**: Test Plan 07, scenario TS-CODE-07.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` with `Code Read` + `Code Write` permissions.
- **Data**: An active code value exists that has been used in data entry (shows Disable icon).
- **Starting URL**: `${BASE_URL}/admin/codetables`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data
A code value known to be used in data entry (e.g., one of the default Accomplishment entries).

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with admin permissions
And   I am on the "Code Table Management" page
And   a code value exists that is in use (shows Disable icon)

When  I hover over the Disable icon on the used code value row
Then  I see a tooltip "Disable record"

When  I click the button "Disable Record" on that row
Then  I see a confirmation prompt "This value will be disabled. Are you sure?"
When  I click the confirm button
Then  the code value row is removed from the Active table view
```

## 5. Expected Results
- The Disable icon shows tooltip "Disable record" on hover.
- Clicking triggers confirmation with exact text "This value will be disabled. Are you sure?"
- After confirm, the value is disabled and removed from Active view.

## 6. Postconditions / Cleanup
- Re-enable the disabled code value (see TS-CODE-09).

## 7. Notes for the Playwright Agent
- Used values show Disable icon (not trash/Delete).
- Tooltip: "Disable record".
- Confirmation text: "This value will be disabled. Are you sure?"
