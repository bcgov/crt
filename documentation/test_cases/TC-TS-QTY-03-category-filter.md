---
id: TC-TS-QTY-03
title: Category filter Qty/Accmp/All
source_plan: 05-financial-planning
source_scenario: TS-QTY-03
covers_ac: [AC-qty-category-filter]
persona: Application User (MANAGER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@quantities", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-QTY-03 — Category filter Qty/Accmp/All

## 1. Context
Verifies that the Quantities/Accomplishments section can be filtered by category: Accomplishments only, Quantities only, or Show All (default).

**Source**: Test Plan 05, scenario TS-QTY-03 ([CRPDB-112]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project with both Quantity and Accomplishment entries.
- **Starting URL**: `${BASE_URL}/projects/79/projecttender`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data
At least one Quantity entry and one Accomplishment entry must exist for the project.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the tender page for project "79"
And   the project has both Quantity and Accomplishment entries

# Default shows all
Then  the button "Show All Qty/Accmp" is visible
And   the table shows both Quantity and Accomplishment entries

# Filter to show only Accomplishments
When  I click the button "Show All Qty/Accmp"
And   I select the "Accomplishments" filter option
Then  the table shows only entries with type "Accomplishment"
And   entries with type "Quantity" are not visible

# Filter to show only Quantities
When  I select the "Quantities" filter option
Then  the table shows only entries with type "Quantity"
And   entries with type "Accomplishment" are not visible

# Reset to Show All
When  I select the "Show All" filter option
Then  the table shows both Quantity and Accomplishment entries
```

## 5. Expected Results
- Default view shows all entries (both Qty and Accmp).
- Filtering by "Accomplishments" hides Quantity rows.
- Filtering by "Quantities" hides Accomplishment rows.
- "Show All" restores both types.

## 6. Postconditions / Cleanup
- No data was created; no cleanup required.

## 7. Notes for the Playwright Agent
- The "Show All Qty/Accmp" button is a toggle/filter control in the section header.
- The filter mechanism may be a toggle button or a dropdown.
- Verify filtering by checking the "Accomplishment/Quantity" column values in visible rows.
