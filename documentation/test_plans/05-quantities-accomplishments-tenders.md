# Test Plan: Quantities/Accomplishments & Project Tender Details

## 1. Introduction
Validates CRUD operations on quantities and accomplishments (3.5) with type selection, clone, and filtering, and tender details (3.6) with CRUD and clone.
**Reference Docs**: [3.5 Quantities/Accomplishments](../confluence_pages/user-support/end-user-guide/quantities-accomplishments.md), [3.6 Project Tender Details](../confluence_pages/user-support/end-user-guide/project-tender-details.md)

## 2. Scope
- **In Scope**: Quantity add/clone/edit/delete, Accomplishment add/clone/edit/delete, type and fiscal year filters, Tender add/clone/edit/delete
- **Out of Scope**: Financial targets (Test Plan 04), segments and ratios (Test Plan 06)

## 3. Test Strategy
- **Test Levels**: E2E (Playwright)
- **Environment**: UAT

## 4. Test Scenarios

### QA - Quantities/Accomplishments (3.5)

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-QA-01 | Verify add quantity via Add function | 1. Navigate to Quantities/Accomplishments section<br>2. Click add button<br>3. Select "Quantity"<br>4. Fill in required details<br>5. Submit | New quantity row is created and displayed | High | Functional |
| TS-QA-02 | Verify add accomplishment via Add function | 1. Click add button<br>2. Select "Accomplishment"<br>3. Fill in required details<br>4. Submit | New accomplishment row is created and displayed | High | Functional |
| TS-QA-03 | Verify clone creates same entity type | 1. Create a quantity row<br>2. Click clone on the quantity row<br>3. Modify details<br>4. Submit | A new quantity row is created (not an accomplishment); values are pre-populated from source | High | Functional |
| TS-QA-04 | Verify clone of accomplishment creates accomplishment | 1. Create an accomplishment row<br>2. Click clone on the accomplishment row<br>3. Submit | A new accomplishment row is created; values are pre-populated from source | High | Functional |
| TS-QA-05 | Verify clone button unavailable with no rows | 1. Navigate to section with no existing rows | Clone buttons are not visible | Medium | Edge Case |
| TS-QA-06 | Verify edit quantity | 1. Click edit (pencil) on a quantity row<br>2. Modify fields<br>3. Submit | Quantity row is updated with new values | High | Functional |
| TS-QA-07 | Verify edit accomplishment | 1. Click edit (pencil) on an accomplishment row<br>2. Modify fields<br>3. Submit | Accomplishment row is updated with new values | High | Functional |
| TS-QA-08 | Verify delete quantity with confirmation | 1. Click delete (trash) on a quantity row<br>2. Confirm deletion | Quantity row is removed | High | Functional |
| TS-QA-09 | Verify delete accomplishment cancelled | 1. Click delete (trash) on an accomplishment row<br>2. Cancel confirmation | Row is not deleted | Medium | Negative |
| TS-QA-10 | Verify filter by type - Quantity | 1. Ensure both quantities and accomplishments exist<br>2. Select "Quantity" from type dropdown filter | Only quantity rows are displayed | High | Functional |
| TS-QA-11 | Verify filter by type - Accomplishment | 1. Select "Accomplishment" from type dropdown filter | Only accomplishment rows are displayed | High | Functional |
| TS-QA-12 | Verify filter by fiscal year | 1. Ensure rows exist across multiple fiscal years<br>2. Select a specific fiscal year from the filter | Only rows matching the selected fiscal year are displayed | High | Functional |
| TS-QA-13 | Verify combined type and fiscal year filter | 1. Select type = "Quantity" and a specific fiscal year | Only quantity rows for the selected fiscal year are displayed | Medium | Functional |
| TS-QA-14 | Verify required field validation on add | 1. Click add, select type<br>2. Leave required fields blank<br>3. Attempt to submit | Validation error shown; submission prevented | High | Negative |
| TS-QA-15 | Verify read-only access restrictions | 1. Log in as Project Read only user<br>2. Navigate to Quantities/Accomplishments | Add, edit, delete, and clone buttons are not visible or disabled | High | Negative |

### TNDR - Project Tender Details (3.6)

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-TNDR-01 | Verify add tender via Add function | 1. Navigate to Project Tender Details<br>2. Click add (+) button<br>3. Fill in tender details<br>4. Submit | New tender row is created and displayed | High | Functional |
| TS-TNDR-02 | Verify add tender via Clone function | 1. Ensure at least one tender row exists<br>2. Click clone button on a row<br>3. Modify details<br>4. Submit | New tender row is created with pre-populated values from source | High | Functional |
| TS-TNDR-03 | Verify clone button unavailable with no rows | 1. Navigate to tenders for a project with no tender rows | Clone button is not visible | Medium | Edge Case |
| TS-TNDR-04 | Verify edit tender | 1. Click edit (pencil) on a tender row<br>2. Modify fields<br>3. Submit | Tender row is updated | High | Functional |
| TS-TNDR-05 | Verify delete tender with confirmation | 1. Click delete (trash) on a tender row<br>2. Confirm deletion | Tender row is removed | High | Functional |
| TS-TNDR-06 | Verify delete tender cancelled | 1. Click delete (trash)<br>2. Cancel confirmation | Tender row is not deleted | Medium | Negative |
| TS-TNDR-07 | Verify required field validation | 1. Click add (+)<br>2. Leave required fields blank<br>3. Attempt to submit | Validation error shown; submission prevented | High | Negative |
| TS-TNDR-08 | Verify read-only access restrictions | 1. Log in as Project Read only user<br>2. Navigate to Tender Details | Add, edit, delete, and clone buttons are not visible or disabled | High | Negative |

## 5. Risks and Mitigation
- **Risk**: The distinction between quantity and accomplishment forms/fields is not fully documented in the user guide.
  - **Mitigation**: Explore both forms during testing; document field differences.
- **Risk**: Clone behavior edge cases (cloning then changing type) are undocumented.
  - **Mitigation**: Test explicitly and document observed behavior.
- **Risk**: Tender detail fields and required validations are not enumerated.
  - **Mitigation**: Determine empirically during first test execution pass.
