---
id: TC-TS-PM-03
title: Delete unassigned PM
source_plan: 07-data-maintenance
source_scenario: TS-PM-03
covers_ac: [AC-pm-delete]
persona: Administrator (SYSTEM_ADMIN)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@admin", "@codetables", "@project-manager", "@persona-admin"]
last_updated: 2026-06-03
---

# TC-TS-PM-03 — Delete unassigned PM

## 1. Context
Verifies that a PM not assigned to any project can be permanently deleted.

**Source**: Test Plan 07, scenario TS-PM-03.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` with `Code Read` + `Code Write` permissions.
- **Data**: PM "CRT-AUTO Test Manager" exists and is not assigned to any project.
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
And   the PM "CRT-AUTO Test Manager" exists and is not assigned to any project

When  I click the button "Delete Record" on the row containing "CRT-AUTO Test Manager"
Then  I see a confirmation prompt "Are you sure?"
When  I click the confirm button
Then  the "CRT-AUTO Test Manager" row is no longer visible

# Verify removed from all dropdowns
When  I navigate to a project details page
And   I click the dropdown "Project Manager"
And   I type "CRT-AUTO" into the filter
Then  "CRT-AUTO Test Manager" does NOT appear in the dropdown
```

## 5. Expected Results
- Confirmation prompt with "Are you sure?" is shown.
- After confirming, the PM is permanently removed.
- The PM no longer appears in any dropdown list.

## 6. Postconditions / Cleanup
- PM permanently deleted; no cleanup required.

## 7. Notes for the Playwright Agent
- Only unassigned PMs show the Delete (trash) icon.
- Assigned PMs would show the Disable icon instead.
