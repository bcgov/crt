---
id: TC-TS-BVT-DET-02
title: "BVT: Edit existing project"
source_plan: 09-bvt-smoke-tests
source_scenario: TS-BVT-DET-02
covers_ac: [AC-bvt-edit-project]
persona: Application User (APP_USER)
priority: High
type: E2E
level: Smoke
automation_candidate: Yes
tags: ["@smoke", "@bvt", "@project-details", "@persona-user"]
last_updated: 2026-06-03
related_ft: [TC-TS-DETAIL-07, TC-TS-DETAIL-08]
---

# TC-TS-BVT-DET-02 — BVT: Edit existing project

## 1. Context
Build Verification Test confirming that an existing project can be found and edited in UAT.

**Source**: Test Plan 09, scenario TS-BVT-DET-02.

## 2. Preconditions
- **Environment**: Build deployed to UAT.
- **User**: Authenticated as `{{IDIR_VALID_USER}}`.
- **Data**: A project exists that can be edited.
- **Starting URL**: `${BASE_URL}/`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Original | Updated |
|-------|----------|---------|
| Project Description | *(existing value)* | `BVT Updated Description` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}"
And   I am on the Project Search page

When  I search for an existing project
And   I click on the project in the search results
Then  the Project Details page loads

When  I modify the "Description" field to "BVT Updated Description"
And   I click the button "Save"
Then  the project is saved successfully
And   the description field shows "BVT Updated Description"
```

## 5. Expected Results
- Search → Select → Edit → Save workflow completes without error.
- Changes are persisted.

## 6. Postconditions / Cleanup
- Revert the description to its original value.

## 7. Notes for the Playwright Agent
- This is a smoke test — verify end-to-end edit works.
- See TC-TS-DETAIL-07/08 for detailed edit coverage.
