# Add EMR Comments Form

## URL
`https://dev-crt.th.gov.bc.ca/projects/{id}` (click "Add EMR Comments" button)

## Purpose
Adds an EMR (Executive Management Review) comment to a project.

## Key Elements

| Element | Type | Selector | Notes |
|---------|------|----------|-------|
| Comment | Textarea | `textarea#comment[name="comment"]` | Placeholder "Insert Comment Here", rows=5 |
| Submit | Button | `button[type="submit"]` | Disabled until comment entered |
| Cancel | Button | `button:has-text("Cancel")` | Closes modal |
| Close (X) | Button | `button.close[aria-label="Close"]` | Top-right close |
| Show all EMR Comments | Button | `button:has-text("Show all EMR Comments")` | Toggle on section header |

## Table Display
- Columns: Date Added, User, Comment
- Shows most recent comments by default
- "Show all EMR Comments" expands to show full history

## Screenshot
![Add EMR Comments Form](screenshots/add-emr-comments-form.png)

## Notes
- Identical structure to Add Status Comments form
- Only difference is the modal title ("Add EMR Comments" vs "Add Status Comments")
- Both forms share the same comment textarea pattern
