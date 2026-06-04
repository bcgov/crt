---
id: TC-TS-USER-13
title: Non-admin cannot see admin tabs
source_plan: 03-user-management
source_scenario: TS-USER-13
covers_ac: [AC-user-nonadmin-hidden]
persona: Non-admin user
priority: High
type: Security
level: E2E
automation_candidate: Yes
status: SKIPPED — deferred to future sprint
tags: ["@regression", "@users", "@security", "@persona-user", "@deferred"]
last_updated: 2026-06-03
---

# TC-TS-USER-13 — Non-admin cannot see admin tabs

> **STATUS: SKIPPED** — This test case is documented for traceability but implementation is deferred to a future date.

## 1. Context
Verifies that non-administrator users cannot see Users and Roles & Permissions tabs.

**Source**: Test Plan 03, scenario TS-USER-13.

## 2. Preconditions
- **User**: Authenticated as a non-administrator (e.g., `{{IDIR_VALID_USER}}` with MANAGER or READ_ONLY role).
- **Starting URL**: `${BASE_URL}/`

## 3. Test Data
None required.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with a non-admin role

Then  the navigation does NOT show "Users" tab
And   the navigation does NOT show "Roles & Permissions" tab
And   navigating directly to "/admin/users" shows access denied or redirects
```

## 5. Expected Results
- Admin navigation tabs are hidden for non-admins.
- Direct URL access is also blocked.

## 6. Postconditions / Cleanup
- None.

## 7. Notes for the Playwright Agent
- Assert absence of admin nav items.
- Also test direct URL access as a security check.
