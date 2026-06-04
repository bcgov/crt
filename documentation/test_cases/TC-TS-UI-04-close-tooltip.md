---
id: TC-TS-UI-04
title: Active project — Close tooltip and button
source_plan: 08-ui-enhancements
source_scenario: TS-UI-04
covers_ac: [AC-ui-close-tooltip]
persona: Application User (APP_USER)
priority: Low
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@ui", "@project-details", "@persona-user"]
last_updated: 2026-06-03
---

# TC-TS-UI-04 — Active project — Close tooltip and button

## 1. Context
Verifies that the disable icon on an active project shows "Activate/Close Project" tooltip and "Close Project" button label.

**Source**: Test Plan 08, scenario TS-UI-04.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}`.
- **Data**: An active project exists.
- **Starting URL**: `${BASE_URL}/projects/{id}`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data
None required.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}"
And   I am on the Project Details page for an active project

When  I hover over the close/disable icon for the project
Then  I see a tooltip "Activate/Close Project"

When  I click the close/disable icon
Then  I see a button labeled "Close Project"
```

## 5. Expected Results
- Tooltip shows "Activate/Close Project" on hover.
- Clicking shows a "Close Project" action button.

## 6. Postconditions / Cleanup
- Do NOT confirm the close action; cancel/dismiss.

## 7. Notes for the Playwright Agent
- Only verify tooltip and button label; do not actually close the project.
- The icon may be a toggle icon that changes based on project state.
