---
id: TC-TS-PM-05
title: Add PM - duplicate prevention
source_plan: 07-data-maintenance
source_scenario: TS-PM-05
covers_ac: [AC-pm-uniqueness]
persona: Administrator (SYSTEM_ADMIN)
priority: High
type: Negative
level: E2E
automation_candidate: Yes
tags: ["@regression", "@admin", "@codetables", "@project-manager", "@persona-admin", "@negative"]
last_updated: 2026-06-04
---

# TC-TS-PM-05 — Add PM - duplicate prevention

## 1. Context
Verifies that adding a PM with the same Code Name as an existing active PM is rejected with a uniqueness violation.

**Source**: Test Plan 07, scenario TS-PM-05.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` with `Code Read` + `Code Write` permissions.
- **Data**: PM "CRT-AUTO Test Manager" already exists and is Active.
- **Starting URL**: `${BASE_URL}/admin/codetables`

## 3. Test Data

| Field | Value |
|-------|-------|
| Code Name | `CRT-AUTO Test Manager` (duplicate of existing) |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with admin permissions
And   I am on the "Code Table Management" page
And   I have selected "Project Manager" from the Code Value Set dropdown
And   the PM "CRT-AUTO Test Manager" already exists

When  I click the button "Add New Project Manager"
And   I fill the textbox "Code Name" with "CRT-AUTO Test Manager"
And   I click the button "Submit"

Then  an error message is displayed indicating a uniqueness violation
And   the duplicate PM is not created
```

## 5. Expected Results
- System rejects duplicate PM creation.
- Error message clearly indicates uniqueness violation.

## 6. Postconditions / Cleanup
- None.

## 7. Notes for the Playwright Agent
- Uniqueness check is case-insensitive on Code Value-Code Name combination.
