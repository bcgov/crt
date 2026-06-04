---
id: TC-TS-UI-05
title: Closed project — Activate tooltip and button
source_plan: 08-ui-enhancements
source_scenario: TS-UI-05
covers_ac: [AC-ui-activate-tooltip]
persona: Application User (APP_USER)
priority: Low
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@ui", "@project-details", "@persona-user"]
last_updated: 2026-06-03
---

# TC-TS-UI-05 — Closed project — Activate tooltip and button

## 1. Context
Verifies that the greyed-out icon on a closed project shows "Activate/Close Project" tooltip and "Activate Project" button label.

**Source**: Test Plan 08, scenario TS-UI-05.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}`.
- **Data**: A closed project exists.
- **Starting URL**: `${BASE_URL}/projects/{id}`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data
None required.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}"
And   I am on the Project Details page for a closed project

When  I hover over the greyed-out activate icon for the project
Then  I see a tooltip "Activate/Close Project"

When  I click the activate icon
Then  I see a button labeled "Activate Project"
```

## 5. Expected Results
- Tooltip shows "Activate/Close Project" on hover.
- Clicking shows an "Activate Project" action button.

## 6. Postconditions / Cleanup
- Do NOT confirm the activate action; cancel/dismiss.

## 7. Notes for the Playwright Agent
- Only verify tooltip and button label; do not actually activate the project.
- The icon is greyed-out for closed projects (same icon, different state).
