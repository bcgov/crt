---
id: TC-TS-ELEM-04
title: Add element — Code Name required validation
source_plan: 07-data-maintenance
source_scenario: TS-ELEM-04
covers_ac: [AC-elem-codename-required]
persona: Administrator (SYSTEM_ADMIN)
priority: High
type: Negative
level: E2E
automation_candidate: Yes
tags: ["@regression", "@admin", "@elements", "@persona-admin"]
last_updated: 2026-06-03
---

# TC-TS-ELEM-04 — Add element — Code Name required validation

## 1. Context
Verifies that attempting to add an element without a Code Name produces a validation error.

**Source**: Test Plan 07, scenario TS-ELEM-04.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` with `Code Read` + `Code Write` permissions.
- **Starting URL**: `${BASE_URL}/admin/elements`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Code Value | `Zz` |
| Code Name | *(left blank)* |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with admin permissions
And   I am on the "Elements Management" page
When  I click the button "Add New Element"
Then  I see a dialog for adding a new element

When  I fill the textbox "Code Value" with "Zz"
And   I leave the textbox "Code Name" empty
Then  the button "Submit" is disabled
```

## 5. Expected Results
- The Submit button remains disabled when Code Name is empty.
- The element is not created.

## 6. Postconditions / Cleanup
- Close the dialog with "Cancel"; no data was created.

## 7. Notes for the Playwright Agent
- Code Name is marked as required (*).
- Submit is disabled until required fields are filled.
