# CRT Application - Test Strategy Overview

## 1. Introduction

This document defines the overall test strategy for the Capital and Rehabilitation Tracking (CaRT/CRT) application. The CRT application is a secure platform used by MoTI (Ministry of Transportation and Infrastructure) staff to manage monthly reports on capital and rehabilitation projects, including project data entry, financial tracking, administrative functions, and reporting.

**Reference Docs**: [CRT End User's Guide](../confluence_pages/user-support/end-user-guide/end-user-guide.md)

## 2. Application Overview

The CRT application is composed of three major functional areas:

| Area | Description | Sections |
|------|-------------|----------|
| Project Data Entry | Screens for adding/updating project information and related components | 3.1–3.8 |
| Administration | Configuration screens for access control, code tables, elements, and roles | 4.1–4.4 |
| Reports & Dashboards | Data export and PowerBI report integration | 5 |

### Environments

| Environment | Menu Color | Purpose |
|-------------|-----------|---------|
| DEV | Green | Feature development and bug fixes |
| TST | Yellow | Functional testing |
| UAT | Purple | Business validation and training |
| PRD | Blue | Live production use |

## 3. Test Plan Index

| # | Test Plan | Covers | File |
|---|-----------|--------|------|
| 1 | Authentication, Navigation & Access | Login, menus, environment identification, role-based access, project navigation | [01-authentication-navigation.md](01-authentication-navigation.md) |
| 2 | Project Search & Creation | Project search, add project, search filtering | [02-project-search-creation.md](02-project-search-creation.md) |
| 3 | Project Details & Comments | Project details editing, Status/EMR comments CRUD | [03-project-details-comments.md](03-project-details-comments.md) |
| 4 | Financial Planning & Public Info | Financial targets CRUD/clone/filter, Public project info | [04-financial-planning-public-info.md](04-financial-planning-public-info.md) |
| 5 | Quantities, Accomplishments & Tenders | Quantities/Accomplishments CRUD/clone/filter, Tender details CRUD/clone | [05-quantities-accomplishments-tenders.md](05-quantities-accomplishments-tenders.md) |
| 6 | Project Segments & Ratios | Segment CRUD with map, highway direction, Ratios manual/auto + validation | [06-segments-ratios.md](06-segments-ratios.md) |
| 7 | Administration - User Management | User CRUD, IDIR lookup, enable/disable, role & region assignment | [07-admin-user-management.md](07-admin-user-management.md) |
| 8 | Administration - Code Tables & Elements | Code table CRUD, element CRUD, disable vs delete logic | [08-admin-code-tables-elements.md](08-admin-code-tables-elements.md) |
| 9 | Administration - User Roles | Role CRUD, permissions assignment, disable implications | [09-admin-user-roles.md](09-admin-user-roles.md) |
| 10 | Reports & Dashboards | PowerBI report access, report selection, export | [10-reports-dashboards.md](10-reports-dashboards.md) |

## 4. Test Strategy

### 4.1 Test Levels

| Level | Scope | Tools |
|-------|-------|-------|
| E2E / UI | Full user workflows through the browser | Playwright |
| Integration | API-level validation of endpoints | API test framework |
| Smoke | Critical path verification after deployments | Playwright subset |

### 4.2 Prioritization

- **High / Must Have**: Core CRUD workflows (project creation, user management), login, navigation, data integrity rules (ratio sum = 1)
- **Medium / Should Have**: Clone functionality, filtering, error handling, field validations
- **Low / Nice to Have**: Environment color verification, ordering of code values, UI polish

### 4.3 Cross-Cutting Concerns

These concerns apply across all test plans:

| Concern | Strategy |
|---------|----------|
| Role-Based Access Control | Each feature must be tested with users who have appropriate permissions AND users who lack them |
| Data Validation | Required fields, data types, boundary values tested on all forms |
| CRUD Confirmation | All delete actions must prompt for confirmation before executing |
| Browser Compatibility | Primary: Microsoft Edge. Secondary: Chrome, Firefox. Excluded: IE |
| Environment Awareness | Verify correct menu color per environment |

## 5. Risks and Mitigation (Global)

| Risk | Impact | Mitigation |
|------|--------|------------|
| End user guide lacks explicit acceptance criteria for most features | Test scenarios may not fully cover business intent | Flag in each plan; derive implicit criteria from described workflows |
| Screenshots referenced in docs are unavailable | Cannot verify exact UI layout expectations | Focus on functional behavior; visual testing deferred |
| Map/GIS integration for segments depends on external services | Segment tests may be environment-dependent | Isolate segment map tests; provide fallback manual verification steps |
| PowerBI reports require VPN and group membership | Report tests have infrastructure prerequisites | Document prerequisites clearly; test access-denied scenario separately |
| IDIR integration for user management is external dependency | User creation tests depend on IDIR service availability | Test with known valid/invalid IDIRs; mock where possible in lower environments |
