---
id: TC-TS-ROLE-09
title: Disable role cascading effect on users
source_plan: 03-user-management
source_scenario: TS-ROLE-09
covers_ac: [AC-role-cascade]
persona: Administrator (SYSTEM_ADMIN)
priority: High
type: Edge Case
level: E2E
automation_candidate: Yes
status: SKIPPED — deferred to future sprint
tags: ["@regression", "@roles", "@admin", "@persona-admin", "@security", "@deferred"]
last_updated: 2026-06-03
---

# TC-TS-ROLE-09 — Disable role cascading effect on users

> **STATUS: SKIPPED** — This test case is documented for traceability but implementation is deferred to a future date.

## 1. Context
Verifies that disabling a role removes access for all users assigned to that role.

**Source**: Test Plan 03, scenario TS-ROLE-09.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` (SYSTEM_ADMIN).
- **Data**: A role is assigned to at least one user.
- **Starting URL**: `${BASE_URL}/admin/roles`

## 3. Test Data

| Setup | Value |
|-------|-------|
| Role | `TEST_ROLE_CASCADE` |
| Assigned User | `{{IDIR_TEST_USER}}` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with SYSTEM_ADMIN role
And   the role "TEST_ROLE_CASCADE" is assigned to user "{{IDIR_TEST_USER}}"

When  I disable the role "TEST_ROLE_CASCADE"
Then  the role is disabled

When  I attempt to log in as "{{IDIR_TEST_USER}}"
Then  the user loses application access (cannot access CRT features)
```

## 5. Expected Results
- Disabling a role cascades to all users with that role.
- Affected users lose access to the application.

## 6. Postconditions / Cleanup
- Re-enable the role and verify user access is restored.

## 7. Notes for the Playwright Agent
- Requires multi-user test (admin disables, user tests access).
- May need separate browser context for the affected user.
