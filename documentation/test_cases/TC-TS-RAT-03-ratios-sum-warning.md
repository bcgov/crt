---
id: TC-TS-RAT-03
title: Ratios do not sum to 1 — warning displayed
source_plan: 06-spatial-segments-ratios
source_scenario: TS-RAT-03
covers_ac: [AC-ratios-sum-warning]
persona: Application User (MANAGER)
priority: High
type: Negative
level: E2E
automation_candidate: Yes
tags: ["@regression", "@ratios", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-RAT-03 — Ratios do not sum to 1 — warning displayed

## 1. Context
Verifies that when ratios for a category do not sum to 1, a yellow info icon appears on that ratio type's heading, and clicking it shows the message "The sum of the ratios should be 1".

**Source**: Test Plan 06, scenario TS-RAT-03 ([CRPDB-163]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project (e.g., project ID 79) accessible from the Segments page.
- **Starting URL**: `${BASE_URL}/projects/79/segments`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Category | Entry | Ratio | Sum |
|----------|-------|-------|-----|
| Highways | Hwy 1 | `0.50` | 0.50 (≠ 1) |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the segments page for project "79"

# Add a single highway ratio that does NOT sum to 1
When  I add a Highway ratio "Hwy 1" with value "0.50"

Then  the Highways section shows the entry with ratio "0.50"
And   a yellow info icon appears in the Highways section heading

When  I click the yellow info icon in the Highways heading
Then  I see the text "The sum of the ratios should be 1"
```

## 5. Expected Results
- A yellow info/warning icon appears next to the ratio category heading.
- Clicking or hovering on the icon reveals the message: "The sum of the ratios should be 1".
- The warning persists until the ratios are corrected to sum to 1.

## 6. Postconditions / Cleanup
- Delete the created ratio entry or add another to make the sum equal 1.

## 7. Notes for the Playwright Agent
- The warning icon is a yellow info/alert icon — look for an `img` or icon element near the section heading.
- The message "The sum of the ratios should be 1" should be asserted verbatim.
- The warning is per-category: only the category with sum ≠ 1 shows the icon.
