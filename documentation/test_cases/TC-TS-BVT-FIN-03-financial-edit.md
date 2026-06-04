---
id: TC-TS-BVT-FIN-03
title: "BVT: Edit financial details"
source_plan: 09-bvt-smoke-tests
source_scenario: TS-BVT-FIN-03
covers_ac: [AC-bvt-financial-edit]
persona: Application User (APP_USER)
priority: Medium
type: E2E
level: Smoke
automation_candidate: Yes
tags: ["@smoke", "@bvt", "@financial-planning", "@persona-user"]
last_updated: 2026-06-03
related_ft: [TC-TS-FIN-05]
---

# TC-TS-BVT-FIN-03 — BVT: Edit financial details

## 1. Context
Build Verification Test confirming that existing financial planning entries can be edited.

**Source**: Test Plan 09, scenario TS-BVT-FIN-03.

## 2. Preconditions
- **Environment**: Build deployed to UAT.
- **User**: Authenticated as `{{IDIR_VALID_USER}}`.
- **Data**: A project with at least one financial planning entry.
- **Starting URL**: `${BASE_URL}/projects/{id}/projectplan`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Original | Updated |
|-------|----------|---------|
| Amount | `500000` | `750000` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}"
And   I am on the Financial Planning page for a project with existing entries

When  I click the button "Edit Record" on an existing financial row
Then  an edit dialog opens with pre-filled values

When  I change the Amount field to "750000"
And   I click the button "Submit"

Then  the row updates to show the new amount "$750,000"
```

## 5. Expected Results
- Edit dialog opens with current data.
- Changes are saved and reflected in the table.
- No errors during the edit workflow.

## 6. Postconditions / Cleanup
- Revert the amount to its original value.

## 7. Notes for the Playwright Agent
- Smoke test — verify edit workflow works end-to-end.
