---
id: TC-TS-ROLE-03
title: Mandatory fields on new role validation
source_plan: 03-user-management
source_scenario: TS-ROLE-03
covers_ac: [AC-role-mandatory]
persona: Administrator (SYSTEM_ADMIN)
priority: High
type: Negative
level: E2E
automation_candidate: Yes
status: SKIPPED — deferred to future sprint
tags: ["@regression", "@roles", "@admin", "@persona-admin", "@deferred"]
last_updated: 2026-06-03
---

# TC-TS-ROLE-03 — Mandatory fields on new role validation

> **STATUS: SKIPPED** — This test case is documented for traceability but implementation is deferred to a future date.

## 1. Context
Verifies that Role Name, Description, and Permissions are mandatory when creating a new role.

**Source**: Test Plan 03, scenario TS-ROLE-03.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` (SYSTEM_ADMIN).
- **Starting URL**: `${BASE_URL}/admin/roles`

## 3. Test Data
All required fields left blank.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with SYSTEM_ADMIN role
And   I am on the "Roles & Permissions" page

When  I click the button "Add Role"
And   I leave "Role Name" blank
And   I leave "Description" blank
And   I do not select any permissions
And   I click the button "Submit"

Then  inline validation errors appear next to each blank mandatory field
And   the form is not submitted
```

## 5. Expected Results
- Role Name, Description, and Permissions are all required.
- Inline validation errors shown for each missing field.
- Form submission is blocked.

## 6. Postconditions / Cleanup
- Cancel dialog; no data created.

## 7. Notes for the Playwright Agent
- Check for inline validation messages adjacent to each field.
