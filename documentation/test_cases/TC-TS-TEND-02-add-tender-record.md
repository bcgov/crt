---
id: TC-TS-TEND-02
title: Add tender record with all fields
source_plan: 05-financial-planning
source_scenario: TS-TEND-02
covers_ac: [AC-add-tender]
persona: Application User (MANAGER)
priority: High
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@tender", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-TEND-02 — Add tender record with all fields

## 1. Context
Verifies that a complete tender record can be added with all fields filled and appears in the tender table in sequential order.

**Source**: Test Plan 05, scenario TS-TEND-02 ([CRPDB-113]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project (e.g., project ID 79) accessible from the Tender page.
- **Starting URL**: `${BASE_URL}/projects/79/projecttender`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Tender Number | `CRT-AUTO-T001` |
| Planned Date | `2025-06-15` |
| Actual Date | `2025-07-01` |
| Ministry Estimate | `1500000` |
| Winning Contractor | (first available contractor from dropdown) |
| Winning Bid | `1450000` |
| Comment | `CRT-AUTO tender test record` |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the tender page for project "79"
When  I click the first button "+ Add" in the Project Tender Details section
Then  I see a dialog for adding a tender record

When  I fill the textbox "Tender Number" with "CRT-AUTO-T001"
And   I fill the date field "Planned Date" with "2025-06-15"
And   I fill the date field "Actual Date" with "2025-07-01"
And   I fill the currency field "Ministry Estimate" with "1500000"
And   I select a contractor from the dropdown "Winning Contractor"
And   I fill the currency field "Winning Bid" with "1450000"
And   I fill the textarea "Comment" with "CRT-AUTO tender test record"
And   I click the button "Submit"

Then  the row containing "CRT-AUTO-T001" appears in the Project Tender Details table
And   the row shows "$1,500,000" in the Ministry Estimate column
And   the row shows "$1,450,000" in the Winning Bid column
```

## 5. Expected Results
- The tender record is created successfully with all field values.
- The new entry appears in the tender table.
- Currency values display formatted with $ prefix and commas.

## 6. Postconditions / Cleanup
- Delete the created tender record `CRT-AUTO-T001` using the Delete action.

## 7. Notes for the Playwright Agent
- Tender Number field is `input[name="tenderNumber"]`.
- Date fields accept YYYY-MM-DD format.
- Currency fields accept integers only (no decimals per Sprint 6 rule — though test plan says 2dp for tender values, verify actual behavior).
- Submit becomes enabled once Tender Number is filled.
