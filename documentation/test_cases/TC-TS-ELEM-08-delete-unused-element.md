---
id: TC-TS-ELEM-08
title: Delete element never used in data entry
source_plan: 07-data-maintenance
source_scenario: TS-ELEM-08
covers_ac: [AC-elem-delete]
persona: Administrator (SYSTEM_ADMIN)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@admin", "@elements", "@persona-admin"]
last_updated: 2026-06-03
---

# TC-TS-ELEM-08 — Delete element never used in data entry

## 1. Context
Verifies that an element that has never been used in data entry can be permanently deleted (shows Delete/trash icon, not Disable).

**Source**: Test Plan 07, scenario TS-ELEM-08.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` with `Code Read` + `Code Write` permissions.
- **Data**: An element exists that has never been used in any financial planning entry (shows Delete/trash icon).
- **Starting URL**: `${BASE_URL}/admin/elements`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data
Create a new element "Zt - CRT-AUTO Delete Test" as setup, then delete it.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with admin permissions
And   I am on the "Elements Management" page
And   an element "Zt" exists that has never been used in data entry

When  I click the button "Delete Record" on the "Zt" element row
Then  I see a confirmation with text "This value will be deleted. Are you sure?"
When  I click the confirm button
Then  the "Zt" element row is no longer visible in the table
And   searching for "Zt" returns no results
```

## 5. Expected Results
- A confirmation prompt appears with the delete warning text.
- After confirming, the element is permanently removed.
- The element cannot be found in Active or Inactive filters.

## 6. Postconditions / Cleanup
- Element is permanently deleted; no cleanup needed.

## 7. Notes for the Playwright Agent
- Per §0.8.1: elements never used show Delete (trash) icon, not Disable.
- The confirmation text is "This value will be deleted. Are you sure?"
- Create a fresh element as setup if no unused element is available for testing.
