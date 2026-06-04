---
id: TC-TS-CODE-06
title: Edit code value
source_plan: 07-data-maintenance
source_scenario: TS-CODE-06
covers_ac: [AC-code-edit]
persona: Administrator (SYSTEM_ADMIN)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@admin", "@codetables", "@persona-admin"]
last_updated: 2026-06-03
---

# TC-TS-CODE-06 — Edit code value

## 1. Context
Verifies that an existing code value can be edited (Code Value, Code Name, Order Number fields) and that at least Code Value or Code Name is required.

**Source**: Test Plan 07, scenario TS-CODE-06.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` with `Code Read` + `Code Write` permissions.
- **Data**: At least one code value exists in the Accomplishment set.
- **Starting URL**: `${BASE_URL}/admin/codetables`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Original | New |
|-------|----------|-----|
| Code Name | `Active Transportation Project` | `Active Transportation Project Edited` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with admin permissions
And   I am on the "Code Table Management" page
And   the Code Set dropdown shows "Accomplishment"

When  I click the button "Edit Record" on the row containing "Active Transportation Project"
Then  I see an edit dialog with pre-filled values

When  I clear the textbox "Code Name"
And   I fill the textbox "Code Name" with "Active Transportation Project Edited"
And   I click the button "Submit"

Then  the row now shows "Active Transportation Project Edited" in the Code Name column
```

## 5. Expected Results
- Edit dialog opens with current values pre-filled.
- Modifying and submitting updates the record.
- At least Code Value or Code Name must remain filled.

## 6. Postconditions / Cleanup
- Revert: Edit the code value back to "Active Transportation Project".

## 7. Notes for the Playwright Agent
- "Edit Record" button appears on each row in the Actions column.
- Same form structure as Add, with pre-populated fields.
