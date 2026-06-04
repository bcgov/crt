---
id: TC-TS-DETAIL-13
title: Save and Close returns to Project Search
source_plan: 04-project-search-details
source_scenario: TS-DETAIL-13
covers_ac: [AC-save-and-close]
persona: Application User (MANAGER)
priority: High
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@projects", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-DETAIL-13 — Save and Close returns to Project Search

## 1. Context
Verifies that saving a project and clicking "Close" (the Close tab) navigates the user back to the Project Search screen.

**Source**: Test Plan 04, scenario TS-DETAIL-13 ([CRPDB-106]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project to edit (e.g., project ID 79).
- **Starting URL**: `${BASE_URL}/projects/79`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Field to Edit | Project Description |
| New Value | `CRT-AUTO updated description for save-close test` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the project details page for project "79"

# Edit and save the project
When  I click the button "Edit Project"
And   I fill the textbox "Description" with "CRT-AUTO updated description for save-close test"
And   I click the button "Save"
Then  the project details page shows the updated description

# Navigate back to Project Search using Close
When  I click the link "Close"
Then  the URL is "/projects"
And   I see the "Projects" page with the search filters
```

## 5. Expected Results
- The project is saved with the updated data.
- Clicking the "Close" tab/link navigates back to the Project Search page (`/projects`).
- The Project Search page loads with default filters.

## 6. Postconditions / Cleanup
- Revert the project description to its original value if needed.

## 7. Notes for the Playwright Agent
- The "Close" navigation is a link/tab in the sub-navigation bar: `a[href="/projects"]` with text "Close".
- This is different from the browser's close button or a modal close.
- After clicking Close, wait for the Projects list page to load.
