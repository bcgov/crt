# Edit Role Form (Admin)

## URL
`https://dev-crt.th.gov.bc.ca/admin/roles` (click edit icon on a role row)

## Purpose
Edit role name, description, and assign/remove permissions for the role.

## Key Elements

| Element | Type | Selector | Notes |
|---------|------|----------|-------|
| Role Name | Text Input | `input#name[name="name"]` | Required* |
| Role Description | Text Input | `input#description[name="description"]` | Required* |
| Permissions | Checkbox Group | `.multi-select input[type="checkbox"]` | Multi-select, see below |
| End Date | Date Picker | `input#endDate[name="endDate"]` | Optional, deactivates role |
| Submit | Button | `button[type="submit"]` | Disabled until valid changes |
| Cancel | Button | `button:has-text("Cancel")` | Closes modal |
| Close (X) | Button | `button.close[aria-label="Close"]` | Top-right close |
| Edit Record (trigger) | Button | `button[title="Edit Record"]` | In table row |

## Permissions (All Available)

| ID | Permission Name | Description |
|----|----------------|-------------|
| 1 | Code Table Read | View code tables |
| 2 | Code Table Write | Edit code tables |
| 3 | Export Read | Export data |
| 4 | Project Read | View projects |
| 5 | Project Write | Edit projects |
| 6 | Role Read | View roles |
| 7 | Role Write | Edit roles |
| 8 | User Read | View users |
| 9 | User Write | Edit users |
| 10 | API Access Client | API access |

## MANAGER Role Default Permissions
- ✅ Code Table Read
- ✅ Export Read
- ✅ Project Read
- ✅ Project Write

## Screenshot
![Edit Role Form](screenshots/edit-role-form.png)
