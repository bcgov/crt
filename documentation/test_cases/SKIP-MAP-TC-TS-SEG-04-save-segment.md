---
id: TC-TS-SEG-04
title: Save segment with coordinates and description
source_plan: 06-spatial-segments-ratios
source_scenario: TS-SEG-04
covers_ac: [AC-save-segment]
persona: Application User (MANAGER)
priority: High
type: Functional
level: E2E
automation_candidate: Partial
tags: ["@regression", "@segments", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-SEG-04 — Save segment with coordinates and description

## 1. Context
Verifies that a segment with valid start/end coordinates can be saved successfully and appears in the segments table with a sequential number, coordinates, and description.

**Source**: Test Plan 06, scenario TS-SEG-04 ([CRPDB-162]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project (e.g., project ID 79) accessible from the Segments page.
- **Starting URL**: `${BASE_URL}/projects/79/segments`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).
- **Other**: Map provider service is reachable.

## 3. Test Data

| Field | Value |
|-------|-------|
| Start Coordinates | `48.816870,-123.718150` |
| End Coordinates | `48.769420,-123.698870` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the segments page for project "79"

When  I add a segment with start coordinates "48.816870,-123.718150" and end coordinates "48.769420,-123.698870" via the map interface
And   I save the segment

Then  a new row appears in the Project Segments table
And   the row shows start coordinates "48.816870,-123.718150"
And   the row shows end coordinates "48.769420,-123.698870"
And   the row has a non-empty description
And   the row has "Edit Record" and "Delete Record" buttons
```

## 5. Expected Results
- The segment is saved and appears in the table.
- Start and end coordinates are displayed correctly.
- A description is auto-populated.
- Edit and Delete actions are available on the row.

## 6. Postconditions / Cleanup
- Delete the created segment using the Delete Record button.

## 7. Notes for the Playwright Agent
- This test requires map interaction to place coordinates — automation candidate is "Partial".
- The segments table shows coordinates in the format "lat,long" (e.g., "48.816870,-123.718150").
- If map initialization fails, consider using API to create segment data directly.
