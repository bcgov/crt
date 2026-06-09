---
id: TC-TS-RAT-06
title: Determine ratios using segments — no existing data
source_plan: 06-spatial-segments-ratios
source_scenario: TS-RAT-06
covers_ac: [AC-determine-ratios-new]
persona: Application User (MANAGER)
priority: High
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@ratios", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-RAT-06 — Determine ratios using segments — no existing data

## 1. Context
Verifies that the "Determine Ratios Using Segments" button calculates ratios from the project's segment data when no existing ratio data is present. A success message is displayed.

**Source**: Test Plan 06, scenario TS-RAT-06 ([CRPDB-218]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project (e.g., project ID 79) with at least one segment defined but NO existing ratio entries.
- **Starting URL**: `${BASE_URL}/projects/79/segments`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data
Project must have segments but no manually-entered ratios.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the segments page for project "79"
And   at least one segment exists for the project
And   no ratio entries exist for any category

When  I click the button "Determine Ratios Using Segments"
Then  I see a success message "Ratios determined. These calculated values are suggestions"
And   ratio entries are populated in one or more category tables
And   the calculated ratios sum to 1 within each populated category
```

## 5. Expected Results
- The button triggers auto-calculation of ratios from segment data.
- A success message appears: "Ratios determined. These calculated values are suggestions…"
- Ratio entries are populated across relevant categories (Electoral Districts, Districts, Highways, Economic Regions, Service Areas).
- Each category's ratios sum to 1.

## 6. Postconditions / Cleanup
- Delete the auto-generated ratio entries if needed for other tests.

## 7. Notes for the Playwright Agent
- The button "Determine Ratios Using Segments" is in the "Project Ratios" section header.
- The success message text starts with "Ratios determined. These calculated values are suggestions" (exact full text may vary).
- After determination, verify that at least one category table has been populated.
- Verify sums equal 1 by reading all ratio values in each category.
