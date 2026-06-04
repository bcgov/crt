---
id: TC-TS-BVT-CODE-01
title: "BVT: Maintain dropdown code values and elements"
source_plan: 09-bvt-smoke-tests
source_scenario: TS-BVT-CODE-01
covers_ac: [AC-bvt-code-maintenance]
persona: Administrator (SYSTEM_ADMIN)
priority: High
type: E2E
level: Smoke
automation_candidate: Yes
tags: ["@smoke", "@bvt", "@admin", "@codetables", "@elements", "@persona-admin"]
last_updated: 2026-06-03
related_ft: [TC-TS-ELEM-03, TC-TS-ELEM-06, TC-TS-ELEM-07, TC-TS-CODE-04, TC-TS-CODE-06, TC-TS-CODE-07]
---

# TC-TS-BVT-CODE-01 — BVT: Maintain dropdown code values and elements

## 1. Context
Build Verification Test confirming that administrators can manage code values and elements (add, edit, disable) after UAT deployment.

**Source**: Test Plan 09, scenario TS-BVT-CODE-01.

## 2. Preconditions
- **Environment**: Build deployed to UAT.
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` with `Code Read` + `Code Write` permissions.
- **Starting URL**: `${BASE_URL}/admin/codetables`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Action | Code Set | Value |
|--------|----------|-------|
| Add | Accomplishment | Code Name: `BVT Test Value` |
| Edit | Accomplishment | Modify name to `BVT Test Value Edited` |
| Disable | Accomplishment | Disable `BVT Test Value Edited` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with "Code Write" permission

# Code Table: Add
When  I navigate to "Code Table Management"
And   I click the button "Add New Accomplishment"
And   I fill the textbox "Code Name" with "BVT Test Value"
And   I click the button "Submit"
Then  the code value "BVT Test Value" appears in the table

# Code Table: Edit
When  I click the button "Edit Record" on "BVT Test Value"
And   I change Code Name to "BVT Test Value Edited"
And   I click the button "Submit"
Then  the row shows "BVT Test Value Edited"

# Code Table: Disable
When  I click the Disable/Delete icon on "BVT Test Value Edited"
And   I confirm the action
Then  the code value is disabled/deleted

# Elements: Add
When  I navigate to "Elements Management"
And   I click the button "Add New Element"
And   I fill the textbox "Code Name" with "BVT Test Element"
And   I click the button "Submit"
Then  the element "BVT Test Element" appears in the table

# Elements: Cleanup
When  I click the button "Delete Record" on "BVT Test Element"
And   I confirm
Then  the element is removed
```

## 5. Expected Results
- Admin can navigate to Code Table and Element management.
- Add, Edit, and Disable/Delete workflows all complete without error.
- Changes are reflected in the tables.

## 6. Postconditions / Cleanup
- All test entries cleaned up within the test steps.

## 7. Notes for the Playwright Agent
- Smoke test — covers the full CRUD lifecycle in one test.
- See TC-TS-ELEM-* and TC-TS-CODE-* for detailed individual coverage.
