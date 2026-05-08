# Test Plan: Administration - User Roles

## 1. Introduction
Validates role management workflows including creation with permissions, editing, disabling, and the downstream impact on users when roles change (4.4).
**Reference Docs**: [4.4 Managing user roles](../confluence_pages/user-support/end-user-guide/managing-user-roles.md)

## 2. Scope
- **In Scope**: Role add/edit/disable, permissions assignment, search active/inactive roles, impact of disabling a role on assigned users, System Administrator role protection
- **Out of Scope**: User creation/editing (Test Plan 07), individual permission enforcement per screen (covered in respective test plans)

## 3. Test Strategy
- **Test Levels**: E2E (Playwright)
- **Environment**: UAT
- **Prerequisites**: Admin user with Role Read and Role Write permissions

## 4. Test Scenarios

### ROLE - User Roles (4.4)

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-ROLE-01 | Verify access requires Role Read | 1. Log in without Role Read permission<br>2. Attempt to navigate to Admin → Roles | Roles menu item is not visible or access is denied | High | Negative |
| TS-ROLE-02 | Verify Roles screen accessible with Role Read | 1. Log in with Role Read permission<br>2. Navigate to Admin → Roles | Roles screen loads; existing roles displayed | High | Functional |
| TS-ROLE-03 | Verify search active roles | 1. Execute search on Roles screen | Active roles are displayed | High | Functional |
| TS-ROLE-04 | Verify search includes inactive roles | 1. Expand search to include inactive<br>2. Execute search | Both active and inactive roles displayed | Medium | Functional |
| TS-ROLE-05 | Verify search for non-existent role | 1. Search for a role name that doesn't exist | No results; appropriate message shown | Low | Negative |
| TS-ROLE-06 | Verify add role with name, description, permissions | 1. Click "Add Role"<br>2. Enter role name and description<br>3. Select permissions (e.g., Project Read, Project Write)<br>4. Submit | New role is created with the specified permissions | High | Functional |
| TS-ROLE-07 | Verify all permissions can be assigned | 1. Create a role<br>2. Assign all available permissions (Code Table R/W, Export Read, Project R/W, Role R/W, User R/W, API Access Client) | All permissions are saved with the role | Medium | Functional |
| TS-ROLE-08 | Verify add role without permissions | 1. Click "Add Role"<br>2. Enter name and description only, no permissions<br>3. Submit | System either prevents creation or creates role with no access | Medium | Edge Case |
| TS-ROLE-09 | Verify duplicate role prevention | 1. Attempt to add a role with exact same permissions as an existing role | System warns about duplication or prevents creation | Medium | Negative |
| TS-ROLE-10 | Verify add role button hidden without Role Write | 1. Log in with Role Read but NOT Role Write<br>2. Navigate to Roles screen | "Add Role" button is not visible | High | Negative |
| TS-ROLE-11 | Verify edit role - change description | 1. Click edit on an existing role<br>2. Modify description<br>3. Submit | Role description is updated | High | Functional |
| TS-ROLE-12 | Verify edit role - add permission | 1. Click edit on a role<br>2. Add a new permission<br>3. Submit | Permission is added; users with this role gain the new access | High | Functional |
| TS-ROLE-13 | Verify edit role - remove permission | 1. Click edit on a role<br>2. Remove a permission<br>3. Submit | Permission is removed; users with this role lose that access | High | Functional |
| TS-ROLE-14 | Verify disable role from search screen | 1. Click disable on an active role (not System Administrator)<br>2. Provide end date<br>3. Confirm | Role is disabled; end date is recorded | High | Functional |
| TS-ROLE-15 | Verify disable role from edit screen | 1. Open edit form for a role<br>2. Disable from within the form | Role is disabled | Medium | Functional |
| TS-ROLE-16 | Verify disabling role revokes user access | 1. Assign a user only the target role<br>2. Disable that role<br>3. User attempts to access the application | User loses application access (as documented: "any users with the disabled role will lose their application access") | High | Functional |
| TS-ROLE-17 | Verify reactivate disabled role | 1. Find an inactive role<br>2. Re-enable it | Role becomes active; can be assigned to users again | Medium | Functional |
| TS-ROLE-18 | Verify System Administrator role cannot be disabled | 1. Locate the System Administrator role<br>2. Attempt to disable it | System prevents disabling; appropriate warning or error | High | Negative |
| TS-ROLE-19 | Verify System Administrator permissions cannot be removed | 1. Open edit for System Administrator role<br>2. Attempt to remove permissions | System prevents permission removal or warns the administrator | High | Negative |
| TS-ROLE-20 | Verify Order Number controls list position | 1. Create or edit a role with a specific Order Number | Role appears in the correct position in the list based on Order Number | Low | Functional |

### Permissions Reference Validation

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-PERM-01 | Verify Code Table Read grants view-only code table access | 1. Create role with only Code Table Read<br>2. Assign to test user<br>3. User navigates to Code Tables | User can view code tables but not add/edit/delete | High | Functional |
| TS-PERM-02 | Verify Code Table Write grants full code table access | 1. Create role with Code Table Read + Write<br>2. Assign to test user | User can add, edit, and disable/delete code values | High | Functional |
| TS-PERM-03 | Verify Export Read grants report navigation | 1. Create role with Export Read<br>2. Assign to test user | User can navigate to Reports section | High | Functional |
| TS-PERM-04 | Verify Project Read grants view-only project access | 1. Create role with Project Read only<br>2. Assign to test user | User can search and view projects but not create or edit | High | Functional |
| TS-PERM-05 | Verify Project Write grants full project access | 1. Create role with Project Read + Write<br>2. Assign to test user | User can create, edit, and delete project data | High | Functional |
| TS-PERM-06 | Verify User Write requires Role Read for user creation | 1. Create role with User Read + User Write but NO Role Read<br>2. Assign to test user<br>3. Attempt to add a user | Role assignment step is not available during user creation | Medium | Functional |

## 5. Risks and Mitigation
- **Risk**: Disabling a role is a high-impact action that affects all users assigned that role.
  - **Mitigation**: Test with a dedicated test role assigned only to test users; never disable production roles in UAT.
- **Risk**: System Administrator protection rules are critical; any bypass could compromise application security.
  - **Mitigation**: Verify protection with both UI and API-level tests if possible.
- **Risk**: Permission combination effects are numerous; exhaustive testing of all combinations is impractical.
  - **Mitigation**: Focus on the documented permissions table; test key combinations rather than all permutations.
