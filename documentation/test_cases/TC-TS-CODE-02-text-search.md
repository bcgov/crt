---
id: TC-TS-CODE-02
title: Code Value/Name text search
source_plan: 07-data-maintenance
source_scenario: TS-CODE-02
covers_ac: [AC-code-search]
persona: Administrator (SYSTEM_ADMIN)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@admin", "@codetables", "@persona-admin"]
last_updated: 2026-06-03
---

# TC-TS-CODE-02 — Code Value/Name text search

## 1. Context
Verifies that the text search filters code table entries by both Code Value and Code Name.

**Source**: Test Plan 07, scenario TS-CODE-02.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` with `Code Read` + `Code Write` permissions.
- **Data**: Default code values seeded for "Accomplishment" code set.
- **Starting URL**: `${BASE_URL}/admin/codetables`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Search Term | Expected Match |
|-------------|---------------|
| `Bridge` | Code names containing "Bridge" |
| `Active` | Code name "Active Transportation Project" |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with admin permissions
And   I am on the "Code Table Management" page
And   the Code Set dropdown shows "Accomplishment"

# Search by code name
When  I fill the textbox with placeholder "Search" with "Bridge"
And   I click the button "Search"
Then  the table shows only entries with "Bridge" in the Code Name column

# Search by different term
When  I click the button "Reset"
And   I fill the textbox with placeholder "Search" with "Active"
And   I click the button "Search"
Then  the table shows "Active Transportation Project" in the results
```

## 5. Expected Results
- Searching filters code table entries matching the search term.
- Search covers both Code Value and Code Name fields.
- Results are filtered correctly.

## 6. Postconditions / Cleanup
- No data was created; no cleanup required.

## 7. Notes for the Playwright Agent
- The search textbox has placeholder "Search".
- Reset clears the search term and shows all results.
