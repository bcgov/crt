---
id: TC-TS-ROLE-08
title: Disable role via icon
source_plan: 03-user-management
source_scenario: TS-ROLE-08
covers_ac: [AC-role-disable-icon]
persona: Administrator (SYSTEM_ADMIN)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
status: SKIPPED — deferred to future sprint
tags: ["@regression", "@roles", "@admin", "@persona-admin", "@deferred"]
last_updated: 2026-06-03
---

# TC-TS-ROLE-08 — Disable role via icon

> **STATUS: SKIPPED** — This test case is documented for traceability but implementation is deferred to a future date.

## 1. Context
Verifies that a role can be disabled using the Disable icon in the roles table.

**Source**: Test Plan 03, scenario TS-ROLE-08.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` (SYSTEM_ADMIN).
- **Data**: A test role exists that can be disabled.
- **Starting URL**: `${BASE_URL}/admin/roles`

## 3. Test Data
Test role "TEST_ADMIN".

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with SYSTEM_ADMIN role
And   I am on the "Roles & Permissions" page

When  I click the Disable icon on the role "TEST_ADMIN"
And   I confirm the disable action
Then  the role "TEST_ADMIN" is disabled
And   it no longer appears in the Active filter
```

## 5. Expected Results
- Clicking Disable icon disables the role.
- Role moves to Inactive status.

## 6. Postconditions / Cleanup
- Re-enable or delete the test role.

## 7. Notes for the Playwright Agent
- Similar pattern to code table disable.
