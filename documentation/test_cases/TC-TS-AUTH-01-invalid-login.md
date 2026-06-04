---
id: TC-TS-AUTH-01
title: Invalid IDIR login rejected by KeyCloak
source_plan: 02-authentication
source_scenario: TS-AUTH-01
covers_ac: [AC-auth-invalid]
persona: Unauthenticated User
priority: High
type: Negative
level: E2E
automation_candidate: Yes
status: SKIPPED — deferred to future sprint
tags: ["@regression", "@authentication", "@keycloak", "@negative", "@deferred"]
last_updated: 2026-06-03
---

# TC-TS-AUTH-01 — Invalid IDIR login rejected by KeyCloak

> **STATUS: SKIPPED** — This test case is documented for traceability but implementation is deferred to a future date.

## 1. Context
Verifies that an invalid IDIR credential is rejected by KeyCloak and the user is NOT redirected into CRT.

**Source**: Test Plan 02, scenario TS-AUTH-01.

## 2. Preconditions
- **User**: Browser session starts logged out.
- **Infrastructure**: KeyCloak is reachable.
- **Starting URL**: CRT login portal.
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Username | `{{IDIR_INVALID}}` |
| Password | `any_password` |

## 4. Steps (Gherkin)

```gherkin
Given the browser session is logged out
And   KeyCloak is reachable

When  I navigate to the CRT login portal
And   I enter username "{{IDIR_INVALID}}"
And   I enter password "any_password"
And   I click the submit/login button

Then  KeyCloak displays an authentication error
And   the user is NOT redirected into CRT
And   the URL remains on the KeyCloak login page
```

## 5. Expected Results
- KeyCloak shows an error message (e.g., "Invalid username or password").
- The browser stays on the KeyCloak login page.
- No access to the CRT application is granted.

## 6. Postconditions / Cleanup
- No data was created; no cleanup required.

## 7. Notes for the Playwright Agent
- KeyCloak login page is external to the CRT app.
- The login page URL contains `/auth/realms/` in the path.
- Do not hardcode passwords in test code — use environment variables.
