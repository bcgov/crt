---
id: TC-TS-BVT-LOC-02
title: "BVT: Add multiple project locations"
source_plan: 09-bvt-smoke-tests
source_scenario: TS-BVT-LOC-02
covers_ac: [AC-bvt-location-multiple]
persona: Application User (APP_USER)
priority: Medium
type: E2E
level: Smoke
automation_candidate: Partial (map component)
tags: ["@smoke", "@bvt", "@segments", "@persona-user"]
last_updated: 2026-06-03
related_ft: [TC-TS-SEG-04]
---

# TC-TS-BVT-LOC-02 — BVT: Add multiple project locations

## 1. Context
Build Verification Test confirming that multiple location segments can be added to a single project.

**Source**: Test Plan 09, scenario TS-BVT-LOC-02.

## 2. Preconditions
- **Environment**: Build deployed to UAT.
- **User**: Authenticated as `{{IDIR_VALID_USER}}`.
- **Data**: An existing project accessible for editing.
- **Starting URL**: `${BASE_URL}/projects/{id}/segments`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Segment | Highway | Start | End |
|---------|---------|-------|-----|
| Segment 1 | Highway A | 0 | 5 |
| Segment 2 | Highway B | 10 | 20 |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}"
And   I am on the Segments page for an existing project

# Add first segment
When  I click the button "+ Add"
And   I fill in segment 1 details (Highway A, Start "0", End "5")
And   I click the button "Submit"
Then  segment 1 appears in the table

# Add second segment
When  I click the button "+ Add"
And   I fill in segment 2 details (Highway B, Start "10", End "20")
And   I click the button "Submit"
Then  segment 2 appears in the table
And   both segments are listed for the project
```

## 5. Expected Results
- Multiple segments can be added to a project.
- Each segment is independently listed in the table.
- No limit on number of segments (within reason).

## 6. Postconditions / Cleanup
- Delete both created segments.

## 7. Notes for the Playwright Agent
- Smoke test — verify multiple segments can coexist.
- Map component issues may limit full automation.
