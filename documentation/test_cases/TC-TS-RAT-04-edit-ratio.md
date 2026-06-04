---
id: TC-TS-RAT-04
title: Edit ratio value
source_plan: 06-spatial-segments-ratios
source_scenario: TS-RAT-04
covers_ac: [AC-edit-ratio]
persona: Application User (MANAGER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@ratios", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-RAT-04 — Edit ratio value

## 1. Context
Verifies that an existing ratio entry can be edited to change its value, and that the warning icon updates accordingly (appearing or disappearing based on whether the updated values sum to 1).

**Source**: Test Plan 06, scenario TS-RAT-04 ([CRPDB-163]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project (e.g., project ID 79) with at least one ratio entry.
- **Starting URL**: `${BASE_URL}/projects/79/segments`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Original Value | New Value |
|-------|---------------|-----------|
| Ratio (Highways - Hwy 1) | `0.99` | `1` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the segments page for project "79"
And   a Highway ratio exists with value "0.99" (warning icon is displayed)

When  I click the button "Edit Record" on the Hwy 1 ratio row
Then  I see an edit form with the current ratio value pre-filled

When  I clear the ratio field
And   I fill the ratio field with "1"
And   I click the button "Submit"

Then  the Highway ratio row shows "1" in the Ratios column
And   the warning icon in the Highways section is no longer visible
```

## 5. Expected Results
- The ratio value can be updated via the edit form.
- After saving, the table reflects the new value.
- If the updated sum equals 1, the warning icon disappears.
- If the updated sum does not equal 1, the warning icon remains/appears.

## 6. Postconditions / Cleanup
- Revert the ratio to its original value if needed.

## 7. Notes for the Playwright Agent
- The "Edit Record" button is per-row with a pencil icon.
- The edit form is a modal/inline form with the ratio value pre-filled.
- After edit, verify both the displayed value AND the warning icon state.
