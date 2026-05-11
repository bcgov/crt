---
source: [4.2 Managing Code Table values](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302776/4.2+Managing+Code+Table+values)
last_updated: 2026-05-08
---

# 4.2 Managing Code Table values

## Getting to code tables

To manage these values one must have the System administrator role, which in this case would mean they should have a role with at least the following permissions:

- **Code Read** - Gives user the access to the *code tables screen*
- **Code Write** - Enables *Add, Edit* and *Disable/Delete* actions for code tables.

To learn about navigation to menu see [Application components → Menu](https://moti-imb.atlassian.net/wiki/display/CRPDB/2+Application+components#id-2Applicationcomponents-Menu).

### Important note for adding a code value

To create or update a code value a user would need to maintain three fields - Code Value, Code name and Order number. Please keep in mind of the following while creating/updating code values:

- If the business group would like to create a short hand/or alpha numeric representation of the actual value that should be put in Code Value, *such as "P" for Planning*.
- The description of the code should be placed in Code Name, *such as "Planning"*. The Code Name field is **required**. If there are some code sets that do not need a shorthand representation (such as Project Managers), just the code name can be provided, and the Code Value field can be left blank.
- The Order Number will allow the administrator to place the code values at the most convenient spot on the list. By default a new value would show up at the bottom of the list.
- *There should not be a duplication of code values, particularly for the same code set - as this would create confusion for the users, and data inconsistencies on the long run.*

## Adding code value

An administrator needs to follow these steps to add a new code value in the application:

1. Search for the code being created to ensure that it does not already exist (expand the search to include both active and inactive codes), if the code exists it is preferable to keep using the one that already exists - or consider differentiating the new code from the existing one in some way to make them distinct.
2. Select a code set, such as Accomplishment, then execute the search to retrieve current values for the code set and click Add <code set>, where <code set> should be the one user intends to add the new value to (same as in the search parameter).

<!-- IMAGE: image2021-5-11_8-16-16.png - Code table search and add -->

3. Provide values in the form to add the code value.

<!-- IMAGE: image2021-5-17_9-28-13.png - Add code value form -->

## Update code value

- To edit a code value click on the edit button at the end of the row of the corresponding code value.

<!-- IMAGE: image2021-5-17_9-51-42.png - Edit code value button -->

- Update the values in the form and save (Submit) the changes.

<!-- IMAGE: image2021-5-17_9-50-16.png - Edit code value form -->

## Remove code value

Depending on whether a code value has been used for data entry the user can either disable or permanently delete a code value.

### Making code value inactive

Making a code value inactive simply means that it can not be used for data entry any more. Such code values can still be reactivated if the need arises. Only code values that have been used for data entry can be disabled.

- Click on the disable button at the end of the row of the corresponding code value.

<!-- IMAGE: image2021-5-17_9-55-9.png - Disable code value button -->

- Confirm the action to disable the code value.

<!-- IMAGE: image2021-5-17_9-56-26.png - Disable confirmation -->

### Permanently delete code value

A code value can only be deleted permanently if it has never been used for the purpose of data entry. Once deleted they can not be re-instated. However the administrator may create them again as a new value, if needed.

- Click on the delete button at the end of the row of the corresponding code value.

<!-- IMAGE: image2021-5-17_10-1-21.png - Delete code value button -->

- Confirm the action to delete the code value.

<!-- IMAGE: image2021-5-17_10-4-30.png - Delete confirmation -->
