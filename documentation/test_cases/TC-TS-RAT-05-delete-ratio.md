---
id: TC-TS-RAT-05
title: Delete ratio with warning recalculation
source_plan: 06-spatial-segments-ratios
source_scenario: TS-RAT-05
covers_ac: [AC-delete-ratio]
persona: Application User (MANAGER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@ratios", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-RAT-05 — Delete ratio with warning recalculation

## 1. Context
Verifies that deleting a ratio entry triggers a confirmation prompt, and after deletion the warning icon is recalculated for remaining entries. If no rows remain for that ratio type, no warning is shown.

**Source**: Test Plan 06, scenario TS-RAT-05 ([CRPDB-163]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project (e.g., project ID 79) with multiple ratio entries in one category (e.g., Highways with Hwy 1 = 0.70, Hwy 18 = 0.30).
- **Starting URL**: `${BASE_URL}/projects/79/segments`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Category | Entry | Ratio |
|----------|-------|-------|
| Highways | Hwy 1 | `0.70` |
| Highways | Hwy 18 | `0.30` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the segments page for project "79"
And   the Highways section has entries "Hwy 1" (0.70) and "Hwy 18" (0.30) summing to 1
And   no warning icon is displayed in the Highways section

# Delete one entry — sum now ≠ 1
When  I click the button "Delete Record" on the "Hwy 18" ratio row
Then  I see a dialog with text "Are you sure?"
When  I click the confirm button
Then  the "Hwy 18" row is removed from the Highways table
And   a warning icon appears in the Highways section (sum is now 0.70 ≠ 1)

# Delete the remaining entry — no rows remain
When  I click the button "Delete Record" on the "Hwy 1" ratio row
Then  I see a dialog with text "Are you sure?"
When  I click the confirm button
Then  the "Hwy 1" row is removed from the Highways table
And   no warning icon is displayed in the Highways section (no rows remain)
```

## 5. Expected Results
- Deletion requires "Are you sure?" confirmation.
- After deleting one entry, the warning recalculates (0.70 ≠ 1, so warning appears).
- After deleting all entries in a category, no warning is shown (no data to validate).

## 6. Postconditions / Cleanup
- Re-create the deleted ratio entries if needed for other tests.

## 7. Notes for the Playwright Agent
- The warning icon only appears when at least one row exists AND the sum ≠ 1.
- An empty category (no ratio rows) should NOT show a warning.
- Confirm deletion recalculates the sum dynamically.
