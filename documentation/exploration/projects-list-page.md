# Projects List Page

## Overview
- **Page Name:** Projects List
- **URL:** `https://dev-crt.th.gov.bc.ca/projects?isInProgress=true&pageNumber=1&pageSize=25`
- **Purpose:** Main landing page displaying a list of all projects with filtering, searching, and sorting capabilities. Users can view, search, and navigate to individual project details from this page.

## Key Elements

### Header / Navigation Bar
| Element | Description | Selector |
|---------|-------------|----------|
| B.C. Government Logo | Link to home page | `a[href="/"]` containing `.bc-gov-logo` or `img[alt="B.C. Government Logo"]` |
| App Title | "MoTI Capital and Rehabilitation Tracking" | Text in navbar |
| CaRT Logo | Link to home page | `a[href="/"]` containing `img[alt="CaRT Logo"]` |
| Toggle Navigation | Hamburger menu button | `button` with text "Toggle navigation" |

### Search/Filter Section
| Element | Description | Selector |
|---------|-------------|----------|
| Regions Dropdown | Filter projects by region | `button` with text "Regions" |
| Search Textbox | Searches Project Number, Name, Description and Scope | `input[placeholder="Number/Name/Description/Scope"]` |
| Project Manager Dropdown | Filter by project manager | `button` with text "Project Manager" |
| Active/Status Dropdown | Filter by project status | `button` with text "Active" |
| Search Button | Execute search with current filters | `button` with text "Search" |
| Reset Button | Clear all filters | `button` with text "Reset" |

### Action Buttons
| Element | Description | Selector |
|---------|-------------|----------|
| Add Project | Opens form to create a new project | `button` with text "Add Project" |

### Projects Table
| Column | Description | Sortable |
|--------|-------------|----------|
| Region | Project region (e.g., "1-South Coast", "2-Southern Interior", "0-Headquarters") | Yes (sort button in header) |
| Project | Project number and name, links to project details (`/projects/{id}`) | Yes (sort button in header) |
| Planning Targets | Dollar amount, links to project plan (`/projects/{id}/projectplan`) | No |
| Tender Details | Contractor name or "Tender Details" text, links to project tender (`/projects/{id}/projecttender`) | No |
| Location and Ratios | "Ratios" link to segments (`/projects/{id}/segments`) | No |
| Status | Shows "Active" badge | No |
| Actions | "Close/Activate Project" button with icon | No |

### Table Row Actions
| Element | Description | Selector |
|---------|-------------|----------|
| Project Name Link | Navigate to project details | `a[href="/projects/{id}"]` |
| Planning Targets Link | Navigate to project plan | `a[href="/projects/{id}/projectplan"]` |
| Tender Details Link | Navigate to project tender | `a[href="/projects/{id}/projecttender"]` |
| Ratios Link | Navigate to segments/ratios | `a[href="/projects/{id}/segments"]` |
| Close/Activate Button | Toggle project active status | `button` with title "Close/Activate Project" |

### Pagination
| Element | Description | Selector |
|---------|-------------|----------|
| Pagination Info | Shows "1 - 8 of 8" record count | Text within pagination container |

## Navigation Paths From This Page
- `/projects/{id}` - Project Details
- `/projects/{id}/projectplan` - Project Plan / Planning Targets
- `/projects/{id}/projecttender` - Project Tender Details
- `/projects/{id}/segments` - Project Segments / Location and Ratios

## Screenshot
![Projects List Page](screenshots/projects-list-page.png)
