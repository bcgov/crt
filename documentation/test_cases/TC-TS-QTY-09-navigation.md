---
id: TC-TS-QTY-09
title: Navigation Back/Continue/Close from Qty page
source_plan: 05-financial-planning
source_scenario: TS-QTY-09
covers_ac: [AC-qty-navigation]
persona: Application User (MANAGER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@quantities", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-QTY-09 — Navigation Back/Continue/Close from Qty page

## 1. Context
Verifies the navigation links from the Tender/Quantities page: navigating back to Financial Plan, forward to Segments, and Close to return to Project Search.

**Source**: Test Plan 05, scenario TS-QTY-09 ([CRPDB-112]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project (e.g., project ID 79).
- **Starting URL**: `${BASE_URL}/projects/79/projecttender`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data
None required.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the tender page for project "79"

# Navigate Back to Financial Plan
When  I click the link "Financial Plan"
Then  the URL contains "/projectplan"
And   I see the heading "Financial Planning Targets"

# Navigate Forward to Segment (Continue)
When  I click the link "Tender"
Then  the URL contains "/projecttender"
When  I click the link "Segment"
Then  the URL contains "/segments"
And   I see the heading "Project Segments"

# Navigate Close to Project Search
When  I click the link "Close"
Then  the URL is "/projects"
And   I see the Projects search page
```

## 5. Expected Results
- "Financial Plan" link navigates to `/projects/{id}/projectplan`.
- "Segment" link navigates to `/projects/{id}/segments`.
- "Close" link navigates back to `/projects` (Project Search).

## 6. Postconditions / Cleanup
- No data was created; no cleanup required.

## 7. Notes for the Playwright Agent
- Navigation uses the sub-navigation tabs: Details, Financial Plan, Tender, Segment, Close.
- Each tab is a link (`<a>` element) with the corresponding text.
- The current page's tab is highlighted in blue (per §0.8 conventions).
