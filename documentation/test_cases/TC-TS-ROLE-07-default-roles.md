---
id: TC-TS-ROLE-07
title: Verify default roles match requirements
source_plan: 03-user-management
source_scenario: TS-ROLE-07
covers_ac: [AC-role-defaults]
persona: Administrator (SYSTEM_ADMIN)
priority: High
type: Functional
level: E2E
automation_candidate: Yes
status: SKIPPED — deferred to future sprint
tags: ["@regression", "@roles", "@admin", "@persona-admin", "@deferred"]
last_updated: 2026-06-03
---

# TC-TS-ROLE-07 — Verify default roles match requirements

> **STATUS: SKIPPED** — This test case is documented for traceability but implementation is deferred to a future date.

## 1. Context
Verifies that the four default seeded roles (SYSTEM_ADMIN, DISTRICT_ADMIN, MANAGER, READ_ONLY) have the correct permissions as per requirements.

**Source**: Test Plan 03, scenario TS-ROLE-07.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` (SYSTEM_ADMIN).
- **Data**: Default roles seeded.
- **Starting URL**: `${BASE_URL}/admin/roles`

## 3. Test Data
Expected permissions per role (from requirements documentation).

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with SYSTEM_ADMIN role
And   I am on the "Roles & Permissions" page

When  I view the permissions for "SYSTEM_ADMIN"
Then  it has all permissions assigned

When  I view the permissions for "DISTRICT_ADMIN"
Then  it has the expected subset of permissions per requirements

When  I view the permissions for "MANAGER"
Then  it has the expected subset of permissions per requirements

When  I view the permissions for "READ_ONLY"
Then  it has read-only permissions only
```

## 5. Expected Results
- Each default role has its documented permission set.
- No extra or missing permissions.

## 6. Postconditions / Cleanup
- None; read-only verification.

## 7. Notes for the Playwright Agent
- Requires reference to requirements doc for expected permission matrix.
