---
id: TC-TS-SEG-05
title: Edit segment coordinates via map
source_plan: 06-spatial-segments-ratios
source_scenario: TS-SEG-05
covers_ac: [AC-edit-segment]
persona: Application User (MANAGER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Partial
tags: ["@regression", "@segments", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-SEG-05 — Edit segment coordinates via map

## 1. Context
Verifies that an existing segment can be edited by moving the start/end pins on the map and saving with updated coordinates.

**Source**: Test Plan 06, scenario TS-SEG-05 ([CRPDB-162]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project (e.g., project ID 79) with at least one segment already saved.
- **Starting URL**: `${BASE_URL}/projects/79/segments`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).
- **Other**: Map provider service is reachable.

## 3. Test Data

| Field | Value |
|-------|-------|
| Original Start | `48.816870,-123.718150` |
| New Start | `48.820000,-123.720000` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the segments page for project "79"
And   a segment exists in the table

When  I click the button "Edit Record" on the segment row
Then  the map interface opens showing the existing segment pins

When  I move the start pin to new coordinates "48.820000,-123.720000"
And   I save the segment

Then  the segment row shows updated start coordinates
And   the segment row end coordinates remain unchanged
```

## 5. Expected Results
- The edit form/map opens with existing pins at their current positions.
- Pins can be moved to new coordinates.
- After saving, the table reflects the updated coordinates.

## 6. Postconditions / Cleanup
- Revert the segment coordinates to their original values if needed.

## 7. Notes for the Playwright Agent
- Editing a segment opens the map view with existing pins.
- Pin dragging requires mouse interaction on the map canvas.
- Marked as "Partial" automation candidate due to map interaction.
