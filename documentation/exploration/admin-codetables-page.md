# Admin - Code Tables Page

## Overview
- **Page Name:** Code Table Management
- **URL:** `https://dev-crt.th.gov.bc.ca/admin/codetables?codeSet=ACCOMPLISHMENT&isActive=true&pageNumber=1&pageSize=25`
- **Purpose:** Manage lookup/reference code tables used throughout the application. The code set can be switched via a dropdown to view different code tables (defaults to "Accomplishment").

## Key Elements

### Header
| Element | Description | Selector |
|---------|-------------|----------|
| Page Heading | "Code Table Management" h1 | `h1` with text "Code Table Management" |

### Search/Filter Section
| Element | Description | Selector |
|---------|-------------|----------|
| Code Set Dropdown | Switch between different code tables | `button` with current code set name (e.g., "Accomplishment") |
| Search Textbox | Search by code value and name | `input` with placeholder "Search" |
| Active Filter | Filter by active status | `button` with text "Active" |
| Search Button | Execute search | `button` with text "Search" |
| Reset Button | Clear filters | `button` with text "Reset" |

### Action Buttons
| Element | Description | Selector |
|---------|-------------|----------|
| Add New [CodeSet] | Add a new code entry (label changes with selected code set) | `button` with text "Add New Accomplishment" (dynamic) |

### Code Table
| Column | Description | Sortable |
|--------|-------------|----------|
| Code Value | Short code identifier (may be empty for some entries) | Yes |
| Code Name | Full descriptive name | Yes |
| Order Number | Display order number | Yes |
| Status | Active/Inactive badge | No |
| Actions | Edit Record, Delete Record | No |

### Row Actions
| Element | Description | Selector |
|---------|-------------|----------|
| Edit Record | Edit the code entry | `button` with text "Edit Record" |
| Delete Record | Delete the code entry | `button` with text "Delete Record" |

## Sample Data (Accomplishment code set)
| Code Value | Code Name | Order |
|------------|-----------|-------|
| (empty) | Active Transportation Project | 10 |
| (empty) | Bridge Installed, New (each) | 20 |
| (empty) | Bridge Rehabbed (each) | 30 |
| (empty) | Bridge Replaced (each) | 40 |
| (empty) | Bridge Resurfaced (each) | 50 |

## Notes
- The `codeSet` query parameter determines which code table is displayed
- The "Add New" button label dynamically reflects the selected code set
- URL pattern: `/admin/codetables?codeSet={CODE_SET_NAME}&isActive=true&pageNumber=1&pageSize=25`

## Screenshot
![Admin Code Tables Page](screenshots/admin-codetables-page.png)
