---
id: TC-TS-PM-08
title: Delete PM (unassigned)
source_plan: 07-data-maintenance
source_scenario: TS-PM-08
covers_ac: [AC-pm-delete-unassigned]
persona: Administrator (SYSTEM_ADMIN)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@admin", "@codetables", "@project-manager", "@persona-admin"]
last_updated: 2026-06-04
---

# TC-TS-PM-08 — Delete PM (unassigned)

## 1. Context
Verifies that a PM not assigned to any project can be permanently deleted via the Delete (trash) icon.

**Source**: Test Plan 07, scenario TS-PM-08.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` with `Code Read` + `Code Write` permissions.
- **Data**: PM "CRT-AUTO Test Manager" exists and is NOT assigned to any project.
- **Starting URL**: `${BASE_URL}/admin/codetables`

## 3. Test Data

| Field | Value |
|-------|-------|
| PM Name | `CRT-AUTO Test Manager` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with admin permissions
And   I am on the "Code Table Management" page with "Project Manager" code set selected
And   the PM "CRT-AUTO Test Manager" exists and is not assigned to any project

When  I click the Delete (trash) icon on the row containing "CRT-AUTO Test Manager"
Then  I see a confirmation prompt "This value will be deleted. Are you sure?"

When  I confirm the delete action
Then  the "CRT-AUTO Test Manager" row is no longer visible in the table

# Verify removed from all dropdowns
When  I navigate to a project details page
And   I click the dropdown "Project Manager"
And   I type "CRT-AUTO" into the filter
Then  "CRT-AUTO Test Manager" does NOT appear in the dropdown
```

## 5. Expected Results
- Confirmation prompt with "This value will be deleted. Are you sure?" is shown.
- After confirming, the PM is permanently removed.
- The PM no longer appears in any dropdown list.

## 6. Postconditions / Cleanup
- PM permanently deleted; no cleanup required.

## 7. Notes for the Playwright Agent
- Only unassigned PMs show the Delete (trash) icon.
- Tooltip on delete icon: "Delete record".
