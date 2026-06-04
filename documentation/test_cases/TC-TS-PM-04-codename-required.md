---
id: TC-TS-PM-04
title: Add PM - Code Name required
source_plan: 07-data-maintenance
source_scenario: TS-PM-04
covers_ac: [AC-pm-validation]
persona: Administrator (SYSTEM_ADMIN)
priority: High
type: Negative
level: E2E
automation_candidate: Yes
tags: ["@regression", "@admin", "@codetables", "@project-manager", "@persona-admin", "@negative"]
last_updated: 2026-06-04
---

# TC-TS-PM-04 — Add PM - Code Name required

## 1. Context
Verifies that submitting a new PM without a Code Name (and no Code Value) triggers a validation error.

**Source**: Test Plan 07, scenario TS-PM-04.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` with `Code Read` + `Code Write` permissions.
- **Starting URL**: `${BASE_URL}/admin/codetables`
- **State**: "Project Manager" code set selected.

## 3. Test Data
None — intentionally left blank to trigger validation.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with admin permissions
And   I am on the "Code Table Management" page
And   I have selected "Project Manager" from the Code Value Set dropdown

When  I click the button "Add New Project Manager"
And   I leave the textbox "Code Name" blank
And   I leave the textbox "Code Value" blank
And   I click the button "Submit"

Then  a validation error is displayed indicating at least Code Value or Code Name must be provided
And   no new PM record is created
```

## 5. Expected Results
- Form does not submit without at least Code Value or Code Name.
- Inline validation error is visible.

## 6. Postconditions / Cleanup
- None.

## 7. Notes for the Playwright Agent
- The validation rule is: at least one of Code Value or Code Name must be filled.
