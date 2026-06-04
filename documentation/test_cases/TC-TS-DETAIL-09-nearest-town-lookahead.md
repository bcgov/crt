---
id: TC-TS-DETAIL-09
title: Nearest Town look-ahead type-ahead selection
source_plan: 04-project-search-details
source_scenario: TS-DETAIL-09
covers_ac: [AC-nearest-town-lookup]
persona: Application User (MANAGER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@projects", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-DETAIL-09 — Nearest Town look-ahead type-ahead selection

## 1. Context
Verifies that the Nearest Town field is a type-ahead dropdown: typing filters the list of towns, and the user can select a single value from the suggestions.

**Source**: Test Plan 04, scenario TS-DETAIL-09 ([CRPDB-106]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: The town lookup table contains entries (e.g., "Duncan", "Victoria", "Nanaimo").
- **Starting URL**: `${BASE_URL}/projects`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Type-ahead Input | `Dun` |
| Expected Suggestion | `Duncan` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the "Projects" page
When  I click the button "Add Project"
Then  I see the heading "Add Project"

# Type partial text in Nearest Town
When  I type "Dun" into the dropdown "Nearest Town"
Then  I see a suggestion list containing "Duncan"

# Select from suggestions
When  I click the option "Duncan" in the suggestion list
Then  the field "Nearest Town" shows "Duncan"
```

## 5. Expected Results
- Typing a partial town name filters the dropdown suggestions.
- The suggestion list shows towns matching the typed text.
- Selecting a suggestion populates the field with that single value.
- Only one town can be selected (single-select).

## 6. Postconditions / Cleanup
- No data was created (form was not submitted); no cleanup required.

## 7. Notes for the Playwright Agent
- The Nearest Town field is a dropdown with autocomplete/type-ahead behavior.
- After typing, suggestions may appear as a list below the input.
- The field shows only the code or short name after selection (per look-ahead convention in §0.8).
