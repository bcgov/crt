---
id: TC-TS-PM-03
title: Add new PM
source_plan: 07-data-maintenance
source_scenario: TS-PM-03
covers_ac: [AC-pm-add]
persona: Administrator (SYSTEM_ADMIN)
priority: High
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@admin", "@codetables", "@project-manager", "@persona-admin"]
last_updated: 2026-06-04
---

# TC-TS-PM-03 — Add new PM

## 1. Context
Verifies that a new Project Manager can be added via the Code Tables "Project Manager" code set, and that it appears in the code table list and the Project Details PM dropdown.

**Source**: Test Plan 07, scenario TS-PM-03.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` with `Code Read` + `Code Write` permissions.
- **Starting URL**: `${BASE_URL}/admin/codetables`

## 3. Test Data

| Field | Value |
|-------|-------|
| Code Name | `CRT-AUTO Test Manager` |
| Code Value | (optional) |
| Order | (optional) |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with admin permissions
And   I am on the "Code Table Management" page
And   I have selected "Project Manager" from the Code Value Set dropdown

When  I click the button "Add New Project Manager"
Then  I see an add form/dialog

When  I fill the textbox "Code Name" with "CRT-AUTO Test Manager"
And   I click the button "Submit"
Then  the row containing "CRT-AUTO Test Manager" appears in the table

# Verify in Project Details dropdown
When  I navigate to a project details page
And   I click the dropdown "Project Manager"
And   I type "CRT-AUTO" into the filter
Then  I see "CRT-AUTO Test Manager" as an option in the PM dropdown
```

## 5. Expected Results
- The PM is added to the Project Manager code set.
- The PM appears in the Project Details PM dropdown (type-ahead).

## 6. Postconditions / Cleanup
- Delete the PM "CRT-AUTO Test Manager" from Code Tables.

## 7. Notes for the Playwright Agent
- Code Set must be "Project Manager" before adding.
- Verify cross-page integration: Code Tables → Project Details dropdown.
