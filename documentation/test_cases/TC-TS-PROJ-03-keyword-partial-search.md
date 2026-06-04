---
id: TC-TS-PROJ-03
title: Keyword partial search across project fields
source_plan: 04-project-search-details
source_scenario: TS-PROJ-03
covers_ac: [AC-keyword-search]
persona: Application User (MANAGER)
priority: High
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@projects", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-PROJ-03 — Keyword partial search across project fields

## 1. Context
Verifies that the keyword search on the Project Search page performs partial matching across Project Number, Project Name, Project Description, and Project Scope fields. This is a core search capability that must match any substring in those fields.

**Source**: Test Plan 04, scenario TS-PROJ-03 ([CRPDB-105]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: At least one project exists with known values in Project Number, Name, Description, and Scope fields. Example: Project Name = "Another test project", Description = "Testing testing 123".
- **Starting URL**: `${BASE_URL}/projects`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value | Expected Match |
|-------|-------|----------------|
| Keyword (partial name) | `test project` | Matches "Another test project" |
| Keyword (partial number) | `999` | Matches project number "999" |
| Keyword (partial description) | `Testing` | Matches description containing "Testing testing 123" |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the "Projects" page

# Search by partial project name
When  I fill the textbox "Number/Name/Description/Scope" with "test project"
And   I click the button "Search"
Then  the row containing "Another test project" appears in the table

# Search by partial project number
When  I click the button "Reset"
And   I fill the textbox "Number/Name/Description/Scope" with "999"
And   I click the button "Search"
Then  the row containing "999" appears in the table

# Search by partial description
When  I click the button "Reset"
And   I fill the textbox "Number/Name/Description/Scope" with "Testing"
And   I click the button "Search"
Then  the row containing "Another test project" appears in the table
```

## 5. Expected Results
- Partial text in the keyword field matches against Project Number, Name, Description, and Scope.
- Search results include projects where any of the four fields contain the partial text.
- The "Reset" button clears the search field and restores default results.

## 6. Postconditions / Cleanup
- No data was created; no cleanup required.

## 7. Notes for the Playwright Agent
- The search textbox has placeholder `"Number/Name/Description/Scope"`.
- Use `page.getByPlaceholder('Number/Name/Description/Scope')` as an alternative locator.
- After each search, verify at least one matching row appears; exact row count depends on test data.
