---
id: TC-TS-CODE-03
title: Status filter — Active default and Inactive toggle
source_plan: 07-data-maintenance
source_scenario: TS-CODE-03
covers_ac: [AC-code-status-filter]
persona: Administrator (SYSTEM_ADMIN)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@admin", "@codetables", "@persona-admin"]
last_updated: 2026-06-03
---

# TC-TS-CODE-03 — Status filter — Active default and Inactive toggle

## 1. Context
Verifies that the Active filter defaults to Active, and toggling to Inactive shows disabled code values.

**Source**: Test Plan 07, scenario TS-CODE-03.

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

# Verify Active default
Then  the button "Active" is visible as the current status filter
And   the URL contains "isActive=true"

# Switch to Inactive
When  I click the button "Active"
And   I select "Inactive" from the filter
And   I click the button "Search"
Then  the table shows code values with Inactive status
And   the URL contains "isActive=false"
```

## 5. Expected Results
- Active is the default status filter.
- Switching to Inactive shows only disabled code values.
- The URL query parameter reflects the filter state.

## 6. Postconditions / Cleanup
- No data was created; no cleanup required.

## 7. Notes for the Playwright Agent
- The Active filter button toggles between Active/Inactive states.
- The URL parameter `isActive` reflects the filter.
