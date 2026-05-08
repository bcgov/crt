# Test Plan: Authentication, Navigation & Access

## 1. Introduction
Validates that users can authenticate via IDIR, navigate application sections based on role, and that environment identification (menu colors) functions correctly.
**Reference Docs**: [2 Application Components](../confluence_pages/user-support/end-user-guide/application-components.md)

## 2. Scope
- **In Scope**: IDIR login/logout, menu rendering based on role, environment color identification, in-project navigation buttons, link navigation, username display
- **Out of Scope**: IDIR service internals, SSO infrastructure, browser-specific rendering bugs

## 3. Test Strategy
- **Test Levels**: E2E (Playwright)
- **Environment**: UAT (purple menu), TST (yellow menu)

## 4. Test Scenarios

### AUTH - Authentication

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-AUTH-01 | Verify successful login with valid IDIR | 1. Navigate to application URL<br>2. Enter valid IDIR credentials<br>3. Submit login | User is authenticated and redirected to the project search screen; username displayed in top-right corner | High | Functional |
| TS-AUTH-02 | Verify login fails with invalid IDIR | 1. Navigate to application URL<br>2. Enter invalid IDIR credentials<br>3. Submit login | Authentication fails; user is shown an error message and not granted access | High | Negative |
| TS-AUTH-03 | Verify logout functionality | 1. Log in with valid IDIR<br>2. Click the logout option in top-right corner | User is logged out and redirected to the login screen; session is terminated | High | Functional |
| TS-AUTH-04 | Verify session expiry behavior | 1. Log in with valid IDIR<br>2. Leave session idle until timeout | User is redirected to login screen on next action; no data loss for unsaved work | Medium | Edge Case |
| TS-AUTH-05 | Verify disabled user cannot log in | 1. Disable a user via Admin (set end date in the past)<br>2. Attempt login with that user's IDIR | Authentication fails or user is denied access to application features | High | Negative |

### NAV - Navigation

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-NAV-01 | Verify menu reflects user role | 1. Log in as user with limited permissions (e.g., Project Read only)<br>2. Inspect menu items | Only sections the user has access to are displayed in the menu; Admin items are hidden | High | Functional |
| TS-NAV-02 | Verify Admin menu varies by role | 1. Log in as System Administrator<br>2. Open Admin menu<br>3. Log in as non-admin user<br>4. Open Admin menu | System Admin sees all Admin sub-items (Users, Code Tables, Elements, Roles); non-admin sees limited or no Admin items | High | Functional |
| TS-NAV-03 | Verify environment menu color - UAT | 1. Navigate to UAT URL (uat-crt.th.gov.bc.ca) | Menu bar below logo is purple | Medium | Functional |
| TS-NAV-04 | Verify environment menu color - PRD | 1. Navigate to PRD URL (crt.th.gov.bc.ca) | Menu bar below logo is blue | Medium | Functional |
| TS-NAV-05 | Verify in-project navigation buttons | 1. Navigate to any project section (e.g., Project Details)<br>2. Click each navigation button at top-right | User navigates to the corresponding project section; current section button is highlighted blue | High | Functional |
| TS-NAV-06 | Verify project search column links | 1. Navigate to project search screen<br>2. Click links under each column for a project | User navigates to the correct data entry section for that project | High | Functional |
| TS-NAV-07 | Verify URL links in data entry fields | 1. Navigate to a project with a URL entered in a data entry field<br>2. Click the URL link | Browser opens the URL in a new tab/window; original application state is preserved | Low | Functional |
| TS-NAV-08 | Verify username display in menu | 1. Log in with valid IDIR | Logged-in user's name appears on the right corner of the menu bar | Medium | Functional |

## 5. Risks and Mitigation
- **Risk**: IDIR authentication is an external dependency; test environments may not fully mirror production SSO behavior.
  - **Mitigation**: Use dedicated test IDIR accounts with known states. Document any SSO differences between environments.
- **Risk**: Menu color verification depends on CSS rendering, which may vary slightly by browser.
  - **Mitigation**: Test on primary browser (Edge) and spot-check Chrome/Firefox.
- **Risk**: User guide does not specify exact error messages for failed login.
  - **Mitigation**: Capture actual error messages during testing and document them for future regression baselines.
