# Admin - Roles and Permissions Page

## Overview
- **Page Name:** Role and Permissions Management
- **URL:** `https://dev-crt.th.gov.bc.ca/admin/roles?isActive=true&pageNumber=1&pageSize=25`
- **Purpose:** Manage application roles and their associated permissions. Allows adding, editing, and disabling roles.

## Key Elements

### Header
| Element | Description | Selector |
|---------|-------------|----------|
| Page Heading | "Role and Permissions Management" h1 | `h1` with text "Role and Permissions Management" |

### Search/Filter Section
| Element | Description | Selector |
|---------|-------------|----------|
| Search Textbox | Search by role/description | `input` with placeholder "Role/Description" |
| Active Filter | Filter by active status | `button` with text "ACTIVE" |
| Search Button | Execute search | `button` with text "Search" |
| Reset Button | Clear filters | `button` with text "Reset" |

### Action Buttons
| Element | Description | Selector |
|---------|-------------|----------|
| Add Role | Add a new role | `button` with text "Add Role" |

### Roles Table
| Column | Description | Sortable |
|--------|-------------|----------|
| Role Name | Role identifier (e.g., "MANAGER", "SYSTEM_ADMIN") | Yes |
| Role Description | Human-readable description (e.g., "Manager", "System Administrator") | Yes |
| Active | Status badge | No |
| Actions | Edit Record, Disable Record | No |

### Row Actions
| Element | Description | Selector |
|---------|-------------|----------|
| Edit Record | Edit role details/permissions | `button` with text "Edit Record" |
| Disable Record | Deactivate role | `button` with text "Disable Record" |

## Existing Roles
| Role Name | Description |
|-----------|-------------|
| MANAGER | Manager |
| READ_ONLY | Read Only |
| REGION_ADMIN | Region Administrator |
| SYSTEM_ADMIN | System Administrator |

## Screenshot
![Admin Roles Page](screenshots/admin-roles-page.png)
