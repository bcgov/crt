---
id: TC-TS-UI-02
title: No decimals on financial amounts
source_plan: 08-ui-enhancements
source_scenario: TS-UI-02
covers_ac: [AC-ui-no-decimals]
persona: Application User (APP_USER)
priority: High
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@ui", "@financial-planning", "@persona-user"]
last_updated: 2026-06-03
---

# TC-TS-UI-02 — No decimals on financial amounts

## 1. Context
Verifies that decimal values are not allowed on financial amount fields (Financial Plan, Announcement, C-035, Tender values).

**Source**: Test Plan 08, scenario TS-UI-02.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}`.
- **Data**: A project exists with access to Financial Planning.
- **Starting URL**: `${BASE_URL}/projects/{id}/projectplan`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Input | Expected Behavior |
|-------|-------|-------------------|
| Amount | `1000.50` | Decimal not accepted or rounded |
| Amount | `1000` | Accepted |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}"
And   I am on the Financial Planning page for a project

When  I click the button "+ Add"
And   I attempt to enter "1000.50" in the Amount field
Then  the field does not accept decimal input (period is stripped or not enterable)

When  I enter "1000" in the Amount field
Then  the value "1000" is accepted

# Verify in Tender Details
When  I navigate to the Tender Details page
And   I click "+ Add"
And   I attempt to enter "500.99" in a monetary field
Then  the field does not accept decimal input
```

## 5. Expected Results
- Decimal points are not allowed in financial/monetary fields.
- Whole numbers are accepted.
- This applies to Financial Plan, Announcement, C-035, and Tender amount fields.

## 6. Postconditions / Cleanup
- Cancel dialogs; no data was created.

## 7. Notes for the Playwright Agent
- Per §0.8 convention: no decimals on currency fields.
- The input field may use `type="number"` with `step="1"` or strip decimal on input.
- Verify the decimal character cannot be typed or is immediately removed.
