---
id: TC-TS-FIN-08
title: Public Project Information edit and help text
source_plan: 05-financial-planning
source_scenario: TS-FIN-08
covers_ac: [AC-public-project-info]
persona: Application User (MANAGER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@financial", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-FIN-08 — Public Project Information edit and help text

## 1. Context
Verifies that the Public Project Information section on the Financial Plan page can be edited. Fields include Announcement Value (currency), C-035 Value (currency), Estimated Value, and Announcement Comment (free text). Currency fields are integers only. Help text is available via hover.

**Source**: Test Plan 05, scenario TS-FIN-08 ([CRPDB-111]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project (e.g., project ID 79) with the Financial Plan screen accessible.
- **Starting URL**: `${BASE_URL}/projects/79/projectplan`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Announcement Value | `250000` |
| C-035 Value | `175000` |
| Announcement Comment | `CRT-AUTO public info test comment` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the financial plan page for project "79"

# Edit Public Project Information
When  I click the button "Edit Public Project Information"
Then  I see an edit form for public project information

When  I fill the currency field "Announcement Value" with "250000"
And   I fill the currency field "C-035 Value" with "175000"
And   I fill the textarea "Announcement Comment" with "CRT-AUTO public info test comment"
And   I click the button "Submit"

Then  the field "Announcement Value" shows "$250,000"
And   the field "C-035 Value" shows "$175,000"
And   the field "Announcement Comment" shows "CRT-AUTO public info test comment"

# Verify help text on hover
When  I hover over the image near the field "C-035 Value"
Then  I see tooltip text describing the C-035 Value field
```

## 5. Expected Results
- Public Project Information fields are editable.
- Announcement Value and C-035 Value accept integer currency values (no decimals).
- Announcement Comment accepts free text.
- Help text tooltips display on hover for fields with info icons.

## 6. Postconditions / Cleanup
- Revert the Public Project Information to its original values.

## 7. Notes for the Playwright Agent
- The "Edit Public Project Information" button has a pencil icon.
- Currency fields display with $ prefix and comma formatting.
- Fields with `img` icons have tooltip/title text for help.
