---
id: TC-TS-ELEM-03
title: Add new element with required fields
source_plan: 07-data-maintenance
source_scenario: TS-ELEM-03
covers_ac: [AC-elem-add]
persona: Administrator (SYSTEM_ADMIN)
priority: High
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@admin", "@elements", "@persona-admin"]
last_updated: 2026-06-03
---

# TC-TS-ELEM-03 — Add new element with required fields

## 1. Context
Verifies that a new element can be added with Code Value (optional), Code Name (required), and Order Number, and that it appears in search results and Financial Planning dropdowns.

**Source**: Test Plan 07, scenario TS-ELEM-03.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` with `Code Read` + `Code Write` permissions.
- **Starting URL**: `${BASE_URL}/admin/elements`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Code Value | `Zt` |
| Code Name | `CRT-AUTO Test Element` |
| Order Number | `999` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with admin permissions
And   I am on the "Elements Management" page
When  I click the button "Add New Element"
Then  I see a dialog for adding a new element

When  I fill the textbox "Code Value" with "Zt"
And   I fill the textbox "Code Name" with "CRT-AUTO Test Element"
And   I fill the field "Order Number" with "999"
And   I click the button "Submit"

Then  I see the row containing "Zt" in the Elements table
And   the row shows "CRT-AUTO Test Element" in the Description column
And   the row shows "999" in the Order Number column
```

## 5. Expected Results
- The element is created successfully.
- It appears in the Elements table with correct values.
- It should also appear in the Financial Planning Element dropdown (verified in TS-ELEM-11).

## 6. Postconditions / Cleanup
- Delete the created element "Zt - CRT-AUTO Test Element" using the Delete action.

## 7. Notes for the Playwright Agent
- Code Value is optional; Code Name is required.
- Order Number controls display order in dropdowns.
- The "Add New Element" button opens a modal dialog.
