# Admin - Elements Page

## Overview
- **Page Name:** Elements Management
- **URL:** `https://dev-crt.th.gov.bc.ca/admin/elements?isActive=true&pageNumber=1&pageSize=25`
- **Purpose:** Manage project elements (work types/categories). Elements are used in financial planning targets and map to program categories, programs, and service lines.

## Key Elements

### Header
| Element | Description | Selector |
|---------|-------------|----------|
| Page Heading | "Elements Management" h1 | `h1` with text "Elements Management" |

### Search/Filter Section
| Element | Description | Selector |
|---------|-------------|----------|
| Search Textbox | Searches through element, description, program category, program and service line | `input` with placeholder "Search" |
| Active Filter | Filter by active status | `button` with text "Active" |
| Search Button | Execute search | `button` with text "Search" |
| Reset Button | Clear filters | `button` with text "Reset" |

### Action Buttons
| Element | Description | Selector |
|---------|-------------|----------|
| Add New Element | Add a new element | `button` with text "Add New Element" |

### Elements Table
| Column | Description | Sortable |
|--------|-------------|----------|
| Element | Short element code (e.g., "Bb", "Bc", "Bd") | Yes |
| Description | Full description (e.g., "Bike BC", "Bridge Coatings") | Yes |
| Program Category | Category (e.g., "Capital", "Preservation") | No |
| Program | Program name (e.g., "Grants - Bike BC", "HRP-Bridges") | No |
| Service Line | Service line number (e.g., "0", "62175") | No |
| Order Number | Display order | Yes |
| Status | Active/Inactive badge | No |
| Actions | Edit Record, Delete/Disable Record | No |

### Row Actions
| Element | Description | Selector |
|---------|-------------|----------|
| Edit Record | Edit element details | `button` with text "Edit Record" |
| Delete Record | Delete element (some entries) | `button` with text "Delete Record" |
| Disable Record | Disable element (some entries) | `button` with text "Disable Record" |

## Sample Data
| Element | Description | Program Category | Program | Service Line | Order |
|---------|-------------|-----------------|---------|--------------|-------|
| Bb | Bike BC | Capital | Grants - Bike BC | 0 | 60 |
| Bc | Bridge Coatings | Preservation | HRP-Bridges | 62175 | 70 |
| Bd | Bridge Deck Resurfacing | Preservation | HRP-Bridges | 62560 | 80 |

## Screenshot
![Admin Elements Page](screenshots/admin-elements-page.png)
