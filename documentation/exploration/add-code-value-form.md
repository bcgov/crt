# Add Code Value Form (Admin Code Tables)

## URL
`https://dev-crt.th.gov.bc.ca/admin/codetables` (select a Code Set, then click "Add {CodeSet}" button)

## Purpose
Adds a new value to a selected code table (lookup table) in the system.

## Key Elements

| Element | Type | Selector | Notes |
|---------|------|----------|-------|
| Code Set | Text Input (disabled) | `input#codeSetName[name="codeSetName"]` | Read-only, shows selected code set |
| Code Value | Text Input | `input#codeValueText[name="codeValueText"]` | Has tooltip (?) icon |
| Code Name | Text Input | `input#codeName[name="codeName"]` | Required*, has tooltip |
| Order Number | Number Input | `input#displayOrder[name="displayOrder"]` | Required*, auto-populated |
| Submit | Button | `button[type="submit"]` | Disabled until required fields filled |
| Cancel | Button | `button:has-text("Cancel")` | Closes modal |

## Code Set Dropdown Options (on page filter)
- "" (empty/All)
- Accomplishment
- Capital Index
- Contractor
- Economic Region
- Electoral District
- Fiscal Year
- Funding Type
- Highway
- Nearest Town
- Phase
- Program
- Quantity
- RC Number
- Service Line
- Program Category
- Project Manager

## Screenshot
![Add Code Value Form](screenshots/add-code-value-form.png)

## Notes
- Modal title dynamically changes: "Add {CodeSetName}" (e.g., "Add Accomplishment")
- Code Set field is disabled/read-only in the form
- Code Value and Code Name have tooltip (?) icons explaining the fields
- Order Number auto-increments based on existing entries
- The form structure is the same regardless of which Code Set is selected
