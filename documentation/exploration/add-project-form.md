# Add Project Form (Modal)

## Overview
- **Page Name:** Add Project (Modal Dialog)
- **URL:** Opened from Projects List page (`/projects?isInProgress=true&pageNumber=1&pageSize=25`)
- **Trigger:** Click "Add Project" button on Projects List page
- **Purpose:** Modal dialog form for creating a new project. Contains required and optional fields for project metadata.

## Modal Structure

### Header
| Element | Description | Selector |
|---------|-------------|----------|
| Modal Title | "Add Project" (h5 heading) | `h5` with text "Add Project" |
| Close Button (X) | Closes the modal without saving | `button` with text "×" or role close within modal header |

### Form Fields

| Field | Type | Required | Placeholder/Description | Selector |
|-------|------|----------|------------------------|----------|
| Project Number | Text input | Yes (*) | "Project Number" | `input[placeholder="Project Number"]` / textbox "Project Number*" |
| Project Name | Text input | Yes (*) | "Project Name" | `input[placeholder="Project Name"]` / textbox "Project Name*" |
| MoTI Region | Dropdown (select) | Yes (*) | Region dropdown | Button/dropdown after "MoTI Region*" label |
| Nearest Town | Dropdown (select/autocomplete) | No | Town dropdown | Button/dropdown after "Nearest Town" label |
| RC Number | Dropdown (select) | Yes (*) | RC Number dropdown | Button/dropdown after "RC Number*" label |
| Project Manager | Dropdown (select) | No | Project Manager dropdown | Button/dropdown after "Project Manager" label |
| Capital Index | Dropdown (select) | Yes (*) | Capital Index dropdown | Button/dropdown after "Capital Index*" label |
| Project Description | Text input/textarea | No | Free text | textbox "Project Description" |
| Project Scope | Text input/textarea | No | Free text | textbox "Project Scope" |
| Project Closed | Checkbox | No | Toggle closed status | checkbox "Project Closed" |

**Required fields (marked with *):** Project Number, Project Name, MoTI Region, RC Number, Capital Index

### Footer/Actions
| Element | Description | Selector | State |
|---------|-------------|----------|-------|
| Submit Button | Saves the new project | `button` with text "Submit" | Disabled until required fields filled |
| Cancel Button | Closes modal without saving | `button` with text "Cancel" | Always enabled |

## Form Validation
- Submit button is **disabled** by default until all required fields are filled
- Required fields are indicated with asterisk (*) in labels
- Fields with info tooltips (img icons): Project Number, Project Name, Nearest Town, RC Number, Project Manager, Capital Index, Project Description, Project Scope, Project Closed

## Screenshot
![Add Project Form](screenshots/add-project-form.png)
