---
id: TC-TS-USER-14
title: Re-enable inactive user via Disable icon
source_plan: 03-user-management
source_scenario: TS-USER-14
covers_ac: [AC-user-reenable-icon]
persona: Administrator (SYSTEM_ADMIN)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
status: SKIPPED — deferred to future sprint
tags: ["@regression", "@users", "@admin", "@persona-admin", "@deferred"]
last_updated: 2026-06-03
---

# TC-TS-USER-14 — Re-enable inactive user via Disable icon

> **STATUS: SKIPPED** — This test case is documented for traceability but implementation is deferred to a future date.

## 1. Context
Verifies that an inactive user can be re-enabled by clicking the greyed-out Disable icon and removing/extending the End Date.

**Source**: Test Plan 03, scenario TS-USER-14.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` (SYSTEM_ADMIN).
- **Data**: An inactive user exists (past End Date).
- **Starting URL**: `${BASE_URL}/admin/users`

## 3. Test Data
An inactive user.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with SYSTEM_ADMIN role
And   I am on the "Users" management page

When  I search for inactive users
And   I click the greyed-out Disable icon on an inactive user
And   I remove the End Date or set a future End Date
And   I click "Update"

Then  the user access is restored immediately
And   the user appears as Active in search results
```

## 5. Expected Results
- Clicking the greyed icon on inactive user opens re-enable dialog.
- Removing/extending End Date reactivates the user.
- User can log in again after reactivation.

## 6. Postconditions / Cleanup
- Deactivate the user again if it was not a test user.

## 7. Notes for the Playwright Agent
- The Disable icon is greyed-out for inactive users (acts as Enable).
