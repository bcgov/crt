---
id: TC-TS-PM-02
title: Disable PM — not in Add/Edit dropdown but still searchable
source_plan: 07-data-maintenance
source_scenario: TS-PM-02
covers_ac: [AC-pm-disable]
persona: Administrator (SYSTEM_ADMIN)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@admin", "@codetables", "@project-manager", "@persona-admin"]
last_updated: 2026-06-03
---

# TC-TS-PM-02 — Disable PM — not in Add/Edit dropdown but still searchable

## 1. Context
Verifies that disabling a PM removes it from the Project Details Add/Edit PM dropdown but keeps it searchable on the Project Search screen.

**Source**: Test Plan 07, scenario TS-PM-02.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` with `Code Read` + `Code Write` permissions.
- **Data**: PM "CRT-AUTO Test Manager" exists and is Active.
- **Starting URL**: `${BASE_URL}/admin/codetables?codeSet=PROJECT_MANAGER`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| PM Name | `CRT-AUTO Test Manager` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with admin permissions
And   I am on the "Code Table Management" page with "Project Manager" code set selected
And   the PM "CRT-AUTO Test Manager" exists and is Active

# Disable the PM
When  I click the Disable icon on the row containing "CRT-AUTO Test Manager"
And   I confirm the disable prompt
Then  the PM is disabled

# Verify NOT in Project Details Add/Edit PM dropdown
When  I navigate to a project details page
And   I click the dropdown "Project Manager"
And   I type "CRT-AUTO" into the filter
Then  "CRT-AUTO Test Manager" does NOT appear in the dropdown options

# Verify still searchable on Project Search
When  I navigate to the Project Search page
And   I open the PM filter dropdown
And   I type "CRT-AUTO" into the PM filter
Then  "CRT-AUTO Test Manager" still appears as a search filter option
```

## 5. Expected Results
- Disabled PM is removed from Add/Edit dropdowns.
- Disabled PM remains in Project Search PM filter for historical records.

## 6. Postconditions / Cleanup
- Re-enable the PM for other tests.

## 7. Notes for the Playwright Agent
- Important distinction: disabled PMs are removed from edit dropdowns but stay in search filters.
- This ensures existing projects with that PM remain searchable.
