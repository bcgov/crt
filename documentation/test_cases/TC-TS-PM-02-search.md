---
id: TC-TS-PM-02
title: Search PM by name
source_plan: 07-data-maintenance
source_scenario: TS-PM-02
covers_ac: [AC-pm-search]
persona: Administrator (SYSTEM_ADMIN)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@admin", "@codetables", "@project-manager", "@persona-admin"]
last_updated: 2026-06-04
---

# TC-TS-PM-02 — Search PM by name

## 1. Context
Verifies that PMs can be searched by partial name in the Code Tables "Project Manager" code set.

**Source**: Test Plan 07, scenario TS-PM-02.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` with `Code Read` + `Code Write` permissions.
- **Data**: Multiple PMs exist in the "Project Manager" code set.
- **Starting URL**: `${BASE_URL}/admin/codetables`

## 3. Test Data

| Field | Value |
|-------|-------|
| Search term | Partial PM name (e.g., first 3 characters of an existing PM) |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with admin permissions
And   I am on the "Code Table Management" page
And   I have selected "Project Manager" from the Code Value Set dropdown

When  I enter a partial PM name in the search textbox
And   I trigger the search

Then  only PMs matching the partial name are displayed
And   the search covers both Code Value and Code Name fields
```

## 5. Expected Results
- Partial name search filters the PM list correctly.
- Both Code Value and Code Name fields are searched.
- No unrelated entries appear in results.

## 6. Postconditions / Cleanup
- Clear the search filter.

## 7. Notes for the Playwright Agent
- Search textbox filters the table in real-time or on submit.
