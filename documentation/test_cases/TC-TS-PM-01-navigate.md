---
id: TC-TS-PM-01
title: Navigate to Project Manager code table
source_plan: 07-data-maintenance
source_scenario: TS-PM-01
covers_ac: [AC-pm-navigate]
persona: Administrator (SYSTEM_ADMIN)
priority: High
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@admin", "@codetables", "@project-manager", "@persona-admin"]
last_updated: 2026-06-04
---

# TC-TS-PM-01 — Navigate to Project Manager code table

## 1. Context
Verifies that an admin can navigate to the Code Tables screen and select the "Project Manager" code set, displaying the PM list with expected columns and default Active filter.

**Source**: Test Plan 07, scenario TS-PM-01.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` with `Code Read` + `Code Write` permissions.
- **Starting URL**: `${BASE_URL}/admin/codetables`
- **Data**: At least one PM exists in the "Project Manager" code set.

## 3. Test Data
None required.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with admin permissions
And   I am on the "Code Table Management" page

When  I click the Code Value Set dropdown
And   I select "Project Manager" from the dropdown

Then  the table displays Project Manager entries
And   the table has columns: "Code Value", "Code Name", "Display Order", and action icons
And   the Status filter defaults to "Active"
And   only active PMs are shown
```

## 5. Expected Results
- "Project Manager" is selectable from the Code Value Set dropdown.
- Table displays PM entries with correct columns.
- Active filter is the default state.

## 6. Postconditions / Cleanup
- None.

## 7. Notes for the Playwright Agent
- Code Value Set dropdown is single-select and mandatory.
- Verify column headers match expected names.
