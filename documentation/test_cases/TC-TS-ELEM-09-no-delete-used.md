---
id: TC-TS-ELEM-09
title: Cannot delete element used in data entry
source_plan: 07-data-maintenance
source_scenario: TS-ELEM-09
covers_ac: [AC-elem-no-delete-used]
persona: Administrator (SYSTEM_ADMIN)
priority: Medium
type: Negative
level: E2E
automation_candidate: Yes
tags: ["@regression", "@admin", "@elements", "@persona-admin"]
last_updated: 2026-06-03
---

# TC-TS-ELEM-09 — Cannot delete element used in data entry

## 1. Context
Verifies that an element already referenced in financial planning entries does not show the Delete icon — only the Disable icon is available.

**Source**: Test Plan 07, scenario TS-ELEM-09.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` with `Code Read` + `Code Write` permissions.
- **Data**: An element exists that is referenced in at least one financial planning entry.
- **Starting URL**: `${BASE_URL}/admin/elements`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data
An element known to be used in financial planning (e.g., "Gp - General Paving").

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with admin permissions
And   I am on the "Elements Management" page

When  I locate the row for an element used in financial planning entries
Then  I see the button "Disable Record" on that row
And   I do not see the button "Delete Record" on that row
```

## 5. Expected Results
- The Delete (trash) icon is NOT shown for elements used in data entry.
- Only the Disable icon is available.
- This enforces referential integrity.

## 6. Postconditions / Cleanup
- No data was created; no cleanup required.

## 7. Notes for the Playwright Agent
- Per §0.8.1: used elements → Disable only; unused elements → Delete only.
- Assert absence of "Delete Record" button on the specific row.
