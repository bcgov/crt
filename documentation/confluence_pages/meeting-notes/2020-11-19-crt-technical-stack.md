---
source: [2020-11-19 CRT Technical stack](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302678/2020-11-19+CRT+Technical+stack)
last_updated: 2026-05-08
---

# 2020-11-19 CRT Technical stack

## Date

Nov 19, 2020

## Attendees

Devashish Bhargava, Young-Jin Chung, Rahim Jessa, Jean Bishop, Volker Schunicht, Peter Spry, Deepak Mital, Dom Kapac, James Munro

## Goals

- Introductions
- Brief overview of the project
- Identify the technology stack for the application

## Discussion items

### Project introduction

Project initiated to replace the existing tool, since it will stop functioning after the move to SQL server 2016.

High level features of the tool to be replaced:
- Restricted user access
  - Only allow users that have valid IDIRs and have been approved by the business area
  - Role based restrictions for the application users
- Provide project information:
  - Basic details - project name/number/description/state(active/inactive)region etc.
  - Location details - start and end points, districts/service areas/electoral districts/Highways/Economic Regions
  - Project planning - Project estimates, Financial planning targets
  - Tender Information - dates, bid information, value
- Change log
- Reporting from collected data
  - 10-15 commonly used reports
  - Several ad-hoc reports (no clear#)

Tool data characteristics:
- Current DB size: 22MB
- Current users: 20-30
- Frequency of usage: Common, multiple times per day by multiple people
- Data:
  - All data is manually entered
  - In general there was no personally identifiable data fields
  - The tender section allows for contractor (the business name of the entity)
  - No financial transactions, but the tool does store financial data for planning and projection

### Team Discussion

The following aspects of the new application were considered:
- High availability requirement - not needed since the tool will not be used 24*7.
- Application access - Internal MoTI users only
- Replacement application life - The Phase 1 of the new IPS team will be up and running, tentatively, in 2-3 years (per IPS team) but will have limited spatial capabilities at that point. Given that IPS RFP process has not been completed as of now, this application will be treated not as an interim measure rather as an application with lifespan of 5+ years.
- Application data - Enterprise scale
- Data Conversion - this will need to be re-assessed once more detailed requirements are captured.
- Application technology stack - The infrastructure, dev and spatial teams were in agreement that using the same stack as HMCR will meet the needs of this project.
  - OpenShift
  - SQL server (not high availability)
  - Geoserver integration for spatial requirements
- The above stack is suitable as the current team has the necessary experience to implement and maintain a solution on it, as well as allows us the ability to utilize BI capabilities (if needed).
- Other aspects to consider:
  - Consistent and clear communication with the business area - also include Jean's team as they are often in touch with them.
  - Address user change fatigue: The users had been using spreadsheets, then moved to the current tool and now once again they will need to move a new application - therefore consistency and user experience needs to be consider during design and implementation. This is also another reason to consider this as a long term solution.

## Action items

- [x] Work with Deepak Mital to get the resource list and work on scheduling the Kickoff with the entire team.
