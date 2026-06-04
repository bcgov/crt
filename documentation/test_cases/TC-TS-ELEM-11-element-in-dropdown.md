---
id: TC-TS-ELEM-11
title: Element appears in Financial Planning form
source_plan: 07-data-maintenance
source_scenario: TS-ELEM-11
covers_ac: [AC-elem-in-dropdown]
persona: Administrator (SYSTEM_ADMIN)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@admin", "@elements", "@persona-admin"]
last_updated: 2026-06-03
---

# TC-TS-ELEM-11 — Element appears in Financial Planning form

## 1. Context
Verifies that a newly added/enabled element appears in the Financial Planning form's Element look-ahead dropdown.

**Source**: Test Plan 07, scenario TS-ELEM-11.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` with admin permissions.
- **Data**: A test element "Zt - CRT-AUTO Test Element" has been created and is Active. An existing project (e.g., ID 79) is accessible.
- **Starting URL**: `${BASE_URL}/projects/79/projectplan`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Element Code | `Zt` |
| Element Name | `CRT-AUTO Test Element` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with admin permissions
And   the element "Zt - CRT-AUTO Test Element" is active
And   I am on the financial plan page for project "79"

When  I click the button "+ Add"
Then  I see a dialog for adding a financial target

When  I click the dropdown "Element"
And   I type "Zt" into the filter of the dropdown
Then  I see the option "Zt-CRT-AUTO Test Element" in the dropdown
```

## 5. Expected Results
- The newly added element appears in the Element look-ahead dropdown.
- It shows with code and description format (e.g., "Zt-CRT-AUTO Test Element").

## 6. Postconditions / Cleanup
- Close dialog with Cancel. Delete the test element if no longer needed.

## 7. Notes for the Playwright Agent
- This test validates the integration between Element management and Financial Planning.
- The Element dropdown has 50+ options; use the type-ahead filter to find the test element.
