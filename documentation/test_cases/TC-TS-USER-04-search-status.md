---
id: TC-TS-USER-04
title: Search by status (Active/Inactive/All)
source_plan: 03-user-management
source_scenario: TS-USER-04
covers_ac: [AC-user-search-status]
persona: Administrator (SYSTEM_ADMIN)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
status: SKIPPED — deferred to future sprint
tags: ["@regression", "@users", "@admin", "@persona-admin", "@deferred"]
last_updated: 2026-06-03
---

# TC-TS-USER-04 — Search by status (Active/Inactive/All)

> **STATUS: SKIPPED** — This test case is documented for traceability but implementation is deferred to a future date.

## 1. Context
Verifies that the status filter works for Active, Inactive, and All users.

**Source**: Test Plan 03, scenario TS-USER-04.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` (SYSTEM_ADMIN).
- **Data**: Both active and inactive users exist.
- **Starting URL**: `${BASE_URL}/admin/users`

## 3. Test Data
None required.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with SYSTEM_ADMIN role
And   I am on the "Users" management page

When  I select "Active" from the status filter and search
Then  only active users are displayed

When  I select "Inactive" from the status filter and search
Then  only inactive users are displayed

When  I select "All" from the status filter and search
Then  both active and inactive users are displayed
```

## 5. Expected Results
- Each filter correctly shows the appropriate users.
- "All" combines both active and inactive.

## 6. Postconditions / Cleanup
- None.

## 7. Notes for the Playwright Agent
- Status filter has three options: Active, Inactive, All.
