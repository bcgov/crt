---
id: TC-TS-ELEM-05
title: Add element — duplicate prevention
source_plan: 07-data-maintenance
source_scenario: TS-ELEM-05
covers_ac: [AC-elem-duplicate]
persona: Administrator (SYSTEM_ADMIN)
priority: High
type: Negative
level: E2E
automation_candidate: Yes
tags: ["@regression", "@admin", "@elements", "@persona-admin"]
last_updated: 2026-06-03
---

# TC-TS-ELEM-05 — Add element — duplicate prevention

## 1. Context
Verifies that adding an element with the same values as an existing element in the same code set is rejected with an error message.

**Source**: Test Plan 07, scenario TS-ELEM-05.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` with `Code Read` + `Code Write` permissions.
- **Data**: Element "Bb - Bike BC" already exists.
- **Starting URL**: `${BASE_URL}/admin/elements`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Code Value | `Bb` |
| Code Name | `Bike BC` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with admin permissions
And   I am on the "Elements Management" page
When  I click the button "Add New Element"
And   I fill the textbox "Code Value" with "Bb"
And   I fill the textbox "Code Name" with "Bike BC"
And   I click the button "Submit"
Then  I see an error message indicating duplicate element is not allowed
And   the element is not created
```

## 5. Expected Results
- A validation error is displayed indicating the element already exists.
- The duplicate entry is rejected.

## 6. Postconditions / Cleanup
- No data was created; close error and cancel dialog.

## 7. Notes for the Playwright Agent
- The error may appear as an inline validation message or a toast/alert.
- The exact error text may vary — assert that an error is shown and no duplicate row appears.
