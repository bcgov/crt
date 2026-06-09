---
id: TC-TS-SEG-08
title: Highway direction mismatch handling
source_plan: 06-spatial-segments-ratios
source_scenario: TS-SEG-08
covers_ac: [AC-seg-direction-mismatch]
persona: Application User (MANAGER)
priority: Medium
type: Edge Case
level: E2E
automation_candidate: No
tags: ["@regression", "@segments", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-SEG-08 — Highway direction mismatch handling

## 1. Context
Verifies the system behavior when a segment is added with start/end coordinates that run against the highway direction (e.g., on the wrong lane). The map should either fail to find a route or return a circuitous route, and the user must swap start/end points or move pins to the correct lane.

**Source**: Test Plan 06, scenario TS-SEG-08 ([CRPDB-162]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project (e.g., project ID 79).
- **Starting URL**: `${BASE_URL}/projects/79/segments`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).
- **Other**: Map provider service is reachable; knowledge of a divided highway with separate lanes in BC.

## 3. Test Data

| Field | Value |
|-------|-------|
| Start Coordinates | Coordinates on the wrong side of a divided highway |
| End Coordinates | Coordinates on the wrong side of a divided highway |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the segments page for project "79"

When  I click the button "+ Add Segment / View Map"
And   I place a start pin on the wrong side of a divided highway
And   I place an end pin that creates a route against traffic flow

Then  the map either fails to find a direct route
Or    the map displays a circuitous/unexpected route (significantly longer than expected)
And   the user is expected to swap start/end points or move pins to the correct lane
```

## 5. Expected Results
- The system handles the direction mismatch gracefully (no crash).
- Either no route is found, or an obviously incorrect circuitous route is shown.
- Per the end-user guide §3.7, the user must correct the pin placement.

## 6. Postconditions / Cleanup
- Do not save the invalid segment; cancel the operation.

## 7. Notes for the Playwright Agent
- This test is NOT an automation candidate (requires visual map inspection and judgment about route correctness).
- Should be executed manually by a tester familiar with BC highway geography.
- The key assertion is that the system does not crash or silently accept an invalid route.
