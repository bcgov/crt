---
id: TC-TS-BVT-DET-01
title: "BVT: Create new project"
source_plan: 09-bvt-smoke-tests
source_scenario: TS-BVT-DET-01
covers_ac: [AC-bvt-create-project]
persona: Application User (APP_USER)
priority: High
type: E2E
level: Smoke
automation_candidate: Yes
tags: ["@smoke", "@bvt", "@project-details", "@persona-user"]
last_updated: 2026-06-03
related_ft: [TC-TS-DETAIL-03, TC-TS-DETAIL-04]
---

# TC-TS-BVT-DET-01 — BVT: Create new project

## 1. Context
Build Verification Test confirming that a new project can be created end-to-end in UAT.

**Source**: Test Plan 09, scenario TS-BVT-DET-01.

## 2. Preconditions
- **Environment**: Build deployed to UAT.
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with project create permission.
- **Starting URL**: `${BASE_URL}/`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Project Name | `BVT Smoke Test Project` |
| Project Number | `BVT-001` |
| Region | `1 - South Coast` |
| Project Manager | *(any available PM)* |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}"
And   I am on the Project Search page

When  I click the button "Add Project"
Then  the Project Details form is displayed

When  I fill the required fields:
      | Field           | Value                   |
      | Project Name    | BVT Smoke Test Project  |
      | Project Number  | BVT-001                 |
And   I select a region from the Region dropdown
And   I select a PM from the Project Manager dropdown
And   I click the button "Save"

Then  the project is saved successfully
And   I see a success message or the saved project details
And   the project "BVT Smoke Test Project" is accessible
```

## 5. Expected Results
- The Add Project workflow completes without errors.
- The project is created and persisted.
- The project details page displays correctly.

## 6. Postconditions / Cleanup
- Delete or close the created project "BVT Smoke Test Project".

## 7. Notes for the Playwright Agent
- This is a smoke test — verify the create workflow works end-to-end.
- See TC-TS-DETAIL-03/04 for detailed field validation coverage.
