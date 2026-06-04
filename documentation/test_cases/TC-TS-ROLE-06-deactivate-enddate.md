---
id: TC-TS-ROLE-06
title: Deactivate role via end date
source_plan: 03-user-management
source_scenario: TS-ROLE-06
covers_ac: [AC-role-deactivate]
persona: Administrator (SYSTEM_ADMIN)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
status: SKIPPED — deferred to future sprint
tags: ["@regression", "@roles", "@admin", "@persona-admin", "@deferred"]
last_updated: 2026-06-03
---

# TC-TS-ROLE-06 — Deactivate role via end date

> **STATUS: SKIPPED** — This test case is documented for traceability but implementation is deferred to a future date.

## 1. Context
Verifies that setting a past End Date deactivates a role and it appears under Inactive filter.

**Source**: Test Plan 03, scenario TS-ROLE-06.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` (SYSTEM_ADMIN).
- **Data**: A test role exists.
- **Starting URL**: `${BASE_URL}/admin/roles`

## 3. Test Data

| Field | Value |
|-------|-------|
| End Date | `2020-01-01` (past date) |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with SYSTEM_ADMIN role
And   I am on the "Roles & Permissions" page

When  I click "Edit" on the role "TEST_ADMIN"
And   I set the "End Date" to "2020-01-01"
And   I click the button "Submit"

When  I switch the filter to "Inactive"
And   I click "Search"
Then  the role "TEST_ADMIN" appears in the Inactive results
```

## 5. Expected Results
- Setting a past End Date deactivates the role.
- The role appears in Inactive filter results.

## 6. Postconditions / Cleanup
- Remove the End Date to reactivate, or delete the test role.

## 7. Notes for the Playwright Agent
- End Date in the past = inactive role.
