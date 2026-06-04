---
id: TC-TS-COMMENT-06
title: Delete EMR comment
source_plan: 08-ui-enhancements
source_scenario: TS-COMMENT-06
covers_ac: [AC-emr-delete]
persona: Application User (APP_USER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@comments", "@emr", "@project-details", "@persona-user"]
last_updated: 2026-06-03
---

# TC-TS-COMMENT-06 — Delete EMR comment

## 1. Context
Verifies that an existing EMR comment can be deleted via the trash icon with confirmation.

**Source**: Test Plan 08, scenario TS-COMMENT-06.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}`.
- **Data**: A project exists with at least one EMR comment.
- **Starting URL**: `${BASE_URL}/projects/{id}`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| EMR comment to delete | `EMR comment to be deleted` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}"
And   I am on the Project Details page with an EMR comment "EMR comment to be deleted"

When  I expand the EMR comment history section
And   I click the delete (trash) icon on the EMR comment "EMR comment to be deleted"
Then  I see a confirmation prompt "Are you sure?"
When  I click the confirm button

Then  the EMR comment "EMR comment to be deleted" is no longer visible
And   remaining EMR comments are still displayed correctly
```

## 5. Expected Results
- The delete icon removes the EMR comment after confirmation.
- Other EMR comments remain intact.

## 6. Postconditions / Cleanup
- EMR comment permanently deleted; no cleanup required.

## 7. Notes for the Playwright Agent
- Same delete workflow as status comments but in the EMR section.
- Confirmation text: "Are you sure?"
