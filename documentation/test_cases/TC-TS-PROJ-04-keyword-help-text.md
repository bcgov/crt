---
id: TC-TS-PROJ-04
title: Keyword search help text on hover
source_plan: 04-project-search-details
source_scenario: TS-PROJ-04
covers_ac: [AC-keyword-help-text]
persona: Application User (MANAGER)
priority: Low
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@projects", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-PROJ-04 — Keyword search help text on hover

## 1. Context
Verifies that hovering over the keyword field's help icon displays the expected help text: "Look for this keyword in Project Number, Project Name, Project Description and Project Scope."

**Source**: Test Plan 04, scenario TS-PROJ-04 ([CRPDB-105]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Starting URL**: `${BASE_URL}/projects`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data
None required.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the "Projects" page
When  I hover over the image near the textbox "Number/Name/Description/Scope"
Then  I see the text "Look for this keyword in Project Number, Project Name, Project Description and Project Scope."
```

## 5. Expected Results
- A tooltip or popover containing the exact text "Look for this keyword in Project Number, Project Name, Project Description and Project Scope." is visible after hovering.

## 6. Postconditions / Cleanup
- No data was created; no cleanup required.

## 7. Notes for the Playwright Agent
- The help icon is an `img` element adjacent to the search input field.
- The tooltip may appear as a `title` attribute or a rendered popover element.
- Use `.hover()` on the help icon and then assert the tooltip text is visible.
