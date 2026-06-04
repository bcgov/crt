---
id: TC-TS-BVT-FIN-02
title: "BVT: Add financial details to existing project"
source_plan: 09-bvt-smoke-tests
source_scenario: TS-BVT-FIN-02
covers_ac: [AC-bvt-financial-later]
persona: Application User (APP_USER)
priority: Medium
type: E2E
level: Smoke
automation_candidate: Yes
tags: ["@smoke", "@bvt", "@financial-planning", "@persona-user"]
last_updated: 2026-06-03
related_ft: [TC-TS-FIN-03]
---

# TC-TS-BVT-FIN-02 — BVT: Add financial details to existing project

## 1. Context
Build Verification Test confirming that financial details can be added to an existing project at a later time (not during initial creation).

**Source**: Test Plan 09, scenario TS-BVT-FIN-02.

## 2. Preconditions
- **Environment**: Build deployed to UAT.
- **User**: Authenticated as `{{IDIR_VALID_USER}}`.
- **Data**: An existing project without financial planning data.
- **Starting URL**: `${BASE_URL}/`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Element | *(any active element)* |
| Fiscal Year | `2025/2026` |
| Amount | `250000` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}"
And   an existing project has no financial planning entries

When  I navigate to the project via Project Search
And   I click the "Financial Plan" tab
Then  the financial planning table shows no data

When  I click the button "+ Add"
And   I fill in financial details (element, fiscal year, amount "250000")
And   I click the button "Submit"

Then  the new financial entry appears in the table
And   the amount displays as "$250,000"
```

## 5. Expected Results
- Users can return to a project and add financial data after initial creation.
- The financial data is saved correctly.

## 6. Postconditions / Cleanup
- Delete the financial entry.

## 7. Notes for the Playwright Agent
- Smoke test verifying the "add later" workflow.
