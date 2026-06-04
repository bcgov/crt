# Add Quantities/Accomplishments Form

## URL
`https://dev-crt.th.gov.bc.ca/projects/{id}/projecttender` (click second "+ Add" button)

## Purpose
Adds a quantity or accomplishment record for a project tender, tracking forecast vs actual values per fiscal year.

## Key Elements

| Element | Type | Selector | Notes |
|---------|------|----------|-------|
| Fiscal Year | Dropdown | `[role="dialog"] .dropdown:nth(0) button` | Required* - defaults to current FY |
| Quantity or Accomplishment | Dropdown | `[role="dialog"] .dropdown:nth(1) button` | See options |
| Submit | Button | `button:has-text("Submit")` | Disabled until required fields filled |
| Cancel | Button | `button:has-text("Cancel")` | Closes modal |

## Dropdown Options

### Fiscal Year
- 2010/2011 through 2027/2028
- "TBD"

### Quantity or Accomplishment
- "" (empty)
- "Accomplishment"
- "Quantity"

## Screenshot
![Add Qty/Accomplishment Form](screenshots/add-qty-accomplishment-form.png)

## Notes
- Modal title: "Add Quantities and Accomplishments"
- After selecting Quantity or Accomplishment type, additional fields may appear (Forecast, Schedule7, Actual, Comment)
- The table columns show: Fiscal Year, Accomplishment/Quantity, Forecast, Schedule7, Actual, Comment
- "Show All Qty/Accmp" and "Show All Fiscal Years" toggle buttons available on the section header
