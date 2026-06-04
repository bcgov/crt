---
id: TC-TS-SEG-01
title: Navigate to Project Segments screen
source_plan: 06-spatial-segments-ratios
source_scenario: TS-SEG-01
covers_ac: [AC-seg-navigation]
persona: Application User (MANAGER)
priority: High
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@segments", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-SEG-01 — Navigate to Project Segments screen

## 1. Context
Verifies that a user can navigate to the Project Segments screen from the project sub-navigation tabs and that the screen loads correctly.

**Source**: Test Plan 06, scenario TS-SEG-01 ([CRPDB-162]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project (e.g., project ID 79).
- **Starting URL**: `${BASE_URL}/projects/79`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data
None required.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the project details page for project "79"
When  I click the link "Segment"
Then  the URL contains "/segments"
And   I see the heading "Project Segments"
And   I see the button "+ Add Segment / View Map"
And   I see the heading "Project Ratios"
```

## 5. Expected Results
- The Segments page loads successfully.
- Both "Project Segments" and "Project Ratios" sections are visible.
- The "+ Add Segment / View Map" button is present.

## 6. Postconditions / Cleanup
- No data was created; no cleanup required.

## 7. Notes for the Playwright Agent
- URL pattern: `/projects/{id}/segments`.
- The page has two main sections: Project Segments (top) and Project Ratios (bottom).
- The "+ Add Segment / View Map" button opens a map interface.
