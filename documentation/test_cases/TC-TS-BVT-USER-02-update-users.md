---
id: TC-TS-BVT-USER-02
title: "BVT: Update users"
source_plan: 03-user-management
source_scenario: TS-BVT-USER-02
covers_ac: [AC-bvt-user-update]
persona: Administrator (SYSTEM_ADMIN)
priority: High
type: E2E
level: Smoke
automation_candidate: Yes
status: SKIPPED — deferred to future sprint
tags: ["@smoke", "@bvt", "@users", "@admin", "@persona-admin", "@deferred"]
last_updated: 2026-06-03
related_ft: [TC-TS-USER-10, TC-TS-USER-11]
---

# TC-TS-BVT-USER-02 — BVT: Update users

> **STATUS: SKIPPED** — This test case is documented for traceability but implementation is deferred to a future date.

## 1. Context
Build Verification Test confirming that an admin can alter user properties and access.

**Source**: Test Plan 03, scenario TS-BVT-USER-02.

## 2. Preconditions
- **Environment**: Build deployed to UAT.
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` (SYSTEM_ADMIN).
- **Data**: A user exists that can be edited.
- **Starting URL**: `${BASE_URL}/admin/users`

## 3. Test Data

| Field | Original | Updated |
|-------|----------|---------|
| Role | MANAGER | DISTRICT_ADMIN |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with SYSTEM_ADMIN role
And   I am on the "Users" management page

When  I click "Edit" on an existing user
And   I change the role to "DISTRICT_ADMIN"
And   I click "Submit"

Then  the user's role is updated to "DISTRICT_ADMIN"
```

## 5. Expected Results
- Admin can modify user properties.
- Changes are saved and reflected.

## 6. Postconditions / Cleanup
- Revert user role to original.

## 7. Notes for the Playwright Agent
- Smoke test — verify edit workflow completes.
