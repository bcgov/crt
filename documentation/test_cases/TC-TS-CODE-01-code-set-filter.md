---
id: TC-TS-CODE-01
title: Code Value Set filter — mandatory single-select with default
source_plan: 07-data-maintenance
source_scenario: TS-CODE-01
covers_ac: [AC-code-filter]
persona: Administrator (SYSTEM_ADMIN)
priority: High
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@admin", "@codetables", "@persona-admin"]
last_updated: 2026-06-03
---

# TC-TS-CODE-01 — Code Value Set filter — mandatory single-select with default

## 1. Context
Verifies that the Code Set filter on Code Table Management is a mandatory single-select dropdown defaulting to "Accomplishment", with correct options.

**Source**: Test Plan 07, scenario TS-CODE-01.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` with `Code Read` + `Code Write` permissions.
- **Starting URL**: `${BASE_URL}/admin/codetables`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data
None required.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with admin permissions
And   I am on the "Code Table Management" page

Then  the heading "Code Table Management" is displayed
And   the Code Set dropdown shows "Accomplishment" as the default
And   the Code Set dropdown is mandatory (cannot be cleared)

When  I click the Code Set dropdown
Then  I see the following options:
      | Accomplishment     |
      | Capital Index      |
      | Contractor         |
      | Economic Region    |
      | Electoral District |
      | Fiscal Year        |
      | Funding Type       |
      | Highway            |
      | Nearest Town       |
      | Phase              |
      | Program            |
      | Quantity           |
      | RC Number          |
      | Service Line       |
      | Program Category   |
      | Project Manager    |

When  I select "Contractor" from the Code Set dropdown
Then  the table updates to show Contractor code values
And   the button text changes to "Add New Contractor"
```

## 5. Expected Results
- Default Code Set is "Accomplishment".
- All expected code set options are available.
- Selecting a different code set loads the corresponding data.
- The "Add New" button label dynamically updates.

## 6. Postconditions / Cleanup
- No data was created; no cleanup required.

## 7. Notes for the Playwright Agent
- Code Set dropdown is a `button` with current code set name.
- The "Add New" button dynamically reads "Add New {CodeSet}".
- URL updates to include `?codeSet={CODE_SET_NAME}`.
