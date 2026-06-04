---
id: TC-TS-USER-11
title: Multiple region assignment
source_plan: 03-user-management
source_scenario: TS-USER-11
covers_ac: [AC-user-multiregion]
persona: Administrator (SYSTEM_ADMIN)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
status: SKIPPED — deferred to future sprint
tags: ["@regression", "@users", "@admin", "@persona-admin", "@deferred"]
last_updated: 2026-06-03
---

# TC-TS-USER-11 — Multiple region assignment

> **STATUS: SKIPPED** — This test case is documented for traceability but implementation is deferred to a future date.

## 1. Context
Verifies that a user can be assigned to multiple MoTI regions, with format `<Code>-<Description>` sorted by code.

**Source**: Test Plan 03, scenario TS-USER-11.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` (SYSTEM_ADMIN).
- **Starting URL**: `${BASE_URL}/admin/users`

## 3. Test Data

| Regions | Format |
|---------|--------|
| 1 - South Coast, 2 - Southern Interior | Code-Description, sorted by code |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with SYSTEM_ADMIN role
And   I am on the "Users" management page

When  I click "Edit" on an existing user
And   I select multiple regions: "1 - South Coast" and "2 - Southern Interior"
And   I click "Submit"

Then  the user is assigned to both regions
And   regions display as "1-South Coast, 2-Southern Interior" (sorted by code)
```

## 5. Expected Results
- Multiple regions can be selected.
- Display format: `<Code>-<Description>`.
- Sorted ascending by code number.

## 6. Postconditions / Cleanup
- Restore user to original region assignment.

## 7. Notes for the Playwright Agent
- Region selector is multi-select.
