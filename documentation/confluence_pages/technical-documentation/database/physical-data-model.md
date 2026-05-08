---
source: [Physical Data Model](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302644/Physical+Data+Model)
last_updated: 2026-05-08
---

# Physical Data Model

# Important Note

### Convention

File naming convention - sprint##_scriptVersion##_AppName_theme_otherQualifiers.filetype

e.g. ***S01_01_APP_CRT_ADMIN_AREA_V2_LOV_dml.sql***

- *sprint# - S01*
- *script# - 01 (run order)*
- *AppName - APP_CRT*
- *theme - ADMIN_AREA*
- *scriptVersion - V2*
- *otherQualifiers - LOV_dml*
- *filetype - sql*

### Repo:

- https://github.com/bcgov/crt/tree/0.2/database

# Change Log

## *Sprint 1*

CRT_APP_V1
- uploaded ddl and pdm for sprint 1

Jan 12, 2021
- updated ddl and pdm for sprint 1 fixing bug on Service Area table
- Included history table for Service Area
- uploaded ADMIN AREA lookup table dml script

Jan 14, 2021
- changed the naming convention as per suggestion
- updated the model to include:
  - lookup and lookup history tables
  - region_district and its history table
- cleaned up the access tables, removing redundant attributes, such as role_id from Permission table
- standardized the constraints to IDs (changed primary keys for region/district/Service area from their numbers to IDs)
- updated the admin area dml script to include:
  - region_district list of values
  - idempotence
- provisioned roles and permission codes

Jan 20, 2021
- fixed code for changing headquarters region code from 4 to 0 based on recommendation from scrum meeting
- finalized all sprint 1 codes after testing with the dev team

## *Sprint 2*

Jan 20, 2021
- provided sprint 2 alter script

Jan 21, 2021
- fixed 'Nearst_Twn_LKUP_ID' data from varchar to numeric and map the LKUP_IDs to the CODE_LKUP table as foreign key
- updated the lookup table constraint for the sprint 2 alter script
- uploaded the values for the lookup table

Jan 22, 2021
- reloaded sprint 2 alter script after changing Nearst_Twn_LKUP_ID on Project table to nullable

Jan 28, 2021
- Bugfix for S02_01_APP_CRT_PROJECT_V1_dbAlter.ddl.sql: trigger referencing non-existent sequence

Feb 1, 2021
- fixed bugs: CRT_NOTE_I_S_I_TR, PROJECT_ID_SEQ to CRT_PROJECT_ID_SEQ

## *Sprint 3*

Feb 4, 2021
- Expanded the scope of version 0 to include CRT_TENDER and CRT_QTY_ACCMP

*Additional sprint change logs (Sprint 4-9) are documented on the Confluence page.*

# Model

*The Physical Data Model includes detailed database diagrams for each sprint:*

- Sprint 1 - User Access
- Sprint 2 - Project
- Sprint 3 - Tender/Financials
- Sprint 4 - Tender/Financials
- Sprint 5 - Tender/Financials
- Sprint 6 - Backlogs
- Sprint 7
- Sprint 8
- Sprint 9

<!-- IMAGE FAILED: Multiple draw.io/Dezign database model diagrams embedded per sprint -->

# Data Dictionary

*Data dictionary details are available on the Confluence page.*

# Deployment (Dezign, DDL, DTS & DML)

*Sprint-by-sprint DDL and DML deployment scripts are listed on the Confluence page and available in the GitHub repository.*
