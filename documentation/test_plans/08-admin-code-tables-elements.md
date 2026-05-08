# Test Plan: Administration - Code Tables & Elements

## 1. Introduction
Validates CRUD operations on code table values (4.2) and elements (4.3), including the distinction between disable (soft delete) and permanent delete based on usage.
**Reference Docs**: [4.2 Managing Code Table values](../confluence_pages/user-support/end-user-guide/managing-code-tables.md), [4.3 Manage Elements](../confluence_pages/user-support/end-user-guide/manage-elements.md)

## 2. Scope
- **In Scope**: Code table value add/edit/disable/delete, element add/edit/disable/delete, search with active/inactive filter, duplicate prevention, ordering
- **Out of Scope**: Role management (Test Plan 09), specific code set business rules

## 3. Test Strategy
- **Test Levels**: E2E (Playwright)
- **Environment**: UAT
- **Prerequisites**: Admin user with Code Read and Code Write permissions

## 4. Test Scenarios

### CODE - Code Table Values (4.2)

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-CODE-01 | Verify access requires Code Read | 1. Log in as user without Code Read permission<br>2. Attempt to navigate to Admin → Code Tables | Code Tables menu item is not visible or access is denied | High | Negative |
| TS-CODE-02 | Verify search code values by code set | 1. Navigate to Code Tables<br>2. Select a code set (e.g., "Accomplishment")<br>3. Execute search | All active code values for the selected code set are displayed | High | Functional |
| TS-CODE-03 | Verify search includes inactive codes | 1. Expand search to include inactive codes<br>2. Execute search | Both active and inactive code values are displayed | Medium | Functional |
| TS-CODE-04 | Verify add code value with Code Value, Code Name, and Order Number | 1. Select a code set<br>2. Click "Add <code set>"<br>3. Enter Code Value (e.g., "P"), Code Name (e.g., "Planning"), Order Number<br>4. Submit | New code value is created and appears in the code set list | High | Functional |
| TS-CODE-05 | Verify add code value with Code Name only (no Code Value) | 1. Click Add<br>2. Enter Code Name only, leave Code Value blank<br>3. Submit | Code value is created successfully with blank code value | Medium | Functional |
| TS-CODE-06 | Verify Code Name is required | 1. Click Add<br>2. Leave Code Name blank<br>3. Attempt to submit | Validation prevents submission; Code Name required error displayed | High | Negative |
| TS-CODE-07 | Verify duplicate code value prevention | 1. Add a code value "P" to code set "Accomplishment"<br>2. Attempt to add another "P" to the same code set | System warns about duplication or prevents creation | Medium | Negative |
| TS-CODE-08 | Verify Order Number controls list position | 1. Add a code value with Order Number = 1<br>2. Add another with Order Number = 5 | Code values appear in the list ordered by their Order Number | Low | Functional |
| TS-CODE-09 | Verify new value without Order Number appears at bottom | 1. Add a code value without specifying Order Number | New value appears at the bottom of the list | Low | Functional |
| TS-CODE-10 | Verify edit code value | 1. Click edit on an existing code value<br>2. Modify Code Name or Order Number<br>3. Submit | Code value is updated | High | Functional |
| TS-CODE-11 | Verify disable code value (used in data entry) | 1. Identify a code value that has been used in project data entry<br>2. Click disable button<br>3. Confirm action | Code value is made inactive; no longer available for new data entry; existing data retains the value | High | Functional |
| TS-CODE-12 | Verify disabled code not available for data entry | 1. Disable a code value<br>2. Navigate to a data entry form that uses that code set | Disabled code value does not appear in the dropdown/selection | High | Functional |
| TS-CODE-13 | Verify reactivate disabled code value | 1. Search including inactive codes<br>2. Re-enable a disabled code value | Code value becomes active and available for data entry again | Medium | Functional |
| TS-CODE-14 | Verify permanent delete (never used in data entry) | 1. Identify a code value that has NEVER been used in data entry<br>2. Click delete button<br>3. Confirm action | Code value is permanently removed; cannot be reinstated | High | Functional |
| TS-CODE-15 | Verify permanent delete not available for used code values | 1. Identify a code value that has been used in data entry<br>2. Check available actions | Delete (permanent) button is not available; only disable is offered | High | Negative |
| TS-CODE-16 | Verify delete confirmation cancelled | 1. Click delete on an eligible code value<br>2. Cancel confirmation | Code value is not deleted | Medium | Negative |
| TS-CODE-17 | Verify read-only access (Code Read, no Code Write) | 1. Log in with Code Read only<br>2. Navigate to Code Tables | Code values are visible; Add, Edit, Disable, Delete buttons are hidden/disabled | High | Negative |

### ELEM - Elements (4.3)

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-ELEM-01 | Verify access requires Code Read | 1. Log in without Code Read<br>2. Attempt to access Elements | Access denied or menu item hidden | High | Negative |
| TS-ELEM-02 | Verify search elements | 1. Navigate to Elements screen<br>2. Execute search | Active elements are displayed | High | Functional |
| TS-ELEM-03 | Verify search includes inactive elements | 1. Expand search to include inactive<br>2. Execute search | Both active and inactive elements displayed | Medium | Functional |
| TS-ELEM-04 | Verify add element with Program Category, Program, Service Line | 1. Click "Add New Element"<br>2. Enter Program Category, Program, Service Line, and other fields<br>3. Submit | New element is created | High | Functional |
| TS-ELEM-05 | Verify element Code Name is required | 1. Click Add<br>2. Leave Code Name blank<br>3. Attempt to submit | Validation prevents submission | High | Negative |
| TS-ELEM-06 | Verify duplicate element prevention | 1. Attempt to add an element identical to an existing one | System warns or prevents duplicate | Medium | Negative |
| TS-ELEM-07 | Verify edit element | 1. Click edit on an existing element<br>2. Modify fields<br>3. Submit | Element is updated | High | Functional |
| TS-ELEM-08 | Verify disable element (used in data entry) | 1. Click disable on an element used in data entry<br>2. Confirm | Element is deactivated; not available for new data entry | High | Functional |
| TS-ELEM-09 | Verify reactivate disabled element | 1. Find inactive element<br>2. Re-enable | Element becomes active again | Medium | Functional |
| TS-ELEM-10 | Verify permanent delete (never used) | 1. Click delete on an element never used in data entry<br>2. Confirm | Element is permanently removed | High | Functional |
| TS-ELEM-11 | Verify permanent delete not available for used elements | 1. Check actions on an element used in data entry | Delete button is not available; only disable offered | High | Negative |
| TS-ELEM-12 | Verify read-only access | 1. Log in with Code Read only<br>2. Navigate to Elements | Add, edit, disable, delete buttons are hidden/disabled | High | Negative |

## 5. Risks and Mitigation
- **Risk**: Determining which code values/elements have been "used in data entry" may require test data setup.
  - **Mitigation**: Prepare test data with known used/unused code values before test execution.
- **Risk**: The exact list of code sets available in the application is not enumerated in the user guide.
  - **Mitigation**: Discover available code sets during testing; document them for future reference.
- **Risk**: Permanently deleting a code value is irreversible.
  - **Mitigation**: Only test permanent delete with values specifically created for testing purposes; never on production-relevant data.
