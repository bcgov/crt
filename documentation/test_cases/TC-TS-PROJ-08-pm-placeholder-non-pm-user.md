---
id: TC-TS-PROJ-08
title: PM field shows placeholder for non-PM users
source_plan: 04-project-search-details
source_scenario: TS-PROJ-08
covers_ac: [AC-pm-placeholder]
persona: Application User (MANAGER, non-PM)
priority: Low
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@projects", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-PROJ-08 — PM field shows placeholder for non-PM users

## 1. Context
Verifies that when a user without the PM flag logs in, the Project Manager field on the Project Search page displays the placeholder text "Project Manager" rather than defaulting to any specific PM.

**Source**: Test Plan 04, scenario TS-PROJ-08 ([CRPDB-105]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER` and the PM flag **not** set.
- **Starting URL**: `${BASE_URL}/projects`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data
None required.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" who does not have the PM flag
When  I navigate to the "Projects" page
Then  the button "Project Manager" has text "Project Manager"
```

## 5. Expected Results
- The Project Manager dropdown button displays the placeholder text "Project Manager".
- No PM name is pre-selected.

## 6. Postconditions / Cleanup
- No data was created; no cleanup required.

## 7. Notes for the Playwright Agent
- Assert the exact button text is "Project Manager" (the placeholder), not a person's name.
- Use `page.getByRole('button', { name: 'Project Manager' })` to locate and verify.
