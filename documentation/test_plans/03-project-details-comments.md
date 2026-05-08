# Test Plan: Project Details & Comments

## 1. Introduction
Validates editing of project header details (3.1) and full CRUD operations on Status and EMR comments (3.2).
**Reference Docs**: [3.1 Project Details](../confluence_pages/user-support/end-user-guide/project-details.md), [3.2 Status and EMR Comments](../confluence_pages/user-support/end-user-guide/status-and-emr-comments.md)

## 2. Scope
- **In Scope**: Edit project details form, Status comments CRUD, EMR comments CRUD, comment history view
- **Out of Scope**: Project creation (Test Plan 02), other project sections

## 3. Test Strategy
- **Test Levels**: E2E (Playwright)
- **Environment**: UAT

## 4. Test Scenarios

### PDET - Project Details (3.1)

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-PDET-01 | Verify edit button opens edit form | 1. Navigate to a project's details section<br>2. Click the edit button (top-right) | Edit form opens with current project data pre-populated | High | Functional |
| TS-PDET-02 | Verify successful update of project details | 1. Open edit form for a project<br>2. Modify one or more fields (e.g., Project Name, Description)<br>3. Click Submit | Changes are saved; updated values are displayed on the details screen | High | Functional |
| TS-PDET-03 | Verify cancel without saving | 1. Open edit form for a project<br>2. Modify a field<br>3. Cancel/close the form without submitting | No changes are saved; original values remain | Medium | Functional |
| TS-PDET-04 | Verify required field validation on edit | 1. Open edit form<br>2. Clear a required field<br>3. Attempt to submit | Validation error is displayed; form is not submitted | High | Negative |
| TS-PDET-05 | Verify read-only user cannot edit | 1. Log in as user with Project Read only<br>2. Navigate to a project's details | Edit button is not visible or is disabled | High | Negative |
| TS-PDET-06 | Verify special characters in project details | 1. Open edit form<br>2. Enter special characters in text fields<br>3. Submit | Data is saved and displayed correctly without encoding issues | Medium | Edge Case |

### CMNT - Status and EMR Comments (3.2)

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-CMNT-01 | Verify add Status comment | 1. Navigate to project's Status/EMR comments section<br>2. Click the add (+) button for Status comments<br>3. Enter comment text<br>4. Submit | New Status comment is created; latest comment is displayed on the details screen | High | Functional |
| TS-CMNT-02 | Verify add EMR comment | 1. Navigate to project's Status/EMR comments section<br>2. Click the add (+) button for EMR comments<br>3. Enter comment text<br>4. Submit | New EMR comment is created; latest comment is displayed on the details screen | High | Functional |
| TS-CMNT-03 | Verify latest comment displayed on details screen | 1. Add multiple Status comments to a project | The most recently added comment is shown on the main details view | Medium | Functional |
| TS-CMNT-04 | Verify view comment history (Status) | 1. Click the expand button for Status comments | Comment history panel opens showing all Status comments in chronological order | High | Functional |
| TS-CMNT-05 | Verify view comment history (EMR) | 1. Click the expand button for EMR comments | Comment history panel opens showing all EMR comments in chronological order | High | Functional |
| TS-CMNT-06 | Verify edit comment | 1. Open comment history<br>2. Click edit (pencil) on a comment<br>3. Modify comment text<br>4. Submit | Comment is updated; updated text is displayed in comment history | High | Functional |
| TS-CMNT-07 | Verify delete comment with confirmation | 1. Open comment history<br>2. Click delete (trash) on a comment<br>3. Confirm deletion | Comment is removed from comment history | High | Functional |
| TS-CMNT-08 | Verify delete comment cancelled | 1. Open comment history<br>2. Click delete (trash) on a comment<br>3. Cancel the confirmation dialog | Comment is not deleted; remains in comment history | Medium | Negative |
| TS-CMNT-09 | Verify add comment with empty text | 1. Click add (+) for Status or EMR comment<br>2. Leave comment text blank<br>3. Attempt to submit | Validation prevents submission; error message displayed | Medium | Negative |
| TS-CMNT-10 | Verify comment with max-length text | 1. Click add (+)<br>2. Enter maximum allowed characters<br>3. Submit | Comment is saved without truncation | Low | Edge Case |
| TS-CMNT-11 | Verify read-only user cannot add/edit/delete comments | 1. Log in as user with Project Read only<br>2. Navigate to comments section | Add, edit, and delete buttons are not visible or disabled | High | Negative |

## 5. Risks and Mitigation
- **Risk**: User guide does not specify maximum field lengths for project details or comments.
  - **Mitigation**: Determine limits empirically or from database schema; document for future tests.
- **Risk**: User guide does not specify which project detail fields are required vs. optional.
  - **Mitigation**: Test all fields; document which are enforced by validation.
