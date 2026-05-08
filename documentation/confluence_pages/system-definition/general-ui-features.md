---
source: [General UI Features](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302693/General+UI+Features)
last_updated: 2026-05-08
---

# General UI Features

## Themes

The standard BC Gov Bootstrap v4 Theme is used.

- Source code: [https://github.com/bcgov/bootstrap-theme](https://github.com/bcgov/bootstrap-theme)
- Sample github: [https://github.com/bcgov/design-system/](https://github.com/bcgov/design-system/)
- Sample reference: [https://bcgov.github.io/bootstrap-theme/docs/reference/simple/](https://bcgov.github.io/bootstrap-theme/docs/reference/simple/)

## Data tables

Datatables are used to view, search and manage records.

### Features

The View List datatable is the "start" page for many system features and provides the following features that are implemented for each list as needed:

- Dynamic record search
- Filters to narrow the list
- Sorting by column, clicking on the column title to change the sort order
- An Actions column to perform next steps, typically, View/Edit Record Details and/or Delete Record
- Records are displayed in pages, with dynamic pagination control (updates with search and filter)
- A stand alone button to create a new record

Example: Activity numbers table, Users table etc.

### Pagination

- Number of records to view option is at bottom left
- Page Size Options: 25, 50, 100, 200 All is sentence case, not all caps
- Default Page Size to 25 unless otherwise specified in the story
- Page Navigation First page, Previous, Next and Last page is at bottom right
- Page Navigation is suppressed when results are one page or less
- Pagination Results updates dynamically when a search is performed (If total number of results is 100 where there are 40 results, display is, "Showing 1-25 of 40 results)
- Search, Filter and Sort are preserved as user pages through results, and when user changes Page Size Option (e.g. from 25 to 10)

<!-- IMAGE: Sample Mockup - image2020-11-24_15-22-31.png -->

## Messages

### Confirmation

- To be used wherever there is a need to draw attention to a user's actions, allowing them a chance to go back to previous state in case the action occurred in error, such as deleting/disabling a record.
- These messages will be accompanied with options to complete the action ("Yes/Save"/"Submit") and to negate the action ("Close/Cancel").

<!-- IMAGE: Sample Mock up - image2020-11-24_15-26-47.png -->

### Success

- These are messages that signify completion of actions, such as Add/Update/Delete. They are only accompanied with the option to close the dialog.
- Display these messages in green.

<!-- IMAGE: Sample Mockup - image2019-10-30_13-23-51.png -->

### Error

- These are messages that signify failure to take expected actions, such as failure to provide value for a mandatory field.
- These messages should be displayed in red.
- For errors corresponding to the individual data fields, the message should appear below the field while also outlining the data field in red.

<!-- IMAGE: Example - image2021-1-27_12-21-15.png -->

### Information/Warning

- These are messages that should grab users attention and may lead to potential correction.
- These messages should be displayed in regular text, with the input field highlighted in Yellow.
- For errors corresponding to the individual data fields, the message should appear below the field while also outlining the data field in Yellow.

<!-- IMAGE: Example - image2021-1-27_12-18-55.png -->

**Wire-frame reference**

These are used for creating reference mock-ups.

<!-- MACRO: Wire-frame tool embed -->
