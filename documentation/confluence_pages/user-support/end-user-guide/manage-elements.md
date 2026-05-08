---
source: [4.3 Manage Elements](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302890/4.3+Manage+Elements)
last_updated: 2026-05-08
---

# 4.3 Manage Elements

## Getting to elements

To maintain these values one must have a role with at least the following permissions:

- **Code Read** - Gives user the access to the *code tables screen*
- **Code Write** - Enables *Add, Edit* and *Disable/Delete* actions for code tables.

To learn about navigation to menu see [Application components → Menu](https://moti-imb.atlassian.net/wiki/display/CRPDB/2+Application+components#id-2Applicationcomponents-Menu).

### Important note for adding an element

To create or update an element a user would need to maintain it's corresponding - Program Category, Program and Service Line. Please keep in mind of the following while creating/updating elements:

- If the business group would like to create a short hand/or alpha numeric representation of the actual value that should be put in element, *such as "P" for Planning*.
- The description of the code should be placed in Code Name, *such as "Planning"*. The Code Name field is **required**. If there are some code sets that do not need a shorthand representation (such as Project Managers), just the code name can be provided, and the element field can be left blank.
- The Order Number will allow the administrator to place the elements at the most convenient spot on the list. By default a new value would show up at the bottom of the list.
- There should not be a duplication of elements, particularly for the same code set - as this would create confusion for the users, and data inconsistencies on the long run.

## Adding element

An administrator needs to follow these steps to add a new element in the application:

1. Search for the element being created to ensure that it does not already exist (expand the search to include both active and inactive elements), if the element exists it is preferable to keep using the one that already exists - or consider differentiating the new element from the existing one in some way to make them distinct.
2. Click *Add New Element* button.

<!-- IMAGE: image2021-5-17_10-41-8.png - Element search and add -->

3. Provide values in the form to add the element.

<!-- IMAGE: image2021-5-17_10-41-33.png - Add element form -->

## Update element

- To edit an element click on the edit button at the end of the row of the corresponding element.

<!-- IMAGE: image2021-5-17_10-42-33.png - Edit element button -->

- Update the values in the form and save (Submit) the changes.

<!-- IMAGE: image2021-5-17_10-43-56.png - Edit element form -->

## Remove element

Depending on whether an element has been used for data entry the user can either disable or permanently delete an element.

### Making element inactive

Making an element inactive simply means that it can not be used for data entry any more. Such elements can still be reactivated if the need arises. Only elements that have been used for data entry can be disabled.

- Click on the disable button at the end of the row of the corresponding element.

<!-- IMAGE: image2021-5-17_10-42-58.png - Disable element button -->

- Confirm the action to disable the element.

<!-- IMAGE: image2021-5-17_9-56-26.png - Disable confirmation -->

### Permanently delete element

An element can only be deleted permanently if it has never been used for the purpose of data entry. Once deleted they can not be re-instated. However the administrator may create them again as a new value, if needed.

- Click on the delete button at the end of the row of the corresponding element.

<!-- IMAGE: image2021-5-17_10-43-28.png - Delete element button -->

- Confirm the action to delete the element.

<!-- IMAGE: image2021-5-17_10-4-30.png - Delete confirmation -->
