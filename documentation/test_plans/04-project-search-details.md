# 4. Project Management – Search & Details

> **Preconditions for this file**: Tester is logged in as `{{IDIR_VALID_USER}}` (`MANAGER`, region `{{REGION_DEFAULT}}`) unless a row specifies a different persona. At least one existing project per region is seeded. See [00-conventions-glossary.md](00-conventions-glossary.md).

## [CRPDB-105] Project Home Screen - Search, Add Projects and Status

**User Story**: As an Application User, I want to search/navigate projects and add new ones, so I can track project information.

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-PROJ-01 | Region filter shows only user's regions | 1. Log in as App User<br>2. Check region dropdown | Only regions associated with user are shown | High | Functional |
| TS-PROJ-02 | Multi-region selection | 1. Select multiple regions from picklist | Multiple regions can be selected | Medium | Functional |
| TS-PROJ-03 | Keyword partial search | 1. Enter partial text in keyword field<br>2. Search across Project Number, Name, Description, Scope | Projects found by partial match in all four fields | High | Functional |
| TS-PROJ-04 | Keyword search help text | 1. Hover over keyword field help icon | Help text: "Look for this keyword in Project Number, Project Name, Project Description and Project Scope." | Low | Functional |
| TS-PROJ-05 | PM multi-select with look-ahead | 1. Open PM dropdown<br>2. Select multiple PMs | Dropdown allows multiple selection with type-ahead filtering | Medium | Functional |
| TS-PROJ-06 | PM dropdown shows region-specific PMs | 1. Change user region permissions<br>2. Check PM dropdown | Only PMs associated with user's region displayed | Medium | Functional |
| TS-PROJ-07 | PM defaults to logged-in user if PM | 1. Log in as PM<br>2. Check PM field default | PM field defaults to logged-in user's name | Medium | Functional |
| TS-PROJ-08 | PM field for non-PM users | 1. Log in as non-PM user | PM field shows "Project Manager" placeholder | Low | Functional |
| TS-PROJ-09 | Status filter with defaults | 1. Check Status dropdown options<br>2. Verify default | Options: Active/Closed (formerly In-progress/Completed); Active is default | Medium | Functional |
| TS-PROJ-10 | Status multi-select | 1. Select both Active and Closed | Both can be selected simultaneously | Low | Functional |

---

## [CRPDB-106] Project Details Screen - Create, Add, Modify and View

**User Story**: As an Application User, I want to provide project information, so that projects are properly defined.

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-DETAIL-01 | Project Number - temporary assignment | 1. Create project without Project Number<br>2. Click Save | Prompt: "Project number was not provided…"; Yes assigns "Temp-<region>-<ID>"; No cancels save | High | Functional |
| TS-DETAIL-02 | Project Name required | 1. Leave Project Name blank<br>2. Save | Inline validation error appears next to Project Name; form is not submitted | High | Negative |
| TS-DETAIL-03 | Project Description with help text | 1. Enter text in Description<br>2. Hover over "?" icon | Text field accepts input; help text displays on hover | Low | Functional |
| TS-DETAIL-04 | Project Scope with help text | 1. Enter text in Scope<br>2. Hover over "?" icon | Text field accepts input; help text displays | Low | Functional |
| TS-DETAIL-05 | Capital Index dropdown | 1. Select value from Capital Index dropdown<br>2. Verify required<br>3. Check help text | Single select; required on save; help text on hover | Medium | Functional |
| TS-DETAIL-06 | Project End Date and status | 1. Set end date in future → check status<br>2. Set end date in past → check status<br>3. Set end date to today | Prior to end date: "Active"; After/on end date: "Closed" | High | Functional |
| TS-DETAIL-07 | MoTI Region selection | 1. Select region from dropdown | Single select; required on save | Medium | Functional |
| TS-DETAIL-08 | PM dropdown dependent on region | 1. Select region → check PM dropdown<br>2. Clear region → check PM dropdown | PM dropdown enabled after region selection; disabled when no region; filtered by region | Medium | Functional |
| TS-DETAIL-09 | Nearest Town look-ahead | 1. Type in Nearest Town field<br>2. Select from suggestions | Type-ahead from list of towns; single selection | Medium | Functional |
| TS-DETAIL-10 | Status Comments | 1. Click "+" to add comment<br>2. Enter up to 2000 chars<br>3. Submit<br>4. View older comments | Date/user recorded; 2000 char limit; older comments accessible with user/date | Medium | Functional |
| TS-DETAIL-11 | EMR Comments | 1. Click "+" to add EMR comment<br>2. Enter up to 2000 chars<br>3. Submit<br>4. View older comments | Same behavior as Status Comments | Medium | Functional |
| TS-DETAIL-12 | Save and Continue navigation | 1. Enter project details<br>2. Click "Save and Continue" | Details saved; navigates to next screen | High | Functional |
| TS-DETAIL-13 | Save and Close navigation | 1. Enter project details<br>2. Click "Save and Close" | Details saved; returns to Project search screen | High | Functional |
| TS-DETAIL-14 | Close with unsaved changes | 1. Make changes on Project Details<br>2. Click Close<br>3. On the `"You have unsaved changes"` prompt, choose Leave or Go Back | Leave → navigates to Project Search and discards changes; Go Back → stays on Project Details with changes intact | Medium | Edge Case |
