---
id: TC-TS-RAT-07
title: Determine ratios with existing data — overwrite warning
source_plan: 06-spatial-segments-ratios
source_scenario: TS-RAT-07
covers_ac: [AC-determine-ratios-overwrite]
persona: Application User (MANAGER)
priority: High
type: Edge Case
level: E2E
automation_candidate: Yes
tags: ["@regression", "@ratios", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-RAT-07 — Determine ratios with existing data — overwrite warning

## 1. Context
Verifies that when existing manual ratios are present and the user clicks "Determine Ratios Using Segments", a warning appears indicating existing ratios will be overwritten. Confirming overwrites the data; canceling preserves existing ratios.

**Source**: Test Plan 06, scenario TS-RAT-07 ([CRPDB-218]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project (e.g., project ID 79) with at least one segment AND at least one manually-entered ratio.
- **Starting URL**: `${BASE_URL}/projects/79/segments`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data
Manually-entered ratio exists (e.g., Electoral Districts: Cowichan Valley = 1).

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the segments page for project "79"
And   at least one segment exists for the project
And   at least one manual ratio entry exists

When  I click the button "Determine Ratios Using Segments"
Then  I see a warning dialog with text "This action will overwrite the current project ratios"
And   I see a confirm button and a cancel button

# Cancel preserves existing ratios
When  I click the button "Cancel"
Then  the existing ratio entries remain unchanged

# Confirm overwrites ratios
When  I click the button "Determine Ratios Using Segments"
And   I see the warning dialog
When  I click the confirm button
Then  the ratio entries are replaced with calculated values from segments
And   I see a success message
```

## 5. Expected Results
- A warning dialog appears with text about overwriting current project ratios.
- Canceling preserves the manually-entered ratios.
- Confirming replaces all existing ratios with auto-calculated values from segments.

## 6. Postconditions / Cleanup
- Re-create the original manual ratios if needed.

## 7. Notes for the Playwright Agent
- The warning text contains "This action will overwrite the current project ratios" (full text may include more context).
- After overwrite, all categories are recalculated — verify multiple category tables are updated.
