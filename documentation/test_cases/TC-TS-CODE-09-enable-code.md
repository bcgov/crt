---
id: TC-TS-CODE-09
title: Enable inactive code value
source_plan: 07-data-maintenance
source_scenario: TS-CODE-09
covers_ac: [AC-code-enable]
persona: Administrator (SYSTEM_ADMIN)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@admin", "@codetables", "@persona-admin"]
last_updated: 2026-06-03
---

# TC-TS-CODE-09 — Enable inactive code value

## 1. Context
Verifies that an inactive code value can be re-enabled via the greyed-out Enable icon with confirmation.

**Source**: Test Plan 07, scenario TS-CODE-09.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` with `Code Read` + `Code Write` permissions.
- **Data**: At least one inactive code value exists in the current code set.
- **Starting URL**: `${BASE_URL}/admin/codetables`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data
A previously disabled code value.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with admin permissions
And   I am on the "Code Table Management" page

# Switch to Inactive filter
When  I click the button "Active"
And   I select "Inactive" from the filter
And   I click the button "Search"
Then  the table shows inactive code values

# Enable an inactive code
When  I hover over the greyed-out enable icon on an inactive code row
Then  I see a tooltip "Enable record"

When  I click the enable icon on that row
Then  I see a confirmation prompt "This value will be enabled. Are you sure?"
When  I click the confirm button
Then  the code value is removed from the Inactive view

# Verify it's back in Active
When  I click the button "Reset"
And   I click the button "Search"
Then  the re-enabled code value appears in the Active list
```

## 5. Expected Results
- The Enable icon shows tooltip "Enable record" on hover.
- Clicking triggers confirmation with text "This value will be enabled. Are you sure?"
- After confirm, the value returns to Active status.

## 6. Postconditions / Cleanup
- Disable the code value again if it was not a test-created value.

## 7. Notes for the Playwright Agent
- Inactive entries show a greyed-out Enable icon.
- Tooltip: "Enable record".
- Confirmation text: "This value will be enabled. Are you sure?"
