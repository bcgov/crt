---
id: TC-TS-PM-06
title: Edit existing PM
source_plan: 07-data-maintenance
source_scenario: TS-PM-06
covers_ac: [AC-pm-edit]
persona: Administrator (SYSTEM_ADMIN)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@admin", "@codetables", "@project-manager", "@persona-admin"]
last_updated: 2026-06-04
---

# TC-TS-PM-06 — Edit existing PM

## 1. Context
Verifies that an existing PM's Code Name or Order can be modified and changes are reflected in the Project Details PM dropdown.

**Source**: Test Plan 07, scenario TS-PM-06.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` with `Code Read` + `Code Write` permissions.
- **Data**: PM "CRT-AUTO Test Manager" exists and is Active.
- **Starting URL**: `${BASE_URL}/admin/codetables`

## 3. Test Data

| Field | Original | Updated |
|-------|----------|---------|
| Code Name | `CRT-AUTO Test Manager` | `CRT-AUTO Updated Manager` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with admin permissions
And   I am on the "Code Table Management" page
And   I have selected "Project Manager" from the Code Value Set dropdown
And   the PM "CRT-AUTO Test Manager" exists

When  I click the "Edit" icon on the row containing "CRT-AUTO Test Manager"
And   I change the textbox "Code Name" to "CRT-AUTO Updated Manager"
And   I click the button "Submit"

Then  the row now shows "CRT-AUTO Updated Manager"

# Verify in Project Details dropdown
When  I navigate to a project details page
And   I click the dropdown "Project Manager"
And   I type "CRT-AUTO" into the filter
Then  I see "CRT-AUTO Updated Manager" in the dropdown
And   "CRT-AUTO Test Manager" no longer appears
```

## 5. Expected Results
- PM name is updated in the code table.
- Updated name appears in Project Details PM dropdown.
- Old name no longer appears.

## 6. Postconditions / Cleanup
- Rename PM back to original name or delete it.

## 7. Notes for the Playwright Agent
- Edit opens an inline form or modal with pre-filled values.
