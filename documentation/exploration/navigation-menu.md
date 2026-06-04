# Navigation Menu

## Overview
- **Page Name:** Main Navigation (Header Bar)
- **Location:** Top of every page
- **Purpose:** Provides access to all main sections of the CRT application.

## Navigation Structure

### Top Navigation Bar (Desktop: 1280px+)
The navigation bar is always visible at the top of the page on desktop views.

### Top Navigation Bar (Mobile/Responsive)
On smaller viewports, a "Toggle navigation" hamburger button shows/hides the nav items.

## Navigation Items

### Left Nav (Main Links)
| Item | Type | URL/Action | Description |
|------|------|------------|-------------|
| B.C. Government Logo | Link | `/` | Navigates to home (redirects to projects list) |
| CaRT Logo | Link | `/` | Navigates to home (redirects to projects list) |
| App Title | Text | - | "MoTI Capital and Rehabilitation Tracking" |
| Projects | Link | `/projects` | Main projects list page |
| Reports | Dropdown | `#` | Dropdown menu with report options |
| Admin | Dropdown | `#` | Dropdown menu with admin options |

### Right Nav (User)
| Item | Type | Description |
|------|------|-------------|
| Username, Logout | Button | Shows current user (e.g., "BARRYJIN, Logout") with icon |

### Reports Dropdown Menu
| Item | Action | Description |
|------|--------|-------------|
| PowerBI Reports | Opens new tab | Opens `https://dev-dwpbi.th.gov.bc.ca/reports/browse/CRT` in a new tab |

### Admin Dropdown Menu
| Item | URL | Description |
|------|-----|-------------|
| Users | `/admin/users` | User management page |
| Roles and Permissions | (TBD) | Roles and permissions management |
| Code Tables | (TBD) | Code table/lookup management |
| Elements | (TBD) | Elements management |
| API Access | (TBD) | API access configuration |
| Version | (TBD) | Application version info |

## Selectors

| Element | Selector |
|---------|----------|
| Toggle Navigation (Hamburger) | `button[aria-label="Toggle navigation"]` |
| Projects Link | `a[href="/projects"]` / link with text "Projects" |
| Reports Dropdown | link with text "Reports" (expanded state reveals menu) |
| Admin Dropdown | link with text "Admin" (expanded state reveals menu) |
| PowerBI Reports MenuItem | `menuitem` with text "PowerBI Reports" |
| Users MenuItem | `menuitem` with text "Users" |
| Roles and Permissions MenuItem | `menuitem` with text "Roles and Permissions" |
| Code Tables MenuItem | `menuitem` with text "Code Tables" |
| Elements MenuItem | `menuitem` with text "Elements" |
| API Access MenuItem | `menuitem` with text "API Access" |
| Version MenuItem | `menuitem` with text "Version" |
| Logout Button | `button` with text containing "Logout" |

## Screenshots
![Navigation Admin Dropdown](screenshots/navigation-admin-dropdown.png)
