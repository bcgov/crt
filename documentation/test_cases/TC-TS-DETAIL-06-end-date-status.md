---
id: TC-TS-DETAIL-06
title: Project end date determines Active/Closed status
source_plan: 04-project-search-details
source_scenario: TS-DETAIL-06
covers_ac: [AC-end-date-status]
persona: Application User (MANAGER)
priority: High
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@projects", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-DETAIL-06 — Project end date determines Active/Closed status

## 1. Context
Verifies that a project's status is automatically determined by its End Date:
- If end date is in the future → status is "Active"
- If end date is today or in the past → status is "Closed"
- If no end date is set → status is "Active"

**Source**: Test Plan 04, scenario TS-DETAIL-06 ([CRPDB-106]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project that can be edited (e.g., `{{PROJECT_NUMBER_EXISTING}}`).
- **Starting URL**: `${BASE_URL}/projects/{id}` (an existing project's details page)
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value | Expected Status |
|-------|-------|-----------------|
| End Date (future) | `2027-12-31` | Active |
| End Date (past) | `2020-01-01` | Closed |
| End Date (today) | `2026-06-03` | Closed |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I navigate to an existing project details page

# Set end date in the future → Active
When  I click the button "Edit Project"
And   I fill the field labeled "End Date" with "2027-12-31"
And   I click the button "Save"
Then  the field "Project Closed" shows "No"
And   the project status in the project list is "Active"

# Set end date in the past → Closed
When  I click the button "Edit Project"
And   I fill the field labeled "End Date" with "2020-01-01"
And   I click the button "Save"
Then  the field "Project Closed" shows "Yes"
And   the project status in the project list is "Closed"

# Set end date to today → Closed
When  I click the button "Edit Project"
And   I fill the field labeled "End Date" with "2026-06-03"
And   I click the button "Save"
Then  the field "Project Closed" shows "Yes"
```

## 5. Expected Results
- A project with an end date in the future has status "Active" (Project Closed = No).
- A project with an end date in the past has status "Closed" (Project Closed = Yes).
- A project with an end date of today has status "Closed" (Project Closed = Yes).

## 6. Postconditions / Cleanup
- Reset the project's end date to its original value (or remove it to restore "Active" status).

## 7. Notes for the Playwright Agent
- The End Date field is in the Edit Project form (`input[name="endDate"]` with YYYY-MM-DD format).
- Status is visible on the Project Details page as the "Project Closed" field (Yes/No).
- Also visible in the project list as an "Active" badge or absence thereof.
- Use a future date that won't become "today" during test runs.
