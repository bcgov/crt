# Test Plan: Administration - User Management

## 1. Introduction
Validates user management workflows including IDIR lookup, user creation, role/region assignment, editing user properties, and enabling/disabling user access (4.1).
**Reference Docs**: [4.1 Managing Application Users](../confluence_pages/user-support/end-user-guide/managing-application-users.md)

## 2. Scope
- **In Scope**: Add user (IDIR lookup, role assignment, region assignment), edit user (role, service areas, end date), disable user, enable inactive user, search active/inactive users
- **Out of Scope**: IDIR service administration, role permission definitions (Test Plan 09)

## 3. Test Strategy
- **Test Levels**: E2E (Playwright)
- **Environment**: UAT
- **Prerequisites**: Test IDIR accounts with known valid/invalid states; admin user with User Read, User Write, and Role Read permissions

## 4. Test Scenarios

### UMGT - User Management (4.1)

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-UMGT-01 | Verify access to Users screen requires User Read | 1. Log in as user without User Read permission<br>2. Attempt to navigate to Admin → Users | Users menu item is not visible or access is denied | High | Negative |
| TS-UMGT-02 | Verify Users screen accessible with User Read | 1. Log in as user with User Read permission<br>2. Navigate to Admin → Users | Users screen loads; user list is displayed | High | Functional |
| TS-UMGT-03 | Verify search for existing active user | 1. Navigate to Users screen<br>2. Search by known IDIR in active users | User appears in search results | High | Functional |
| TS-UMGT-04 | Verify search for inactive user | 1. Expand search to include inactive users<br>2. Search by IDIR of a disabled user | Inactive user appears in search results | Medium | Functional |
| TS-UMGT-05 | Verify search for non-existent user | 1. Search by an IDIR that does not exist in the system | No results displayed; appropriate message shown | Medium | Negative |
| TS-UMGT-06 | Verify Add User - valid IDIR lookup | 1. Click "Add User"<br>2. Enter a valid IDIR<br>3. Click "Next" | System retrieves and displays IDIR details (name, email, etc.) | High | Functional |
| TS-UMGT-07 | Verify Add User - invalid IDIR lookup | 1. Click "Add User"<br>2. Enter an invalid/non-existent IDIR<br>3. Click "Next" | System displays an error indicating IDIR is invalid | High | Negative |
| TS-UMGT-08 | Verify Add User - assign role(s) | 1. Complete IDIR lookup successfully<br>2. Select one or more roles for the user | Roles are associated with the user | High | Functional |
| TS-UMGT-09 | Verify Add User - assign MoTI region(s) | 1. Complete IDIR lookup and role assignment<br>2. Select one or more MoTI service areas/regions | Regions are associated with the user | High | Functional |
| TS-UMGT-10 | Verify Add User - submit and verify creation | 1. Complete all steps (IDIR, roles, regions)<br>2. Submit the form<br>3. Search for the newly created user | New user appears in the user list with correct roles and regions | High | Functional |
| TS-UMGT-11 | Verify Add User - duplicate prevention | 1. Search for a user that already exists<br>2. Attempt to add the same IDIR again | System warns that user already exists or prevents duplicate creation | Medium | Negative |
| TS-UMGT-12 | Verify Add User button hidden without User Write | 1. Log in as user with User Read but NOT User Write<br>2. Navigate to Users screen | "Add User" button is not visible | High | Negative |
| TS-UMGT-13 | Verify Edit User - change role | 1. Click edit on an existing user<br>2. Modify the user's role(s)<br>3. Submit | User's role is updated; changes reflected in user list | High | Functional |
| TS-UMGT-14 | Verify Edit User - change service areas | 1. Click edit on an existing user<br>2. Add/remove service areas<br>3. Submit | User's service areas are updated | High | Functional |
| TS-UMGT-15 | Verify Edit User - set end date | 1. Click edit on a user<br>2. Set an end date in the future<br>3. Submit | End date is saved; user remains active until that date | Medium | Functional |
| TS-UMGT-16 | Verify user info (name, email) not directly editable | 1. Open edit form for a user | Name and email fields are read-only or not editable within CRT | Medium | Functional |
| TS-UMGT-17 | Verify Disable User via Disable Record action | 1. Click "Disable Record" on an active user<br>2. Provide an end date<br>3. Confirm | User is disabled as of the provided end date | High | Functional |
| TS-UMGT-18 | Verify Disable User via Edit with end date | 1. Click edit on an active user<br>2. Set end date to today or past date<br>3. Submit | User is disabled; cannot access the application | High | Functional |
| TS-UMGT-19 | Verify Enable Inactive User - remove end date | 1. Find an inactive user (search including inactive)<br>2. Click "Disable Record" action<br>3. Remove the end date<br>4. Submit | User's access is restored immediately | High | Functional |
| TS-UMGT-20 | Verify Enable Inactive User - set future end date | 1. Edit an inactive user<br>2. Change end date to a future date<br>3. Submit | User's access is restored; will expire on the future date | Medium | Functional |
| TS-UMGT-21 | Verify Disable Record button greyed out for inactive user | 1. Search including inactive users<br>2. Inspect an inactive user's row | Disable Record button appears greyed out / visually different | Low | Functional |
| TS-UMGT-22 | Verify user with no end date is active perpetually | 1. Create a user without setting an end date<br>2. Verify user can access the application over time | User remains active with no automatic expiration | Medium | Functional |

## 5. Risks and Mitigation
- **Risk**: IDIR lookup depends on external identity service; may be unavailable in lower environments.
  - **Mitigation**: Use dedicated test IDIRs; coordinate with IAM team for test environment access. Consider mocking IDIR service for automated tests.
- **Risk**: User guide does not specify behavior when adding a user with no roles assigned.
  - **Mitigation**: Test this scenario and document the outcome.
- **Risk**: Disabling a user while they are actively logged in - session handling behavior is undocumented.
  - **Mitigation**: Test and document whether the user is immediately logged out or retains access until session expires.
