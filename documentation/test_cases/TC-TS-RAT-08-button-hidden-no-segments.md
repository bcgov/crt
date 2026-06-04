---
id: TC-TS-RAT-08
title: Determine ratios button hidden without segments
source_plan: 06-spatial-segments-ratios
source_scenario: TS-RAT-08
covers_ac: [AC-determine-ratios-hidden]
persona: Application User (MANAGER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@ratios", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-RAT-08 — Determine ratios button hidden without segments

## 1. Context
Verifies that the "Determine Ratios Using Segments" button is NOT shown when the project has no segments defined.

**Source**: Test Plan 06, scenario TS-RAT-08 ([CRPDB-218]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project with NO segments defined (or a new project where segments have not been added).
- **Starting URL**: `${BASE_URL}/projects/{id}/segments` (a project with no segments)
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data
A project with zero segments in the Project Segments table.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I navigate to the segments page for a project with no segments

Then  the Project Segments table is empty
And   I do not see the button "Determine Ratios Using Segments"
```

## 5. Expected Results
- The "Determine Ratios Using Segments" button is hidden/not rendered when no segments exist.
- The button should only appear when the project has at least one segment.

## 6. Postconditions / Cleanup
- No data was created; no cleanup required.

## 7. Notes for the Playwright Agent
- Use `await expect(button).toBeHidden()` or check that the button does not exist in the DOM.
- This requires finding/creating a project with no segments for testing purposes.
- After adding a segment to this project, the button should become visible (verify if needed).
