# 7. Data Maintenance

> **Preconditions for this file**: Tester is logged in as `{{IDIR_VALID_ADMIN}}` (or any role granting `Code Read` + `Code Write`) unless a row specifies a different persona. Default Code Tables (Accomplishments, Project Manager, Capital Index, Element code sets, Tender Contractor) are seeded. See [00-conventions-glossary.md](00-conventions-glossary.md).

## Element Management

**User Story**: As an Application Administrator, I want to maintain element values (Program Category, Program, Service Line) that are used in financial planning, so users have accurate options for data entry.

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-ELEM-01 | Navigate to Element management | 1. Log in with Code Read + Code Write permissions<br>2. Navigate to Admin → Elements | Elements management screen accessible | High | Functional |
| TS-ELEM-02 | Search existing elements | 1. Search by element code or name<br>2. Toggle Active/Inactive filter | Elements found; Active default; Inactive filter works | Medium | Functional |
| TS-ELEM-03 | Add new element | 1. Click "Add New Element"<br>2. Provide Code Value (optional), Code Name (required), Order Number<br>3. Submit | Element created; appears in search results and relevant dropdowns | High | Functional |
| TS-ELEM-04 | Add element - Code Name required | 1. Click "Add New Element"<br>2. Leave Code Name blank<br>3. Submit | Error: Code Name is required | High | Negative |
| TS-ELEM-05 | Add element - duplicate prevention | 1. Add element with same values as existing element in same code set | Error: duplicate element not allowed | High | Negative |
| TS-ELEM-06 | Edit element | 1. Click Edit on existing element<br>2. Modify Code Name or Order Number<br>3. Submit | Element updated in table and reflected in data entry dropdowns | Medium | Functional |
| TS-ELEM-07 | Disable element (used in data entry) | 1. Click Disable icon on element that has been used in data entry<br>2. Confirm "This value will be disabled. Are you sure?" | Element disabled; no longer available for new data entry; existing records unaffected | Medium | Functional |
| TS-ELEM-08 | Delete element (never used) | 1. Click Delete (trash) icon on element never used in data entry<br>2. Confirm "This value will be deleted. Are you sure?" | Element permanently removed | Medium | Functional |
| TS-ELEM-09 | Cannot delete element used in data entry | 1. Attempt to delete element already referenced in financial planning entries | Delete icon not shown; only Disable icon available | Medium | Negative |
| TS-ELEM-10 | Re-enable disabled element | 1. Filter for Inactive elements<br>2. Click Enable icon on disabled element<br>3. Confirm | Element re-activated; available for data entry again | Medium | Functional |
| TS-ELEM-11 | Element appears in Financial Planning form | 1. Add or enable element<br>2. Navigate to Financial Planning → Add<br>3. Type in Element look-ahead field | Newly added/enabled element appears in look-ahead results with code and description | Medium | Functional |
| TS-ELEM-12 | Permission boundary - Code Read only | 1. Log in with role having Code Read but NOT Code Write<br>2. Navigate to Elements screen | Elements visible but Add/Edit/Disable/Delete actions not available | High | Security |

---

## [CRPDB-201] Data Maintenance - Code Table

**User Story**: As an Application Administrator, I want to maintain code values used in application dropdowns.

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-CODE-01 | Code Value Set filter | 1. Verify single-select mandatory filter<br>2. Verify dropdown list<br>3. Hover over help<br>4. Verify default is "Accomplishments" | Filter works as specified; help text on hover | High | Functional |
| TS-CODE-02 | Code Value/Name text search | 1. Search by code value<br>2. Search by code name<br>3. Verify hover text | Searches both fields; hover text explains behavior | Medium | Functional |
| TS-CODE-03 | Status filter (Active/Inactive) | 1. Verify Active is default<br>2. Switch to Inactive | Correct records shown per status | Medium | Functional |
| TS-CODE-04 | Add new code value | 1. Select "Accomplishment" code set<br>2. Click Add New<br>3. Enter Code Value, Code Name, Order<br>4. Submit<br>5. Verify help text and hover messages | Code added; mandatory validation (at least Code Value or Code Name); help text on hover | High | Functional |
| TS-CODE-05 | Uniqueness validation | 1. Add code with duplicate Code Value<br>2. Add code with duplicate Code Value-Code Name combination (case insensitive) | Error: uniqueness violation | High | Negative |
| TS-CODE-06 | Edit code value | 1. Click Edit<br>2. Modify fields<br>3. Submit | Record updated; at least Code Value or Code Name required | Medium | Functional |
| TS-CODE-07 | Disable active used code | 1. Click Disable icon (for active, used code)<br>2. Confirm "This value will be disabled. Are you sure?" | Value disabled; tooltip "Disable record" | Medium | Functional |
| TS-CODE-08 | Delete active unused code | 1. Click Delete icon (trash, for active unused code)<br>2. Confirm "This value will be deleted. Are you sure?" | Value deleted; tooltip "Delete record" | Medium | Functional |
| TS-CODE-09 | Enable inactive code | 1. Click greyed-out icon (for inactive code)<br>2. Confirm "This value will be enabled. Are you sure?" | Value re-enabled; tooltip "Enable record" | Medium | Functional |

---

## [CRPDB-202] Maintain Project Managers as Code Values

**User Story**: As an Administrator, I want to manage PMs via Code Tables, so the PM list is maintained independently of system users.

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-PM-01 | Navigate to Project Manager code table | 1. Navigate to Admin → Code Tables<br>2. Select "Project Manager" from Code Value Set dropdown | Project Manager list displayed with columns: Code Value, Code Name, Order, Status; Active filter default | High | Functional |
| TS-PM-02 | Search PM by name | 1. Select "Project Manager" code set<br>2. Enter partial PM name in search field | Matching PMs displayed; search covers both Code Value and Code Name fields | Medium | Functional |
| TS-PM-03 | Add new PM | 1. Select "Project Manager" code set<br>2. Click Add New<br>3. Enter Code Name (PM full name)<br>4. Optionally enter Code Value and Order<br>5. Submit | New PM appears in code table list and in Project Details PM dropdown | High | Functional |
| TS-PM-04 | Add PM - Code Name required | 1. Select "Project Manager" code set<br>2. Click Add New<br>3. Leave Code Name blank<br>4. Submit | Validation error; at least Code Value or Code Name must be provided | High | Negative |
| TS-PM-05 | Add PM - duplicate prevention | 1. Add PM with same Code Name as existing active PM | Error: uniqueness violation; duplicate PM not created | High | Negative |
| TS-PM-06 | Edit existing PM | 1. Click Edit on existing PM<br>2. Modify Code Name or Order<br>3. Submit | PM updated; changes reflected in Project Details PM dropdown | Medium | Functional |
| TS-PM-07 | Disable PM assigned to projects | 1. Click Disable icon on PM currently assigned to one or more projects<br>2. Confirm "This value will be disabled. Are you sure?" | PM disabled; not available in Project Details Add/Edit PM dropdown; existing project assignments unchanged; PM still searchable on Project Search screen | High | Functional |
| TS-PM-08 | Delete PM (unassigned) | 1. Click Delete (trash) icon on PM not assigned to any project<br>2. Confirm "This value will be deleted. Are you sure?" | PM permanently removed from code table and all dropdown lists | Medium | Functional |
| TS-PM-09 | Cannot delete PM assigned to project | 1. Attempt to delete PM currently assigned to a project | Delete icon not shown; only Disable icon available | High | Negative |
| TS-PM-10 | Re-enable disabled PM | 1. Switch to Inactive filter<br>2. Click Enable icon on disabled PM<br>3. Confirm "This value will be enabled. Are you sure?" | PM re-activated; available again in Project Details PM dropdown | Medium | Functional |
| TS-PM-11 | PM appears in Project Details dropdown | 1. Add or enable a PM in Code Tables<br>2. Navigate to Project Details → Edit<br>3. Open PM dropdown | Newly added/enabled PM appears in the PM selection list | High | Functional |
| TS-PM-12 | Disabled PM not in Project Details dropdown | 1. Disable a PM in Code Tables<br>2. Navigate to Project Details → Edit<br>3. Open PM dropdown | Disabled PM does not appear in PM selection list for new assignments | High | Functional |
| TS-PM-13 | PM still searchable on Project Search after disable | 1. Disable a PM assigned to existing projects<br>2. Navigate to Project Search<br>3. Search by the disabled PM name | Projects previously assigned to disabled PM still appear in search results | Medium | Functional |
| TS-PM-14 | Permission boundary - Code Read only cannot modify PMs | 1. Log in with role having Code Read but NOT Code Write<br>2. Navigate to Code Tables → Project Manager | PM list visible but Add/Edit/Disable/Delete actions not available | High | Security |

---

## [CRPDB-203] Add Ability to Duplicate Rows

**User Story**: As an Application User, I want to duplicate existing table rows to speed up data entry.

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-CLONE-01 | Clone record in Qty/Accomplishment | 1. Navigate to Qty/Accomplishments screen<br>2. Add a Qty/Accomplishment record<br>3. Click Clone Record button<br>4. Modify details<br>5. Save | New record created with copied data; can be modified before save | Medium | Functional |
| TS-CLONE-02 | Clone record in Financial Planning | 1. Navigate to Financial Planning Targets<br>2. Add a financial planning entry<br>3. Click Clone button on the row<br>4. Modify fiscal year/amount<br>5. Submit | New financial planning entry created with copied data from source row | Medium | Functional |
| TS-CLONE-03 | Clone record in Tender Details | 1. Navigate to Tender Details<br>2. Add a tender entry<br>3. Click Clone button on the row<br>4. Modify tender number/values<br>5. Submit | New tender entry created with copied data from source row | Medium | Functional |
| TS-CLONE-04 | Clone type restriction (Qty→Qty only) | 1. Navigate to Qty/Accomplishments<br>2. Add a Quantity record<br>3. Click Clone on the Quantity row | Cloned record pre-selects Quantity category; cannot create an Accomplishment from a Quantity clone | Medium | Edge Case |
| TS-CLONE-05 | Clone requires existing row | 1. Navigate to Financial Planning / Tender / Qty screen with no existing records | Clone button is not available when no rows exist | Low | Edge Case |
