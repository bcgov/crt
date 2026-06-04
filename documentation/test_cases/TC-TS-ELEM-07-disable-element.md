---
id: TC-TS-ELEM-07
title: Disable element used in data entry
source_plan: 07-data-maintenance
source_scenario: TS-ELEM-07
covers_ac: [AC-elem-disable]
persona: Administrator (SYSTEM_ADMIN)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@admin", "@elements", "@persona-admin"]
last_updated: 2026-06-03
---

# TC-TS-ELEM-07 — Disable element used in data entry

## 1. Context
Verifies that an element already used in data entry can be disabled (not deleted). After disabling, it is no longer available for new data entry but existing records are unaffected.

**Source**: Test Plan 07, scenario TS-ELEM-07.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` with `Code Read` + `Code Write` permissions.
- **Data**: An element exists that has been used in at least one financial planning entry (so it shows a Disable icon, not Delete).
- **Starting URL**: `${BASE_URL}/admin/elements`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data
An element that has been referenced in financial planning entries.

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with admin permissions
And   I am on the "Elements Management" page
And   an element exists that has been used in data entry (shows Disable icon)

When  I click the button "Disable Record" on that element row
Then  I see a confirmation with text "This value will be disabled. Are you sure?"
When  I click the confirm button
Then  the element status changes to "Inactive"
And   the element no longer appears in the Active filter view
```

## 5. Expected Results
- A confirmation prompt appears with the disable warning text.
- After confirming, the element's status becomes Inactive.
- The element no longer appears in Active element lists.
- Existing financial planning records referencing this element remain intact.

## 6. Postconditions / Cleanup
- Re-enable the disabled element (see TS-ELEM-10).

## 7. Notes for the Playwright Agent
- Per §0.8.1: elements used in data entry show Disable icon (not Delete).
- The confirmation text is "This value will be disabled. Are you sure?"
- After disabling, switch to Inactive filter to verify the element appears there.
