---
id: TC-TS-TEND-01
title: Verify tender form fields
source_plan: 05-financial-planning
source_scenario: TS-TEND-01
covers_ac: [AC-tender-form-fields]
persona: Application User (MANAGER)
priority: High
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@tender", "@persona-manager"]
last_updated: 2026-06-03
---

# TC-TS-TEND-01 — Verify tender form fields

## 1. Context
Verifies that the Add Tender form contains all expected fields: Tender Number (required), Planned Date, Actual Date, Ministry Estimate ($), Winning Contractor (dropdown), Winning Bid ($), and Comment (free text).

**Source**: Test Plan 05, scenario TS-TEND-01 ([CRPDB-113]).

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with role `MANAGER`, region `1-South Coast`.
- **Data**: An existing project (e.g., project ID 79) accessible from the Tender page.
- **Starting URL**: `${BASE_URL}/projects/79/projecttender`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data
None required — this is a form structure verification.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with role "MANAGER"
And   I am on the tender page for project "79"
When  I click the first button "+ Add" in the Project Tender Details section
Then  I see a dialog for adding a tender record

And   I see the textbox "Tender Number" which is required
And   I see the field "Planned Date" (date picker)
And   I see the field "Actual Date" (date picker)
And   I see the currency field "Ministry Estimate"
And   I see the dropdown "Winning Contractor"
And   I see the currency field "Winning Bid"
And   I see the textarea with placeholder "Insert Comment Here"
And   the button "Submit" is disabled (until Tender Number is filled)
And   the button "Cancel" is enabled
```

## 5. Expected Results
- All seven fields are present in the Add Tender form.
- Tender Number is marked as required.
- Submit is disabled until the required Tender Number field is filled.
- Currency fields (Ministry Estimate, Winning Bid) accept dollar amounts.
- Winning Contractor is a dropdown with contractor options.

## 6. Postconditions / Cleanup
- Close the dialog with "Cancel"; no data was created.

## 7. Notes for the Playwright Agent
- The "+ Add" for tenders is the FIRST "+ Add" button on the page (before the Qty/Accmp section).
- Tender Number field: `input[name="tenderNumber"]`.
- Date fields use date picker controls (YYYY-MM-DD format).
- Currency fields default to $0.
- Comment textarea: `textarea[placeholder="Insert Comment Here"]`.
