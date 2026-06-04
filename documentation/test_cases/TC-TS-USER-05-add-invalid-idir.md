---
id: TC-TS-USER-05
title: Add user with invalid IDIR
source_plan: 03-user-management
source_scenario: TS-USER-05
covers_ac: [AC-user-add-invalid]
persona: Administrator (SYSTEM_ADMIN)
priority: High
type: Negative
level: E2E
automation_candidate: Yes
status: SKIPPED — deferred to future sprint
tags: ["@regression", "@users", "@admin", "@persona-admin", "@deferred"]
last_updated: 2026-06-03
---

# TC-TS-USER-05 — Add user with invalid IDIR

> **STATUS: SKIPPED** — This test case is documented for traceability but implementation is deferred to a future date.

## 1. Context
Verifies that entering an invalid IDIR when adding a user produces an error.

**Source**: Test Plan 03, scenario TS-USER-05.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` (SYSTEM_ADMIN).
- **Starting URL**: `${BASE_URL}/admin/users`

## 3. Test Data

| Field | Value |
|-------|-------|
| IDIR | `{{IDIR_INVALID}}` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with SYSTEM_ADMIN role
And   I am on the "Users" management page

When  I click the button "Add User"
And   I enter "{{IDIR_INVALID}}" in the User ID field
And   I submit the lookup

Then  I see an error "Invalid User ID"
And   the user is not created
```

## 5. Expected Results
- Error message "Invalid User ID" displayed.
- User creation is blocked.

## 6. Postconditions / Cleanup
- None.

## 7. Notes for the Playwright Agent
- The IDIR lookup is validated against the directory.
