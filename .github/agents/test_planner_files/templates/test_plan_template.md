# Test Plan: TP-{US-id} — {Story Title}

**Source Story**: [US-{id}-{slug}](../user_stories/US-{id}-{slug}.md)
**Feature Area**: {e.g., Project Management}
**Last Updated**: {YYYY-MM-DD}

> **Purpose of this document**
> This is a **high-level test plan**. It defines *what* must be tested and *why*.
> Step-by-step procedures, test data, locators, and Gherkin scenarios are produced
> by the downstream **Test Case Creator** agent using this plan as input.

## 1. Scope
- **In Scope**: Business capabilities, flows, and behaviours covered by this plan.
- **Out of Scope**: Explicit exclusions (with brief reason).

## 2. Acceptance Criteria (extracted from User Story)
| AC ID | Criterion |
|-------|-----------|
| AC-1  | … |
| AC-2  | … |

## 3. Test Strategy
- **Test Levels**: Which of E2E / API / Unit apply, and why.
- **Personas Under Test**: e.g., System Admin, Project Manager, Read-Only User.
- **Environment**: e.g., Staging, QA.
- **Test Data Strategy**: High-level note only (e.g., "uses baseline project fixture"). Concrete data values are defined in test cases.
- **Entry Criteria**: Conditions that must be met before testing begins.
- **Exit Criteria**: Conditions that signal testing is complete.

## 4. Test Scenarios (high-level intent only)
One-line intent per scenario. **Do not** include steps, selectors, or data values here.

| Scenario ID     | Intent                                              | Type        | Priority | Persona         | Level | Automation Candidate |
|-----------------|-----------------------------------------------------|-------------|----------|-----------------|-------|----------------------|
| TS-{US-id}-01   | Verify [happy path intent]                          | Functional  | High     | Project Manager | E2E   | Yes                  |
| TS-{US-id}-02   | Reject [invalid input intent]                       | Negative    | Medium   | Project Manager | E2E   | Yes                  |
| TS-{US-id}-03   | Verify [permission boundary intent]                 | Permission  | High     | Read-Only User  | E2E   | Yes                  |
| TS-{US-id}-04   | Verify [side effect — audit / notification / etc.] | Integration | Medium   | System          | API   | Yes                  |
| TS-{US-id}-05   | Visual / accessibility / exploratory check          | Visual      | Low      | Any             | E2E   | No (manual)          |

**Type values**: Functional, Negative, Edge Case, Permission, Validation, Integration, Visual, Accessibility, Performance.

## 5. Coverage Matrix
Every Acceptance Criterion must map to at least one scenario.

| AC ID | Covered By                   |
|-------|------------------------------|
| AC-1  | TS-{US-id}-01, TS-{US-id}-03 |
| AC-2  | TS-{US-id}-02                |

## 6. Risks and Assumptions
- **Risk**: [Description] — **Mitigation**: [Action]
- **Assumption**: [Anything assumed because the story was incomplete or ambiguous]
