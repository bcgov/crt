---
id: TC-TS-PROJ-06
title: PM dropdown shows region-specific PMs only
source_plan: 04-project-search-details
source_scenario: TS-PROJ-06
covers_ac: [AC-pm-region-filter]
persona: Application User (MANAGER)
priority: Medium
type: Functional
level: E2E
automation_candidate: Partial
tags: ["@regression", "@projects", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-PROJ-06 — PM dropdown shows region-specific PMs only

## 1. Context
Verifies that the Project Manager dropdown on the Project Search page only displays PMs associated with the user's assigned region(s). PMs from other regions should not appear.

**Source**: Test Plan 04, scenario TS-PROJ-06 ([CRPDB-105]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, assigned to region `1-South Coast` only.
- **Data**: At least one PM exists in `1-South Coast` and at least one PM exists in another region (e.g., `2-Southern Interior`).
- **Starting URL**: `${BASE_URL}/projects`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| User Region | `1-South Coast` |
| Expected PM (same region) | A PM assigned to `1-South Coast` |
| Unexpected PM (other region) | A PM assigned only to `2-Southern Interior` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER" assigned to region "1-South Coast"
And   I am on the "Projects" page
When  I click the button "Project Manager"
Then  I see PMs associated with region "1-South Coast" in the dropdown
And   I do not see PMs associated only with region "2-Southern Interior" in the dropdown
```

## 5. Expected Results
- The PM dropdown lists only those PMs whose region assignment includes `1-South Coast`.
- PMs exclusively assigned to other regions are not visible in the dropdown.

## 6. Postconditions / Cleanup
- No data was created; no cleanup required.

## 7. Notes for the Playwright Agent
- This test requires knowledge of which PMs belong to which regions in the test data.
- Automation candidate is "Partial" because verifying absence of specific PMs requires known test data.
- Consider using API calls to seed/confirm PM region assignments before running this test.
