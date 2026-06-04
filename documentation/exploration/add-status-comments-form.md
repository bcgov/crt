# Add Status Comments Form

## URL
`https://dev-crt.th.gov.bc.ca/projects/{id}` (click "Add Status Comments" button)

## Purpose
Adds a status comment to a project for tracking progress and communication.

## Key Elements

| Element | Type | Selector | Notes |
|---------|------|----------|-------|
| Comment | Textarea | `textarea#comment[name="comment"]` | Placeholder "Insert Comment Here", rows=5 |
| Submit | Button | `button[type="submit"]` | Disabled until comment entered |
| Cancel | Button | `button:has-text("Cancel")` | Closes modal |
| Close (X) | Button | `button.close[aria-label="Close"]` | Top-right close |
| Show all Status Comments | Button | `button:has-text("Show all Status Comments")` | Toggle on section header |

## Table Display
- Columns: Date Added, User, Comment
- Shows most recent comments by default
- "Show all Status Comments" expands to show full history

## Screenshot
![Add Status Comments Form](screenshots/add-status-comments-form.png)
