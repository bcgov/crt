---
id: TC-TS-ROLE-10
title: System Admin role cannot be disabled
source_plan: 03-user-management
source_scenario: TS-ROLE-10
covers_ac: [AC-role-sysadmin-nodisable]
persona: Administrator (SYSTEM_ADMIN)
priority: High
type: Negative
level: E2E
automation_candidate: Yes
status: SKIPPED — deferred to future sprint
tags: ["@regression", "@roles", "@admin", "@persona-admin", "@security", "@deferred"]
last_updated: 2026-06-03
---

# TC-TS-ROLE-10 — System Admin role cannot be disabled

> **STATUS: SKIPPED** — This test case is documented for traceability but implementation is deferred to a future date.

## 1. Context
Verifies that the SYSTEM_ADMIN role is protected and cannot be disabled.

**Source**: Test Plan 03, scenario TS-ROLE-10.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` (SYSTEM_ADMIN).
- **Starting URL**: `${BASE_URL}/admin/roles`

## 3. Test Data
None required.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with SYSTEM_ADMIN role
And   I am on the "Roles & Permissions" page

When  I attempt to disable the "SYSTEM_ADMIN" role
Then  the system rejects the action
And   the SYSTEM_ADMIN role remains active and unchanged
```

## 5. Expected Results
- Disable action is either hidden or blocked for SYSTEM_ADMIN.
- The role remains active.

## 6. Postconditions / Cleanup
- None.

## 7. Notes for the Playwright Agent
- The Disable icon may be absent or clicking it shows an error.
