---
id: TC-TS-USER-12
title: Verify search results columns
source_plan: 03-user-management
source_scenario: TS-USER-12
covers_ac: [AC-user-columns]
persona: Administrator (SYSTEM_ADMIN)
priority: Low
type: Functional
level: E2E
automation_candidate: Yes
status: SKIPPED — deferred to future sprint
tags: ["@regression", "@users", "@admin", "@persona-admin", "@deferred"]
last_updated: 2026-06-03
---

# TC-TS-USER-12 — Verify search results columns

> **STATUS: SKIPPED** — This test case is documented for traceability but implementation is deferred to a future date.

## 1. Context
Verifies that user search results display all required columns.

**Source**: Test Plan 03, scenario TS-USER-12.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` (SYSTEM_ADMIN).
- **Starting URL**: `${BASE_URL}/admin/users`

## 3. Test Data
None required.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with SYSTEM_ADMIN role
And   I am on the "Users" management page

When  I perform a user search
Then  the results table displays the following columns:
      | Column      |
      | First Name  |
      | Last Name   |
      | User ID     |
      | Email       |
      | Region      |
      | Status      |
      | Edit icon   |
      | Disable icon|
```

## 5. Expected Results
- All specified columns are visible in search results.
- Edit and Disable icons appear as action columns.

## 6. Postconditions / Cleanup
- None.

## 7. Notes for the Playwright Agent
- Verify table header text/structure.
