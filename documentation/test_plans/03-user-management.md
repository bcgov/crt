# 3. User Management – Roles & Permissions

> **Preconditions for this file**: Tester is logged in as `{{IDIR_VALID_ADMIN}}` (`SYSTEM_ADMIN`) unless a row specifies a different persona. Default seeded roles (`SYSTEM_ADMIN`, `DISTRICT_ADMIN`, `MANAGER`, `READ_ONLY`) and at least one user per region are present. See [00-conventions-glossary.md](00-conventions-glossary.md).

## [CRPDB-77] Manage User Access - Set Up Roles and Permissions

**User Story**: As an Administrator, I want to manage roles and permissions, so that users have appropriate access to perform their activities.

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-ROLE-01 | Admin login | 1. Log in with Administrator credentials | Login with no error | High | Functional |
| TS-ROLE-02 | Search roles with partial name | 1. Navigate to Roles & Permissions<br>2. Enter partial role name in search<br>3. Verify Active/Inactive filter (default: Active) | Role found with partial search; Active is default filter | Medium | Functional |
| TS-ROLE-03 | Mandatory fields on new role | 1. Click Add Role<br>2. Leave Role Name, Description, or Permissions blank<br>3. Submit | Inline validation error appears next to each blank mandatory field; form is not submitted | High | Negative |
| TS-ROLE-04 | Create new role with all permissions | 1. Click Add Role<br>2. Enter Role Name "TEST_ADMIN"<br>3. Enter Description<br>4. Select End Date<br>5. Select all permissions<br>6. Submit | Role created with all permissions and end date | High | Functional |
| TS-ROLE-05 | Modify role permissions | 1. Edit existing role<br>2. Remove/add permissions<br>3. Submit | Role permissions updated | Medium | Functional |
| TS-ROLE-06 | Deactivate role via end date | 1. Edit role<br>2. Set End Date to past date<br>3. Search with Inactive filter | Role appears in Inactive search results | Medium | Functional |
| TS-ROLE-07 | Verify default roles match requirements | 1. Check DISTRICT_ADMIN, MANAGER, READ_ONLY, SYSTEM_ADMIN permissions | Permissions match requirements documentation | High | Functional |
| TS-ROLE-08 | Disable role via icon | 1. Click Disable icon on a role | Role is disabled | Medium | Functional |
| TS-ROLE-09 | Disable role cascading effect on users | 1. Assign a role to one or more users<br>2. Disable the role<br>3. Attempt to log in as affected user | Users with the disabled role lose application access | High | Edge Case |
| TS-ROLE-10 | System Admin role cannot be disabled | 1. Navigate to Roles & Permissions<br>2. Attempt to disable the SYSTEM_ADMIN role | System rejects action; SYSTEM_ADMIN role remains active and unchanged | High | Negative |
| TS-ROLE-11 | System Admin role permissions cannot be removed | 1. Edit SYSTEM_ADMIN role<br>2. Attempt to remove permissions<br>3. Submit | System prevents saving SYSTEM_ADMIN with reduced permissions | High | Negative |

---

## [CRPDB-78] User Management Interface - Set Up Users

**User Story**: As an Administrator, I want to add/edit users with appropriate access, so they can perform their tasks in the application.

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-USER-01 | Search users by multiple regions | 1. Log in as Admin<br>2. Select multiple MoTI regions in filter<br>3. Search | Users listed per selected regions; regions display as expected (0-HQ, 1-South Coast, 2-Southern Interior, 3-Northern) | Medium | Functional |
| TS-USER-02 | Search users by region | 1. Select specific region<br>2. Search | Only users in selected region are shown | Medium | Functional |
| TS-USER-03 | Partial text search for users | 1. Enter partial First Name, Last Name, or IDIR<br>2. Search | User found with accurate information | Medium | Functional |
| TS-USER-04 | Search by status (Active/Inactive/All) | 1. Search Active users<br>2. Search Inactive users<br>3. Search All users | Correct users displayed for each filter | Medium | Functional |
| TS-USER-05 | Add user with invalid IDIR | 1. Click Add User<br>2. Enter `{{IDIR_INVALID}}` | Error displayed: `"Invalid User ID"`; user is not created | High | Negative |
| TS-USER-06 | Add user with valid IDIR | 1. Click Add User<br>2. Enter `{{IDIR_VALID_USER}}` | Form auto-populates IDIR, First Name, Last Name, Email from the directory lookup | High | Functional |
| TS-USER-07 | Prevent duplicate IDIR | 1. Add user `{{IDIR_VALID_USER}}`<br>2. Add same IDIR again<br>3. Make the user inactive (set past End Date)<br>4. Add same IDIR again | Steps 2 & 4 both display: `"Username [IDIR] already exists"` and the duplicate is not created | High | Negative |
| TS-USER-08 | Only System Admin can assign System Admin role | 1. Log in as non-system admin<br>2. Attempt to assign System Admin role | Non-system admin cannot assign System Admin role | High | Security |
| TS-USER-09 | Edit user details popup | 1. Click Edit on existing user | Popup shows User ID, Role, MoTI Region, End Date | Medium | Functional |
| TS-USER-10 | Multiple region assignment | 1. Edit user<br>2. Select multiple MoTI regions | Multiple regions allowed; format: `<Code>-<Description>`, sorted by code | Medium | Functional |
| TS-USER-11 | Verify search results columns | 1. Perform user search | Results show: First Name, Last Name, User ID, Email, Region, Status, Edit icon, Disable icon | Low | Functional |
| TS-USER-12 | Non-admin cannot see admin tabs | 1. Log in as non-administrator | Users and Roles & Permissions tabs not visible | High | Security |
| TS-USER-13 | Re-enable inactive user via Disable icon | 1. Search for inactive user<br>2. Click greyed-out Disable icon<br>3. Remove End Date or set future End Date<br>4. Click Update | User access restored immediately; user appears as Active in search | Medium | Functional |
| TS-USER-14 | Re-enable inactive user via Edit | 1. Search for inactive user<br>2. Click Edit icon<br>3. Remove End Date or provide future End Date<br>4. Submit | User access restored; user can log in again | Medium | Functional |

---

## [CRPDB-104] BVT - User Management (UAT Smoke Test)

**User Story**: As an Administrator, I want to add and manage users in the CRT application.

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-BVT-USER-01 | Add new users | 1. Navigate to Users screen<br>2. Add user with properties | Admin can add users with appropriate access | High | E2E |
| TS-BVT-USER-02 | Update users | 1. Edit existing user properties | Admin can alter user properties and access | High | E2E |
| TS-BVT-USER-03 | Application access verification | 1. Log in as newly created/modified user | User accesses application per assigned properties | High | E2E |
