---
id: TC-TS-TEND-06
title: Continue without adding tender
source_plan: 05-financial-planning
source_scenario: TS-TEND-06
covers_ac: [AC-tender-skip]
persona: Application User (MANAGER)
priority: Medium
type: Edge Case
level: E2E
automation_candidate: Yes
tags: ["@regression", "@tender", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-TEND-06 — Continue without adding tender

## 1. Context
Verifies that a user can proceed to the next screen (Segments) from the Tender page without adding any tender records and no error is thrown.

**Source**: Test Plan 05, scenario TS-TEND-06 ([CRPDB-113]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project (e.g., project ID 79) with no tender records (or at least the ability to navigate without adding one).
- **Starting URL**: `${BASE_URL}/projects/79/projecttender`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data
None required.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the tender page for project "79"
And   no tender records have been added

When  I click the link "Segment"
Then  the URL contains "/segments"
And   I see the heading "Project Segments"
And   no error message is displayed
```

## 5. Expected Results
- Navigation to the Segment page succeeds without any error or validation message.
- Tender records are optional; the user is not blocked from proceeding.

## 6. Postconditions / Cleanup
- No data was created; no cleanup required.

## 7. Notes for the Playwright Agent
- The "Segment" link is in the sub-navigation tabs.
- Verify no alert, toast, or error dialog appears after clicking.
- This confirms that tender data is not required to advance in the project workflow.
