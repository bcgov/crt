# Edit Project Form

## URL
`https://dev-crt.th.gov.bc.ca/projects/{id}` (click Edit button on project details)

## Purpose
Allows editing of project metadata including region, capital index, RC number, nearest town, and project name/description.

## Key Elements

| Element | Type | Selector | Notes |
|---------|------|----------|-------|
| Project Name | Text Input | `input[name="projectName"]` | Required |
| Description | Textarea | `textarea[name="description"]` | Optional |
| MoTI Region | Dropdown | `.dropdown button` (first in form) | See options below |
| Capital Index | Dropdown | `.dropdown button` (second in form) | See options below |
| RC Number | Dropdown | `.dropdown button` (third in form) | See options below |
| Nearest Town | Text Input | `input[name="nearestTownLkupId"]` or dropdown | Town lookup |
| End Date | Date Input | `input[name="endDate"]` | YYYY-MM-DD format |
| Save | Button | `button:has-text("Save")` | Submits form |
| Cancel | Button | `button:has-text("Cancel")` | Closes modal |

## Dropdown Options

### MoTI Region
- "" (empty)
- "0-Headquarters"
- "1-South Coast"
- "2-Southern Interior"
- "3-Northern"

### Capital Index
- "" (empty)
- "10-Capitalizable-All components>40yrs"
- "9-Capitalizable-Average components>40yrs overall"
- "8-Capitalizable-Some components<40 yrs, but all>15yrs"
- "7-Capitalizable-All components>15yrs"
- "6-Capitalizable-Average components>15 yrs overall"
- "5-Capitalizable/Expense-Some components<15yrs"
- "4-Capitalizable/Expense-Terminated/Deferred WIP components>15yrs"
- "3-Expense-All components<15yrs"
- "2-Expense-No additional life: original benefits only"
- "1-Expense-No additional life: repairs only to realize portion of original benefits"
- "0-Expense- Materiality clause not met"

### RC Number
25+ options including:
- "55080-WR Bennett Bridge"
- "55090-Okanagan Lake Bridge"
- "55100-Nelson Bridge"
- "55110-Blue River Bridge"
- "55120-Kicking Horse Canyon"
- "55912-Remote & Rural Community Access"
- (and many more)
