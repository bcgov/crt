---
id: TC-TS-RAT-01
title: Add ratios for each boundary category
source_plan: 06-spatial-segments-ratios
source_scenario: TS-RAT-01
covers_ac: [AC-add-ratios-all-categories]
persona: Application User (MANAGER)
priority: High
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@ratios", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-RAT-01 — Add ratios for each boundary category

## 1. Context
Verifies that ratios can be added for each of the five administrative boundary categories: Electoral Districts, Districts, Highways, Economic Regions, and Service Areas. Each category has its own "+ Add" button and displays the correct dropdown options.

**Source**: Test Plan 06, scenario TS-RAT-01 ([CRPDB-163]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project (e.g., project ID 79) accessible from the Segments page.
- **Starting URL**: `${BASE_URL}/projects/79/segments`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Category | Value | Ratio |
|----------|-------|-------|
| Electoral Districts | `Cowichan Valley` | `1` |
| Districts | `Vancouver Island` | `1` |
| Highways | `Hwy 1` | `1` |
| Economic Regions | `Vancouver Island and Coast` | `1` |
| Service Areas | `South Island` | `1` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the segments page for project "79"

# Add Electoral District ratio
When  I click the button "+ Add" in the "Electoral Districts" section
Then  I see a form with a dropdown for selecting an Electoral District and a ratio field
When  I select "Cowichan Valley" from the dropdown
And   I fill the ratio field with "1"
And   I click the button "Submit"
Then  the row containing "Cowichan Valley" appears in the Electoral Districts table with ratio "1"

# Add District ratio
When  I click the button "+ Add" in the "Districts" section
Then  I see a form with a dropdown for selecting a District
When  I select "Vancouver Island" from the dropdown
And   I fill the ratio field with "1"
And   I click the button "Submit"
Then  the row containing "Vancouver Island" appears in the Districts table with ratio "1"

# Add Highway ratio
When  I click the button "+ Add" in the "Highways" section
Then  I see a form with a dropdown for selecting a Highway
When  I select "Hwy 1" from the dropdown
And   I fill the ratio field with "1"
And   I click the button "Submit"
Then  the row containing "Hwy 1" appears in the Highways table with ratio "1"

# Add Economic Region ratio
When  I click the button "+ Add" in the "Economic Regions" section
Then  I see a form with a dropdown for selecting an Economic Region
When  I select "Vancouver Island and Coast" from the dropdown
And   I fill the ratio field with "1"
And   I click the button "Submit"
Then  the row containing "Vancouver Island and Coast" appears in the Economic Regions table with ratio "1"

# Add Service Area ratio
When  I click the button "+ Add" in the "Service Areas" section
Then  I see a form with a dropdown for selecting a Service Area
When  I select "South Island" from the dropdown
And   I fill the ratio field with "1"
And   I click the button "Submit"
Then  the row containing "South Island" appears in the Service Areas table with ratio "1"
```

## 5. Expected Results
- Each category has its own "+ Add" button and associated form.
- Each form has a category-specific dropdown (district names, highway names, etc.) and a ratio input.
- Entries appear in their respective category tables after submission.

## 6. Postconditions / Cleanup
- Delete the created ratio entries using the Delete Record buttons.

## 7. Notes for the Playwright Agent
- There are five separate "+ Add" buttons on the page, one per ratio category section.
- Each section has its own heading: "Electoral Districts", "Districts", "Highways", "Economic Regions", "Service Areas".
- Use section-scoped selectors to distinguish between the "+ Add" buttons.
- Ratio values are decimal numbers (typically summing to 1 within a category).
