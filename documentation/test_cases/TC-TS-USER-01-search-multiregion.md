---
id: TC-TS-USER-01
title: Search users by multiple regions
source_plan: 03-user-management
source_scenario: TS-USER-01
covers_ac: [AC-user-search-multiregion]
persona: Administrator (SYSTEM_ADMIN)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
status: SKIPPED — deferred to future sprint
tags: ["@regression", "@users", "@admin", "@persona-admin", "@deferred"]
last_updated: 2026-06-03
---

# TC-TS-USER-01 — Search users by multiple regions

> **STATUS: SKIPPED** — This test case is documented for traceability but implementation is deferred to a future date.

## 1. Context
Verifies that users can be searched by selecting multiple MoTI regions.

**Source**: Test Plan 03, scenario TS-USER-01.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` (SYSTEM_ADMIN).
- **Data**: At least one user per region.
- **Starting URL**: `${BASE_URL}/admin/users`

## 3. Test Data

| Regions Selected | Expected |
|-----------------|----------|
| 1-South Coast, 2-Southern Interior | Users from both regions |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with SYSTEM_ADMIN role
And   I am on the "Users" management page

When  I select "1 - South Coast" from the region filter
And   I select "2 - Southern Interior" from the region filter
And   I click the button "Search"

Then  users from both regions are listed
And   regions display as "0-HQ", "1-South Coast", "2-Southern Interior", "3-Northern"
```

## 5. Expected Results
- Multi-region selection is supported.
- Results include users from all selected regions.
- Region display format: `<Code>-<Description>`.

## 6. Postconditions / Cleanup
- None.

## 7. Notes for the Playwright Agent
- Region filter supports multi-select.
