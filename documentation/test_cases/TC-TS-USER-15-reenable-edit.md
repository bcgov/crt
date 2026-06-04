---
id: TC-TS-USER-15
title: Re-enable inactive user via Edit
source_plan: 03-user-management
source_scenario: TS-USER-15
covers_ac: [AC-user-reenable-edit]
persona: Administrator (SYSTEM_ADMIN)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
status: SKIPPED — deferred to future sprint
tags: ["@regression", "@users", "@admin", "@persona-admin", "@deferred"]
last_updated: 2026-06-03
---

# TC-TS-USER-15 — Re-enable inactive user via Edit

> **STATUS: SKIPPED** — This test case is documented for traceability but implementation is deferred to a future date.

## 1. Context
Verifies that an inactive user can be re-enabled via the Edit icon by removing or extending the End Date.

**Source**: Test Plan 03, scenario TS-USER-15.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` (SYSTEM_ADMIN).
- **Data**: An inactive user exists.
- **Starting URL**: `${BASE_URL}/admin/users`

## 3. Test Data
An inactive user.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with SYSTEM_ADMIN role
And   I am on the "Users" management page

When  I search for inactive users
And   I click the "Edit" icon on an inactive user
And   I remove the End Date or provide a future End Date
And   I click "Submit"

Then  the user access is restored
And   the user can log in again
```

## 5. Expected Results
- Edit allows modifying End Date to reactivate.
- User is immediately restored to Active status.

## 6. Postconditions / Cleanup
- Deactivate the user again if it was not a test user.

## 7. Notes for the Playwright Agent
- Same outcome as TS-USER-14 but via the Edit icon instead.
