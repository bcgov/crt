---
id: TC-TS-BVT-SEARCH-01
title: "BVT: Search projects end-to-end"
source_plan: 09-bvt-smoke-tests
source_scenario: TS-BVT-SEARCH-01
covers_ac: [AC-bvt-search]
persona: Application User (APP_USER)
priority: High
type: E2E
level: Smoke
automation_candidate: Yes
tags: ["@smoke", "@bvt", "@project-search", "@persona-user"]
last_updated: 2026-06-03
related_ft: [TC-TS-PROJ-01, TC-TS-PROJ-02, TC-TS-PROJ-03, TC-TS-PROJ-04]
---

# TC-TS-BVT-SEARCH-01 — BVT: Search projects end-to-end

## 1. Context
Build Verification Test confirming that the Project Search workflow functions correctly after UAT deployment. This is a coarse-grained E2E check — see related FT test cases for detailed coverage.

**Source**: Test Plan 09, scenario TS-BVT-SEARCH-01.

## 2. Preconditions
- **Environment**: Build deployed to UAT.
- **User**: Authenticated as `{{IDIR_VALID_USER}}`.
- **Data**: At least one project exists in the system.
- **Starting URL**: `${BASE_URL}/`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Filter | Value |
|--------|-------|
| Region | `2 - South Coast` |
| Keywords | `Highway` |
| Project Manager | *(any available PM)* |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}"
And   I am on the Project Search page

# Search by region
When  I select "2 - South Coast" from the region dropdown
And   I click the button "Search"
Then  the results table shows projects in "South Coast" region

# Search by keywords
When  I click the button "Reset"
And   I fill the textbox "Keywords" with "Highway"
And   I click the button "Search"
Then  the results table shows projects matching "Highway"

# Search by PM filter
When  I click the button "Reset"
And   I select a PM from the Project Manager dropdown
And   I click the button "Search"
Then  the results table shows projects assigned to that PM

# Open a project from results
When  I click on a project row in the results
Then  the Project Details page loads successfully
```

## 5. Expected Results
- Project Search page loads without error.
- Region, Keywords, and PM filters produce relevant results.
- Clicking a result navigates to Project Details.

## 6. Postconditions / Cleanup
- No data was created; no cleanup required.

## 7. Notes for the Playwright Agent
- This is a smoke test — verify the workflow completes without errors.
- Do not test all edge cases; see TC-TS-PROJ-* for detailed coverage.
