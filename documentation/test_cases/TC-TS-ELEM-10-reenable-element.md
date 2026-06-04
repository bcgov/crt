---
id: TC-TS-ELEM-10
title: Re-enable disabled element
source_plan: 07-data-maintenance
source_scenario: TS-ELEM-10
covers_ac: [AC-elem-reenable]
persona: Administrator (SYSTEM_ADMIN)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@admin", "@elements", "@persona-admin"]
last_updated: 2026-06-03
---

# TC-TS-ELEM-10 — Re-enable disabled element

## 1. Context
Verifies that a disabled (Inactive) element can be re-enabled, making it available for data entry again.

**Source**: Test Plan 07, scenario TS-ELEM-10.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` with `Code Read` + `Code Write` permissions.
- **Data**: At least one disabled/inactive element exists.
- **Starting URL**: `${BASE_URL}/admin/elements`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data
A previously disabled element.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with admin permissions
And   I am on the "Elements Management" page

# Filter for Inactive elements
When  I click the button "Active"
And   I select "Inactive" from the filter
And   I click the button "Search"
Then  the table shows inactive elements

# Re-enable an element
When  I click the enable icon on an inactive element row
Then  I see a confirmation prompt
When  I confirm the re-enable action
Then  the element is removed from the Inactive list

# Verify it appears in Active
When  I click the button "Reset"
And   I click the button "Search"
Then  the re-enabled element appears in the Active elements list
```

## 5. Expected Results
- Inactive elements are visible when filtering by Inactive status.
- Clicking the enable icon triggers a confirmation.
- After confirming, the element returns to Active status.
- The element is again available in Financial Planning dropdowns.

## 6. Postconditions / Cleanup
- Disable the element again if it was not a test-created element.

## 7. Notes for the Playwright Agent
- The enable icon is a greyed-out icon on inactive rows (per §0.8.1).
- The confirmation text may be "This value will be enabled. Are you sure?"
