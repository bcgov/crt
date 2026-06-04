---
id: TC-TS-USER-03
title: Partial text search for users
source_plan: 03-user-management
source_scenario: TS-USER-03
covers_ac: [AC-user-search-partial]
persona: Administrator (SYSTEM_ADMIN)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
status: SKIPPED — deferred to future sprint
tags: ["@regression", "@users", "@admin", "@persona-admin", "@deferred"]
last_updated: 2026-06-03
---

# TC-TS-USER-03 — Partial text search for users

> **STATUS: SKIPPED** — This test case is documented for traceability but implementation is deferred to a future date.

## 1. Context
Verifies that users can be found by partial First Name, Last Name, or IDIR.

**Source**: Test Plan 03, scenario TS-USER-03.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` (SYSTEM_ADMIN).
- **Data**: Users with known names exist.
- **Starting URL**: `${BASE_URL}/admin/users`

## 3. Test Data

| Search Term | Type |
|-------------|------|
| Partial first name | e.g., `Joh` |
| Partial last name | e.g., `Smi` |
| Partial IDIR | e.g., `JSMI` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with SYSTEM_ADMIN role
And   I am on the "Users" management page

When  I enter "Joh" in the search field
And   I click the button "Search"
Then  users with first name starting with "Joh" appear

When  I clear the search and enter a partial IDIR
And   I click the button "Search"
Then  users with matching IDIR appear
```

## 5. Expected Results
- Partial text matches on First Name, Last Name, and IDIR.
- Results show accurate user information.

## 6. Postconditions / Cleanup
- None.

## 7. Notes for the Playwright Agent
- Search is across multiple fields simultaneously.
