---
id: TC-TS-PM-13
title: PM still searchable on Project Search after disable
source_plan: 07-data-maintenance
source_scenario: TS-PM-13
covers_ac: [AC-pm-searchable-after-disable]
persona: Administrator (SYSTEM_ADMIN)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@admin", "@codetables", "@project-manager", "@persona-admin"]
last_updated: 2026-06-04
---

# TC-TS-PM-13 — PM still searchable on Project Search after disable

## 1. Context
Verifies that after disabling a PM, projects previously assigned to that PM still appear when searching by that PM's name on the Project Search screen.

**Source**: Test Plan 07, scenario TS-PM-13.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` with `Code Read` + `Code Write` permissions.
- **Data**: PM "CRT-AUTO Test Manager" has been disabled and was previously assigned to at least one project.
- **Starting URL**: `${BASE_URL}/`

## 3. Test Data

| Field | Value |
|-------|-------|
| PM Name | `CRT-AUTO Test Manager` (disabled, assigned to project(s)) |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with admin permissions
And   the PM "CRT-AUTO Test Manager" is disabled
And   at least one project was assigned to "CRT-AUTO Test Manager"

When  I navigate to the Project Search page
And   I open the PM filter
And   I type "CRT-AUTO" into the PM filter
Then  "CRT-AUTO Test Manager" appears as a filter option

When  I select "CRT-AUTO Test Manager" as the PM filter
And   I execute the search
Then  projects previously assigned to "CRT-AUTO Test Manager" appear in the results
```

## 5. Expected Results
- Disabled PM remains available as a search filter on Project Search.
- Historical project assignments are preserved and searchable.
- This ensures no data loss for reporting purposes.

## 6. Postconditions / Cleanup
- None.

## 7. Notes for the Playwright Agent
- Project Search PM filter includes both active and disabled PMs.
- This is distinct from Project Details edit dropdown which only shows active PMs.
