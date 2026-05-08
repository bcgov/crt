---
source: [CRT 1.0.0 Deployment Plan](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302830/CRT+1.0.0+Deployment+Plan)
last_updated: 2026-05-08
---

# CRT 1.0.0 Deployment Plan

## Preparation

Need to complete the following tasks for deployment to production (Tentative):

- Complete [CRT 1.0.0 Transition Plan Checklist](crt-1.0.0-transition-plan-checklist.md)
  - Complete user manual and update/complete related project documentation - May 7, 2021
  - Complete security scan and review results by May 14, 2021
- Follow release steps as best conforming to the release - [Release Steps](https://moti-imb.atlassian.net/wiki/spaces/LA/pages/102996360)
- CAB Approval:
  - Send in CAB request, tentatively May 12, 2021
  - Follow up to get CAB Approval tentatively May 20, 2021
- Set up message and URL to new application on the current SharePoint site - Jun 23, 2021
- Schedule cut over window, tentatively Jun 23, 2021

## Activities

The production migration is scheduled for May 26, 2021. However due to estimates discussions the business area would prefer to go-live late June.

- For Production migration individual tasks and assignees can be seen here: CRPDB-246: Production migration activities (Done)

After migration:

- [x] Smoke test production environment, verify sample of migrated data - May 26, 2021
- [x] Update migration tickets

Go-live activities and assignees are tracked here: CRPDB-263: Go-Live activities (Done)

- [x] Send a message to the broader business area regarding the upcoming transition, week of Jun 29, 2021
- [x] Stop use of legacy system on Jun 29, 2021 - publish message on the SharePoint to stop further data entry
- [x] Provide the migration team with the latest Access DB file Jun 29, 2021 EoD.
- [x] Load data from the latest copy of the access DB provided by the business area Jun 30, 2021
- [x] Smoke test and verify data in PRD Jun 30, 2021
- [x] Send the list of users to be added to the security groups for browsing CRT reports and dashboards.
- [x] Set up system users, Jun 30, 2021
- [ ] Send request to decommission legacy site per [Access DB SharePoint decommissioning](access-db-sharepoint-decommissioning.md), Aug 27, 2021 (tentatively)

*User training to be established by the business group.*

## Production migration

[Production Implementation](../production-implementation/production-implementation.md)
