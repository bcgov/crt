---
id: TC-TS-BVT-FIN-01
title: "BVT: Create project with financial details"
source_plan: 09-bvt-smoke-tests
source_scenario: TS-BVT-FIN-01
covers_ac: [AC-bvt-financial-create]
persona: Application User (APP_USER)
priority: High
type: E2E
level: Smoke
automation_candidate: Yes
tags: ["@smoke", "@bvt", "@financial-planning", "@persona-user"]
last_updated: 2026-06-03
related_ft: [TC-TS-FIN-03, TC-TS-FIN-04]
---

# TC-TS-BVT-FIN-01 — BVT: Create project with financial details

## 1. Context
Build Verification Test confirming the full workflow: create project → navigate to Planning → add financial data.

**Source**: Test Plan 09, scenario TS-BVT-FIN-01.

## 2. Preconditions
- **Environment**: Build deployed to UAT.
- **User**: Authenticated as `{{IDIR_VALID_USER}}`.
- **Starting URL**: `${BASE_URL}/`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Project Name | `BVT Financial Test` |
| Element | *(any active element)* |
| Fiscal Year | `2024/2025` |
| Funding Type | *(any available)* |
| Amount | `500000` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}"

# Create project
When  I create a new project "BVT Financial Test"
And   I save the project

# Navigate to Financial Planning
When  I click the "Financial Plan" tab
And   I click the button "+ Add"
Then  the Add Financial Target dialog opens

When  I select an element from the dropdown
And   I select fiscal year "2024/2025"
And   I select a funding type
And   I enter "500000" in the Amount field
And   I click the button "Submit"

Then  the financial planning entry appears in the table
And   the amount displays as "$500,000"
```

## 5. Expected Results
- Full workflow from project creation to financial data entry completes.
- Financial target is saved and displayed correctly.
- No errors during the workflow.

## 6. Postconditions / Cleanup
- Delete the financial entry and project.

## 7. Notes for the Playwright Agent
- Smoke test — verify the complete workflow without error.
- Amount displays without decimals (per convention).
