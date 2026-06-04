---
id: TC-TS-RAT-02
title: Ratios sum to 1 — no warning
source_plan: 06-spatial-segments-ratios
source_scenario: TS-RAT-02
covers_ac: [AC-ratios-sum-valid]
persona: Application User (MANAGER)
priority: High
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@ratios", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-RAT-02 — Ratios sum to 1 — no warning

## 1. Context
Verifies that when ratios for a category sum to exactly 1, no warning icon or message is displayed.

**Source**: Test Plan 06, scenario TS-RAT-02 ([CRPDB-163]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project (e.g., project ID 79) with ratio entries that sum to 1 in at least one category.
- **Starting URL**: `${BASE_URL}/projects/79/segments`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Category | Entries | Ratios | Sum |
|----------|---------|--------|-----|
| Highways | Hwy 1 | `0.70` | 1.00 |
| | Hwy 18 | `0.30` | |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the segments page for project "79"

# Add two highway ratios that sum to 1
When  I add a Highway ratio "Hwy 1" with value "0.70"
And   I add a Highway ratio "Hwy 18" with value "0.30"

Then  the Highways section shows both entries
And   no warning icon is displayed in the Highways section heading
And   no message "The sum of the ratios should be 1" is visible
```

## 5. Expected Results
- When ratios sum to exactly 1.00, no yellow info icon or warning message appears.
- The section displays normally without any validation indicators.

## 6. Postconditions / Cleanup
- Delete the created ratio entries.

## 7. Notes for the Playwright Agent
- The warning icon is a yellow info icon that appears in the section heading when sum ≠ 1.
- Assert its absence with `toBeHidden()` or by checking that no warning element exists.
- Use `0.70 + 0.30 = 1.00` to ensure exact sum (avoid floating point issues).
