---
id: TC-TS-DETAIL-14
title: Unsaved changes prompt on Close navigation
source_plan: 04-project-search-details
source_scenario: TS-DETAIL-14
covers_ac: [AC-unsaved-changes-prompt]
persona: Application User (MANAGER)
priority: Medium
type: Edge Case
level: E2E
automation_candidate: Yes
tags: ["@regression", "@projects", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-DETAIL-14 — Unsaved changes prompt on Close navigation

## 1. Context
Verifies that when a user has unsaved changes on the Project Details page and attempts to navigate away (e.g., clicking "Close"), a confirmation prompt appears with the exact text "You have unsaved changes" and offers "Go Back" and "Leave" options.

**Source**: Test Plan 04, scenario TS-DETAIL-14 ([CRPDB-106]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project to edit (e.g., project ID 79).
- **Starting URL**: `${BASE_URL}/projects/79`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Field to Modify | Project Description |
| Modified Value | `Unsaved change test` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the project details page for project "79"

# Make changes without saving
When  I click the button "Edit Project"
And   I fill the textbox "Description" with "Unsaved change test"

# Attempt to navigate away
When  I click the link "Close"
Then  I see a dialog with text "You have unsaved changes"
And   I see the button "Go Back" in the dialog
And   I see the button "Leave" in the dialog

# Choose "Go Back" — stays on the page
When  I click the button "Go Back"
Then  I am still on the project details page
And   the textbox "Description" still contains "Unsaved change test"

# Attempt to navigate away again
When  I click the link "Close"
Then  I see a dialog with text "You have unsaved changes"

# Choose "Leave" — discards changes and navigates away
When  I click the button "Leave"
Then  the URL is "/projects"
And   I am on the "Projects" search page
```

## 5. Expected Results
- A confirmation dialog appears with the exact text "You have unsaved changes".
- Clicking "Go Back" dismisses the dialog and keeps the user on the current page with changes intact.
- Clicking "Leave" discards the changes and navigates to the Project Search page.

## 6. Postconditions / Cleanup
- No data was created or modified (changes were discarded); no cleanup required.

## 7. Notes for the Playwright Agent
- The dialog text must be asserted verbatim: "You have unsaved changes".
- Button labels are exactly "Go Back" and "Leave".
- This prompt may be triggered by any navigation away from an unsaved form (tabs, browser back, etc.).
- Ensure the form is in edit mode with actual changes before attempting navigation.
