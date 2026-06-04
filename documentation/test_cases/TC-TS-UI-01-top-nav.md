---
id: TC-TS-UI-01
title: Top navigation buttons visible
source_plan: 08-ui-enhancements
source_scenario: TS-UI-01
covers_ac: [AC-ui-topnav]
persona: Application User (APP_USER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@ui", "@navigation", "@persona-user"]
last_updated: 2026-06-03
---

# TC-TS-UI-01 — Top navigation buttons visible

## 1. Context
Verifies that navigation buttons are visible at the top of project sub-screens for easy navigation.

**Source**: Test Plan 08, scenario TS-UI-01.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}`.
- **Data**: A project exists and is accessible.
- **Starting URL**: `${BASE_URL}/projects/{id}`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data
None required.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}"
And   I am on the Project Details page for a project

# Check sub-screen navigation buttons
When  I navigate to the Financial Planning sub-screen
Then  top navigation buttons are visible (e.g., "Project Details", "Financial Plan", "Qty/Accmp", "Tender", "Segments")

When  I navigate to the Qty/Accomplishments sub-screen
Then  top navigation buttons are still visible at the top

When  I navigate to the Tender Details sub-screen
Then  top navigation buttons are still visible at the top
```

## 5. Expected Results
- Navigation buttons/tabs are visible at the top of every project sub-screen.
- They allow direct navigation between project tabs without scrolling.

## 6. Postconditions / Cleanup
- No data was created; no cleanup required.

## 7. Notes for the Playwright Agent
- The top navigation includes tabs/buttons for: Project Details, Financial Plan, Qty/Accmp, Tender, Segments/Location.
- Verify visibility (not just existence) — buttons should be in the viewport.
