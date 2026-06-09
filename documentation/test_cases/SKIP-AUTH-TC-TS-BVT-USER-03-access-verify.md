---
id: TC-TS-BVT-USER-03
title: "BVT: Application access verification"
source_plan: 03-user-management
source_scenario: TS-BVT-USER-03
covers_ac: [AC-bvt-user-access]
persona: Newly created/modified user
priority: High
type: E2E
level: Smoke
automation_candidate: Yes
status: SKIPPED — deferred to future sprint
tags: ["@smoke", "@bvt", "@users", "@authentication", "@deferred"]
last_updated: 2026-06-03
related_ft: [TC-TS-AUTH-02]
---

# TC-TS-BVT-USER-03 — BVT: Application access verification

> **STATUS: SKIPPED** — This test case is documented for traceability but implementation is deferred to a future date.

## 1. Context
Build Verification Test confirming that a newly created/modified user can access the application per their assigned properties.

**Source**: Test Plan 03, scenario TS-BVT-USER-03.

## 2. Preconditions
- **Environment**: Build deployed to UAT.
- **User**: A user was just created/modified in TS-BVT-USER-01 or 02.
- **Starting URL**: CRT login portal.

## 3. Test Data

| Field | Value |
|-------|-------|
| Username | `{{IDIR_NEW_USER}}` |

## 4. Steps (Gherkin)

```gherkin
Given a user "{{IDIR_NEW_USER}}" has been created with role "MANAGER"

When  I log in as "{{IDIR_NEW_USER}}"
Then  the user can access the CRT application
And   the user sees features appropriate to the "MANAGER" role
And   the user does NOT see admin-only features
```

## 5. Expected Results
- User can log in and access the application.
- Access matches the assigned role and region.

## 6. Postconditions / Cleanup
- Log out.

## 7. Notes for the Playwright Agent
- Requires a separate browser context for the new user login.
- Verify role-appropriate UI elements are visible/hidden.
