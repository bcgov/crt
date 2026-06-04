---
id: TC-TS-RAT-09
title: Redetermine ratios after adding new segment
source_plan: 06-spatial-segments-ratios
source_scenario: TS-RAT-09
covers_ac: [AC-redetermine-ratios]
persona: Application User (MANAGER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Partial
tags: ["@regression", "@ratios", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-RAT-09 — Redetermine ratios after adding new segment

## 1. Context
Verifies that after initially determining ratios from segments, adding a new segment and re-running "Determine Ratios Using Segments" recalculates all ratios to include the new segment data.

**Source**: Test Plan 06, scenario TS-RAT-09 ([CRPDB-218]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project (e.g., project ID 79) with at least one segment and previously determined ratios.
- **Starting URL**: `${BASE_URL}/projects/79/segments`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).
- **Other**: Map provider service is reachable for adding a new segment.

## 3. Test Data

| Step | Action |
|------|--------|
| 1 | Existing segment and ratios already determined |
| 2 | Add a new segment crossing a different administrative boundary |
| 3 | Re-determine ratios |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the segments page for project "79"
And   ratios have been previously determined from existing segments
And   I note the current ratio values

# Add a new segment
When  I add a new segment via the map interface

# Redetermine ratios
When  I click the button "Determine Ratios Using Segments"
Then  I see a warning dialog about overwriting current ratios
When  I confirm the overwrite

Then  the ratio entries are recalculated
And   the ratios include values reflecting the new segment's geographic boundaries
And   all ratio types (Electoral Districts, Districts, Highways, Economic Regions, Service Areas) are updated
And   each category's ratios sum to 1
```

## 5. Expected Results
- After adding a new segment and re-determining, ratios are recalculated to include the new segment.
- All five ratio categories are updated.
- Each category's values sum to 1.
- The new determination may produce different values than before (reflecting the additional segment).

## 6. Postconditions / Cleanup
- Delete the added segment and re-determine ratios to restore original state, or delete all ratios.

## 7. Notes for the Playwright Agent
- This test combines segment creation (map interaction — partial automation) with ratio determination.
- The key assertion is that ratio VALUES change after adding a segment and redetermining.
- Compare ratio values before and after to confirm recalculation occurred.
- Marked as "Partial" due to map interaction dependency for segment creation.
