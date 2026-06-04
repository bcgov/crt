---
id: TC-TS-CODE-04
title: Add new code value to Accomplishment set
source_plan: 07-data-maintenance
source_scenario: TS-CODE-04
covers_ac: [AC-code-add]
persona: Administrator (SYSTEM_ADMIN)
priority: High
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@admin", "@codetables", "@persona-admin"]
last_updated: 2026-06-03
---

# TC-TS-CODE-04 — Add new code value to Accomplishment set

## 1. Context
Verifies that a new code value can be added to the Accomplishment code set with mandatory validation (at least Code Value or Code Name required), and that Order Number auto-populates.

**Source**: Test Plan 07, scenario TS-CODE-04.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` with `Code Read` + `Code Write` permissions.
- **Data**: "Accomplishment" code set selected.
- **Starting URL**: `${BASE_URL}/admin/codetables`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Code Value | `CRT-AUTO-001` |
| Code Name | `CRT Automated Test Accomplishment` |
| Order Number | *(auto-populated)* |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with admin permissions
And   I am on the "Code Table Management" page
And   the Code Set dropdown shows "Accomplishment"

When  I click the button "Add New Accomplishment"
Then  I see a dialog with title "Add Accomplishment"
And   the field "Code Set" is disabled and shows "Accomplishment"
And   the field "Order Number" is auto-populated with a value

When  I fill the textbox "Code Value" with "CRT-AUTO-001"
And   I fill the textbox "Code Name" with "CRT Automated Test Accomplishment"
And   I click the button "Submit"

Then  the dialog closes
And   the row containing "CRT-AUTO-001" appears in the table
And   the row shows "CRT Automated Test Accomplishment" in the Code Name column
```

## 5. Expected Results
- The Add dialog opens with Code Set disabled and Order Number auto-filled.
- After submit, the new code value appears in the table.
- Submit requires at least Code Value or Code Name.

## 6. Postconditions / Cleanup
- Delete the created code value "CRT-AUTO-001" using the Delete action.

## 7. Notes for the Playwright Agent
- The Add button label is dynamic: "Add New Accomplishment" (matches code set).
- Modal title is "Add Accomplishment".
- Code Set field is disabled (input#codeSetName).
- Order Number auto-increments (input#displayOrder).
