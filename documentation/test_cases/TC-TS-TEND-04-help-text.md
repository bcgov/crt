---
id: TC-TS-TEND-04
title: Tender form hover-over help text
source_plan: 05-financial-planning
source_scenario: TS-TEND-04
covers_ac: [AC-tender-help-text]
persona: Application User (MANAGER)
priority: Low
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@tender", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-TEND-04 — Tender form hover-over help text

## 1. Context
Verifies that hovering over tender form field labels displays help text describing each field's purpose.

**Source**: Test Plan 05, scenario TS-TEND-04 ([CRPDB-113]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project (e.g., project ID 79) accessible from the Tender page.
- **Starting URL**: `${BASE_URL}/projects/79/projecttender`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data
None required.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the tender page for project "79"
When  I click the first button "+ Add" in the Project Tender Details section
Then  I see a dialog for adding a tender record

When  I hover over the help icon near "Tender Number"
Then  I see tooltip text describing the Tender Number field

When  I hover over the help icon near "Ministry Estimate"
Then  I see tooltip text describing the Ministry Estimate field

When  I hover over the help icon near "Winning Bid"
Then  I see tooltip text describing the Winning Bid field
```

## 5. Expected Results
- Help icons are present next to field labels.
- Hovering over each help icon shows a tooltip with descriptive text.

## 6. Postconditions / Cleanup
- Close the dialog with "Cancel"; no data was created.

## 7. Notes for the Playwright Agent
- Help icons are `img` elements near field labels.
- Tooltips may use `title` attributes or rendered popover elements.
- Not all fields may have help icons — assert only those that do.
