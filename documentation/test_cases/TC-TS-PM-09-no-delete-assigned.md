---
id: TC-TS-PM-09
title: Cannot delete PM assigned to project
source_plan: 07-data-maintenance
source_scenario: TS-PM-09
covers_ac: [AC-pm-no-delete-assigned]
persona: Administrator (SYSTEM_ADMIN)
priority: High
type: Negative
level: E2E
automation_candidate: Yes
tags: ["@regression", "@admin", "@codetables", "@project-manager", "@persona-admin", "@negative"]
last_updated: 2026-06-04
---

# TC-TS-PM-09 — Cannot delete PM assigned to project

## 1. Context
Verifies that a PM currently assigned to a project cannot be deleted — only the Disable icon is available, not the Delete (trash) icon.

**Source**: Test Plan 07, scenario TS-PM-09.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` with `Code Read` + `Code Write` permissions.
- **Data**: PM is assigned to at least one project.
- **Starting URL**: `${BASE_URL}/admin/codetables`

## 3. Test Data

| Field | Value |
|-------|-------|
| PM Name | A PM currently assigned to a project |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with admin permissions
And   I am on the "Code Table Management" page with "Project Manager" code set selected

When  I look at the row for a PM that is assigned to one or more projects
Then  the Delete (trash) icon is NOT shown for that row
And   only the Disable icon is available
```

## 5. Expected Results
- Delete icon is hidden for assigned PMs.
- Only Disable icon is shown, preventing accidental data loss.

## 6. Postconditions / Cleanup
- None.

## 7. Notes for the Playwright Agent
- Verify absence of the trash/delete icon on the row.
- Compare with an unassigned PM row which should show both icons.
