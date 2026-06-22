# 0. Conventions, Glossary & Reference Data

> **Audience**: This file is the canonical reference for AI agents and human testers consuming this test plan. Read this file first before generating or executing test cases. Every test scenario in the chapter files implicitly relies on the definitions, personas, preconditions, and test data declared here.

---

## 0.1 How AI Agents Should Use This Test Plan

When generating test cases (e.g., Playwright, Cucumber, manual scripts) from these files:

1. **One test scenario row = one test case.** The `ID` (e.g., `TS-AUTH-01`) is the canonical identifier. Reuse it as the test case name/tag.
2. **Resolve abbreviations and roles** using §0.3 (Glossary) and §0.4 (Personas & Roles).
3. **Apply preconditions in this order**:
   a. Global preconditions (§0.6).
   b. File-level preconditions (top of each chapter file, where present).
   c. Steps listed in the row.
4. **Use placeholder test data** from §0.7 unless the scenario explicitly specifies a value. Do not invent usernames, IDs, or email addresses; use the placeholders so generated tests stay environment-agnostic.
5. **Treat `Type` and `Priority`** per §0.5. Negative and Edge Case rows assert failure or boundary behavior; do not silently convert them into happy-path assertions.
6. **Quoted strings in `Expected Result`** (e.g., `"Are you sure?"`) are exact UI text and must be asserted verbatim. Unquoted expectations are behavioral and can be asserted by state, attribute, or role.
7. **Cross-reference traceability** via the risks/traceability chapter — every issue/story ID maps to a feature area. Preserve the ID in generated test metadata.
8. **Do not merge multi-step rows** into a single assertion. If a row lists multiple checks, produce one test per assertion or one test with multiple ordered assertions, but never drop assertions.

---

## 0.2 Test Case ID Scheme

All scenario IDs follow `TS-<AREA>-<NN>`:

| Prefix | Area | File |
|---|---|---|
| `TS-{AREA1}` | {Area 1 description} | {chapter file number} |
| `TS-{AREA2}` | {Area 2 description} | {chapter file number} |

> Replace each row with the area codes and chapter file numbers defined for this project. Add one row per functional area. `NN` is a zero-padded sequential number, unique within an area.

---

## 0.3 Glossary

| Term | Definition |
|---|---|
| **{Term}** | {Definition} |

> Add one row per project-specific term, acronym, or abbreviation. Include application name, identity provider, key domain concepts, and environment abbreviations.

---

## 0.4 Personas, Roles & Permissions

### 0.4.1 Personas → Roles

| Persona | Concrete Role(s) | Capabilities |
|---|---|---|
| **{Persona name}** | `{ROLE_NAME}` | {What this persona can do} |

> Define every persona used in test scenarios. Include a "default" note for any persona that is unqualified in scenario rows (e.g., "When a scenario says 'User' without qualification, assume role X").

### 0.4.2 Canonical Permission Catalog

These are the permissions defined in {Application Name}. A role is a named bundle of zero or more of these.

| Permission | Grants |
|---|---|
| `{Permission Name}` | {What it allows} |

### 0.4.3 Per-Screen Permission Requirements

| Screen / Action | Required permissions |
|---|---|
| {Screen name} (view) | `{Permission}` |
| {Screen name} (create/edit) | `{Permission}` + `{Permission}` |

---

## 0.5 Priority & Type Conventions

**Priority** — execution / failure-impact ordering:

| Priority | Meaning |
|---|---|
| **High** | Must pass for release; blocks shipping; included in regression suite |
| **Medium** | Important; failure logged as a bug but not necessarily blocking |
| **Low** | Cosmetic, help text, sort order, or convenience behavior |

**Type** — what the row asserts:

| Type | Meaning |
|---|---|
| **Functional** | Happy-path behavior matching acceptance criteria |
| **Negative** | System must reject invalid input or unauthorized action; assertion is on the error/refusal |
| **Edge Case** | Boundary, unusual sequence, or concurrent-state behavior |
| **Security** | Authorization boundary — a user without permission must not see/perform the action |
| **E2E** | Multi-screen end-to-end workflow (used in BVT/smoke test chapters) |

---

## 0.6 Global Preconditions

Apply these to every scenario unless the row overrides them.

- The application is deployed to the relevant environment and reachable.
- The identity provider / authentication system is reachable and test accounts exist.
- The database is seeded with required reference data.
- The browser session starts logged out unless a step or persona implies an existing session.
- All times/dates use the application's configured timezone (`{Timezone}`).
- The browser under test is one of the supported browsers (§0.6.2).

### 0.6.1 Environments

| Environment | Purpose | URL | Visual identifier |
|---|---|---|---|
| `{ENV1}` | {Purpose} | `{URL or "(internal)"}` | {colour / banner text} |
| `{ENV2}` | {Purpose} | `{URL or "(internal)"}` | {colour / banner text} |

### 0.6.2 Supported Browsers

| Browser | Status |
|---|---|
| {Browser name} | Primary |
| {Browser name} | Supported |
| {Browser name} | **Not supported** |

---

## 0.7 Test Data Placeholders

Use these placeholders in generated tests; bind them to environment-specific values via test config / fixtures.

| Placeholder | Description | Example shape |
|---|---|---|
| `{{VALID_USER}}` | A valid user with the default test role | `test.user1` |
| `{{VALID_ADMIN}}` | A valid user with the admin role | `test.admin1` |
| `{{INVALID_USER}}` | A syntactically valid but non-existent user | `does.not.exist` |
| `{{PASSWORD_VALID}}` | The matching password (read from secret store; never hard-code) | n/a |
| `{{RECORD_ID_EXISTING}}` | A record ID already present in the test DB | `2021-001` |
| `{{RECORD_ID_NEW}}` | A record ID known not to exist | `TEST-{{timestamp}}` |

> Add project-specific placeholders as needed. Never hard-code credentials or environment-specific IDs in test files — always reference a placeholder.

---

## 0.8 Cross-Cutting UI Conventions

These behaviors apply across the application; do not re-test per screen unless a row explicitly asks.

- **Mandatory field validation** is performed on form Submit/Save; errors render inline beside the field.
- **Confirmation prompts** for destructive actions use the exact text `"{confirmation text}"` with `Cancel` / `{action}` buttons.
- **Unsaved-changes prompts** use the exact text `"{unsaved changes text}"` with `{stay}` / `{leave}` buttons.
- **Active vs Inactive filters** default to `Active` on every search screen (if applicable).

> Replace placeholder text in quotes with the exact strings used by the application under test. Add or remove bullet points to match the application's actual UI patterns.

### 0.8.1 {Any domain-specific rule that applies globally}

> Add subsections for any cross-cutting rules that scenario authors must know — e.g., disable vs delete logic, audit trail requirements, cascading effects of state changes.
