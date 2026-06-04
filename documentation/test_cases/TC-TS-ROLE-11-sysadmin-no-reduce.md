---
id: TC-TS-ROLE-11
title: System Admin role permissions cannot be removed
source_plan: 03-user-management
source_scenario: TS-ROLE-11
covers_ac: [AC-role-sysadmin-noedit]
persona: Administrator (SYSTEM_ADMIN)
priority: High
type: Negative
level: E2E
automation_candidate: Yes
status: SKIPPED — deferred to future sprint
tags: ["@regression", "@roles", "@admin", "@persona-admin", "@security", "@deferred"]
last_updated: 2026-06-03
---

# TC-TS-ROLE-11 — System Admin role permissions cannot be removed

> **STATUS: SKIPPED** — This test case is documented for traceability but implementation is deferred to a future date.

## 1. Context
Verifies that permissions cannot be removed from the SYSTEM_ADMIN role.

**Source**: Test Plan 03, scenario TS-ROLE-11.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` (SYSTEM_ADMIN).
- **Starting URL**: `${BASE_URL}/admin/roles`

## 3. Test Data
None required.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with SYSTEM_ADMIN role
And   I am on the "Roles & Permissions" page

When  I click "Edit" on the "SYSTEM_ADMIN" role
And   I attempt to uncheck a permission
And   I click the button "Submit"

Then  the system prevents saving SYSTEM_ADMIN with reduced permissions
And   the SYSTEM_ADMIN role retains all permissions
```

## 5. Expected Results
- System rejects removing permissions from SYSTEM_ADMIN.
- An error message or disabled checkboxes prevent the change.

## 6. Postconditions / Cleanup
- None.

## 7. Notes for the Playwright Agent
- Checkboxes may be disabled, or submit fails with validation error.
