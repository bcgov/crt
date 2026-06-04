---
id: TC-TS-ELEM-02
title: Search elements with Active/Inactive filter
source_plan: 07-data-maintenance
source_scenario: TS-ELEM-02
covers_ac: [AC-elem-search]
persona: Administrator (SYSTEM_ADMIN)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@admin", "@elements", "@persona-admin"]
last_updated: 2026-06-03
---

# TC-TS-ELEM-02 — Search elements with Active/Inactive filter

## 1. Context
Verifies that elements can be searched by code or name, and that the Active/Inactive toggle filters results correctly with Active as the default.

**Source**: Test Plan 07, scenario TS-ELEM-02.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` with `Code Read` + `Code Write` permissions.
- **Data**: Default elements seeded (e.g., "Bb-Bike BC", "Br-Bridge").
- **Starting URL**: `${BASE_URL}/admin/elements`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Search by code | `Bb` |
| Search by name | `Bridge` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with admin permissions
And   I am on the "Elements Management" page

# Default shows Active
Then  the button "Active" is visible as the current filter

# Search by element code
When  I fill the textbox with placeholder "Search" with "Bb"
And   I click the button "Search"
Then  the row containing "Bb" appears in the table
And   the row shows "Bike BC" in the Description column

# Search by element name
When  I click the button "Reset"
And   I fill the textbox with placeholder "Search" with "Bridge"
And   I click the button "Search"
Then  the table shows rows with "Bridge" in the Description column

# Toggle to Inactive
When  I click the button "Reset"
And   I click the button "Active"
And   I select "Inactive" from the filter
And   I click the button "Search"
Then  the table shows only inactive elements (if any exist)
```

## 5. Expected Results
- Search by element code filters to matching entries.
- Search by element name/description filters appropriately.
- Active is the default filter state.
- Switching to Inactive shows only disabled elements.

## 6. Postconditions / Cleanup
- No data was created; no cleanup required.

## 7. Notes for the Playwright Agent
- The search textbox has placeholder "Search".
- The Active filter is a button/dropdown with Active as default.
- Element table columns: Element, Description, Program Category, Program, Service Line, Order Number, Status, Actions.
