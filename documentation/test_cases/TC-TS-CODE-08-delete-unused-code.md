---
id: TC-TS-CODE-08
title: Delete active unused code value
source_plan: 07-data-maintenance
source_scenario: TS-CODE-08
covers_ac: [AC-code-delete]
persona: Administrator (SYSTEM_ADMIN)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@admin", "@codetables", "@persona-admin"]
last_updated: 2026-06-03
---

# TC-TS-CODE-08 — Delete active unused code value

## 1. Context
Verifies that an active code value that has never been used can be permanently deleted via the Delete (trash) icon with confirmation.

**Source**: Test Plan 07, scenario TS-CODE-08.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` with `Code Read` + `Code Write` permissions.
- **Data**: An active code value exists that has never been used (shows Delete/trash icon). Create "CRT-AUTO-DEL" as setup if needed.
- **Starting URL**: `${BASE_URL}/admin/codetables`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Code Value | `CRT-AUTO-DEL` |
| Code Name | `CRT Auto Delete Test` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with admin permissions
And   I am on the "Code Table Management" page
And   an unused code value "CRT-AUTO-DEL" exists (shows trash icon)

When  I hover over the Delete icon on "CRT-AUTO-DEL" row
Then  I see a tooltip "Delete record"

When  I click the button "Delete Record" on that row
Then  I see a confirmation prompt "This value will be deleted. Are you sure?"
When  I click the confirm button
Then  the "CRT-AUTO-DEL" row is no longer visible in the table
And   searching for "CRT-AUTO-DEL" returns no results
```

## 5. Expected Results
- The Delete icon shows tooltip "Delete record" on hover.
- Clicking triggers confirmation with text "This value will be deleted. Are you sure?"
- After confirm, the code value is permanently deleted.

## 6. Postconditions / Cleanup
- Code value permanently deleted; no cleanup required.

## 7. Notes for the Playwright Agent
- Unused values show Delete (trash) icon, not Disable.
- Tooltip: "Delete record".
- Confirmation text: "This value will be deleted. Are you sure?"
