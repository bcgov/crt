---
source: [4.4 Managing user roles](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302888/4.4+Managing+user+roles)
last_updated: 2026-05-08
---

# 4.4 Managing user roles

## Getting to user roles

To maintain these values one must have a role with at least the following permissions:

- **Role Read** - Gives user the access to the *roles screen*
- **Role Write** - Enables *Add, Edit* and *Disable/Delete* actions for roles.

To learn about navigation to menu see [Application components → Menu](https://moti-imb.atlassian.net/wiki/display/CRPDB/2+Application+components#id-2Applicationcomponents-Menu).

### Important note for user roles

To create or update a role the administrator would need to maintain its description and corresponding permissions. Please keep in mind of the following while creating/updating roles:

- The Order Number will allow the administrator to place the roles at the most convenient spot on the list. By default a new value would show up at the bottom of the list.
- Before adding a new role, check whether an existing role could suffice. There should not be a duplication of roles, i.e. a new role with exact same set of permissions as one that already exists should not be created.
- The System Administrator role should **NEVER** be disabled, **NOR** have permissions taken away from it.

## Adding a role

An administrator needs to follow these steps to add a new role in the application:

1. Search for the role being created to ensure that it does not already exist (expand the search to include both active and inactive roles), if the role exists it is preferable to keep using the one that already exists.
2. Click *Add Role* button.

<!-- IMAGE: image2021-5-20_8-5-16.png - Role search and add -->

3. Provide role name and description in the form to add the role.

<!-- IMAGE: image2021-5-20_8-8-12.png - Add role form -->

4. Provide permissions associated with the role, these will determine the level of access any user with a given role could have.

<!-- IMAGE: Permissions selection -->

### Permissions Reference

| Permission | Access granted |
|-----------|---------------|
| Code Table Read | View code table values only |
| Code Table Write | Add/Update code table values |
| Export Read | Navigate to reports |
| Project Read | View project information only |
| Project Write | Add/Update project information |
| Role Read | View user roles only |
| Role Write | Add/Update user roles |
| User Read | View user information only |
| User Write | Add/Update user information (needs Role read as well to create user/update their roles) |
| API Access Client | Grants the user ability to create an API client to interact with the application |

## Update role

- To edit a role click on the edit button at the end of the row of the corresponding role.

<!-- IMAGE: image2021-5-20_8-41-46.png - Edit role button -->

- Update the values in the form and save (Submit) the changes.

<!-- IMAGE: image2021-5-20_8-42-16.png - Edit role form -->

## Disable a role

Making a role inactive simply means that it can not be assigned to a user anymore, as well as *any users with the disabled role will lose their application access*. Such roles can still be reactivated if the need arises. Only roles that have been used for data entry can be disabled.

### From the search screen

- Click on the disable button at the end of the row of the corresponding role.

<!-- IMAGE: Disable role button -->

- Provide an end date and confirm the action to disable the role.

<!-- IMAGE: Disable role confirmation -->

### From the edit screen

A role can also be disabled from the Edit form. Once deleted they can not be re-instated. However the administrator may create them again as a new value, if needed.
