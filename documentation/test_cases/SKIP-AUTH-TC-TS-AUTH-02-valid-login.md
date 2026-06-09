---
id: TC-TS-AUTH-02
title: Valid IDIR login redirects to CRT home
source_plan: 02-authentication
source_scenario: TS-AUTH-02
covers_ac: [AC-auth-valid]
persona: Application User (APP_USER)
priority: High
type: Functional
level: E2E
automation_candidate: Yes
status: SKIPPED — deferred to future sprint
tags: ["@regression", "@authentication", "@keycloak", "@deferred"]
last_updated: 2026-06-03
---

# TC-TS-AUTH-02 — Valid IDIR login redirects to CRT home

> **STATUS: SKIPPED** — This test case is documented for traceability but implementation is deferred to a future date.

## 1. Context
Verifies that a valid IDIR login through KeyCloak redirects the user to the CRT Project Search home screen with their name visible.

**Source**: Test Plan 02, scenario TS-AUTH-02.

## 2. Preconditions
- **User**: Browser session starts logged out.
- **Infrastructure**: KeyCloak is reachable.
- **Accounts**: `{{IDIR_VALID_USER}}` and `{{PASSWORD_VALID}}` are valid.
- **Starting URL**: CRT login portal.
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Username | `{{IDIR_VALID_USER}}` |
| Password | `{{PASSWORD_VALID}}` |

## 4. Steps (Gherkin)

```gherkin
Given the browser session is logged out
And   KeyCloak is reachable

When  I navigate to the CRT login portal
And   I enter username "{{IDIR_VALID_USER}}"
And   I enter password "{{PASSWORD_VALID}}"
And   I click the submit/login button

Then  the user is redirected to the CRT Project Search home screen
And   the URL contains the CRT base URL (not KeyCloak)
And   the logged-in user's name is visible in the top navigation
```

## 5. Expected Results
- Successful authentication redirects to the CRT home (Project Search).
- The user's display name appears in the top navigation bar.
- The application is fully accessible.

## 6. Postconditions / Cleanup
- Log out after test if needed.

## 7. Notes for the Playwright Agent
- Do not hardcode passwords — use environment variables or secrets.
- The redirect may take a moment; wait for the CRT URL to appear.
- Top navigation should show first + last name from IDIR directory.
