# 0. Conventions, Glossary & Reference Data

> **Audience**: This file is the canonical reference for AI agents and human testers consuming this test plan. Read this file first before generating or executing test cases. Every test scenario in files 02–09 implicitly relies on the definitions, personas, preconditions, and test data declared here.

---

## 0.1 How AI Agents Should Use This Test Plan

When generating test cases (e.g., Playwright, Cucumber, manual scripts) from these files:

1. **One test scenario row = one test case.** The `ID` (e.g., `TS-AUTH-01`) is the canonical identifier. Reuse it as the test case name/tag.
2. **Resolve abbreviations and roles** using §0.3 (Glossary) and §0.4 (Personas & Roles).
3. **Apply preconditions in this order**:
   a. Global preconditions (§0.6).
   b. File-level preconditions (top of each chapter file, where present).
   c. Steps listed in the row.
4. **Use placeholder test data** from §0.7 unless the scenario explicitly specifies a value. Do not invent IDIR usernames, project numbers, or email addresses; use the placeholders so generated tests stay environment-agnostic.
5. **Treat `Type` and `Priority`** per §0.5. Negative and Edge Case rows assert failure or boundary behavior; do not silently convert them into happy-path assertions.
6. **Quoted strings in `Expected Result`** (e.g., `"Are you sure?"`) are exact UI text and must be asserted verbatim. Unquoted expectations are behavioral and can be asserted by state, attribute, or role.
7. **Cross-reference traceability** via §10 (Risks & Traceability) — every Jira ID (`CRPDB-xxx`) maps to a feature area. Preserve the Jira ID in generated test metadata.
8. **Do not merge multi-step rows** into a single assertion. If a row lists multiple checks (e.g., "default is X; multi-select works"), produce one test per assertion or one test with multiple ordered assertions, but never drop assertions.

---

## 0.2 Test Case ID Scheme

All scenario IDs follow `TS-<AREA>-<NN>`:

| Prefix | Area | File |
|---|---|---|
| `TS-AUTH` | Authentication | 02 |
| `TS-ROLE` | Roles & Permissions | 03 |
| `TS-USER` | User Management | 03 |
| `TS-BVT-USER` | BVT — User Management | 03 |
| `TS-PROJ` | Project Search / Home | 04 |
| `TS-DETAIL` | Project Details | 04 |
| `TS-FIN` | Financial Planning | 05 |
| `TS-QTY` | Quantities & Accomplishments | 05 |
| `TS-TEND` | Tender Details | 05 |
| `TS-SEG` | Location Segments | 06 |
| `TS-RAT` | Project Ratios | 06 |
| `TS-ELEM` | Element Management | 07 |
| `TS-CODE` | Code Tables | 07 |
| `TS-PM` | PM Code Maintenance | 07 |
| `TS-CLONE` | Row Duplication | 07 |
| `TS-COMMENT` | Status & EMR Comments | 08 |
| `TS-UI` | UI Enhancements | 08 |
| `TS-BVT-*` | BVT smoke tests | 09 |

`NN` is a zero-padded sequential number, unique within an area.

---

## 0.3 Glossary

| Term | Definition |
|---|---|
| **CRT / CaRT** | Capital and Rehabilitation Tracking — the application under test. Confluence and some UI text use the spelling **CaRT**; both refer to the same product. |
| **MoTI** | British Columbia Ministry of Transportation and Infrastructure (the application owner) |
| **IDIR** | BC Government identity provider username (`firstname.lastname` style); used for SSO via KeyCloak |
| **KeyCloak** | OIDC identity broker that authenticates IDIR users into CRT |
| **PM** | Project Manager (a CRT role flag on a user; also a dropdown value sourced from a code table) |
| **EMR** | Executive Management Report — a free-text comment field on Project Details |
| **BVT** | Build Verification Test — high-level smoke test run after a UAT deployment |
| **FT** | Functional Test — detailed step-level verification run in TST |
| **DEV / TST / UAT / PRD** | Application environments — see §0.6.1 for URLs and visual identifiers |
| **Qty / Accmp** | Quantity / Accomplishment — two categories of project progress data |
| **Schedule 7** | A contractually defined quantity column; available only for Quantity records, not Accomplishments |
| **C-035** | A specific public-information project value field on the Financial Planning screen |
| **Element** | A code-table-backed value with three parts — Program Category, Program, Service Line — used in financial planning entries |
| **Segment** | A start/end coordinate pair representing a project's spatial extent on a highway/road |
| **Ratio** | The proportion of a project attributable to an administrative boundary (must sum to 1 across a category) |
| **Ratio Type** | One of: `District`, `Electoral District`, `Service Area`, `Highway`, `Economic Region` |
| **Code Table / Code Set** | Admin-maintained dropdown source list (e.g., Accomplishments, Project Manager) |
| **Capital Index** | Required single-select on Project Details |
| **Look-ahead** | A type-ahead / autocomplete dropdown |
| **Region** | A MoTI geographic region: `0-HQ`, `1-South Coast`, `2-Southern Interior`, `3-Northern` |

---

## 0.4 Personas, Roles & Permissions

### 0.4.1 Personas → Roles

| Persona | Concrete Role(s) | Capabilities |
|---|---|---|
| **Application User** | `READ_ONLY`, `MANAGER`, `DISTRICT_ADMIN` (depending on scenario) | Project search, view, create, edit, financial/spatial data entry |
| **Administrator** | `SYSTEM_ADMIN` or `DISTRICT_ADMIN` | All Application User capabilities + Users, Roles & Permissions, Code Tables, Elements |
| **System Administrator** | `SYSTEM_ADMIN` | Only role permitted to assign the `SYSTEM_ADMIN` role; this role is non-disable-able |
| **Project Manager (PM)** | Any role with the `PM` user flag enabled | Appears in PM dropdowns; PM field defaults to this user on Project Search |
| **Code Maintainer** | Any role with `Code Read` + `Code Write` permissions | Add/Edit/Disable/Delete Code Table and Element values |

When a scenario says "Application User" without further qualification, assume `MANAGER` in region `1-South Coast`. When it says "Administrator" without qualification, assume `SYSTEM_ADMIN`.

### 0.4.2 Canonical Permission Catalog

These are the only permissions defined in CRT. A role is a named bundle of zero or more of these.

| Permission | Grants |
|---|---|
| `Code Read` (a.k.a. `Code Table Read`) | View Code Tables and Elements screens |
| `Code Write` (a.k.a. `Code Table Write`) | Add / Edit / Disable / Delete Code Table values and Elements |
| `Project Read` | View project information |
| `Project Write` | Add / Edit project information |
| `Role Read` | View Roles & Permissions screen; required to assign roles when adding/editing a user |
| `Role Write` | Add / Edit / Disable user roles |
| `User Read` | View Users screen |
| `User Write` | Add User, Edit User, Disable User actions (**also requires `Role Read`** to assign roles) |
| `Export Read` | Navigate to Reports & Dashboards |
| `API Access Client` | Create an API client to interact with the application programmatically |

### 0.4.3 Per-Screen Permission Requirements

| Screen / Action | Required permissions |
|---|---|
| Project Search / Details (read) | `Project Read` |
| Project Details (create/edit) | `Project Read` + `Project Write` |
| Users screen (view) | `User Read` |
| Users screen (add/edit/disable) | `User Read` + `User Write` + `Role Read` |
| Roles & Permissions (view) | `Role Read` |
| Roles & Permissions (add/edit/disable) | `Role Read` + `Role Write` |
| Code Tables (view) | `Code Read` |
| Code Tables (add/edit/disable/delete) | `Code Read` + `Code Write` |
| Elements (view) | `Code Read` |
| Elements (add/edit/disable/delete) | `Code Read` + `Code Write` |
| Reports / Dashboards | `Export Read` |

> **Search prerequisite**: A user must have at least the `Read` permission for a section to perform a search on that screen.

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
| **E2E** | Multi-screen end-to-end workflow (used in BVT file 09) |

---

## 0.6 Global Preconditions

Apply these to every scenario unless the row overrides them.

- The CRT application is deployed to the relevant environment (TST for FT, UAT for BVT) and reachable.
- KeyCloak / IDIR is reachable and the configured test IDIR accounts exist.
- The database is seeded with reference data: MoTI regions, default roles (`SYSTEM_ADMIN`, `DISTRICT_ADMIN`, `MANAGER`, `READ_ONLY`), default Code Tables (Accomplishments, Project Manager, Capital Index, Element code sets, Tender Contractor), and at least one project per region.
- The browser session starts logged out unless a step or persona implies an existing session.
- All times/dates use the application's configured timezone (America/Vancouver).
- The browser under test is one of the supported browsers (§0.6.2). Internet Explorer is **not** supported — do not generate IE tests.

### 0.6.1 Environments

| Environment | Purpose | URL | Menu colour (visual identifier) |
|---|---|---|---|
| `DEV` | Development | (internal) | Green |
| `TST` | Functional testing (FT runs here) | (internal) | Yellow |
| `UAT` | Acceptance testing & training (BVT runs here) | `https://uat-crt.th.gov.bc.ca/` | Purple |
| `PRD` | Production | `https://crt.th.gov.bc.ca/` | Blue |

The menu colour is rendered as a horizontal band beneath the logo; agents asserting environment can read this colour as a sanity check.

### 0.6.2 Supported Browsers

| Browser | Status |
|---|---|
| Microsoft Edge | Primary — screenshots and behaviour authored against this |
| Google Chrome | Supported |
| Mozilla Firefox | Supported |
| Internet Explorer | **Not supported** — some features will not work; do not generate IE tests |

---

## 0.7 Test Data Placeholders

Use these placeholders in generated tests; bind them to environment-specific values via test config / fixtures.

| Placeholder | Description | Example shape |
|---|---|---|
| `{{IDIR_VALID_USER}}` | A valid IDIR with `MANAGER` role in region `1-South Coast` | `test.user1` |
| `{{IDIR_VALID_ADMIN}}` | A valid IDIR with `SYSTEM_ADMIN` role | `test.admin1` |
| `{{IDIR_VALID_PM}}` | A valid IDIR with `MANAGER` role and `PM` flag set | `test.pm1` |
| `{{IDIR_VALID_READONLY}}` | A valid IDIR with `READ_ONLY` role | `test.readonly1` |
| `{{IDIR_INVALID}}` | A syntactically valid but non-existent IDIR | `does.not.exist` |
| `{{PASSWORD_VALID}}` | The matching IDIR password (read from secret store; never hard-code) | n/a |
| `{{PROJECT_NUMBER_EXISTING}}` | A project number already present in the test DB | `2021-001` |
| `{{PROJECT_NUMBER_NEW}}` | A project number known not to exist | `TEST-{{timestamp}}` |
| `{{REGION_DEFAULT}}` | Default region for tests | `1-South Coast` |
| `{{FISCAL_YEAR_VALID}}` | A fiscal year inside the supported range (2010/2011 – 2027/2028) | `2024/2025` |
| `{{ELEMENT_VALID}}` | A code value from the active Element code set | `PC01` |
| `{{TENDER_NUMBER_NEW}}` | A non-existing tender number | `T-{{timestamp}}` |
| `{{COORD_START}}` / `{{COORD_END}}` | Lat/long pairs inside BC | `49.2827,-123.1207` / `48.4284,-123.3656` |
| `{{COMMENT_TEXT_2000}}` | A 2000-character string for the comment-length boundary test | n/a |

---

## 0.8 Cross-Cutting UI Conventions

These behaviors apply across the application; do not re-test per screen unless a row explicitly asks.

- **Mandatory field validation** is performed on form Submit/Save; errors render inline beside the field.
- **Numeric currency fields** (Financial Plan amount, Announcement Value, C-035, Tender Value, Winning Bid) accept integers only — no decimals (per Sprint 6 review).
- **Numeric Qty/Accmp fields** support up to 3 decimal places.
- **Free-text comment fields** accept up to 2000 characters.
- **Confirmation prompts** for destructive actions use the exact text `"Are you sure?"` with `Cancel` / `Delete` (or equivalent) buttons.
- **Unsaved-changes prompts** use the exact text `"You have unsaved changes"` with `Go Back` / `Leave` buttons.
- **Active vs Inactive filters** default to `Active` on every search screen.
- **Look-ahead dropdowns** filter as the user types; selecting a value shows the code only (not the description) in the field.
- **In-project navigation buttons** sit at the top-right of every project sub-screen. The button for the **current page is highlighted in blue**; agents can use this as the canonical "current page" indicator.
- **Order Number** (on Code Tables, Elements, Roles add/edit forms) controls dropdown display order; new values default to the bottom of the list.

### 0.8.1 Disable vs Delete Rule (canonical)

The same rule governs Code Values, Elements, and Roles:

| Has the value ever been used in data entry? | Allowed action(s) | UI affordance |
|---|---|---|
| **Yes** | **Disable** only (re-enable possible later) | `Disable` icon shown; `Delete` icon hidden |
| **No** | **Delete** only (permanent; not re-instatable) | `Delete` (trash) icon shown; `Disable` icon hidden |
| Already disabled | **Re-enable** | Greyed-out icon shown; clicking re-activates after end-date prompt |

Disabling a **role** cascades: every user holding that role immediately loses application access. The `SYSTEM_ADMIN` role is the only role that can never be disabled and never have permissions removed.
