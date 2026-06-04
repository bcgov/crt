---
id: TC-TS-USER-02
title: Search users by single region
source_plan: 03-user-management
source_scenario: TS-USER-02
covers_ac: [AC-user-search-region]
persona: Administrator (SYSTEM_ADMIN)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
status: SKIPPED — deferred to future sprint
tags: ["@regression", "@users", "@admin", "@persona-admin", "@deferred"]
last_updated: 2026-06-03
---

# TC-TS-USER-02 — Search users by single region

> **STATUS: SKIPPED** — This test case is documented for traceability but implementation is deferred to a future date.

## 1. Context
Verifies that selecting a specific region shows only users in that region.

**Source**: Test Plan 03, scenario TS-USER-02.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` (SYSTEM_ADMIN).
- **Starting URL**: `${BASE_URL}/admin/users`

## 3. Test Data

| Region | Expected |
|--------|----------|
| 1 - South Coast | Only South Coast users |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with SYSTEM_ADMIN role
And   I am on the "Users" management page

When  I select "1 - South Coast" from the region filter
And   I click the button "Search"

Then  only users assigned to "1 - South Coast" are shown
```

## 5. Expected Results
- Single region filter works correctly.
- No users from other regions appear.

## 6. Postconditions / Cleanup
- None.

## 7. Notes for the Playwright Agent
- Verify all result rows show the selected region.
