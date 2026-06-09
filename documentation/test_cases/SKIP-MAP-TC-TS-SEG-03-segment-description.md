---
id: TC-TS-SEG-03
title: Segment description auto-generates and is editable
source_plan: 06-spatial-segments-ratios
source_scenario: TS-SEG-03
covers_ac: [AC-segment-description]
persona: Application User (MANAGER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Partial
tags: ["@regression", "@segments", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-SEG-03 — Segment description auto-generates and is editable

## 1. Context
Verifies that when a segment is added, a description is auto-generated from the coordinates/route, and that the user can manually edit/overwrite this description.

**Source**: Test Plan 06, scenario TS-SEG-03 ([CRPDB-162]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project (e.g., project ID 79) with a segment already added (or ability to add one).
- **Starting URL**: `${BASE_URL}/projects/79/segments`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).
- **Other**: Map provider service is reachable.

## 3. Test Data

| Field | Value |
|-------|-------|
| Auto-generated Description | (generated from map route, e.g., "Duncan bypass improvements boys rd to hwy 18") |
| Manual Description | `CRT-AUTO custom segment description` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the segments page for project "79"
And   a segment has been added with start/end coordinates

# Verify auto-generated description
Then  the segment row shows a non-empty description in the Description column

# Edit the description
When  I click the button "Edit Record" on the segment row
Then  the edit form shows the auto-generated description
When  I clear the description field
And   I fill the description field with "CRT-AUTO custom segment description"
And   I save the changes
Then  the segment row shows "CRT-AUTO custom segment description" in the Description column
```

## 5. Expected Results
- A description is automatically generated when a segment is created.
- The description can be manually overwritten via the edit form.
- The updated description persists after saving.

## 6. Postconditions / Cleanup
- Revert the segment description to its original value if needed.

## 7. Notes for the Playwright Agent
- The Description column is visible in the segments table (per exploration: "Duncan bypass improvements boys rd to hwy 18").
- This test depends on having a segment already created (may need TC-TS-SEG-02 as prerequisite).
- Marked as "Partial" automation candidate due to dependency on map interaction for segment creation.
