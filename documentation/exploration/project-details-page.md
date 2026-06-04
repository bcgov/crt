# Project Details Page

## Overview
- **Page Name:** Project Details
- **URL:** `https://dev-crt.th.gov.bc.ca/projects/{id}`
- **Example URL:** `https://dev-crt.th.gov.bc.ca/projects/79`
- **Purpose:** Displays detailed information about a specific project including project metadata, status comments, and EMR comments. Allows editing the project and adding comments.

## Sub-Navigation Tabs
| Element | Description | Selector |
|---------|-------------|----------|
| Details Tab | Current page - project details | `a[href="/projects/{id}"]` with text "Details" |
| Financial Plan Tab | Navigate to financial plan | `a[href="/projects/{id}/projectplan"]` with text "Financial Plan" |
| Tender Tab | Navigate to project tenders | `a[href="/projects/{id}/projecttender"]` with text "Tender" |
| Segment Tab | Navigate to project segments | `a[href="/projects/{id}/segments"]` with text "Segment" |
| Close Tab | Return to project search list | `a[href="/projects"]` with text "Close" |

## Project Details Section

### Header
| Element | Description | Selector |
|---------|-------------|----------|
| Section Heading | "Project Details" h1 | `h1` containing text "Project Details" |
| Edit Project Button | Opens edit form for project | `button` with text/title "Edit Project" (has pencil icon) |

### Project Fields (Read-Only Display)
| Field | Description | Example Value |
|-------|-------------|---------------|
| Project Number | Unique project identifier | "999" |
| Project Name | Full project name | "Another test project" |
| MoTI Region | Ministry region | "1-South Coast" |
| Nearest Town | Closest town to project | "Duncan" |
| RC Number | RC/Program number (has tooltip with program name) | "55750" (tooltip: "Community Safety Enhancement Program") |
| Project Manager | Assigned project manager | "Devashish Bhargava" |
| Capital Index | Capital index value (has tooltip with description) | "7" (tooltip: "Capitalizable-All components>15yrs") |
| Project Closed | Whether project is closed | "No" |
| Project Description | Description text | "Testing testing 123" |
| Project Scope | Scope text | "Making streets safer" |

**Note:** Fields with `img` icons next to labels appear to have info tooltips.

## Status Comments Section

### Header
| Element | Description | Selector |
|---------|-------------|----------|
| Section Heading | "Status Comments" h1 | `h1` containing text "Status Comments" |
| Add Status Comments Button | Opens form to add a status comment | `button` with text "Add Status Comments" |
| Show All Status Comments Button | Expands to show all comments | `button` with text "Show all Status Comments" |

### Comments Table
| Column | Description |
|--------|-------------|
| Date Added | When the comment was added |
| User | Who added the comment |
| Comment | Comment text |

## EMR Comments Section

### Header
| Element | Description | Selector |
|---------|-------------|----------|
| Section Heading | "EMR Comments" h1 | `h1` containing text "EMR Comments" |
| Add EMR Comments Button | Opens form to add an EMR comment | `button` with text "Add EMR Comments" |
| Show All EMR Comments Button | Expands to show all EMR comments | `button` with text "Show all EMR Comments" |

### Comments Table
| Column | Description |
|--------|-------------|
| Date Added | When the comment was added |
| User | Who added the comment |
| Comment | Comment text |

## Navigation Paths From This Page
- `/projects/{id}/projectplan` - Financial Plan
- `/projects/{id}/projecttender` - Tender
- `/projects/{id}/segments` - Segment
- `/projects` - Back to Projects List

## Screenshot
![Project Details Page](screenshots/project-details-page.png)
