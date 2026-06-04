---
id: TC-TS-BVT-LOC-01
title: "BVT: Add project location segment"
source_plan: 09-bvt-smoke-tests
source_scenario: TS-BVT-LOC-01
covers_ac: [AC-bvt-location-add]
persona: Application User (APP_USER)
priority: High
type: E2E
level: Smoke
automation_candidate: Partial (map component)
tags: ["@smoke", "@bvt", "@segments", "@persona-user"]
last_updated: 2026-06-03
related_ft: [TC-TS-SEG-02, TC-TS-SEG-03]
---

# TC-TS-BVT-LOC-01 — BVT: Add project location segment

## 1. Context
Build Verification Test confirming that a project location (segment) can be added with start/end points.

**Source**: Test Plan 09, scenario TS-BVT-LOC-01.

## 2. Preconditions
- **Environment**: Build deployed to UAT.
- **User**: Authenticated as `{{IDIR_VALID_USER}}`.
- **Data**: An existing project accessible for editing.
- **Starting URL**: `${BASE_URL}/projects/{id}/segments`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Highway | *(any available highway)* |
| Start Landmark | `0` |
| End Landmark | `10` |
| Description | `BVT Test Segment` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}"
And   I am on the Segments page for an existing project

When  I click the button "+ Add"
And   I fill in segment details (Highway, Start Landmark "0", End Landmark "10", Description "BVT Test Segment")
And   I click the button "Submit"

Then  the segment entry appears in the table
And   it shows the highway, start/end points, and description
```

## 5. Expected Results
- Location segment is added to the project.
- Start/end points and description are saved and displayed.

## 6. Postconditions / Cleanup
- Delete the created segment.

## 7. Notes for the Playwright Agent
- Map component may have Keycloak initialization issues in dev; focus on form submission.
- Automation candidate marked as Partial due to map dependency.
