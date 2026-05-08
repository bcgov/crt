# Test Plan: Financial Planning Targets & Public Project Information

## 1. Introduction
Validates CRUD operations on financial planning targets including clone and fiscal year filtering (3.3), and add/update of public project information (3.4).
**Reference Docs**: [3.3 Financial Planning Targets](../confluence_pages/user-support/end-user-guide/financial-planning-targets.md), [3.4 Public Project Information](../confluence_pages/user-support/end-user-guide/public-project-information.md)

## 2. Scope
- **In Scope**: Financial target add/clone/edit/delete, fiscal year filter, public project info add/update
- **Out of Scope**: Other project sections, report-level financial data

## 3. Test Strategy
- **Test Levels**: E2E (Playwright)
- **Environment**: UAT

## 4. Test Scenarios

### FPT - Financial Planning Targets (3.3)

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-FPT-01 | Verify add financial target via Add function | 1. Navigate to Financial Planning Targets section<br>2. Click add (+) button<br>3. Fill in fiscal year, amount, and other required fields<br>4. Submit | New financial target row is created and displayed in the section | High | Functional |
| TS-FPT-02 | Verify add financial target via Clone function | 1. Ensure at least one financial target row exists<br>2. Click clone button on an existing row<br>3. Modify fiscal year or other fields as needed<br>4. Submit | New financial target row is created with pre-populated values from the cloned row | High | Functional |
| TS-FPT-03 | Verify clone button not available when no rows exist | 1. Navigate to Financial Planning Targets for a project with no targets | Clone button is not visible (only Add is available) | Medium | Edge Case |
| TS-FPT-04 | Verify edit financial target | 1. Click edit (pencil) button on an existing row<br>2. Modify one or more fields<br>3. Submit | Row is updated with new values | High | Functional |
| TS-FPT-05 | Verify delete financial target with confirmation | 1. Click delete (trash) button on an existing row<br>2. Confirm deletion | Row is removed from the financial targets list | High | Functional |
| TS-FPT-06 | Verify delete financial target cancelled | 1. Click delete (trash) button<br>2. Cancel confirmation | Row is not deleted; remains in the list | Medium | Negative |
| TS-FPT-07 | Verify fiscal year filter | 1. Ensure multiple financial targets exist across different fiscal years<br>2. Select a specific fiscal year from the filter | Only rows matching the selected fiscal year are displayed | High | Functional |
| TS-FPT-08 | Verify fiscal year filter reset | 1. Apply a fiscal year filter<br>2. Clear/reset the filter | All financial target rows are displayed again | Medium | Functional |
| TS-FPT-09 | Verify required field validation on add | 1. Click add (+)<br>2. Leave required fields blank<br>3. Attempt to submit | Validation error is shown; form is not submitted | High | Negative |
| TS-FPT-10 | Verify negative or zero financial amount | 1. Click add (+)<br>2. Enter 0 or negative value in amount field<br>3. Submit | System either accepts or rejects based on business rules; behavior is consistent | Medium | Edge Case |
| TS-FPT-11 | Verify duplicate fiscal year entry | 1. Add a financial target for fiscal year 2024-25<br>2. Attempt to add another for the same fiscal year with same element | System either prevents duplicate or allows multiple entries per business rules | Medium | Edge Case |
| TS-FPT-12 | Verify read-only user cannot add/edit/delete targets | 1. Log in as user with Project Read only<br>2. Navigate to Financial Planning Targets | Add, edit, delete, and clone buttons are not visible or disabled | High | Negative |

### PPI - Public Project Information (3.4)

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-PPI-01 | Verify add/update public project information | 1. Navigate to Public Project Information section<br>2. Click edit (pencil) button<br>3. Enter or update project value details<br>4. Submit | Public project information is saved; updated values displayed on screen | High | Functional |
| TS-PPI-02 | Verify initial state with no public info | 1. Navigate to Public Project Info for a new project with no data | Section is displayed with empty/default values; edit button is available | Medium | Functional |
| TS-PPI-03 | Verify cancel edit without saving | 1. Click edit (pencil)<br>2. Modify fields<br>3. Cancel without submitting | No changes are saved; original values remain | Medium | Functional |
| TS-PPI-04 | Verify required field validation | 1. Click edit (pencil)<br>2. Clear required fields<br>3. Attempt to submit | Validation prevents submission | Medium | Negative |
| TS-PPI-05 | Verify read-only user cannot edit | 1. Log in as user with Project Read only<br>2. Navigate to Public Project Information | Edit button is not visible or disabled | High | Negative |

## 5. Risks and Mitigation
- **Risk**: User guide does not specify valid fiscal year formats or ranges.
  - **Mitigation**: Test common formats (e.g., "2024/2025"); document accepted format.
- **Risk**: Business rules for duplicate fiscal year entries are unclear.
  - **Mitigation**: Document observed behavior and flag for business confirmation.
- **Risk**: Public project information fields and validation rules are not enumerated in the user guide.
  - **Mitigation**: Explore the form during testing; document discovered fields and validations.
