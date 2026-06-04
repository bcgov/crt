---
id: TC-TS-PM-10
title: Re-enable disabled PM
source_plan: 07-data-maintenance
source_scenario: TS-PM-10
covers_ac: [AC-pm-reenable]
persona: Administrator (SYSTEM_ADMIN)
priority: Medium
type: Functional
level: E2E
automation_candidate: Yes
tags: ["@regression", "@admin", "@codetables", "@project-manager", "@persona-admin"]
last_updated: 2026-06-04
---

# TC-TS-PM-10 — Re-enable disabled PM

## 1. Context
Verifies that a disabled PM can be re-enabled, making it available again in the Project Details PM dropdown.

**Source**: Test Plan 07, scenario TS-PM-10.

## 2. Preconditions
- **User**: Authenticated as `{{IDIR_VALID_ADMIN}}` with `Code Read` + `Code Write` permissions.
- **Data**: PM "CRT-AUTO Test Manager" exists and is currently Inactive/disabled.
- **Starting URL**: `${BASE_URL}/admin/codetables`

## 3. Test Data

| Field | Value |
|-------|-------|
| PM Name | `CRT-AUTO Test Manager` (currently disabled) |

## 4. Steps (Gherkin)

```gherkin
Given I am logged in as "{{IDIR_VALID_ADMIN}}" with admin permissions
And   I am on the "Code Table Management" page with "Project Manager" code set selected

When  I switch the Status filter to "Inactive"
Then  disabled PMs are displayed including "CRT-AUTO Test Manager"

When  I click the Enable icon (greyed-out icon) on the row containing "CRT-AUTO Test Manager"
Then  I see a confirmation prompt "This value will be enabled. Are you sure?"

When  I confirm the enable action
Then  "CRT-AUTO Test Manager" is re-activated

# Verify available in Project Details dropdown
When  I navigate to a project details page
And   I click the dropdown "Project Manager"
And   I type "CRT-AUTO" into the filter
Then  I see "CRT-AUTO Test Manager" as an available option
```

## 5. Expected Results
- Confirmation prompt with "This value will be enabled. Are you sure?" is shown.
- PM is re-activated after confirmation.
- PM appears again in Project Details PM dropdown.

## 6. Postconditions / Cleanup
- Disable or delete the PM if no longer needed.

## 7. Notes for the Playwright Agent
- Must switch to Inactive filter first to see disabled PMs.
- Enable icon tooltip: "Enable record".
