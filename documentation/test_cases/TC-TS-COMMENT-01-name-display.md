---
id: TC-TS-COMMENT-01
title: Comments show first and last name
source_plan: 08-ui-enhancements
source_scenario: TS-COMMENT-01
covers_ac: [AC-comment-name]
persona: Application User (APP_USER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@comments", "@project-details", "@persona-user"]
last_updated: 2026-06-03
---

# TC-TS-COMMENT-01 — Comments show first and last name

## 1. Context
Verifies that status and EMR comments display the commenting user's first and last name.

**Source**: Test Plan 08, scenario TS-COMMENT-01.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}`.
- **Data**: A project (`{{PROJECT_NUMBER_EXISTING}}`) exists.
- **Starting URL**: `${BASE_URL}/projects/{id}`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Status Comment | `Test comment for name display` |
| Expected Name | First and last name of logged-in user |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}"
And   I am on the Project Details page for project "{{PROJECT_NUMBER_EXISTING}}"

# Add a status comment
When  I click the link or button to add a status comment
And   I fill the textarea "comment" with "Test comment for name display"
And   I click the button "Submit"
Then  the comment is saved successfully

# Verify name display
When  I expand the comment history section
Then  the latest comment shows the user's first and last name (e.g., "John Smith")
And   the comment text "Test comment for name display" is displayed
```

## 5. Expected Results
- The comment is saved and displayed in the history.
- The user's first and last name appears next to the comment (not IDIR username).
- Name format is "FirstName LastName".

## 6. Postconditions / Cleanup
- Delete the test comment.

## 7. Notes for the Playwright Agent
- The comment textarea has id="comment" and placeholder "Insert Comment Here".
- Name display format may vary — assert it contains both first and last name parts.
