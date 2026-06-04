---
id: TC-TS-FIN-01
title: Navigate to Financial Planning screen
source_plan: 05-financial-planning
source_scenario: TS-FIN-01
covers_ac: [AC-fin-navigation]
persona: Application User (MANAGER)
priority: High
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@financial", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-FIN-01 — Navigate to Financial Planning screen

## 1. Context
Verifies that a user can navigate from Project Details to the Financial Planning Targets screen, and that the fiscal year filter defaults to showing all fiscal years.

**Source**: Test Plan 05, scenario TS-FIN-01 ([CRPDB-111]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project with Project Details saved (e.g., project ID 79).
- **Starting URL**: `${BASE_URL}/projects/79`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data
None required beyond the existing project.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the project details page for project "79"
When  I click the link "Financial Plan"
Then  the URL contains "/projectplan"
And   I see the heading "Financial Planning Targets"
And   the button "Show All Fiscal Years" is visible
```

## 5. Expected Results
- The Financial Plan page loads successfully.
- The heading "Financial Planning Targets" is visible.
- The "Show All Fiscal Years" toggle button is present, indicating all fiscal years are viewable.

## 6. Postconditions / Cleanup
- No data was created; no cleanup required.

## 7. Notes for the Playwright Agent
- Navigation uses the sub-navigation tab link with text "Financial Plan".
- The URL pattern is `/projects/{id}/projectplan`.
- The "Show All Fiscal Years" button controls fiscal year filtering visibility.
