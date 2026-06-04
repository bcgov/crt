---
id: TC-TS-ELEM-01
title: Navigate to Element management screen
source_plan: 07-data-maintenance
source_scenario: TS-ELEM-01
covers_ac: [AC-elem-navigation]
persona: Administrator (SYSTEM_ADMIN)
priority: High
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@admin", "@elements", "@persona-admin"]
last_updated: 2026-06-03
---

# TC-TS-ELEM-01 — Navigate to Element management screen

## 1. Context
Verifies that a user with Code Read + Code Write permissions can navigate to and access the Elements management screen.

**Source**: Test Plan 07, scenario TS-ELEM-01.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` with `Code Read` + `Code Write` permissions.
- **Starting URL**: `${BASE_URL}/`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data
None required.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with "Code Read" and "Code Write" permissions
When  I click the navigation menu
And   I click the link "Elements" under the Admin section
Then  the URL contains "/admin/elements"
And   I see the heading "Elements Management"
And   I see the button "Add New Element"
And   I see the textbox with placeholder "Search"
```

## 5. Expected Results
- The Elements Management page loads successfully.
- The heading "Elements Management" is displayed.
- The "Add New Element" button is visible.
- The search filter and Active/Inactive filter are available.

## 6. Postconditions / Cleanup
- No data was created; no cleanup required.

## 7. Notes for the Playwright Agent
- Navigation path: Admin menu → Elements.
- URL pattern: `/admin/elements?isActive=true&pageNumber=1&pageSize=25`.
