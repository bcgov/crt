---
source: [Project details and status](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302684/Project+details+and+status)
last_updated: 2026-05-08
---

# Project details and status

This page documents the input field properties for Project Details and Status screens, including database column mappings.

## Field properties

### Project Details

| Screen field | DB Column | Type | Mandatory | Additional field properties | Definition | Example |
|-------------|-----------|------|-----------|---------------------------|------------|---------|
| Project Number | PROJECT_NUMBER | String (50) | Y | Unique to each project within the region | Manually assigned by financial ee's using an H0277 form | Test-1234 |
| Project Name | PROJECT_NAME | String (255) | Y | | Typically created by project manager using project naming conventions | Test Highway Side Rd Improvements |
| Project Description (Public) | DESCRIPTION | String (2000) | | Free text field | Non-technical description of the project; meant for public consumption | Minor improvements to bridges or major culverts throughout the Fort George District. |
| Project Scope | SCOPE | String (2000) | | Free text field | Technical description, meant for internal consumption | Culvert replacement, brushing and various works... |
| Capital Index | CAP_INDX_LKUP_ID | Number | Y | List of values: static list | Whether expenditures are capitalizable or expensable | 10 - Capitalizable-All components>40yrs |
| Project Closed | END_DATE | Date | | | Helps with filtering and identifying in progress and completed projects | Checkbox on UI, populates end date |
| MoTI Region | REGION_ID | Number | Y | List of values | | HQ-Headquarter |
| RC Number | RC_LKUP_ID | Number | | List of values | Responsibility Center | |

### Notes

(See source page for complete notes field details)

## Lists

### MoTI Location Hierarchy

Region → Service Area → District hierarchy used for project location assignment.

### Capital Index (CODE_LOOKUP - CODE_SET = 'CAP_INDX')

Static list of capital index values for project categorization.

### RC Number (CODE_LOOKUP - CODE_SET = 'RC')

Responsibility Center number lookup values.

### Town Names (CODE_LOOKUP - CODE_SET = 'NEARST_TWN')

Nearest town name lookup values for project location.

> **Note:** This is a large reference page with detailed field-level specifications. See the [source page](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302684/Project+details+and+status) for complete field details, validation rules, and list values.
