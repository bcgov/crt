---
id: TC-TS-SEG-07
title: Navigation links from Segments page
source_plan: 06-spatial-segments-ratios
source_scenario: TS-SEG-07
covers_ac: [AC-seg-nav-links]
persona: Application User (MANAGER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@segments", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-SEG-07 — Navigation links from Segments page

## 1. Context
Verifies that all sub-navigation links from the Segments page work correctly: Close (back to project list), Tender, Details, and Financial Plan.

**Source**: Test Plan 06, scenario TS-SEG-07 ([CRPDB-162]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project (e.g., project ID 79).
- **Starting URL**: `${BASE_URL}/projects/79/segments`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data
None required.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the segments page for project "79"

# Navigate to Details
When  I click the link "Details"
Then  the URL is "/projects/79"
And   I see the heading "Project Details"

# Navigate back to Segments, then to Financial Plan
When  I click the link "Segment"
Then  the URL contains "/segments"
When  I click the link "Financial Plan"
Then  the URL contains "/projectplan"
And   I see the heading "Financial Planning Targets"

# Navigate to Tender
When  I click the link "Tender"
Then  the URL contains "/projecttender"
And   I see the heading "Project Tender Details"

# Navigate to Close (Project Search)
When  I click the link "Close"
Then  the URL is "/projects"
And   I see the Projects search page
```

## 5. Expected Results
- "Details" → `/projects/79`
- "Financial Plan" → `/projects/79/projectplan`
- "Tender" → `/projects/79/projecttender`
- "Close" → `/projects`

## 6. Postconditions / Cleanup
- No data was created; no cleanup required.

## 7. Notes for the Playwright Agent
- Sub-navigation tabs: Details, Financial Plan, Tender, Segment, Close.
- Each is an `<a>` element with the corresponding text.
