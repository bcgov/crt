---
source: [4.1 Managing Application Users](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302846/4.1+Managing+Application+Users)
last_updated: 2026-05-08
---

# 4.1 Managing Application Users

## Getting to user management

To be able to create and/or edit users one must have certain degree of administrator role, which in this case would mean they should have a role with following permissions:

- **User Read** - Gives user the access to the *Users* screen
- **User Write** - Enables *Add User, Edit User* and *Disable User* actions on the screen
- **Role Read** - Enables the ability to grant roles to a user within the application

To learn about navigation to menu see [Application components → Menu](https://moti-imb.atlassian.net/wiki/display/CRPDB/2+Application+components#id-2Applicationcomponents-Menu).

## Adding new user

An administrator needs to follow these steps to add a new user to the application:

1. Navigate to Admin → Users

<!-- IMAGE: image2021-4-28_15-35-3.png - Admin > Users menu -->

2. Before adding a new user, it is a good practice to ensure that the requested user does not already exist. To do so simply search for the IDIR in both active and inactive users.

<!-- IMAGE: image2021-4-28_15-51-21.png - Search for existing user -->

3. If the user exists, edit their properties to enable them (for more details - see [Enable an inactive user](#enable-an-inactive-user)).
4. If the user does not exist click on *Add User* to add them.
5. Provide the corresponding user's *IDIR*, then click *Next*.

<!-- IMAGE: image2021-4-28_15-37-28.png - Enter IDIR -->

6. If the IDIR is valid the administrator should see associated details for the IDIR.

<!-- IMAGE: image2021-4-28_15-38-32.png - IDIR details -->

7. After verifying user details the Administrator may continue to determine the access of the user within the application.
8. Grant user role(s) - Roles determine the screens a user can access, and the corresponding actions they can perform (for more information see [4.4 Managing user roles](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302888)).

<!-- IMAGE: image2021-4-28_15-56-21.png - Grant roles -->

9. Assign MoTI Regions - selecting service areas allows a user to limit the project results to the assigned regions by default, a user maybe assigned one or more regions.

<!-- IMAGE: image2021-4-28_15-59-13.png - Assign regions -->

Once user's credentials have been verified and access established, the administrator can submit these results and a new user will be created.

## Edit existing user

- An administrator can, directly, only edit the following details for a user:
  - **User Role** - determines screens and actions for user
  - **Service Areas** - determines service areas that user can upload files and/or produce report exports for
  - **End Date** - extent for which the user is enabled within the application:
    - The user is active perpetually if no end date is provided
    - If an end date is provided, the user will not be able to access the application as of the provided date.
- Every user granted access to the application will have an edit icon at the right end of the row. The administrator can see/update the following user properties:

<!-- IMAGE: image2021-4-28_16-3-56.png - Edit user form -->

### Editing user's information

- Any information specific to the user, such as name, email etc. would need to be changed with the respective id service (IDIR).

## Disable a user's access

Once it has been determined that a user no longer needs access to the application. The access can be disabled in one of two ways.

1. The first would be to use the *Disable Record* action on the *Users* screen, provide an End Date. The user access will be disabled as of the provided date.

<!-- IMAGE: image2021-4-28_16-5-37.png - Disable record action -->

2. The second would be to use *Edit Record* action and provide *End Date* for the user over there.

<!-- IMAGE: image2021-4-28_16-7-58.png - Edit record with end date -->

## Enable an Inactive user

The access of an inactive user can be restored in one of two ways.

1. The first would be to use the *Disable Record* action on the *Users* screen, notice that the disable record is greyed out for an inactive user. Remove the *End Date*, or provide a future *End Date*, and click update. The user's access will be restored immediately.
2. The second would be to use *Edit Record* action and either remove the *End Date* or provide a future *End Date* for the user.

<!-- IMAGE: image2021-4-28_16-17-16.png - Enable inactive user -->
