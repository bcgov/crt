# Playwright Locator Hint Vocabulary

This vocabulary is the contract between the **Test Case Creator** agent and the
downstream **Playwright** agent. Phrasing test-case steps with this vocabulary
lets the Playwright agent translate them mechanically into Playwright's
role-based locator API without guessing.

## Why Role-Based Locators?
- Resilient to markup churn (CSS classes, IDs, DOM structure can change).
- Mirror how a real user (and accessibility tools) perceive the UI.
- Encourage accessible markup as a side-effect.
- Map 1:1 to Playwright's recommended API (`getByRole`, `getByLabel`, etc.).

## Vocabulary Mapping

| Test-case phrasing                                  | Playwright translation                                                  |
|-----------------------------------------------------|-------------------------------------------------------------------------|
| `button "Save"`                                     | `page.getByRole('button', { name: 'Save' })`                            |
| `link "Projects"`                                   | `page.getByRole('link', { name: 'Projects' })`                          |
| `heading "Project Details"`                         | `page.getByRole('heading', { name: 'Project Details' })`                |
| `textbox "Project Name"`                            | `page.getByRole('textbox', { name: 'Project Name' })`                   |
| `combobox "Region"`                                 | `page.getByRole('combobox', { name: 'Region' })`                        |
| `checkbox "I agree"`                                | `page.getByRole('checkbox', { name: 'I agree' })`                       |
| `radio "Yes"`                                       | `page.getByRole('radio', { name: 'Yes' })`                              |
| `tab "Backlog"`                                     | `page.getByRole('tab', { name: 'Backlog' })`                            |
| `dialog "Confirm Delete"`                           | `page.getByRole('dialog', { name: 'Confirm Delete' })`                  |
| `alert "Project created"`                           | `page.getByRole('alert').filter({ hasText: 'Project created' })`        |
| `row containing "CRT-AUTO-001"`                     | `page.getByRole('row', { name: /CRT-AUTO-001/ })`                       |
| `cell "Active"` in `row containing "CRT-AUTO-001"`  | `page.getByRole('row', { name: /CRT-AUTO-001/ }).getByRole('cell', { name: 'Active' })` |
| `field labeled "Start Date"`                        | `page.getByLabel('Start Date')`                                         |
| `text "No projects found"`                          | `page.getByText('No projects found')`                                   |
| `image "Company Logo"`                              | `page.getByRole('img', { name: 'Company Logo' })`                       |

## Action Verb Mapping

| Test-case verb                                | Playwright action                                       |
|-----------------------------------------------|---------------------------------------------------------|
| `click the {locator}`                         | `.click()`                                              |
| `double-click the {locator}`                  | `.dblclick()`                                           |
| `fill the {locator} with "X"`                 | `.fill('X')`                                            |
| `type "X" into the {locator}`                 | `.pressSequentially('X')` (when input events matter)    |
| `select "X" from the combobox "Y"`            | `.selectOption({ label: 'X' })` or option click pattern |
| `check the checkbox "X"`                      | `.check()`                                              |
| `uncheck the checkbox "X"`                    | `.uncheck()`                                            |
| `hover over the {locator}`                    | `.hover()`                                              |
| `press "Enter"`                               | `page.keyboard.press('Enter')`                          |
| `upload file "path/to/file.csv" to {locator}` | `.setInputFiles('path/to/file.csv')`                    |

## Assertion Verb Mapping

| Test-case assertion                                     | Playwright assertion                                       |
|---------------------------------------------------------|------------------------------------------------------------|
| `I see the {locator}`                                   | `await expect(locator).toBeVisible()`                      |
| `I do not see the {locator}`                            | `await expect(locator).toBeHidden()`                       |
| `the {locator} is enabled`                              | `await expect(locator).toBeEnabled()`                      |
| `the {locator} is disabled`                             | `await expect(locator).toBeDisabled()`                     |
| `the textbox "X" contains "Y"`                          | `await expect(locator).toHaveValue('Y')`                   |
| `the {locator} has text "X"`                            | `await expect(locator).toHaveText('X')`                    |
| `the row containing "X" appears in the table "Y"`      | `await expect(table.getByRole('row', { name: /X/ })).toBeVisible()` |
| `the URL is "/projects/123"`                            | `await expect(page).toHaveURL(/\/projects\/123/)`          |
| `{n} rows are visible in the table "Y"`                 | `await expect(table.getByRole('row')).toHaveCount(n + 1)`  |

## Disambiguating Duplicates
When multiple elements share the same role + name (e.g., two `Save` buttons),
the test case should add a scoping qualifier:

- `button "Save" inside the dialog "Edit Project"`
  → `page.getByRole('dialog', { name: 'Edit Project' }).getByRole('button', { name: 'Save' })`
- `the first row in the table "Projects"`
  → `page.getByRole('table', { name: 'Projects' }).getByRole('row').nth(1)` (skipping header)

## When Role-Based Locators Aren't Enough
Some elements aren't reliably exposed by role (custom widgets, canvases,
non-semantic divs). The fallback order is:

1. `field labeled "X"` → `getByLabel`
2. `text "X"` → `getByText`
3. `placeholder "X"` → `getByPlaceholder`
4. `test id "X"` → `getByTestId` — **last resort**, and only when the
   application provides stable `data-testid` attributes. Flag this in the
   test case's **Notes for the Playwright Agent** section so the team knows
   the markup needs accessibility improvements.

## Forbidden in Test Cases
- Raw CSS selectors (`.btn-primary`, `#save-btn`)
- XPath expressions
- Direct DOM queries (`querySelector`)
- `nth-child` / structural selectors
- `page.locator('css=...')` syntax

If you're tempted to use any of these, the underlying issue is missing
accessible markup — raise it rather than working around it.
