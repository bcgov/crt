---
id: TC-TS-PROJ-07
title: PM field defaults to logged-in PM user
source_plan: 04-project-search-details
source_scenario: TS-PROJ-07
covers_ac: [AC-pm-default]
persona: Project Manager
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@projects", "@persona-pm"]
last_updated: 2026-06-03
---

# TC-TS-PROJ-07 — PM field defaults to logged-in PM user

## 1. Context
Verifies that when a user with the PM flag logs in, the Project Manager field on the Project Search page defaults to that user's name. This allows PMs to quickly see their own projects.

**Source**: Test Plan 04, scenario TS-PROJ-07 ([CRPDB-105]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_PM}}` with role `MANAGER` and the `PM` user flag enabled.
- **Data**: The user's name appears in the PM code table for their region.
- **Starting URL**: `${BASE_URL}/projects`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| PM User Display Name | The display name of `{{IDIR_VALID_PM}}` (e.g., `Devashish Bhargava`) |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_PM}}" who has the PM flag enabled
When  I navigate to the "Projects" page
Then  the button "Project Manager" shows the text containing my display name
```

## 5. Expected Results
- Upon page load, the Project Manager filter already shows the logged-in PM user's name as the selected value.
- The user does not need to manually select themselves from the dropdown.

## 6. Postconditions / Cleanup
- No data was created; no cleanup required.

## 7. Notes for the Playwright Agent
- The PM dropdown is a button that displays selected values in its text content.
- When defaulted, the button text will include the PM's name instead of the placeholder "Project Manager".
- Use `await expect(button).toContainText('Devashish Bhargava')` or similar assertion.
