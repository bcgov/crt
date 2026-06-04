---
id: TC-TS-BVT-TEND-01
title: "BVT: Create project with tender and Qty/Accmp data"
source_plan: 09-bvt-smoke-tests
source_scenario: TS-BVT-TEND-01
covers_ac: [AC-bvt-tender-create]
persona: Application User (APP_USER)
priority: High
type: E2E
level: Smoke
automation_candidate: Yes
tags: ["@smoke", "@bvt", "@tender", "@quantities", "@persona-user"]
last_updated: 2026-06-03
related_ft: [TC-TS-TEND-02, TC-TS-QTY-02]
---

# TC-TS-BVT-TEND-01 — BVT: Create project with tender and Qty/Accmp data

## 1. Context
Build Verification Test confirming the full workflow: create project → add tender → add Qty/Accomplishment data.

**Source**: Test Plan 09, scenario TS-BVT-TEND-01.

## 2. Preconditions
- **Environment**: Build deployed to UAT.
- **User**: Authenticated as `{{IDIR_VALID_USER}}`.
- **Starting URL**: `${BASE_URL}/`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Section | Field | Value |
|---------|-------|-------|
| Tender | Tender Number | `BVT-T001` |
| Tender | Bid Value | `1000000` |
| Qty/Accmp | Fiscal Year | `2024/2025` |
| Qty/Accmp | Forecast | `5` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}"
And   a project exists (or I create a new one)

# Add Tender
When  I navigate to the Tender Details tab
And   I click the button "+ Add"
And   I fill in tender details (Tender Number "BVT-T001", Bid Value "1000000")
And   I click the button "Submit"
Then  the tender entry appears in the table

# Add Qty/Accomplishment
When  I navigate to the Qty/Accomplishments tab
And   I click the button "+ Add"
And   I fill in quantity details (Fiscal Year "2024/2025", Forecast "5")
And   I click the button "Submit"
Then  the Qty/Accmp entry appears in the table
```

## 5. Expected Results
- Tender data is added and displayed correctly.
- Qty/Accomplishment data is added and displayed correctly.
- Full workflow completes without errors.

## 6. Postconditions / Cleanup
- Delete the tender and Qty/Accmp entries.

## 7. Notes for the Playwright Agent
- Smoke test — verify both tender and Qty workflows work.
