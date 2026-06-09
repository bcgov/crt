---
id: TC-TS-SEG-02
title: Add new segment via map interface
source_plan: 06-spatial-segments-ratios
source_scenario: TS-SEG-02
covers_ac: [AC-add-segment-map]
persona: Application User (MANAGER)
priority: High
type: Functional
level: E2E
automation_candidate: Partial
tags: ["@regression", "@segments", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-SEG-02 — Add new segment via map interface

## 1. Context
Verifies that a user can add a new segment by opening the map interface, placing start and end coordinate pins, and saving the segment. The map supports pin drop, keyword search, or current location methods for placing coordinates.

**Source**: Test Plan 06, scenario TS-SEG-02 ([CRPDB-162]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project (e.g., project ID 79) accessible from the Segments page.
- **Starting URL**: `${BASE_URL}/projects/79/segments`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).
- **Other**: Map provider service is reachable; KeyCloak authentication is functional for map component.

## 3. Test Data

| Field | Value |
|-------|-------|
| Start Coordinates | `48.816870,-123.718150` |
| End Coordinates | `48.769420,-123.698870` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the segments page for project "79"
When  I click the button "+ Add Segment / View Map"
Then  the map interface opens
And   I see instructions for adding start and end locations

When  I place a start pin at coordinates "48.816870,-123.718150"
And   I place an end pin at coordinates "48.769420,-123.698870"
Then  the start pin is visible on the map
And   the end pin is visible on the map
And   a route is displayed between the two points
```

## 5. Expected Results
- The map interface opens with instructions.
- Start and end coordinate pins can be placed on the map.
- A route line is drawn between the two points (following the road network).

## 6. Postconditions / Cleanup
- If the segment was saved, delete it via the Delete action.

## 7. Notes for the Playwright Agent
- **Known issue**: The map component may throw "keycloak: failed to initialize" in some environments (observed during exploration).
- This test is marked as "Partial" automation candidate due to map interaction complexity.
- Pin placement may require clicking on the map canvas at specific coordinates.
- Consider using keyword search within the map interface as an alternative to direct pin placement.
- If map initialization fails, this test should be marked as blocked/skipped with an environment note.
