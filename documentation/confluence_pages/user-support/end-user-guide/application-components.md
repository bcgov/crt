---
source: [2 Application components](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302842/2+Application+components)
last_updated: 2026-05-08
---

# 2 Application components

## Overview

CaRT application provides a simple secure platform for the MoTI staff to upload their monthly reports on various activities. Based on their access, a user may be able to:

- View/Add/Update Projects and project details
- View/Add/Update Users
- View/Add/Update Roles and Permissions
- View/Add/Update Code and element values
- Report on export collected data in various formats

From the point of view of data flow the applications has following aspects:

- **Project data entry** - Various screens that enable users to add and update information about projects and related components - such as financial targets, accomplishments, tender etc.
- **Administrative tools** - Various screens that are needed to enable configurations that support access and data entry
- **Reporting** - Retrieve the data from the database and publish it in form of dashboards and/or reports.

To keep the production environment stable and maintain the integrity of its data, various application environments have been set up based on intended activity and user base:

| Environment | Purpose | Primary User(s) | Menu color |
|-------------|---------|-----------------|------------|
| Development (DEV) | Build new features. Fix bugs. | Developers | Green |
| Test (TST) | Functional testing of new features and/or bug fixes. Reproduce reported issues. | Business Analyst | Yellow |
| User Acceptance Testing (UAT) | Business validation testing of new features and/or bug fixes. Reproduce reported issues. Training | End users, Business Analyst | Purple |
| Production (PRD) | Primary application environment where all activity will occur | End users | Blue |

As seen above each environment can be easily spotted via the color of its menu, below the logo and application name. Therefore it is important to keep in mind that:

- If the user is performing actual maintenance reporting related activity (as part of their day to day work) the menu color **should be** blue.
- If a user intends to use the application for training/testing the menu color **should not** be blue.

## Common Actions

### Application Access

The request for application access should be raised with the application administrators within the business area. The administrator will know/need to know the following information:

- User Name
- Which Ministry region they need access to?
- What does the user need to do? - This will allow the administrator to associate the appropriate role to the user
- See [4.1 Managing Application Users](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302846) on how to create and maintain user properties.

The user can then access the application using the following url - https://crt.th.gov.bc.ca/ and using their IDIR credentials.

<!-- IMAGE: image2021-4-28_14-1-46.png - Login screen -->

### Navigation

#### Menu

- The sections of the application that a user has access to will be available to them on the menu.

<!-- IMAGE: image2021-4-28_14-4-47.png - Application menu -->

- The user should be able to see their login user name on the right corner of the menu, along with the logout option.
- The menu selections under Admin, will vary from user to user based on their role within the application.

<!-- IMAGE: image2021-4-28_14-6-55.png - Admin menu -->

#### Links

- The links within the application's project search screen will enable users to navigate to associated data entry sections of the application.
- Some data entry fields allow users to enter url (web-links) as input, when entered correctly, users can click on these to navigate to the corresponding webpage.

#### Project Information

- Users can access various sections of a project by clicking on the links under the appropriate column on the search screen.

<!-- IMAGE: image2021-4-29_14-39-34.png - Project search links -->

- Once a user is within one of the data entry sections of the project, they can navigate to any other section for that project by using the navigation buttons on the top right part of the screen. The current data entry page will be highlighted **blue**.

<!-- IMAGE: image2021-4-29_14-49-8.png - In-project navigation buttons -->

- Below is the summary of the navigation options for data entry and the corresponding project sections they lead to.

| Search screen column/In-project navigation | Corresponding data entry sections |
|-------------------------------------------|----------------------------------|
| / | Project details, Status comments, EMR comments |
| / | Financial planning targets, Public project information |
| / | Tender details, Quantity/Accomplishments |
| / | Project segments, Project ratios |

### Add/Edit information

**Searching**

Prerequisite: A user would need to have at least "Read" access to a given section of the application to be able to perform a search on that screen.

The search parameters at the top of the screen allow the user to provide a search criteria(s). For example - below the user is searching for all Projects that are *active, in MoTI region 1, and have a reference to pavement in project name, description or scope*.

## Known Issues

(See page for current known issues)
