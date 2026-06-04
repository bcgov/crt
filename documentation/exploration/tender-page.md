# Tender Page

## Overview
- **Page Name:** Project Tender
- **URL:** `https://dev-crt.th.gov.bc.ca/projects/{id}/projecttender`
- **Example URL:** `https://dev-crt.th.gov.bc.ca/projects/79/projecttender`
- **Purpose:** Displays project tender details (contractor bids) and quantities/accomplishments tracking. Allows adding new tender records and quantity records.

## Sub-Navigation Tabs
Same as other project pages: Details, Financial Plan, Tender, Segment, Close.

## Project Header
| Element | Description | Selector |
|---------|-------------|----------|
| Project Title | Shows "999-Another test project" | `h1` with project name text |

## Project Tender Details Section

### Header
| Element | Description | Selector |
|---------|-------------|----------|
| Section Title | "Project Tender Details" | Text within heading |
| + Add Button | Opens form to add a new tender record | `button` with text "+ Add" (first one on page) |

### Tender Table
| Column | Description |
|--------|-------------|
| Tender # | Tender number identifier |
| Planned Date | Planned tender date |
| Actual Date | Actual tender date |
| Ministry Estimate | Ministry's cost estimate |
| Winning Contractor | Name of winning contractor |
| Winning Bid | Dollar amount of winning bid |
| %Min.Est. | Percentage of ministry estimate |
| Comment | Free text comment |
| Actions | (action buttons column) |

**Note:** The tender table body is currently empty for this project.

## Quantities/Accomplishments Section

### Header
| Element | Description | Selector |
|---------|-------------|----------|
| Section Title | "Quantities/Accomplishments" | Text within heading |
| Show All Qty/Accmp Button | Toggle showing all quantities/accomplishments | `button` with text "Show All Qty/Accmp" |
| Show All Fiscal Years Button | Toggle showing all fiscal years | `button` with text "Show All Fiscal Years" |
| + Add Button | Opens form to add a new quantity record | `button` with text "+ Add" (second one on page) |

### Quantities Table
| Column | Description |
|--------|-------------|
| Fiscal Year | e.g., "2022/2023" |
| Accomplishment/Quantity | Type of accomplishment or quantity |
| Forecast | Forecast value |
| Schedule7 | Schedule 7 value |
| Actual | Actual value |
| Comment | Free text comment |
| Actions | (action buttons column) |

**Note:** The quantities table body is currently empty for this project.

## Navigation Paths From This Page
- `/projects/{id}` - Back to Details
- `/projects/{id}/projectplan` - Financial Plan
- `/projects/{id}/segments` - Segment
- `/projects` - Back to Projects List

## Screenshot
![Tender Page](screenshots/tender-page.png)
