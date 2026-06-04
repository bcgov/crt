---
id: TC-TS-BVT-TEND-02
title: "BVT: Add tender details to existing project"
source_plan: 09-bvt-smoke-tests
source_scenario: TS-BVT-TEND-02
covers_ac: [AC-bvt-tender-later]
persona: Application User (APP_USER)
priority: Medium
type: E2E
level: Smoke
automation_candidate: Yes
tags: ["@smoke", "@bvt", "@tender", "@persona-user"]
last_updated: 2026-06-03
related_ft: [TC-TS-TEND-02]
---

# TC-TS-BVT-TEND-02 — BVT: Add tender details to existing project

## 1. Context
Build Verification Test confirming that tender data can be added to an existing project at a later time.

**Source**: Test Plan 09, scenario TS-BVT-TEND-02.

## 2. Preconditions
- **Environment**: Build deployed to UAT.
- **User**: Authenticated as `{{IDIR_VALID_USER}}`.
- **Data**: An existing project without tender data.
- **Starting URL**: `${BASE_URL}/`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Tender Number | `BVT-T002` |
| Bid Value | `500000` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}"
And   an existing project has no tender entries

When  I navigate to the project via search
And   I click the "Tender" tab
Then  the tender table shows no data

When  I click the button "+ Add"
And   I fill in tender details (Tender Number "BVT-T002", Bid Value "500000")
And   I click the button "Submit"

Then  the tender entry appears in the table with number "BVT-T002"
```

## 5. Expected Results
- Users can return to a project and add tender data after initial creation.
- Tender data is saved correctly.

## 6. Postconditions / Cleanup
- Delete the tender entry.

## 7. Notes for the Playwright Agent
- Smoke test verifying the "add later" tender workflow.
