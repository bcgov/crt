---
id: TC-TS-USER-09
title: Only System Admin can assign System Admin role
source_plan: 03-user-management
source_scenario: TS-USER-09
covers_ac: [AC-user-sysadmin-assign]
persona: Non-admin user
priority: High
type: Security
level: E2E
automation_candidate: Yes
status: SKIPPED — deferred to future sprint
tags: ["@regression", "@users", "@security", "@persona-admin", "@deferred"]
last_updated: 2026-06-03
---

# TC-TS-USER-09 — Only System Admin can assign System Admin role

> **STATUS: SKIPPED** — This test case is documented for traceability but implementation is deferred to a future date.

## 1. Context
Verifies that a non-system admin user cannot assign the System Admin role to any user.

**Source**: Test Plan 03, scenario TS-USER-09.

## 2. Preconditions
- **User**: Authenticated as a non-system-admin (e.g., DISTRICT_ADMIN).
- **Starting URL**: `${BASE_URL}/admin/users`

## 3. Test Data
None required.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as a user with DISTRICT_ADMIN role (not SYSTEM_ADMIN)
And   I am on the "Users" management page

When  I attempt to edit a user and assign the "SYSTEM_ADMIN" role
Then  the SYSTEM_ADMIN role is not available for selection
Or    the system rejects the assignment with an error
```

## 5. Expected Results
- Non-system admins cannot assign SYSTEM_ADMIN role.
- The role is either hidden or the assignment is rejected.

## 6. Postconditions / Cleanup
- None.

## 7. Notes for the Playwright Agent
- Requires login as non-SYSTEM_ADMIN user with admin access.
