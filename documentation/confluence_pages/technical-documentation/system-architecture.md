---
source: [System Architecture](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302634/System+Architecture)
last_updated: 2026-05-08
---

# System Architecture

**Conceptual Solution Architecture**

The ideal future state of the solution architecture is described below at the conceptual layer. Key elements of the diagram are:

a) Frontend is single-page web application which serves user interface in a browser.

b) REST APIs are protected by OAuth provider Keycloak with a identity provider IDIR. All of these REST APIs are designed to be consumed only by Frontend and service account clients authenticated by Keycloak.

<!-- IMAGE: image2021-3-18_13-27-3.png - Conceptual Solution Architecture Diagram -->

**1) Application Tier:** There are three applications outlined in the diagram, the CRT, TWM and the Reporting & Business Analytics application (PowerBI)

- CRT web application is SPA (Single-Page Application) web application built with React, Redux, JavaScript, Bootstrap, and HTML5. This web application runs on a browser and the main functionality is an interface for ministry staff to enter project data and track projects.
- TWM (Transportation Web Map) is JavaScript client application that interacts with various web APIs such as Data BC router, Geocoder, OGC Service (Open Geospatial Consortium) and GeoServer.
- Reporting & Business Analytics application hasn't been decided but Power BI is being considered. Business Analytics Power BI is a business analytics service provided by Microsoft. It provides interactive visualizations with self-service business intelligence capabilities, where end users can create reports and dashboards by themselves, without having to depend on information technology staff or database administrators. It is comprised of a desktop application that allows end-users or developers to create/view the dashboards and reports and a back-end server for Business Intelligence Analytics, information integration and serving reports. There is currently a Cloud version of Power BI but this project is currently limited to the on-premise version.

**2) Service Tier:** The service tier is comprised of REST APIs and background processing. The service tier is responsible for managing user access and validating and processing uploaded files along with sending feedback regarding the upload results to the maintenance contractors.

- REST APIs will be built with ASP.NET in .NET 5 and Entity Framework Core 5.
- Swagger will be used for API documentation.
- Background processing will be performed by Hangfire.
- For getting IDIR user information, LDAP service will be utilized.
- For some spatial validations and conversions, GeoServer will be referenced.
- Nuget Packages such as Hangfire, AutoMapper (mapping between entity and DTO) and Serilog will be used for building the service tier.
- For unit testing, Microsoft Unit Test framework or XUnit along with Moq are being considered.
- All endpoints are protected with Keycloak backed with IDIR. Access will be granted to IDIR users who are registered to the CRT application.

**3) Business Logic Tier:**

- User access management will use IDIR info of the successfully logged-in user via Keycloak to give a user access to the system.
- User management will use IDIR info via LDAP search to register new user or sync user info with IDIR.
- Spatial validation and conversion will be performed using GeoServer API.
- Geo Server will fetch and transform data and feed to the Spatial API.
- Report Server will fetch and transform data and feed to Report and BI business analytics.

**4) Data Tier:**

- CRT DB - MSSQL will be used for persistence storage.
- Log DB - PostgreSQL will be used for application logging.
