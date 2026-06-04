---
id: TC-TS-ROLE-01
title: Admin login succeeds
source_plan: 03-user-management
source_scenario: TS-ROLE-01
covers_ac: [AC-role-admin-login]
persona: Administrator (SYSTEM_ADMIN)
priority: High
type: Functional
level: E2E
automation_candidate: Yes
status: SKIPPED — deferred to future sprint
tags: ["@regression", "@roles", "@admin", "@persona-admin", "@deferred"]
last_updated: 2026-06-03
---

# TC-TS-ROLE-01 — Admin login succeeds

> **STATUS: SKIPPED** — This test case is documented for traceability but implementation is deferred to a future date.

## 1. Context
Verifies that an administrator can log in without error.

**Source**: Test Plan 03, scenario TS-ROLE-01.

## 2. Preconditions
- **User**: `{{IDIR_VALID_ADMIN}}` with SYSTEM_ADMIN role.
- **Starting URL**: CRT login portal.

## 3. Test Data

| Field | Value |
|-------|-------|
| Username | `{{IDIR_VALID_ADMIN}}` |
| Password | `{{PASSWORD_VALID}}` |

## 4. Steps (Gherkin)

```gherkin
Given the browser session is logged out
When  I log in as "{{IDIR_VALID_ADMIN}}"
Then  I am redirected to the CRT home screen without error
And   the admin navigation tabs are visible (Users, Roles & Permissions)
```

## 5. Expected Results
- Admin logs in successfully.
- Admin-specific navigation is visible.

## 6. Postconditions / Cleanup
- None.

## 7. Notes for the Playwright Agent
- Verifies admin-level UI elements are present post-login.
