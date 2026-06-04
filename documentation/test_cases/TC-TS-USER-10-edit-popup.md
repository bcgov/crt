---
id: TC-TS-USER-10
title: Edit user details popup
source_plan: 03-user-management
source_scenario: TS-USER-10
covers_ac: [AC-user-edit-popup]
persona: Administrator (SYSTEM_ADMIN)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
status: SKIPPED — deferred to future sprint
tags: ["@regression", "@users", "@admin", "@persona-admin", "@deferred"]
last_updated: 2026-06-03
---

# TC-TS-USER-10 — Edit user details popup

> **STATUS: SKIPPED** — This test case is documented for traceability but implementation is deferred to a future date.

## 1. Context
Verifies that clicking Edit on a user opens a popup with User ID, Role, MoTI Region, and End Date.

**Source**: Test Plan 03, scenario TS-USER-10.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` (SYSTEM_ADMIN).
- **Data**: At least one user exists.
- **Starting URL**: `${BASE_URL}/admin/users`

## 3. Test Data
Any existing user.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with SYSTEM_ADMIN role
And   I am on the "Users" management page

When  I click the "Edit" icon on an existing user row
Then  a popup/dialog opens showing:
      | Field       |
      | User ID     |
      | Role        |
      | MoTI Region |
      | End Date    |
```

## 5. Expected Results
- Edit popup shows all expected fields.
- Fields are editable (Role, Region, End Date).
- User ID is read-only.

## 6. Postconditions / Cleanup
- Cancel the dialog without changes.

## 7. Notes for the Playwright Agent
- Edit popup is a modal dialog.
