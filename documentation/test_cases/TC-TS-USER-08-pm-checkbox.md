---
id: TC-TS-USER-08
title: Project Manager checkbox
source_plan: 03-user-management
source_scenario: TS-USER-08
covers_ac: [AC-user-pm-checkbox]
persona: Administrator (SYSTEM_ADMIN)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
status: SKIPPED — deferred to future sprint
tags: ["@regression", "@users", "@admin", "@project-manager", "@persona-admin", "@deferred"]
last_updated: 2026-06-03
---

# TC-TS-USER-08 — Project Manager checkbox

> **STATUS: SKIPPED** — This test case is documented for traceability but implementation is deferred to a future date.

## 1. Context
Verifies that checking the PM checkbox for a user makes them appear in the PM list.

**Source**: Test Plan 03, scenario TS-USER-08.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` (SYSTEM_ADMIN).
- **Starting URL**: `${BASE_URL}/admin/users`

## 3. Test Data
A user to assign PM checkbox to.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with SYSTEM_ADMIN role
And   I am on the "Users" management page

When  I edit an existing user
And   I check the "Project Manager" checkbox
And   I click "Submit"

Then  the user now has PM status
When  I navigate to a project and open the PM dropdown
Then  the user appears in the PM list
```

## 5. Expected Results
- PM checkbox adds user to the PM dropdown list.
- The user is available as a PM option in project details.

## 6. Postconditions / Cleanup
- Uncheck the PM checkbox to restore original state.

## 7. Notes for the Playwright Agent
- PM checkbox in user edit form.
