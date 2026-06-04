# Add Tender Form

## URL
`https://dev-crt.th.gov.bc.ca/projects/{id}/projecttender` (click first "+ Add" button)

## Purpose
Adds tender details for a project including tender number, dates, estimates, and winning bid info.

## Key Elements

| Element | Type | Selector | Notes |
|---------|------|----------|-------|
| Tender Number | Text Input | `input[name="tenderNumber"]` | Required* |
| Planned Date | Date Input | `input[type="text"]` (date picker) | YYYY-MM-DD format |
| Actual Date | Date Input | `input[type="text"]` (date picker) | YYYY-MM-DD format |
| Ministry Estimate | Currency Input | currency field | Default $0 |
| Winning Contractor | Dropdown | `.dropdown button` in dialog | Contractor list |
| Winning Bid | Currency Input | currency field | Default $0 |
| Comment | Textarea | `textarea[placeholder="Insert Comment Here"]` | Optional |
| Submit | Button | `button:has-text("Submit")` | Disabled until Tender Number filled |
| Cancel | Button | `button:has-text("Cancel")` | Closes modal |

## Screenshot
![Add Tender Form](screenshots/add-tender-form.png)
