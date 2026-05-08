# Test Plan: Reports & Dashboards

## 1. Introduction
Validates the reporting functionality including access to PowerBI reports, report selection, and export capabilities (5).
**Reference Docs**: [5 Reports and Dashboards](../confluence_pages/user-support/end-user-guide/reports-and-dashboards.md)

## 2. Scope
- **In Scope**: Reports menu navigation, PowerBI report server access, report selection (Work, Wildlife, Rockfall reports), search/filter within reports, export functionality
- **Out of Scope**: PowerBI report content accuracy (owned by BI team), VPN infrastructure, PBIRS server administration

## 3. Test Strategy
- **Test Levels**: E2E (Playwright where possible), Manual (for PowerBI server interaction)
- **Environment**: UAT (requires VPN and PBIRS group membership)
- **Prerequisites**: User must be on government network or VPN; user must be added to `TRAN_AP_PBIRS_CRT_BRWS_ALL` group

## 4. Test Scenarios

### RPT - Reports & Dashboards (5)

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-RPT-01 | Verify Reports menu visible with Export Read permission | 1. Log in as user with Export Read permission<br>2. Check menu | Reports menu item is visible with PowerBI Reports sub-option | High | Functional |
| TS-RPT-02 | Verify Reports menu hidden without Export Read | 1. Log in as user without Export Read permission<br>2. Check menu | Reports menu item is not visible | High | Negative |
| TS-RPT-03 | Verify navigation to PowerBI Reports | 1. Click Reports → PowerBI Reports | User is navigated to the PBIRS report server (dwpbi.th.gov.bc.ca/reports/browse/CRT) | High | Functional |
| TS-RPT-04 | Verify report server listing | 1. Navigate to the report server URL<br>2. View available reports | Report listing shows available reports including CRT Reports folder | High | Functional |
| TS-RPT-05 | Verify CRT Reports folder contents | 1. Navigate into CRT Reports | Developed reports and pre-defined views (`CRT_<section>_VW`) are accessible | Medium | Functional |
| TS-RPT-06 | Verify report access without VPN | 1. Disconnect from government network and VPN<br>2. Attempt to access report server URL | Access fails; connection error or timeout | Medium | Negative |
| TS-RPT-07 | Verify report access without PBIRS group membership | 1. Log in as user NOT in `TRAN_AP_PBIRS_CRT_BRWS_ALL` group<br>2. Navigate to report server | Access denied; appropriate error message | Medium | Negative |
| TS-RPT-08 | Verify Work report loads | 1. Select Work report from report listing | Report opens and displays data | High | Functional |
| TS-RPT-09 | Verify Wildlife report loads | 1. Select Wildlife report from report listing | Report opens and displays data | High | Functional |
| TS-RPT-10 | Verify Rockfall report loads | 1. Select Rockfall report from report listing | Report opens and displays data | High | Functional |
| TS-RPT-11 | Verify report search/filter parameters | 1. Open a report<br>2. Apply search/filter criteria (similar to project search) | Report data is filtered according to criteria | Medium | Functional |
| TS-RPT-12 | Verify report export functionality | 1. Open a report with data<br>2. Use export option to download in desired format | Report is exported and downloaded successfully | High | Functional |
| TS-RPT-13 | Verify direct URL access to report server | 1. Navigate directly to https://dwpbi.th.gov.bc.ca/reports/browse/CRT | Report server listing is accessible (same as in-app navigation) | Low | Functional |
| TS-RPT-14 | Verify pre-defined view access | 1. Navigate to a `CRT_<section>_VW` view | View loads with corresponding section data | Medium | Functional |

## 5. Risks and Mitigation
- **Risk**: PowerBI report server is an external dependency outside the CRT application boundary.
  - **Mitigation**: Limit testing to navigation and access verification; defer report content validation to BI team.
- **Risk**: VPN and group membership prerequisites limit automated test execution.
  - **Mitigation**: Ensure test environment has persistent VPN access; document manual steps for group membership verification.
- **Risk**: Report export formats are not specified in the user guide.
  - **Mitigation**: Discover available formats during testing; test at least PDF and Excel if available.
- **Risk**: User guide description of "search" within reports is vague; behavior may differ from project search.
  - **Mitigation**: Explore report parameter capabilities during test execution; document actual behavior.
