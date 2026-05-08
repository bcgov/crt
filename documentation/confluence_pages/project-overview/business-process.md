---
source: [Business Process](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302622/Business+Process)
last_updated: 2026-05-08
---

# Business Process

The CaRT/CRT system comes into play for planning and tracking purposes, it is primarily a recording tool. This section only describes the business process as it relates to the data management process as it pertains to the legacy and CRT systems for the program(s).

## Overview

Any project in the CaRT/CRT application would go through:

- Initial Planning and project intake
- Recording actual accomplishment
- Managing project budget
- Reporting

## Current and Future state

Overall the introduction of CRT will not make affect any business processes directly, the change will be to the tools used for data entry and reporting.

| STATE / PHASE | Initial Planning and intake | Recording accomplishments | Managing project budget | Reporting |
|---------------|---------------------------|--------------------------|------------------------|-----------|
| **Current state** | - The projects could be planned out 3-4 years in advance, therefore they are often entered in the Access DB before the official intake is done.<br>- The official project intake happens through the Project Initiation document (PID) aka form H0277.<br>- At the planning stage the following aspects are taken into consideration: Project/Program Objective(s), Financial requirements, Planned quantity(ies) / accomplishment(s), Project location (spatial information) | - Once the project is approved and underway the actual accomplishments and quantities are tracked in access DB | - The project managers maintain monthly financial forecasts in CPS.<br>- These CPS forecasts can be compared against actuals from CAS-ORCA for managing budget.<br>- The access DB does not track actual financial information, it is only used to plan budget allocation in accordance to PIP.<br>- The financial plan in Access DB can be rolled up using elements which are further associated to category, program, service line, rehab category. However these associations are not strictly enforced in access DB | - Currently the access DB in combination with extracts from CPS, CAS-ORCA and PIP are used to produce a Master Database Report (MDR) spreadsheet, which is used by the regions and HQ for their needs as well as reporting up to the executives.<br>- These reports roll up financial and accomplishment information by various ratios (Districts, Service area etc.), as well as various elements and their associations (Program category, program and service line).<br>- The business area also needs to be able to address ad-hoc requests beyond those that can be met through MDR |
| **Future state** | - There is no change to the planning and intake process by introduction of the CRT system, the only difference will be that information will be added in the CRT system.<br>- However, in CRT Project number/Name/RC are mandatory fields, therefore until the project is approved they would need to be assigned temporary values, which can be updated once official values are obtained | - Once the project is approved and underway the actual accomplishments and quantities are tracked in the CRT system. | - The introduction of CRT does not change the budget allocation and management process.<br>- However, it does enforce a clear association between element and program category, program, and service line | - The business area will be able to use the data from CRT and other extracts to create reports similar to MDR, but these will be developed using power BI and offered through report server. |

## Data accumulated through CaRT/CRT

The fields gathered through the CRT system pertain to the following aspect of a project:

- Project definition - describing the project, its objectives, and associated properties - such as Region, Responsibility center etc.
- Financial Planning - associates various projects phases to their financial planning values, and other financial reporting fields - such as program category, service lines etc.
- Public project information - capture
- Quantity and Accomplishments - records planned and actual values for work accomplished - such as Bridges rehabilitated, as well as tracks material used - such as tonnes of Asphalt.
- Tender - Record tender(s) released along with winning bid(s) in order to accomplish the project's objective(s)
- Project location - record spatial location of the project, along with proportion of the project within various boundaries - such as Districts, Service areas etc.

For details regarding individual fields please see - [Input Field properties](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302682).
