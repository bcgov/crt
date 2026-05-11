---
source: [5 Reports and Dashboards](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302848/5+Reports+and+Dasboards)
last_updated: 2026-05-08
---

# 5 Reports and Dashboards

The internal users have the ability to export data that has been validated by the application and stored in the database. At a high level the users can export data as one of three reports - Work report, Wildlife report and Rockfall report. Further the reporting feature behaves in the same manner as most searches (for more information see [2 Application Components → Common Actions → Searching](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302842)) the only difference being that instead of a results table the user will get the option to export the results in the format that is most useful to them.

## Report access

The user needs to be added to the appropriate group to access the PowerBI reports. Most users would only need browse access, they would need to be added to `TRAN_AP_PBIRS_CRT_BRWS_ALL` group, please contact [TRANIT](mailto:tranit@gov.bc.ca) with this request.

## Selecting report

Basic report export feature involve the following steps:

1. The user needs to ensure that they are on the government network or connected to VPN.
2. Within the application they would need to select Reports → PowerBI Reports.

<!-- IMAGE: image2022-3-9_14-30-33.png - Reports menu -->

3. They will navigate to https://dwpbi.th.gov.bc.ca/reports/browse/CRT.
4. A user may also directly use the above link to access the report server.
5. Here the user would have the option to select the appropriate report.

<!-- IMAGE: image2022-3-9_14-33-3.png - Report server listing -->

- Most of the developed reports are within the CRT Reports selection.
- Pre-defined views for various sections of the application can be accessed using `CRT_<section>_VW`.
