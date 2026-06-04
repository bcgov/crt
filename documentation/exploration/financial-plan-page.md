# Financial Plan Page

## Overview
- **Page Name:** Financial Plan (Project Plan)
- **URL:** `https://dev-crt.th.gov.bc.ca/projects/{id}/projectplan`
- **Example URL:** `https://dev-crt.th.gov.bc.ca/projects/79/projectplan`
- **Purpose:** Displays financial planning targets for a project and public project information. Allows adding, editing, cloning, and deleting financial records.

## Sub-Navigation Tabs
Same as Project Details page: Details, Financial Plan, Tender, Segment, Close.

## Project Header
| Element | Description | Selector |
|---------|-------------|----------|
| Project Title | Shows "999-Another test project" (project number + name) | `h1` with project name text |

## Financial Planning Targets Section

### Header
| Element | Description | Selector |
|---------|-------------|----------|
| Section Title | "Financial Planning Targets" | Text within heading |
| Show All Fiscal Years Button | Toggles showing all fiscal years | `button` with text "Show All Fiscal Years" |
| + Add Button | Opens form to add a new financial target | `button` with text "+ Add" |

### Financial Targets Table
| Column | Description |
|--------|-------------|
| Fiscal Year | e.g., "2022/2023" |
| Project Phase | e.g., "P-Plan" |
| Element | e.g., "Sp" |
| Funding Type | e.g., "Allocation" |
| Amount | Dollar amount, e.g., "$100,000" |
| Description | Free text description |
| Actions | Edit, Clone, Delete buttons per row |

### Row Actions
| Element | Description | Selector |
|---------|-------------|----------|
| Edit Record | Edit the financial target | `button` with text "Edit Record" (pencil icon) |
| Clone Record | Duplicate the financial target | `button` with text "Clone Record" (copy icon) |
| Delete Record | Delete the financial target | `button` with text "Delete Record" (trash icon) |

### Total
| Element | Description | Selector |
|---------|-------------|----------|
| Total Project Funding | Sum of all amounts | `strong` with text "Total Project Funding" followed by amount |

## Public Project Information Section

### Header
| Element | Description | Selector |
|---------|-------------|----------|
| Section Title | "Public Project Information" | Text within heading |
| Edit Button | Edit public project information | `button` with text "Edit Public Project Information" (pencil icon) |

### Fields (Read-Only)
| Field | Description | Example Value |
|-------|-------------|---------------|
| Announcement Value | Dollar value for announcement | "$100,000" |
| C-035 Value | C-035 value (has tooltip) | (empty in example) |
| Estimated Value | Estimated project value (has tooltip) | (empty in example) |
| Announcement Comment | Comment text | "no comment" |

**Note:** Fields with `img` icons next to labels have info tooltips.

## Navigation Paths From This Page
- `/projects/{id}` - Back to Details
- `/projects/{id}/projecttender` - Tender
- `/projects/{id}/segments` - Segment
- `/projects` - Back to Projects List

## Screenshot
![Financial Plan Page](screenshots/financial-plan-page.png)
