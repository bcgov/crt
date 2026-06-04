---
id: TC-TS-ROLE-02
title: Search roles with partial name
source_plan: 03-user-management
source_scenario: TS-ROLE-02
covers_ac: [AC-role-search]
persona: Administrator (SYSTEM_ADMIN)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
status: SKIPPED — deferred to future sprint
tags: ["@regression", "@roles", "@admin", "@persona-admin", "@deferred"]
last_updated: 2026-06-03
---

# TC-TS-ROLE-02 — Search roles with partial name

> **STATUS: SKIPPED** — This test case is documented for traceability but implementation is deferred to a future date.

## 1. Context
Verifies that roles can be searched by partial name and that Active is the default filter.

**Source**: Test Plan 03, scenario TS-ROLE-02.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` (SYSTEM_ADMIN).
- **Data**: Default roles seeded (SYSTEM_ADMIN, DISTRICT_ADMIN, MANAGER, READ_ONLY).
- **Starting URL**: `${BASE_URL}/admin/roles`

## 3. Test Data

| Field | Value |
|-------|-------|
| Search term | `DIST` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with SYSTEM_ADMIN role
When  I navigate to "Roles & Permissions"
Then  the Active filter is selected by default

When  I enter "DIST" in the search field
And   I click the button "Search"
Then  the role "DISTRICT_ADMIN" appears in the results
```

## 5. Expected Results
- Partial name search finds matching roles.
- Active is the default filter.

## 6. Postconditions / Cleanup
- None.

## 7. Notes for the Playwright Agent
- Roles page at `/admin/roles`.
