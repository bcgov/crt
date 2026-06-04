---
id: TC-TS-USER-06
title: Add user with valid IDIR — auto-populate
source_plan: 03-user-management
source_scenario: TS-USER-06
covers_ac: [AC-user-add-valid]
persona: Administrator (SYSTEM_ADMIN)
priority: High
type: Functional
level: E2E
automation_candidate: Yes
status: SKIPPED — deferred to future sprint
tags: ["@regression", "@users", "@admin", "@persona-admin", "@deferred"]
last_updated: 2026-06-03
---

# TC-TS-USER-06 — Add user with valid IDIR — auto-populate

> **STATUS: SKIPPED** — This test case is documented for traceability but implementation is deferred to a future date.

## 1. Context
Verifies that entering a valid IDIR auto-populates First Name, Last Name, and Email from directory lookup.

**Source**: Test Plan 03, scenario TS-USER-06.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` (SYSTEM_ADMIN).
- **Starting URL**: `${BASE_URL}/admin/users`

## 3. Test Data

| Field | Value |
|-------|-------|
| IDIR | `{{IDIR_VALID_USER}}` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with SYSTEM_ADMIN role
And   I am on the "Users" management page

When  I click the button "Add User"
And   I enter "{{IDIR_VALID_USER}}" in the User ID field
And   I submit the lookup

Then  the form auto-populates:
      | Field      | Value                        |
      | IDIR       | {{IDIR_VALID_USER}}          |
      | First Name | (from directory)             |
      | Last Name  | (from directory)             |
      | Email      | (from directory)             |
```

## 5. Expected Results
- Valid IDIR triggers directory lookup.
- Fields auto-populate with directory information.

## 6. Postconditions / Cleanup
- Cancel the form (do not save if user already exists).

## 7. Notes for the Playwright Agent
- The lookup may be triggered on blur or via a "Lookup" button.
