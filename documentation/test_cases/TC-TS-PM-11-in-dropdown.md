---
id: TC-TS-PM-11
title: PM appears in Project Details dropdown
source_plan: 07-data-maintenance
source_scenario: TS-PM-11
covers_ac: [AC-pm-in-dropdown]
persona: Administrator (SYSTEM_ADMIN)
priority: High
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@admin", "@codetables", "@project-manager", "@persona-admin"]
last_updated: 2026-06-04
---

# TC-TS-PM-11 — PM appears in Project Details dropdown

## 1. Context
Verifies that a newly added or re-enabled PM is immediately available in the Project Details PM selection dropdown.

**Source**: Test Plan 07, scenario TS-PM-11.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` with `Code Read` + `Code Write` permissions.
- **Data**: PM "CRT-AUTO Test Manager" has just been added or re-enabled.
- **Starting URL**: `${BASE_URL}/admin/codetables`

## 3. Test Data

| Field | Value |
|-------|-------|
| PM Name | `CRT-AUTO Test Manager` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with admin permissions
And   the PM "CRT-AUTO Test Manager" exists and is Active in Code Tables

When  I navigate to Project Details for an existing project
And   I click "Edit" on the project
And   I open the "Project Manager" dropdown
And   I type "CRT-AUTO" into the PM filter

Then  "CRT-AUTO Test Manager" appears in the PM selection list
```

## 5. Expected Results
- Active PM appears immediately in Project Details PM dropdown.
- PM is selectable for assignment to the project.

## 6. Postconditions / Cleanup
- Do not save the project changes.

## 7. Notes for the Playwright Agent
- PM dropdown uses type-ahead filtering.
- Navigate to any existing project's edit form to verify.
