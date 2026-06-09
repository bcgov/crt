---
id: TC-TS-BVT-USER-01
title: "BVT: Add new users"
source_plan: 03-user-management
source_scenario: TS-BVT-USER-01
covers_ac: [AC-bvt-user-add]
persona: Administrator (SYSTEM_ADMIN)
priority: High
type: E2E
level: Smoke
automation_candidate: Yes
status: SKIPPED — deferred to future sprint
tags: ["@smoke", "@bvt", "@users", "@admin", "@persona-admin", "@deferred"]
last_updated: 2026-06-03
related_ft: [TC-TS-USER-06]
---

# TC-TS-BVT-USER-01 — BVT: Add new users

> **STATUS: SKIPPED** — This test case is documented for traceability but implementation is deferred to a future date.

## 1. Context
Build Verification Test confirming that an admin can add users with appropriate access.

**Source**: Test Plan 03, scenario TS-BVT-USER-01.

## 2. Preconditions
- **Environment**: Build deployed to UAT.
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` (SYSTEM_ADMIN).
- **Starting URL**: `${BASE_URL}/admin/users`

## 3. Test Data

| Field | Value |
|-------|-------|
| IDIR | `{{IDIR_NEW_USER}}` |
| Role | MANAGER |
| Region | 1 - South Coast |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with SYSTEM_ADMIN role
And   I am on the "Users" management page

When  I click "Add User"
And   I enter "{{IDIR_NEW_USER}}" and complete the lookup
And   I assign role "MANAGER" and region "1 - South Coast"
And   I click "Submit"

Then  the user is created and appears in search results
```

## 5. Expected Results
- Admin can add a user with role and region.
- User appears in the users list.

## 6. Postconditions / Cleanup
- Deactivate or remove the test user.

## 7. Notes for the Playwright Agent
- Smoke test — verify add workflow completes.
