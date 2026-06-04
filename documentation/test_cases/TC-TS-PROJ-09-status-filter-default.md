---
id: TC-TS-PROJ-09
title: Status filter options and default value
source_plan: 04-project-search-details
source_scenario: TS-PROJ-09
covers_ac: [AC-status-filter-default]
persona: Application User (MANAGER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@projects", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-PROJ-09 — Status filter options and default value

## 1. Context
Verifies that the Status dropdown on the Project Search page contains the expected options (Active, Closed) and that "Active" is selected by default on page load.

**Source**: Test Plan 04, scenario TS-PROJ-09 ([CRPDB-105]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Starting URL**: `${BASE_URL}/projects`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data
None required.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
When  I navigate to the "Projects" page
Then  the button "Active" is visible
And   the button text indicates "Active" is the default status filter

When  I click the button "Active"
Then  I see the option "Active" in the dropdown
And   I see the option "Closed" in the dropdown
And   the checkbox "Active" is checked by default
```

## 5. Expected Results
- The Status dropdown button displays "Active" by default on page load.
- Opening the dropdown reveals two options: "Active" and "Closed".
- "Active" is pre-selected (checked).

## 6. Postconditions / Cleanup
- No data was created; no cleanup required.

## 7. Notes for the Playwright Agent
- The status dropdown button text is "Active" by default (observed in exploration).
- The URL parameter `isInProgress=true` corresponds to "Active" status.
- Options may historically have been labeled "In-progress" / "Completed" but are now "Active" / "Closed".
