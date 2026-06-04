---
id: TC-TS-USER-07
title: Prevent duplicate IDIR
source_plan: 03-user-management
source_scenario: TS-USER-07
covers_ac: [AC-user-duplicate]
persona: Administrator (SYSTEM_ADMIN)
priority: High
type: Negative
level: E2E
automation_candidate: Yes
status: SKIPPED — deferred to future sprint
tags: ["@regression", "@users", "@admin", "@persona-admin", "@deferred"]
last_updated: 2026-06-03
---

# TC-TS-USER-07 — Prevent duplicate IDIR

> **STATUS: SKIPPED** — This test case is documented for traceability but implementation is deferred to a future date.

## 1. Context
Verifies that adding a user with an existing IDIR (active or inactive) is rejected with "Username [IDIR] already exists".

**Source**: Test Plan 03, scenario TS-USER-07.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` (SYSTEM_ADMIN).
- **Data**: `{{IDIR_VALID_USER}}` already exists as a user.
- **Starting URL**: `${BASE_URL}/admin/users`

## 3. Test Data

| Field | Value |
|-------|-------|
| IDIR | `{{IDIR_VALID_USER}}` (already exists) |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with SYSTEM_ADMIN role
And   "{{IDIR_VALID_USER}}" already exists as a user

# Attempt duplicate of active user
When  I click "Add User" and enter "{{IDIR_VALID_USER}}"
Then  I see error "Username {{IDIR_VALID_USER}} already exists"

# Make user inactive, attempt again
When  the user is made inactive (past End Date)
And   I click "Add User" and enter "{{IDIR_VALID_USER}}" again
Then  I see error "Username {{IDIR_VALID_USER}} already exists"
And   no duplicate is created
```

## 5. Expected Results
- Duplicate IDIR is rejected whether the existing user is active or inactive.
- Error message includes the IDIR username.

## 6. Postconditions / Cleanup
- Restore user to original state if modified.

## 7. Notes for the Playwright Agent
- Error text format: "Username [IDIR] already exists".
