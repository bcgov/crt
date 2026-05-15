# CRT v1.0.0 Test Plan

This folder contains the test plan for the Capital and Rehabilitation Tracking (CRT) application v1.0.0, split into focused sections for easy reference by AI agents and human testers.

## For AI Agents — Start Here

If you are an AI agent generating test cases (Playwright, manual scripts, Cucumber, etc.) from this test plan:

1. **Read [00-conventions-glossary.md](00-conventions-glossary.md) first.** It defines the ID scheme, glossary, personas, priorities, types, global preconditions, and test-data placeholders that every other file relies on.
2. **One row in a scenario table = one test case.** The `ID` column (`TS-AREA-NN`) is the canonical name to reuse as a test tag/title.
3. **Quoted strings in `Expected Result` are exact UI text** — assert verbatim. Unquoted expectations are behavioral.
4. **Do not invent test data.** Use the `{{PLACEHOLDER}}` tokens defined in §0.7 of the conventions file.
5. **Preserve the Jira ID** (`CRPDB-xxx`) shown in each section header as test metadata for traceability.
6. **Do not collapse multi-assertion rows.** If a row lists several expectations, generate matching assertions for each.

## Reading Order

| # | File | Description |
|---|------|-------------|
| 0 | [00-conventions-glossary.md](00-conventions-glossary.md) | **Read first** — conventions, glossary, personas, priorities/types, global preconditions, test data placeholders |
| 1 | [01-introduction-scope-strategy.md](01-introduction-scope-strategy.md) | Introduction, scope (in/out), test strategy, environments, personas |
| 2 | [02-authentication.md](02-authentication.md) | KeyCloak/IDIR login scenarios |
| 3 | [03-user-management.md](03-user-management.md) | Roles & permissions, user CRUD, re-enablement, BVT |
| 4 | [04-project-search-details.md](04-project-search-details.md) | Project home screen search, project details, navigation |
| 5 | [05-financial-planning.md](05-financial-planning.md) | Financial planning targets, quantities/accomplishments, tender details |
| 6 | [06-spatial-segments-ratios.md](06-spatial-segments-ratios.md) | Location segments, project ratios, determine using segments |
| 7 | [07-data-maintenance.md](07-data-maintenance.md) | Element management, code tables, PM management, clone/duplicate rows |
| 8 | [08-ui-enhancements.md](08-ui-enhancements.md) | Comments (add/edit/delete), Sprint 6 feedback, UI fixes |
| 9 | [09-bvt-smoke-tests.md](09-bvt-smoke-tests.md) | All BVT/UAT end-to-end smoke tests |
| 10 | [10-risks-traceability.md](10-risks-traceability.md) | Risks & mitigation, traceability matrix |

## Scenario Table Schema

Every scenario table in files 02–09 uses this fixed schema:

| Column | Meaning |
|---|---|
| `ID` | `TS-<AREA>-<NN>` — unique within the area; reuse as the generated test name |
| `Test Scenario` | Short imperative title of what is being verified |
| `Steps` | Ordered actions (numbered, separated by `<br>`); follow exactly unless the row is a higher-level E2E |
| `Expected Result` | Observable outcome; quoted strings are verbatim UI text |
| `Priority` | `High` / `Medium` / `Low` — see §0.5 of the conventions file |
| `Type` | `Functional` / `Negative` / `Edge Case` / `Security` / `E2E` — see §0.5 |

## Source

Reverse-engineered from Jira/Zephyr export: `documentation/jira_test_cases/Jira migrations - Test case export-XML.xml` (24 test cases, project CRPDB).

Cross-referenced against: `documentation/confluence_pages/user-support/end-user-guide/`

## Original Test Period

January 2021 – May 2021 (Sprints 2–10)
