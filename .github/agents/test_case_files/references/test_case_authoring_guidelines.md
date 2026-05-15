# Test Case Authoring Guidelines

## Purpose of a Test Case
A test case is the **executable detail** that sits between a high-level Test Plan
scenario and an automated Playwright test. It must be:

1. **Unambiguous to a human tester** — they can run it without asking questions.
2. **Structured for a Playwright agent** — it can be translated into code
   without re-interpreting business intent.

A good test case reads like a precise recipe; it doesn't argue about *whether*
the test should exist (the plan already decided that).

## One Plan Scenario → How Many Test Cases?
- **Default: one-to-one**. Each `TS-{US-id}-{nn}` scenario maps to one `TC-{TS-id}-{nn}` file.
- **Split into multiple cases** when:
  - Boundary values warrant independent assertion (e.g., min, max, max+1).
  - Persona/role variants need different preconditions (different login).
  - Setup or cleanup differs materially.
- **Combine into one data-driven case** when:
  - The flow is identical and only inputs/outputs vary.
  - Use the **Examples** table; downstream agents convert it to `test.each`.

When you split, append a suffix: `TC-{TS-id}-{nn}-a`, `-b`, etc. Never reuse an
ID for a different intent.

## Step Style: Gherkin with Role-Based Locators
- Use fenced ` ```gherkin ` blocks. This is the format Playwright agents handle
  most reliably.
- One action per line. Use `Given` / `When` / `Then` / `And` / `But`.
- Refer to elements by **role + accessible name**, not by CSS/XPath/ID.
- Phrase actions consistently:
  - `I click the button "Save"`
  - `I fill the textbox "Project Name" with "CRT-AUTO-001"`
  - `I select "South Coast" from the combobox "Region"`
  - `I check the checkbox "I agree"`
  - `I see the heading "Projects"`
  - `the row containing "CRT-AUTO-001" appears in the table "Projects"`
- Phrase assertions as **observable outcomes**: a user (or a Playwright locator)
  can directly verify them. Avoid internal-state language ("the model is updated").

## Preconditions and Hermeticity
A test case must be runnable on its own. Always document:
- **Authentication**: which persona, which login mechanism.
- **Data**: required fixtures, seed records, or "clean DB" assumption.
- **Feature flags / config**: anything that toggles the behaviour.
- **Starting state**: URL, viewport, locale if relevant.

If the test creates data, it must clean it up (or document why cleanup is
intentionally skipped — e.g., handled by a global teardown).

## Test Data Discipline
- **Concrete values only.** No `<projectName>` placeholders in the steps.
- Use a recognizable prefix (`CRT-AUTO-`) so seeded data is easy to spot and
  clean up.
- Keep data minimal — only what the assertion actually requires.
- For invalid-input cases, choose values that violate exactly one rule so the
  failure mode is unambiguous.

## Tagging Convention
Tags drive Playwright `--grep` filtering. Use these consistently:
- **Suite**: `@smoke`, `@regression`, `@nightly`
- **Feature area**: `@projects`, `@reports`, `@admin`, `@auth`
- **Persona**: `@persona-admin`, `@persona-pm`, `@persona-readonly`
- **Risk**: `@critical`, `@flaky` (when known)

Every test case must have at least one suite tag and one feature-area tag.

## Traceability (do not break the chain)
Front-matter must always carry:
- `source_plan` — the parent `TP-...`
- `source_scenario` — the parent `TS-...`
- `covers_ac` — list of AC IDs from the User Story

If you discover behaviour that has no parent scenario, **stop and raise it back
to the test planner**. Don't silently invent coverage.

## What NOT to Put in a Test Case
- Playwright code or imports (that's the next agent's job).
- CSS, XPath, or `data-testid` selectors (use role + accessible name).
- Multiple unrelated assertions (split into multiple cases instead).
- Vague expected results ("works correctly", "looks right").
- Discussion of *whether* to test something (decide that in the plan).

## Self-Review Checklist
Before saving a test case, confirm:
- [ ] Front-matter `id`, `source_plan`, `source_scenario`, `covers_ac` are present and accurate.
- [ ] Every step uses role + accessible name phrasing.
- [ ] Every assertion is observable.
- [ ] Test data is concrete and minimal.
- [ ] Preconditions and cleanup are sufficient for hermetic execution.
- [ ] Tags include at least one suite and one feature-area tag.
- [ ] No CSS/XPath/`data-testid` leaked into steps.
- [ ] Persona is stated.
