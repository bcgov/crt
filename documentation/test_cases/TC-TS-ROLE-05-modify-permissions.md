---
id: TC-TS-ROLE-05
title: Modify role permissions
source_plan: 03-user-management
source_scenario: TS-ROLE-05
covers_ac: [AC-role-modify]
persona: Administrator (SYSTEM_ADMIN)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
status: SKIPPED — deferred to future sprint
tags: ["@regression", "@roles", "@admin", "@persona-admin", "@deferred"]
last_updated: 2026-06-03
---

# TC-TS-ROLE-05 — Modify role permissions

> **STATUS: SKIPPED** — This test case is documented for traceability but implementation is deferred to a future date.

## 1. Context
Verifies that permissions can be added/removed from an existing role.

**Source**: Test Plan 03, scenario TS-ROLE-05.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` (SYSTEM_ADMIN).
- **Data**: A test role "TEST_ADMIN" exists with all permissions.
- **Starting URL**: `${BASE_URL}/admin/roles`

## 3. Test Data

| Action | Permission |
|--------|-----------|
| Remove | Code Write |
| Add back | Code Write |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with SYSTEM_ADMIN role
And   I am on the "Roles & Permissions" page

When  I click "Edit" on the role "TEST_ADMIN"
And   I uncheck the permission "Code Write"
And   I click the button "Submit"
Then  the role "TEST_ADMIN" no longer has "Code Write" permission

When  I click "Edit" on the role "TEST_ADMIN"
And   I check the permission "Code Write"
And   I click the button "Submit"
Then  the role "TEST_ADMIN" has "Code Write" permission again
```

## 5. Expected Results
- Permissions can be toggled on/off for existing roles.
- Changes are persisted.

## 6. Postconditions / Cleanup
- Ensure role is in original state.

## 7. Notes for the Playwright Agent
- Permissions are checkboxes in the edit dialog.
