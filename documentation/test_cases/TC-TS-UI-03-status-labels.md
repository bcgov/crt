---
id: TC-TS-UI-03
title: Project status label changes — Active and Closed
source_plan: 08-ui-enhancements
source_scenario: TS-UI-03
covers_ac: [AC-ui-status-labels]
persona: Application User (APP_USER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@ui", "@project-details", "@persona-user"]
last_updated: 2026-06-03
---

# TC-TS-UI-03 — Project status label changes — Active and Closed

## 1. Context
Verifies that the project status labels use "Active" (not "In-progress") and "Closed" (not "Completed").

**Source**: Test Plan 08, scenario TS-UI-03.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}`.
- **Data**: Projects exist in both Active and Closed states.
- **Starting URL**: `${BASE_URL}/`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data
None required.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}"

# Check Project Search filter labels
When  I navigate to the Project Search page
Then  the status filter shows "Active" (not "In-progress")
And   the status filter shows "Closed" (not "Completed")

# Check Project Details status display
When  I open a project that is currently active
Then  the status label shows "Active" (not "In-progress")

When  I open a project that is closed
Then  the status label shows "Closed" (not "Completed")
```

## 5. Expected Results
- "In-progress" has been renamed to "Active" everywhere.
- "Completed" has been renamed to "Closed" everywhere.
- Status dropdown, search filters, and display labels all use the new terminology.

## 6. Postconditions / Cleanup
- No data was created; no cleanup required.

## 7. Notes for the Playwright Agent
- This is a label/terminology change — search for old terms and confirm they're gone.
- Check: status filter dropdown, project detail header, table status column.
