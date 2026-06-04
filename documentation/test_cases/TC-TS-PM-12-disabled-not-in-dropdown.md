---
id: TC-TS-PM-12
title: Disabled PM not in Project Details dropdown
source_plan: 07-data-maintenance
source_scenario: TS-PM-12
covers_ac: [AC-pm-disabled-not-in-dropdown]
persona: Administrator (SYSTEM_ADMIN)
priority: High
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@admin", "@codetables", "@project-manager", "@persona-admin"]
last_updated: 2026-06-04
---

# TC-TS-PM-12 — Disabled PM not in Project Details dropdown

## 1. Context
Verifies that a disabled PM does not appear in the Project Details PM dropdown for new assignments.

**Source**: Test Plan 07, scenario TS-PM-12.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` with `Code Read` + `Code Write` permissions.
- **Data**: PM "CRT-AUTO Test Manager" exists and has been disabled in Code Tables.
- **Starting URL**: `${BASE_URL}/admin/codetables`

## 3. Test Data

| Field | Value |
|-------|-------|
| PM Name | `CRT-AUTO Test Manager` (disabled) |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with admin permissions
And   the PM "CRT-AUTO Test Manager" is disabled in Code Tables

When  I navigate to Project Details for an existing project
And   I click "Edit" on the project
And   I open the "Project Manager" dropdown
And   I type "CRT-AUTO" into the PM filter

Then  "CRT-AUTO Test Manager" does NOT appear in the PM selection list
```

## 5. Expected Results
- Disabled PM is excluded from the Project Details dropdown.
- Only active PMs are shown for new assignments.

## 6. Postconditions / Cleanup
- None.

## 7. Notes for the Playwright Agent
- Pair with TC-TS-PM-11 to test both states.
- Verify absence, not just non-selection.
