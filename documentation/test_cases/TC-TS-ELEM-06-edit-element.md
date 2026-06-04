---
id: TC-TS-ELEM-06
title: Edit existing element
source_plan: 07-data-maintenance
source_scenario: TS-ELEM-06
covers_ac: [AC-elem-edit]
persona: Administrator (SYSTEM_ADMIN)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@admin", "@elements", "@persona-admin"]
last_updated: 2026-06-03
---

# TC-TS-ELEM-06 — Edit existing element

## 1. Context
Verifies that an existing element can be edited (Code Name, Order Number) and the changes are reflected in the table and downstream dropdowns.

**Source**: Test Plan 07, scenario TS-ELEM-06.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` with `Code Read` + `Code Write` permissions.
- **Data**: At least one element exists that can be safely edited.
- **Starting URL**: `${BASE_URL}/admin/elements`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Original Value | New Value |
|-------|---------------|-----------|
| Code Name | `Bike BC` | `Bike BC Updated` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with admin permissions
And   I am on the "Elements Management" page
When  I click the button "Edit Record" on the row containing "Bb"
Then  I see an edit dialog with pre-filled values

When  I clear the textbox "Code Name"
And   I fill the textbox "Code Name" with "Bike BC Updated"
And   I click the button "Submit"

Then  the row containing "Bb" shows "Bike BC Updated" in the Description column
```

## 5. Expected Results
- The edit dialog opens with pre-filled current values.
- After saving, the table reflects the updated Code Name.

## 6. Postconditions / Cleanup
- Revert the element Code Name to "Bike BC".

## 7. Notes for the Playwright Agent
- The "Edit Record" button has a pencil icon.
- The edit dialog is the same form structure as Add, pre-populated.
