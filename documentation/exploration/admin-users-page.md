# Admin - User Management Page

## Overview
- **Page Name:** User Management
- **URL:** `https://dev-crt.th.gov.bc.ca/admin/users?isActive=true&pageNumber=1&pageSize=25`
- **Purpose:** Manage application users - view, search, add, edit, and disable user accounts. Displays user details including name, IDIR, email, region assignments, and active status.

## Key Elements

### Header
| Element | Description | Selector |
|---------|-------------|----------|
| Page Heading | "User Management" h1 | `h1` with text "User Management" |

### Search/Filter Section
| Element | Description | Selector |
|---------|-------------|----------|
| Regions Dropdown | Filter users by region | `button` with text "Regions" |
| Search Textbox | Search by IDIR/Name/Email | `input` with placeholder "IDIR/Name/Email" |
| Active Filter | Filter by active/inactive status | `button` with text "ACTIVE" |
| Search Button | Execute search | `button` with text "Search" |
| Reset Button | Clear all filters | `button` with text "Reset" |

### Action Buttons
| Element | Description | Selector |
|---------|-------------|----------|
| Add User | Add a new user | `button` with text "Add User" |

### Users Table
| Column | Description | Sortable |
|--------|-------------|----------|
| First Name | User's first name | Yes |
| Last Name | User's last name | Yes |
| IDIR | User's IDIR username | Yes |
| Email | User's email address | Yes |
| Regions | Comma-separated region numbers (e.g., "0,1,2,3") | No |
| Active | Shows "Active" badge | No |
| Actions | Edit Record, Disable Record buttons | No |

### Row Actions
| Element | Description | Selector |
|---------|-------------|----------|
| Edit Record | Edit user details | `button` with text "Edit Record" |
| Disable Record | Disable/deactivate user | `button` with text "Disable Record" |

## Sample Data
| First Name | Last Name | IDIR | Email | Regions |
|-----------|-----------|------|-------|---------|
| Barry | Jin | BARRYJIN | Barry.Jin@gov.bc.ca | 0,1,2,3 |
| Bruce | Wang | BRWANG | Bruce.Wang@gov.bc.ca | 0,1,2,3 |
| Bowen | Wang | BWANG | Bowen.Wang@gov.bc.ca | 0,1,2,3 |
| Devashish | Bhargava | DBHARGAV | Devashish.Bhargava@gov.bc.ca | 0,1 |

## Screenshot
![Admin Users Page](screenshots/admin-users-page.png)
