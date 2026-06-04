# Segment Page

## Overview
- **Page Name:** Project Segments & Ratios
- **URL:** `https://dev-crt.th.gov.bc.ca/projects/{id}/segments`
- **Example URL:** `https://dev-crt.th.gov.bc.ca/projects/79/segments`
- **Purpose:** Manages project segments (geographic locations defined by start/end coordinates) and project ratios across multiple geographic categories (Electoral Districts, Highways, Service Areas, Districts, Economic Regions).

## Sub-Navigation Tabs
Same as other project pages: Details, Financial Plan, Tender, Segment, Close.

## Project Header
| Element | Description | Selector |
|---------|-------------|----------|
| Project Title | Shows "999-Another test project" | `h1` with project name text |

## Project Segments Section

### Header
| Element | Description | Selector |
|---------|-------------|----------|
| Section Title | "Project Segments" | Text within heading |
| + Add Segment / View Map Button | Opens map to add/view segments | `button` with text "+ Add Segment / View Map" |

### Segments Table
| Column | Description | Example |
|--------|-------------|---------|
| Segment start coordinates | Latitude,Longitude of start point | "48.816870,-123.718150" |
| Segment end coordinates | Latitude,Longitude of end point | "48.769420,-123.698870" |
| Description | Segment description | "Duncan bypass improvements boys rd to hwy 18" |
| Actions | Edit/Delete buttons | Edit Record, Delete Record |

### Row Actions
| Element | Description | Selector |
|---------|-------------|----------|
| Edit Record | Edit the segment | `button` with text "Edit Record" |
| Delete Record | Delete the segment | `button` with text "Delete Record" |

## Project Ratios Section

### Header
| Element | Description | Selector |
|---------|-------------|----------|
| Section Title | "Project Ratios" | Text within heading |
| Determine Ratios Using Segments Button | Auto-calculate ratios from segments | `button` with text "Determine Ratios Using Segments" |

### Electoral Districts Sub-Section
| Element | Description | Selector |
|---------|-------------|----------|
| Section Title | "Electoral Districts" | Heading text |
| + Add Button | Add electoral district ratio | `button` with text "+ Add" within Electoral Districts heading |

| Column | Description | Example |
|--------|-------------|---------|
| Electoral District | District name | "Cowichan Valley" |
| Ratios | Ratio value (decimal or 1) | "1" |
| Actions | Edit/Delete | Edit Record, Delete Record |

### Highways Sub-Section
| Element | Description | Selector |
|---------|-------------|----------|
| Section Title | "Highways" | Heading text |
| + Add Button | Add highway ratio | `button` with text "+ Add" within Highways heading |

| Column | Description | Example |
|--------|-------------|---------|
| Highway | Highway name | "Hwy 1", "Hwy 18" |
| Ratios | Ratio value (decimal, totals ~1.0) | "0.99", "0.01" |
| Actions | Edit/Delete | Edit Record, Delete Record |

### Service Areas Sub-Section
| Element | Description | Selector |
|---------|-------------|----------|
| Section Title | "Service Areas" | Heading text |
| + Add Button | Add service area ratio | `button` with text "+ Add" within Service Areas heading |

| Column | Description | Example |
|--------|-------------|---------|
| Service Area | Service area name | "South Island" |
| Ratios | Ratio value | "1" |
| Actions | Edit/Delete | Edit Record, Delete Record |

### Districts Sub-Section
| Element | Description | Selector |
|---------|-------------|----------|
| Section Title | "Districts" | Heading text |
| + Add Button | Add district ratio | `button` with text "+ Add" within Districts heading |

| Column | Description | Example |
|--------|-------------|---------|
| District | District name | "Vancouver Island" |
| Ratios | Ratio value | "1" |
| Actions | Edit/Delete | Edit Record, Delete Record |

### Economic Regions Sub-Section
| Element | Description | Selector |
|---------|-------------|----------|
| Section Title | "Economic Regions" | Heading text |
| + Add Button | Add economic region ratio | `button` with text "+ Add" within Economic Regions heading |

| Column | Description | Example |
|--------|-------------|---------|
| Economic Region | Economic region name | "Vancouver Island and Coast" |
| Ratios | Ratio value | "1" |
| Actions | Edit/Delete | Edit Record, Delete Record |

## Navigation Paths From This Page
- `/projects/{id}` - Back to Details
- `/projects/{id}/projectplan` - Financial Plan
- `/projects/{id}/projecttender` - Tender
- `/projects` - Back to Projects List

## Screenshot
![Segment Page](screenshots/segment-page.png)
