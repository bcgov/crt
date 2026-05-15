# Test Strategy Guidelines

## Scope of a Test Plan
A test plan is a **high-level document**. It enumerates *what* will be tested and
*why*. It is **not** the place for step-by-step procedures, selectors, or
concrete test data — those belong in the Test Cases produced downstream.

> **Rule of thumb**: A scenario is one *intent*, not one *click path*.
> If you find yourself writing "click X, then type Y", you've gone too deep —
> collapse it back to a single line of intent.

## Principles of Effective Planning
1. **Cover the User Story**: Every Acceptance Criterion must map to at least one scenario in the Coverage Matrix.
2. **Think Negative**: Don't just plan for success. Plan for invalid input, missing data, network failure, concurrent edits, expired sessions.
3. **Boundary Value Analysis**: Plan scenarios at the edges of numerical ranges, string limits, date ranges, and collection sizes.
4. **Permission Boundaries**: For every persona that interacts with a feature, plan at least one scenario verifying both *allowed* and *denied* behaviour.
5. **Integration Side-Effects**: Plan for audit logs, notifications, downstream data writes, and any cross-feature consequences.

## Splitting Scenarios
Prefer **many small, single-intent scenarios** over a few broad ones. This makes
downstream parameterization easier (the test case agent can fold related
scenarios into a data-driven test if appropriate).

- **Good**: `TS-...-03 Read-Only user cannot see "Create" button` + `TS-...-04 Project Manager can see "Create" button`
- **Bad**: `TS-...-03 Verify create-button visibility for all roles`

## How to Prioritize
- **High / Must Have**: Critical user flows. If this breaks, the user cannot do their job. Permission denials that protect data.
- **Medium / Should Have**: Important features, error handling that prevents crashes or data loss, integration side-effects.
- **Low / Nice to Have**: Visual polish, minor edge cases, rarely exercised paths.

## Automation Candidacy
Mark `Automation Candidate` honestly:
- **Yes**: Deterministic, repeatable behaviour observable through UI or API. Default for functional/negative/permission scenarios.
- **Partial**: Setup or teardown requires manual steps; automation covers the core assertion only.
- **No**: Visual polish, exploratory, accessibility audit (manual review), subjective UX. Always include a brief reason.

## Writing High-Level Scenario Intents
A scenario intent should answer: *what condition is being verified, and for whom?*

- **Clear**: `Verify Project Manager receives validation error when project name exceeds 100 characters`
- **Too vague**: `Test project name field`
- **Too detailed**: `Enter 101 'a' characters in project-name input, click Save, observe red error text`

## Stable IDs and Traceability
- **AC IDs** (`AC-1`, `AC-2`...) are extracted once and never renumbered.
- **Scenario IDs** (`TS-{US-id}-{nn}`) are stable for the life of the plan.
- Downstream test cases will be filed as `TC-{TS-id}-{nn}` — preserving ID stability is what makes the whole pipeline traceable.

## What NOT to Include in a Test Plan
- Step-by-step instructions (Given/When/Then, click sequences)
- CSS / XPath selectors or accessibility locator strings
- Concrete test data values (`projectName: "ABC-123"`)
- Playwright code or fixture names
- Assertions phrased as code

All of the above are the responsibility of the **Test Case Creator** agent, which
combines this plan with app exploration and supporting docs to produce
executable detail.
