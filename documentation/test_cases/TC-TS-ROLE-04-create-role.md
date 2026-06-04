---
id: TC-TS-ROLE-04
title: Create new role with all permissions
source_plan: 03-user-management
source_scenario: TS-ROLE-04
covers_ac: [AC-role-create]
persona: Administrator (SYSTEM_ADMIN)
priority: High
type: Functional
level: E2E
automation_candidate: Yes
status: SKIPPED — deferred to future sprint
tags: ["@regression", "@roles", "@admin", "@persona-admin", "@deferred"]
last_updated: 2026-06-03
---

# TC-TS-ROLE-04 — Create new role with all permissions

> **STATUS: SKIPPED** — This test case is documented for traceability but implementation is deferred to a future date.

## 1. Context
Verifies that a new role can be created with a name, description, end date, and all permissions.

**Source**: Test Plan 03, scenario TS-ROLE-04.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` (SYSTEM_ADMIN).
- **Starting URL**: `${BASE_URL}/admin/roles`

## 3. Test Data

| Field | Value |
|-------|-------|
| Role Name | `TEST_ADMIN` |
| Description | `Test role with all permissions` |
| End Date | `2027-12-31` |
| Permissions | All available |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with SYSTEM_ADMIN role
And   I am on the "Roles & Permissions" page

When  I click the button "Add Role"
And   I fill the textbox "Role Name" with "TEST_ADMIN"
And   I fill the textbox "Description" with "Test role with all permissions"
And   I set the "End Date" to "2027-12-31"
And   I select all available permissions
And   I click the button "Submit"

Then  the role "TEST_ADMIN" appears in the roles table
And   it shows all permissions assigned
And   the end date is "2027-12-31"
```

## 5. Expected Results
- Role created successfully with all fields.
- Appears in search results with correct details.

## 6. Postconditions / Cleanup
- Delete or disable the "TEST_ADMIN" role.

## 7. Notes for the Playwright Agent
- Permissions are likely checkboxes; select all.
