---
id: TC-TS-PM-07
title: Disable PM assigned to projects
source_plan: 07-data-maintenance
source_scenario: TS-PM-07
covers_ac: [AC-pm-disable-assigned]
persona: Administrator (SYSTEM_ADMIN)
priority: High
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@admin", "@codetables", "@project-manager", "@persona-admin"]
last_updated: 2026-06-04
---

# TC-TS-PM-07 — Disable PM assigned to projects

## 1. Context
Verifies that disabling a PM currently assigned to projects removes it from the Project Details dropdown but leaves existing project assignments unchanged and keeps the PM searchable on the Project Search screen.

**Source**: Test Plan 07, scenario TS-PM-07.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` with `Code Read` + `Code Write` permissions.
- **Data**: PM "CRT-AUTO Test Manager" exists, is Active, and is assigned to at least one project.
- **Starting URL**: `${BASE_URL}/admin/codetables`

## 3. Test Data

| Field | Value |
|-------|-------|
| PM Name | `CRT-AUTO Test Manager` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with admin permissions
And   I am on the "Code Table Management" page with "Project Manager" code set selected
And   the PM "CRT-AUTO Test Manager" exists, is Active, and is assigned to a project

When  I click the Disable icon on the row containing "CRT-AUTO Test Manager"
Then  I see a confirmation prompt "This value will be disabled. Are you sure?"

When  I confirm the disable action
Then  the PM "CRT-AUTO Test Manager" is no longer shown in the Active list

# Verify NOT in Project Details dropdown
When  I navigate to a project details page
And   I click the dropdown "Project Manager"
And   I type "CRT-AUTO" into the filter
Then  "CRT-AUTO Test Manager" does NOT appear in the dropdown options

# Verify existing assignments unchanged
When  I navigate to the project that had this PM assigned
Then  the project still shows "CRT-AUTO Test Manager" as its PM

# Verify still searchable on Project Search
When  I navigate to the Project Search page
And   I search by PM "CRT-AUTO Test Manager"
Then  projects assigned to this PM still appear in results
```

## 5. Expected Results
- Confirmation prompt displayed before disabling.
- Disabled PM removed from Add/Edit dropdowns.
- Existing project assignments are not affected.
- Disabled PM remains searchable on Project Search for historical records.

## 6. Postconditions / Cleanup
- Re-enable the PM for other tests.

## 7. Notes for the Playwright Agent
- Important distinction: disabled PMs are removed from edit dropdowns but stay in search filters.
- The Disable icon shows tooltip "Disable record".
