---
id: TC-{TS-id}-{nn}
title: {Concise, action-oriented title}
source_plan: TP-{US-id}-{slug}
source_scenario: TS-{US-id}-{nn}
covers_ac: [AC-1, AC-2]
persona: Project Manager
priority: High
type: Functional            # Functional | Negative | Edge Case | Permission | Validation | Integration | Visual | Accessibility | Performance
level: E2E                   # E2E | API | Unit
automation_candidate: Yes    # Yes | Partial | No
tags: ["@smoke", "@regression", "@projects", "@persona-pm"]
last_updated: {YYYY-MM-DD}
---

# TC-{TS-id}-{nn} — {Title}

> **Purpose of this document**
> This is a **detailed test case**. It is human-executable and structured for
> downstream Playwright agents to convert into automated tests. Steps use
> Gherkin with role + accessible name locator hints — never CSS or XPath.

## 1. Context
Brief plain-language summary of what this test verifies and why it matters.
Reference the parent **Test Plan** scenario and the Acceptance Criteria it
covers (already in front-matter — restate here in prose for human reviewers).

## 2. Preconditions
Everything that must be true before the first step runs. Be explicit enough
that the test is hermetic.

- **User**: Authenticated as `Project Manager` (IDIR stub user `crt-pm-01`).
- **Data**: Baseline projects fixture loaded (`fixtures/projects-baseline.sql`).
- **Feature Flags**: `enableProjectCreation = true`.
- **Starting URL**: `${BASE_URL}/projects`.
- **Other**: e.g., browser viewport 1280x800, English locale.

## 3. Test Data
Concrete values used by the test. If the only variation between cases is
data, use the **Examples** section below instead of fanning out into
multiple files.

| Field         | Value                |
|---------------|----------------------|
| Project Name  | `CRT-AUTO-001`       |
| Region        | `South Coast`        |
| Description   | `Automated test seed`|

## 4. Steps (Gherkin)

```gherkin
Given I am on the "Projects" page
When  I click the button "Create Project"
And   I fill the textbox "Project Name" with "CRT-AUTO-001"
And   I select "South Coast" from the combobox "Region"
And   I fill the textbox "Description" with "Automated test seed"
And   I click the button "Save"
Then  I see the alert "Project created"
And   the row containing "CRT-AUTO-001" appears in the table "Projects"
```

**Locator phrasing rules** (mirrored in `playwright_locator_hints.md`):
- `button "Save"` → `page.getByRole('button', { name: 'Save' })`
- `textbox "Project Name"` → `page.getByRole('textbox', { name: 'Project Name' })`
- `combobox "Region"` → `page.getByRole('combobox', { name: 'Region' })`
- `row containing "X"` → `page.getByRole('row', { name: /X/ })`
- `alert "..."` / `toast "..."` → `page.getByRole('alert')` filtered by name
- Use `link "..."`, `heading "..."`, `checkbox "..."`, `radio "..."` similarly.

## 5. Expected Results
Restate the observable outcomes for human reviewers. Each item here should
correspond to a `Then`/`And` line above and be independently verifiable.

- A success alert/toast with text `Project created` is visible.
- A new row with project name `CRT-AUTO-001` appears in the Projects table.
- Navigating away and back still shows the new row (persistence verified).

## 6. Postconditions / Cleanup
- Delete project `CRT-AUTO-001` via API: `DELETE /api/projects?name=CRT-AUTO-001`.
- Reset any feature flags toggled during setup.

## 7. Examples (optional, for data-driven variants)
Use this section when the test logic is identical and only inputs/outputs
differ. Downstream agents will translate this into `test.each(...)`.

| Example | Project Name        | Region        | Expected Outcome              |
|---------|---------------------|---------------|-------------------------------|
| 1       | `CRT-AUTO-001`      | `South Coast` | Created successfully          |
| 2       | `` (empty)          | `South Coast` | Validation: "Name is required"|
| 3       | `A` × 101           | `South Coast` | Validation: "Max 100 chars"   |

## 8. Notes for the Playwright Agent (optional)
Free-form hints that don't fit elsewhere:
- Suggested fixture: `authedAsProjectManager`.
- Network calls to wait for: `POST /api/projects` returning 201.
- Known flake risk: toast auto-dismisses in 5s — assert before navigation.
