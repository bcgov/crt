---
id: TC-TS-BVT-RAT-01
title: "BVT: Add ratios manually"
source_plan: 09-bvt-smoke-tests
source_scenario: TS-BVT-RAT-01
covers_ac: [AC-bvt-ratio-manual]
persona: Application User (APP_USER)
priority: High
type: E2E
level: Smoke
automation_candidate: Yes
tags: ["@smoke", "@bvt", "@ratios", "@persona-user"]
last_updated: 2026-06-03
related_ft: [TC-TS-RAT-02, TC-TS-RAT-03]
---

# TC-TS-BVT-RAT-01 — BVT: Add ratios manually

## 1. Context
Build Verification Test confirming that administrative boundaries and ratios can be added manually, with over/under 1 feedback.

**Source**: Test Plan 09, scenario TS-BVT-RAT-01.

## 2. Preconditions
- **Environment**: Build deployed to UAT.
- **User**: Authenticated as `{{IDIR_VALID_USER}}`.
- **Data**: An existing project accessible for editing.
- **Starting URL**: `${BASE_URL}/projects/{id}/ratio`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| District | Ratio |
|----------|-------|
| North Coast | 0.60 |
| South Coast | 0.40 |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}"
And   I am on the Ratios page for an existing project

When  I click the button "+ Add" for Electoral District
And   I select "North Coast" from the district dropdown
And   I enter ratio "0.60"
And   I click the button "Submit"
Then  the ratio entry appears

When  I click the button "+ Add" for Electoral District
And   I select "South Coast" from the district dropdown
And   I enter ratio "0.40"
And   I click the button "Submit"
Then  both ratios are listed
And   the total ratio equals 1.00 (no warning displayed)
```

## 5. Expected Results
- Ratios can be added for administrative boundaries.
- When ratios sum to 1.00, no warning is shown.
- If ratios were over/under 1, a warning would be displayed.

## 6. Postconditions / Cleanup
- Delete the created ratio entries.

## 7. Notes for the Playwright Agent
- Smoke test — verify the manual ratio workflow.
- See TC-TS-RAT-* for detailed coverage of over/under warnings.
