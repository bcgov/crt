---
id: TC-TS-DETAIL-03
title: Project Description field with help text
source_plan: 04-project-search-details
source_scenario: TS-DETAIL-03
covers_ac: [AC-description-help-text]
persona: Application User (MANAGER)
priority: Low
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@projects", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-DETAIL-03 — Project Description field with help text

## 1. Context
Verifies that the Project Description field accepts text input and that hovering over its help ("?") icon displays a tooltip with descriptive help text.

**Source**: Test Plan 04, scenario TS-DETAIL-03 ([CRPDB-106]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Starting URL**: `${BASE_URL}/projects`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Description Text | `Test description for validation` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the "Projects" page
When  I click the button "Add Project"
Then  I see the heading "Add Project"

# Verify text entry works
When  I fill the textbox "Project Description" with "Test description for validation"
Then  the textbox "Project Description" contains "Test description for validation"

# Verify help text tooltip
When  I hover over the image near the field labeled "Project Description"
Then  I see tooltip text describing the purpose of the Project Description field
```

## 5. Expected Results
- The Project Description field accepts free-text input.
- A help icon (info/question mark image) is present near the field label.
- Hovering over the help icon displays a tooltip with contextual help text.

## 6. Postconditions / Cleanup
- No data was created (form was not submitted); no cleanup required.

## 7. Notes for the Playwright Agent
- The help icon is an `img` element adjacent to the "Project Description" label.
- The tooltip may render as a `title` attribute or a popover element.
- The exact tooltip text is not specified in the test plan — assert that *some* tooltip text appears.
