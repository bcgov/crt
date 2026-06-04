---
id: TC-TS-CLONE-04
title: Clone type restriction — Qty can only clone to Qty
source_plan: 07-data-maintenance
source_scenario: TS-CLONE-04
covers_ac: [AC-clone-type-restriction]
persona: Application User (APP_USER)
priority: Medium
type: Edge Case
level: E2E
automation_candidate: Yes
tags: ["@regression", "@clone", "@quantities", "@persona-user"]
last_updated: 2026-06-03
---

# TC-TS-CLONE-04 — Clone type restriction — Qty can only clone to Qty

## 1. Context
Verifies that cloning a Quantity record pre-selects the Quantity category and cannot be changed to Accomplishment (type restriction).

**Source**: Test Plan 07, scenario TS-CLONE-04.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_USER}}` with project edit permissions.
- **Data**: A project exists with at least one Quantity-type record.
- **Starting URL**: `${BASE_URL}/projects/{id}/qtyaccmp`
- **Browser**: Supported browser (Edge, Chrome, or Firefox).

## 3. Test Data

| Field | Value |
|-------|-------|
| Source type | Quantity |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_USER}}" with project edit permissions
And   I am on the Qty/Accomplishments page with at least one Quantity record

When  I click the button "Clone Record" on a Quantity-type row
Then  a new row is created with "Quantity" pre-selected as the category
And   the category field cannot be changed to "Accomplishment"
```

## 5. Expected Results
- The cloned row inherits the Quantity type from the source.
- The type/category cannot be switched to Accomplishment on a cloned Quantity row.
- This enforces type-safe cloning.

## 6. Postconditions / Cleanup
- Cancel or delete the cloned row.

## 7. Notes for the Playwright Agent
- Verify the category/type dropdown is either disabled or restricted to the source type.
- This prevents mismatched data from being created via clone.
