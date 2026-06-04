---
id: TC-TS-FIN-04
title: Element field look-ahead shows code and description
source_plan: 05-financial-planning
source_scenario: TS-FIN-04
covers_ac: [AC-element-lookahead]
persona: Application User (MANAGER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@financial", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-FIN-04 — Element field look-ahead shows code and description

## 1. Context
Verifies that the Element dropdown in the Add Financial Target form shows both code and description in the option list, but only the code is displayed after selection (per the look-ahead convention in §0.8).

**Source**: Test Plan 05, scenario TS-FIN-04 ([CRPDB-111]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project (e.g., project ID 79) with the Financial Plan screen accessible.
- **Starting URL**: `${BASE_URL}/projects/79/projectplan`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Search Term | `Gp` |
| Expected Option Text | `Gp-General Paving` |
| Expected After Selection | `Gp` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the financial plan page for project "79"
When  I click the button "+ Add"
Then  I see a dialog for adding a financial target

When  I click the dropdown "Element"
Then  the dropdown list shows options with code and description (e.g., "Gp-General Paving")

When  I type "Gp" into the filter of the dropdown "Element"
Then  the list is filtered to show "Gp-General Paving"

When  I select "Gp-General Paving" from the dropdown
Then  the dropdown shows "Gp" as the selected value
```

## 5. Expected Results
- The Element dropdown options display as `<code>-<description>` (e.g., "Gp-General Paving").
- Typing filters the options list.
- After selection, only the code portion is displayed in the field (e.g., "Gp").

## 6. Postconditions / Cleanup
- No data was created; close the dialog with "Cancel".

## 7. Notes for the Playwright Agent
- The Element dropdown has 50+ options.
- Look-ahead filtering may use a text input within the dropdown.
- The display-after-selection behavior is a key assertion: code only, not the full description.
