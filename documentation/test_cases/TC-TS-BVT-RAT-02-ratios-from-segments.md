---
id: TC-TS-BVT-RAT-02
title: "BVT: Determine ratios from segments"
source_plan: 09-bvt-smoke-tests
source_scenario: TS-BVT-RAT-02
covers_ac: [AC-bvt-ratio-segments]
persona: Application User (APP_USER)
priority: Medium
type: E2E
level: Smoke
automation_candidate: Partial (map/spatial dependency)
tags: ["@smoke", "@bvt", "@ratios", "@segments", "@persona-user"]
last_updated: 2026-06-03
related_ft: [TC-TS-RAT-06]
---

# TC-TS-BVT-RAT-02 — BVT: Determine ratios from segments

## 1. Context
Build Verification Test confirming that ratios can be automatically determined from spatial segment data using "Determine Using Segments".

**Source**: Test Plan 09, scenario TS-BVT-RAT-02.

## 2. Preconditions
- **Environment**: Build deployed to UAT.
- **User**: Authenticated as `{{IDIR_VALID_USER}}`.
- **Data**: A project with at least one valid location segment defined.
- **Starting URL**: `${BASE_URL}/projects/{id}/ratio`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data
Project must have valid segments before this test.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}"
And   I am on the Ratios page for a project that has location segments defined

When  I click the button "Determine Using Segments"
Then  the system calculates ratios based on spatial data
And   ratio entries are populated for the relevant administrative boundaries
And   the calculated ratios are approximate values based on the segments
```

## 5. Expected Results
- The "Determine Using Segments" button triggers spatial calculation.
- Ratios are auto-populated based on where segments cross boundaries.
- Results are approximate and may need manual adjustment.

## 6. Postconditions / Cleanup
- Delete the auto-generated ratios if not needed.

## 7. Notes for the Playwright Agent
- This depends on spatial services being available.
- If spatial service is down, the button may show an error — that's acceptable for a smoke test to detect.
- Marked as Partial automation candidate due to spatial dependency.
