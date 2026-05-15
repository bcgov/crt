# 5. Financial Planning, Quantities & Tender

> **Preconditions for this file**: Tester is logged in as `{{IDIR_VALID_USER}}`. A project (`{{PROJECT_NUMBER_EXISTING}}`) exists with required Project Details already saved so the Planning, Qty/Accmp, and Tender screens are reachable. Currency fields enforce no decimals (Sprint 6 rule, §0.8). See [00-conventions-glossary.md](00-conventions-glossary.md).

## [CRPDB-111] Project Financial Planning - Estimates

**User Story**: As an Application User, I want to provide financial planning data for projects.

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-FIN-01 | Navigate to Planning screen | 1. Select project<br>2. Click "Continue" from Project Details | Planning screen displays; fiscal year filter shows "All" by default | High | Functional |
| TS-FIN-02 | Add financial planning entry | 1. Click "Add"<br>2. Fill: Fiscal Year, Phase, Element, Forecast, Amount, Description<br>3. Submit | Entry created with all fields; mandatory fields validated | High | Functional |
| TS-FIN-03 | Fiscal Year dropdown range | 1. Open Fiscal Year dropdown | Range: 2010/2011 to 2027/2028; increments annually | Medium | Functional |
| TS-FIN-04 | Element field look-ahead | 1. Type in Element field | Shows code and description in list; only code displayed after selection | Medium | Functional |
| TS-FIN-05 | Amount allows negative values | 1. Enter negative $ amount<br>2. Submit | Negative value accepted (no decimals allowed) | Medium | Edge Case |
| TS-FIN-06 | Edit financial planning entry | 1. Click Edit on existing entry<br>2. Modify amount to negative<br>3. Submit | Entry updated; negative value shows in table | Medium | Functional |
| TS-FIN-07 | Delete financial planning entry | 1. Click Delete<br>2. Confirm "Are you sure?" prompt | Record deleted after confirmation; Cancel returns to screen | Medium | Functional |
| TS-FIN-08 | Public Project Information | 1. Click Edit<br>2. Enter Announcement Value, C-035 Value, Notes<br>3. Check hover help | Numeric values with $; notes free text; help descriptions on hover | Medium | Functional |

---

## [CRPDB-112] Project Accomplishment and Quantities

**User Story**: As an Application User, I want to provide quantities and accomplishments data for projects.

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-QTY-01 | Fiscal year filter | 1. Verify "Choose All" default<br>2. Select multiple years<br>3. Select specific year | Filter works; default shows all fiscal years | Medium | Functional |
| TS-QTY-02 | Data table view columns | 1. Review table display | Shows: Fiscal Year, Accomplishments/Quantity, Forecast, Schedule 7, Actual, Comments, Add/Edit/Delete | Medium | Functional |
| TS-QTY-03 | Category filter (Qty/Accmp/All) | 1. Select Accomplishments<br>2. Select Qty<br>3. Select Show All | Filters data appropriately; default is "Show All" | Medium | Functional |
| TS-QTY-04 | Add Accomplishment record | 1. Click Add<br>2. Select Accomplishment<br>3. Fill Forecast, Actual, Comment (precision 3 decimal places)<br>4. Submit | Record created; numeric precision to 3 decimal places | High | Functional |
| TS-QTY-05 | Add Quantity record | 1. Click Add<br>2. Select Quantity<br>3. Fill Forecast, Schedule 7, Actual, Comment<br>4. Submit | Record created; Schedule 7 field available for Quantity only | High | Functional |
| TS-QTY-06 | Switch category clears data | 1. Select Quantity and enter values<br>2. Switch to Accomplishment | Prompt displayed verbatim: `"This action will clear any data entered for the previous selection. Continue?"` | Medium | Edge Case |
| TS-QTY-07 | Cancel with unsaved changes | 1. Enter data<br>2. Cancel<br>3. Select "Go Back" / "Leave" | Prompt displayed verbatim: `"You have unsaved changes"`; Go Back returns to form with data intact; Leave exits and discards data | Medium | Functional |
| TS-QTY-08 | Delete record | 1. Click Delete<br>2. Cancel<br>3. Click Delete again<br>4. Confirm | Prompt displayed verbatim: `"Are you sure?"`; Cancel aborts (record retained); Delete removes record | Medium | Functional |
| TS-QTY-09 | Navigation (Back/Continue/Close) | 1. Click Project Planning<br>2. Click Continue<br>3. Click Close | Back to previous; Next screen; Return to Project home | Medium | Functional |

---

## [CRPDB-113] Project Tender Details

**User Story**: As an Application User, I want to provide tender and announcement data for projects.

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-TEND-01 | Verify tender form fields | 1. Click Add<br>2. Review form fields | Fields: Tender Number (required), Planned Date, Actual Date, Tender Value ($, 2dp), Winning Contractor (dropdown), Winning Bid Value ($, 2dp), Comment (free text) | High | Functional |
| TS-TEND-02 | Add tender record | 1. Complete all fields<br>2. Submit | Record added to table in sequential order | High | Functional |
| TS-TEND-03 | Tender table display and sorting | 1. Review table after adding entries | Sorted by tender number by default; allows sorting by other fields; shows Edit/Delete | Medium | Functional |
| TS-TEND-04 | Hover-over help text | 1. Hover over field labels | Help text appears for each field | Low | Functional |
| TS-TEND-05 | Cancel with unsaved changes | 1. Start filling form<br>2. Cancel<br>3. "Go Back" / "Leave" | Unsaved changes prompt appears; Go Back returns; Leave exits | Medium | Functional |
| TS-TEND-06 | Continue without adding tender | 1. Do not add any tender<br>2. Click Continue | User proceeds to next screen without error | Medium | Edge Case |
