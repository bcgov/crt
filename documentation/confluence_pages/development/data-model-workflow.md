---
source: [Data Model Workflow](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102309767/Data+Model+Workflow)
last_updated: 2026-05-08
---

# Data Model Workflow

The following are data model development and maintenance process for data architects delivering data model changes to the development team.

## Design Workflow

- Develop within a single model using Dezign
- Create PDM and LDM ERDs
- LDM - hide detailed fields and history tables

## LDM Changes

Within the Dezign modeling tool, the LDM is managed as a subset diagram from the PDM. Certain entities and attributes are hidden in this ERD. As the PDM is managed, the LDM will reflect attribute changes.

## PDM Changes

1. Referencing assigned tickets and team discussion, make changes to the PDM within Dezign
2. Compare the changes to your local development RDBMS environment and generate alter scripts
   - Script naming convention: `<execution sequence>_HMR_PDM-<dml or ddl>-<unique description>-v<model version><sprint release>`
   - e.g.: `1_HMR_PDM-ddl-HWY_NAME-v18_IS8.sql`
3. Modify the generated scripts as necessary:
   - MOD1 - Renamed fields are often not handled during load to _TMP table. Requires manual script changes to map old field to new field
   - MOD2 - History and Instead of Triggers require manual management within Dezign (could also generate via script)
   - MOD3 - any DDL that results in use of temp table (xyz_TMP) loses field descriptions. It only preserves the table description. If adding a new field, this description is implemented. (requires the manual addition of extended properties to script, careful to not add twice.)
4. Execute ddl/dml within local environment
5. Run unit tests
   - Triggers are firing, hist tables are being loaded
6. Send confirmed ddl/dml to lead developer
7. Update Confluence with ERD, Data Dictionary and change history

## Dezign Export Settings

Ensure only the following Comparison options are checked:

- **Ignored Table elements:**
  - Ignore collation settings
  - Ignore character settings
  - Ignore default constraint names
- **Other options:**
  - Convert domains to normal data types
