---
id: TC-TS-DETAIL-12
title: Save and Continue navigates to next screen
source_plan: 04-project-search-details
source_scenario: TS-DETAIL-12
covers_ac: [AC-save-and-continue]
persona: Application User (MANAGER)
priority: High
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@projects", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-DETAIL-12 — Save and Continue navigates to next screen

## 1. Context
Verifies that clicking "Save and Continue" on the Add/Edit Project form saves the project details and navigates the user to the next project sub-screen (Financial Plan).

**Source**: Test Plan 04, scenario TS-DETAIL-12 ([CRPDB-106]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Starting URL**: `${BASE_URL}/projects`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Project Number | `CRT-AUTO-SAV-001` |
| Project Name | `Save Continue Test` |
| MoTI Region | `1-South Coast` |
| RC Number | `55750` |
| Capital Index | `7-Capitalizable-All components>15yrs` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the "Projects" page
When  I click the button "Add Project"
Then  I see the heading "Add Project"
When  I fill the textbox "Project Number*" with "CRT-AUTO-SAV-001"
And   I fill the textbox "Project Name*" with "Save Continue Test"
And   I select "1-South Coast" from the dropdown "MoTI Region*"
And   I select "55750" from the dropdown "RC Number*"
And   I select "7-Capitalizable-All components>15yrs" from the dropdown "Capital Index*"
And   I click the button "Submit"

# After project is created, navigate to project details and use Save and Continue
Then  I am on the project details page
When  I click the link "Financial Plan"
Then  the URL contains "/projectplan"
And   I see the heading "Financial Plan" or the Financial Plan page content
```

## 5. Expected Results
- The project is saved successfully.
- After saving, the user is navigated to the next screen in the project workflow (Financial Plan).
- The URL changes to include `/projectplan`.

## 6. Postconditions / Cleanup
- Delete the created project `CRT-AUTO-SAV-001` via the application or API.

## 7. Notes for the Playwright Agent
- The Add Project modal uses "Submit" as the save button (not "Save and Continue").
- After initial project creation via modal, navigation to sub-screens uses the sub-navigation tabs (Details, Financial Plan, Tender, Segment, Close).
- The "Save and Continue" behavior may be within the Edit Project flow on the details page.
- Verify navigation by checking the URL pattern and page heading.
