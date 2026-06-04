---
id: TC-TS-CODE-05
title: Uniqueness validation on code value
source_plan: 07-data-maintenance
source_scenario: TS-CODE-05
covers_ac: [AC-code-uniqueness]
persona: Administrator (SYSTEM_ADMIN)
priority: High
type: Negative
level: E2E
automation_candidate: Yes
tags: ["@regression", "@admin", "@codetables", "@persona-admin"]
last_updated: 2026-06-03
---

# TC-TS-CODE-05 — Uniqueness validation on code value

## 1. Context
Verifies that duplicate Code Values (and duplicate Code Value-Code Name combinations, case-insensitive) are rejected with an error.

**Source**: Test Plan 07, scenario TS-CODE-05.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` with `Code Read` + `Code Write` permissions.
- **Data**: An entry exists in Accomplishment with Code Name "Active Transportation Project".
- **Starting URL**: `${BASE_URL}/admin/codetables`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Attempt | Code Value | Code Name | Expected |
|---------|-----------|-----------|----------|
| Duplicate name | *(empty)* | `Active Transportation Project` | Error |
| Case-insensitive | *(empty)* | `active transportation project` | Error |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with admin permissions
And   I am on the "Code Table Management" page
And   the Code Set dropdown shows "Accomplishment"

# Attempt duplicate Code Name
When  I click the button "Add New Accomplishment"
And   I fill the textbox "Code Name" with "Active Transportation Project"
And   I click the button "Submit"
Then  I see an error message indicating the value already exists

# Attempt case-insensitive duplicate
When  I clear the textbox "Code Name"
And   I fill the textbox "Code Name" with "active transportation project"
And   I click the button "Submit"
Then  I see an error message indicating the value already exists
And   the duplicate entry is not created
```

## 5. Expected Results
- Duplicate Code Value or Code Name within the same code set is rejected.
- The uniqueness check is case-insensitive.
- An appropriate error message is shown.

## 6. Postconditions / Cleanup
- Cancel the dialog; no data was created.

## 7. Notes for the Playwright Agent
- The error may appear as a toast, inline, or field validation message.
- Case-insensitive uniqueness: "ABC" = "abc".
