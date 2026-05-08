---
source: [CRT 1.0.0 Transition plan checklist](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302836/CRT+1.0.0+Transition+plan+checklist)
last_updated: 2026-05-08
---

# CRT 1.0.0 Transition plan checklist

- [x] Create a line item in the LOB application list - complete all columns
  - [x] additional key contacts:
    - [x] users within the business unit
    - [x] IMB staff who were involved in the project
    - [x] developer name & contact info & rate
    - [x] vendor name & contact info & rate - available through CBC
- [x] Provide training to the:
  - [x] Ops BA team
  - [x] Client Services team
  - [x] Business Unit(s)
- [x] Provide the following documentation:
  - [x] user documentation
  - [x] administrator documentation
    - [x] setting up users, access, control
    - [x] understanding what kind of access to grant to different types of users
  - [x] business requirements documentation
    - [x] high-level diagram of use cases
    - [x] completed zephyr test cases
  - [x] technical documentation
    - [x] data flow diagram especially showing integration points with other applications and data sources
    - [x] e-commerce documentation where applicable (e.g. Beanstream accounts etc) - Not Applicable
    - [x] platforms used by the app, including required versions and libraries (e.g., .NET version, CCW version, etc.)
    - [ ] entity-relationship diagram
    - [x] TNSnames.ora entry if applicable - Not Applicable
- [x] JIRA
  - [x] JIRA component set up in the TH project to handle tickets
  - [x] JIRA Project set up, with admin access to Ops BA team
- [x] Items in parking lot that are to be implemented have been identified within JIRA so that the Ops BA team is aware of remaining functionality to be implemented
- [ ] Any applications that are being retired by the introduction of the new app have a corresponding decommissioning plan created and completed
  - [ ] reminder: ensure that any reporting done by the retiring app have been replaced with corresponding reports in the new app
- [x] TST and UAT environment is set-up that:
  - [x] matches PROD
  - [x] has an automated way to sync-up with PROD - Not Applicable; there is no need for data sync between PRD and non-PRD environments, all environments are set up identically
  - [x] (ask tech team if they would like the same for the DEV environment) - Not Applicable
