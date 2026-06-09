---
id: TC-TS-PM-14
title: Permission boundary - Code Read only cannot modify PMs
source_plan: 07-data-maintenance
source_scenario: TS-PM-14
covers_ac: [AC-pm-permission-boundary]
persona: Non-admin (Code Read only)
priority: High
type: Security
level: E2E
automation_candidate: Yes
tags: ["@regression", "@admin", "@codetables", "@project-manager", "@security", "@persona-user"]
last_updated: 2026-06-04
---

# TC-TS-PM-14 — Permission boundary - Code Read only cannot modify PMs

## 1. Context
Verifies that a user with Code Read permission but NOT Code Write cannot add, edit, disable, or delete PMs in the Project Manager code table.

**Source**: Test Plan 07, scenario TS-PM-14.

## 2. Preconditions
- **User**: Authenticated as a user with `Code Read` but NOT `Code Write` permission.
- **Starting URL**: `${BASE_URL}/admin/codetables`

## 3. Test Data
None required.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as a user with "Code Read" but NOT "Code Write" permission
And   I navigate to the "Code Table Management" page
And   I select "Project Manager" from the Code Value Set dropdown

Then  the PM list is displayed (read access works)
And   the "Add New Project Manager" button is NOT visible or is disabled
And   the "Edit" icons on PM rows are NOT visible or are disabled
And   the "Disable" icons on PM rows are NOT visible or are disabled
And   the "Delete" icons on PM rows are NOT visible or are disabled
```

## 5. Expected Results
- PM list is viewable (Code Read works).
- All modification actions (Add, Edit, Disable, Delete) are unavailable.
- No error occurs — actions are simply hidden/disabled.

## 6. Postconditions / Cleanup
- None.

## 7. Notes for the Playwright Agent
- Requires login as a user with limited permissions (not SYSTEM_ADMIN).
- Verify buttons/icons are absent or disabled, not just non-functional.
