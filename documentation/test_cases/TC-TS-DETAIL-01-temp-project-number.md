---
id: TC-TS-DETAIL-01
title: Temporary project number assignment on save without number
source_plan: 04-project-search-details
source_scenario: TS-DETAIL-01
covers_ac: [AC-temp-project-number]
persona: Application User (MANAGER)
priority: High
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@projects", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-DETAIL-01 — Temporary project number assignment on save without number

## 1. Context
Verifies that when a user creates a project without providing a Project Number, the system prompts with a confirmation dialog offering to assign a temporary number in the format "Temp-<region>-<ID>". Choosing "Yes" assigns the temporary number and saves; choosing "No" cancels the save.

**Source**: Test Plan 04, scenario TS-DETAIL-01 ([CRPDB-106]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: No conflicting temp project numbers in the database.
- **Starting URL**: `${BASE_URL}/projects`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Project Number | *(left blank)* |
| Project Name | `CRT-AUTO-TEMP-001` |
| MoTI Region | `1-South Coast` |
| RC Number | `55750` |
| Capital Index | `7-Capitalizable-All components>15yrs` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the "Projects" page

# Create project without a project number
When  I click the button "Add Project"
Then  I see the heading "Add Project"
When  I fill the textbox "Project Name*" with "CRT-AUTO-TEMP-001"
And   I select "1-South Coast" from the dropdown "MoTI Region*"
And   I select "55750" from the dropdown "RC Number*"
And   I select "7-Capitalizable-All components>15yrs" from the dropdown "Capital Index*"
And   I click the button "Submit"

# Confirm temporary number prompt appears
Then  I see a dialog with text "Project number was not provided"
And   I see the button "Yes" in the dialog
And   I see the button "No" in the dialog

# Accept temporary number assignment
When  I click the button "Yes"
Then  the project is saved successfully
And   the project number matches the pattern "Temp-1-"
```

## 5. Expected Results
- A prompt dialog appears with text indicating the project number was not provided and offering to assign a temporary number.
- Clicking "Yes" saves the project with a temporary number in the format `Temp-<region code>-<ID>`.
- The project appears in the project list with the assigned temporary number.

## 6. Postconditions / Cleanup
- Delete the created project `CRT-AUTO-TEMP-001` via the application or API.

## 7. Examples (data-driven variant for No response)

| Example | Action | Expected Outcome |
|---------|--------|------------------|
| 1 | Click "Yes" on temp number prompt | Project saved with temp number |
| 2 | Click "No" on temp number prompt | Save cancelled; form remains open |

## 8. Notes for the Playwright Agent
- The prompt text is: "Project number was not provided…" (the exact wording may vary slightly).
- The temp number format is `Temp-<region_code>-<auto_id>` (e.g., `Temp-1-123`).
- Wait for the dialog to appear before asserting or clicking buttons.
