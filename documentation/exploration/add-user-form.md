# Add User Form (Admin)

## URL
`https://dev-crt.th.gov.bc.ca/admin/users` (click "Add User" button)

## Purpose
Two-step wizard to add a new user to the CRT system by searching their IDIR and assigning roles/regions.

## Key Elements - Step 1 (Search)

| Element | Type | Selector | Notes |
|---------|------|----------|-------|
| Search by IDIR | Text Input | `input#username[name="username"]` | Placeholder "IDIR" |
| Next | Button | `button:has-text("Next")` | Disabled until IDIR entered |
| Cancel | Button | `button:has-text("Cancel")` | Closes modal |
| Close (X) | Button | `button.close[aria-label="Close"]` | Top-right close |

## Step 2 (Not fully explored)
After entering valid IDIR and clicking Next, likely shows:
- User details (name, email from IDIR lookup)
- Role assignment dropdown (MANAGER, READ_ONLY, REGION_ADMIN, SYSTEM_ADMIN)
- Region assignment (multi-select: 0-Headquarters, 1-South Coast, 2-Southern Interior, 3-Northern)
- Submit/Save button

## Screenshot
![Add User Form](screenshots/add-user-form.png)

## Notes
- Modal title: "Add User"
- Uses `autocomplete="off"` on IDIR input
- Two-step process: search IDIR first, then configure access
- Next button disabled until username field has value
