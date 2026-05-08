---
source: [CRT ETL field map](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302790/CRT+ETL+field+map)
last_updated: 2026-05-08
---

# CRT ETL field map

## Background

The business area use an Access database to track Rehab projects. This database has approximately 4 years worth of project tracking data, which needs to be migrated to the new solution so it is available to the users from a single source.

- Legacy = MS Access DB of the SharePoint solution being replaced
- Target = SQL server DB of the new CRT solution

## Mapping table

### Project

| Target table | Target field | Legacy table | Legacy field | Comment |
|---|---|---|---|---|
| CRT_PROJECT | PROJECT_ID | | | generated sequential unique numbers |
| CRT_PROJECT | LEGACY_PROJECT_ID | tblProjects | ID | |
| CRT_PROJECT | PROJECT_NUMBER | tblProjects | Project Number | There are project with no project number of TBD as project number, assign TBD<sequencenumber 5digits) as temporary project number for migration |
| CRT_PROJECT | PROJECT_NAME | tblProjects | Project Name | |
| CRT_PROJECT | DESCRIPTION | tblProjects | Key Accomplishments | |
| CRT_PROJECT | SCOPE | tblProjects | Project Description | |
| CRT_PROJECT | REGION_ID | tblProjects | MOTI Region | |
| CRT_PROJECT | CAP_INDX_LKUP_ID | tblProjects | Capital Index | |
| CRT_PROJECT | NEARST_TWN_LKUP_ID | tblProjects | Nearest Town | |
| CRT_PROJECT | RC_LKUP_ID | tblProjects | DefaultRC | |
| CRT_PROJECT | PROJECT_MGR_ID | tblProjects | Project Manager | |
| CRT_PROJECT | ANNCMENT_VALUE | No values mapped | No values mapped | All announced values from legacy will be mapped to the new ESTIMATED_VALUE field in the CRT database |
| CRT_PROJECT | C035_VALUE | tblProjects | C-035 Value | Multiply the value by 1000 before saving |
| CRT_PROJECT | ESTIMATED_VALUE | tblProjects | Announced Value | Multiply the value by 1000 before saving |
| CRT_PROJECT | ANNCMENT_COMMENT | tblProjects | Announcment Notes | |
| CRT_PROJECT | END_DATE | tblProjects | _SharePointModifiedDate | For inactive projects use _SharePointModifiedDate, NULL for active projects |

### Financial Planning

| Target table | Target field | Legacy table | Legacy field | Comment |
|---|---|---|---|---|
| CRT_FIN_TARGET | FIN_TARGET_ID | | | generated sequential unique numbers |
| CRT_FIN_TARGET | PROJECT_ID | CRT_PROJECT | PROJECT_ID | |
| CRT_FIN_TARGET | DESCRIPTION | tblFinancialForecast | Description | |
| CRT_FIN_TARGET | AMOUNT | tblFinancialForecast | Amount | Multiply the value by 1000 before saving |
| CRT_FIN_TARGET | FISCAL_YEAR_LKUP_ID | tblFinancialForecast | Fiscal Year | |
| CRT_FIN_TARGET | ELEMENT_ID | tblFinancialForecast | Element | |
| CRT_FIN_TARGET | PHASE_LKUP_ID | tblFinancialForecast | Forecast Phase | Map project phase D-Design to E-Engineer |
| CRT_FIN_TARGET | FUNDING_TYPE_LKUP_ID | tblFinancialForecast | Forecast Type | |
| CRT_FIN_TARGET | END_DATE | | | |

### Notes

#### Importing Status comments

| Target table | Target field | Legacy table | Legacy field | Comment |
|---|---|---|---|---|
| CRT_NOTE | NOTE_ID | | | generated sequential unique numbers |
| CRT_NOTE | NOTE_TYPE | | | "STATUS" |
| CRT_NOTE | COMMENT | tblProjects | Status Comments | |
| CRT_NOTE | PROJECT_ID | CRT_PROJECT | PROJECT_ID | |

#### Importing EMR comments

| Target table | Target field | Legacy table | Legacy field | Comment |
|---|---|---|---|---|
| CRT_NOTE | NOTE_ID | | | generated sequential unique numbers |
| CRT_NOTE | NOTE_TYPE | | | "EMR" |
| CRT_NOTE | COMMENT | tblProjects | EMR Comments | |
| CRT_NOTE | PROJECT_ID | CRT_PROJECT | PROJECT_ID | |

### Quantity and Accomplishment

| Target table | Target field | Legacy table | Legacy field | Comment |
|---|---|---|---|---|
| CRT_QTY_ACCMP | QTY_ACCMP_ID | tblProjectAccomplishments | ID | generated sequential unique numbers |
| CRT_QTY_ACCMP | PROJECT_ID | CRT_PROJECT | PROJECT_ID | from project table map of tblProjects.ID and CRT_PROJECT.PROJECT_ID |
| CRT_QTY_ACCMP | FISCAL_YEAR_LKUP_ID | tblProjectAccomplishments | Fiscal Year | |
| CRT_QTY_ACCMP | QTY_ACCMP_LKUP_ID | tblProjectAccomplishments | Accomplishment | |
| CRT_QTY_ACCMP | FORECAST | tblProjectAccomplishments | Forecast Quantity | |
| CRT_QTY_ACCMP | SCHEDULE7 | tblProjectAccomplishments | Schedule7 | |
| CRT_QTY_ACCMP | ACTUAL | tblProjectAccomplishments | Actual Quantity | |
| CRT_QTY_ACCMP | COMMENT | tblProjectAccomplishments | Comments | |

### Tender

| Target table | Target field | Legacy table | Legacy field | Comment |
|---|---|---|---|---|
| CRT_TENDER | TENDER_ID | | | generated sequential unique numbers |
| CRT_TENDER | PROJECT_ID | CRT_PROJECT | PROJECT_ID | |
| CRT_TENDER | TENDER_NUMBER | | | Assign temporary number - \<projectnumber\>-TEMP\<sequencenumber\> |
| CRT_TENDER | PLANNED_DATE | tblProjects | Forecast Tender Date | |
| CRT_TENDER | ACTUAL_DATE | tblProjects | Actual Tender Date | |
| CRT_TENDER | TENDER_VALUE | tblProjects | Tender Estimate | Multiply the value by 1000 before saving |
| CRT_TENDER | WINNING_CNTRCTR_LKUP_ID | tblProjectTenderBids | Contractor | (only import data for Winning Bid = Yes) use tblProjectTenderBids.ProjectId to connect with information from tblProjects. In the event multiple tender bids for Winning Bid=Yes are found for a project, use the most recent line item, the one with the highest ID among them (Access DB does not store create_date for this table) |
| CRT_TENDER | BID_VALUE | tblProjectTenderBids | Bid Value | DO NOT MULTIPLY THIS VALUE by 1000, the legacy does not store this as multiples of $1000 |
| CRT_TENDER | COMMENT | tblProjectTenderBids | Comment | For every row imported regardless of whether it has a comment or not always start with- "Temp tendernumber assigned. \<Comment from access DB\>" |

### Ratios

#### Importing District Ratios

| Target table | Target field | Legacy table | Legacy field | Comment |
|---|---|---|---|---|
| CRT_RATIO | RATIO_ID | | | generated sequential unique numbers |
| CRT_RATIO | PROJECT_ID | CRT_PROJECT | PROJECT_ID | |
| CRT_RATIO | RATIO | tblDistrictRatios | Ratio | |
| CRT_RATIO | RATIO_OBJECT_LKUP_ID | | | |
| CRT_RATIO | RATIO_OBJECT_TYPE_LKUP_ID | | | |
| CRT_RATIO | SERVICE_AREA_ID | | | |
| CRT_RATIO | DISTRICT_ID | tblDistrictRatios | District | |

#### Importing Service Area Ratios

| Target table | Target field | Legacy table | Legacy field | Comment |
|---|---|---|---|---|
| CRT_RATIO | RATIO_ID | | | generated sequential unique numbers |
| CRT_RATIO | PROJECT_ID | CRT_PROJECT | PROJECT_ID | |
| CRT_RATIO | RATIO | tblServiceAreaRatios | Ratio | |
| CRT_RATIO | RATIO_OBJECT_LKUP_ID | | | |
| CRT_RATIO | RATIO_OBJECT_TYPE_LKUP_ID | | | |

### Segments

*Additional segment mapping data available on the Confluence page.*
