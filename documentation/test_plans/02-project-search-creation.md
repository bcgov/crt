# Test Plan: Project Search & Creation

## 1. Introduction
Validates the project search functionality (filtering, results display) and the ability to create new projects via the Add Project form.
**Reference Docs**: [3 Project Data Entry](../confluence_pages/user-support/end-user-guide/project-data-entry.md), [2 Application Components](../confluence_pages/user-support/end-user-guide/application-components.md)

## 2. Scope
- **In Scope**: Project search screen, search parameters (active/inactive, region, keyword), Add Project form, required field validation on creation
- **Out of Scope**: Editing project details after creation (covered in Test Plan 03), data entry subsections

## 3. Test Strategy
- **Test Levels**: E2E (Playwright)
- **Environment**: UAT

## 4. Test Scenarios

### SRCH - Project Search

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-SRCH-01 | Verify search with all criteria | 1. Navigate to project search screen<br>2. Set status to "Active"<br>3. Select MoTI Region "1"<br>4. Enter keyword "pavement" in search field<br>5. Execute search | Only active projects in Region 1 containing "pavement" in name, description, or scope are displayed | High | Functional |
| TS-SRCH-02 | Verify search with no criteria returns all results | 1. Navigate to project search screen<br>2. Execute search without any filters | All projects are returned (subject to pagination) | Medium | Functional |
| TS-SRCH-03 | Verify search with no matching results | 1. Navigate to project search screen<br>2. Enter a keyword that does not match any project (e.g., "zzznonexistent")<br>3. Execute search | No results displayed; appropriate message shown (e.g., "No projects found") | Medium | Negative |
| TS-SRCH-04 | Verify search includes inactive projects | 1. Navigate to project search screen<br>2. Set status filter to include inactive projects<br>3. Execute search | Both active and inactive projects are returned in results | Medium | Functional |
| TS-SRCH-05 | Verify search results display correct columns | 1. Execute a search with results | Results table shows expected columns with clickable navigation links to project sections | High | Functional |
| TS-SRCH-06 | Verify read-only user can search | 1. Log in as user with Project Read permission only<br>2. Execute a search | Search executes successfully; results are displayed; Add Project button is not visible | High | Functional |

### CPRJ - Create Project

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-CPRJ-01 | Verify Add Project button is visible for authorized users | 1. Log in as user with Project Write permission<br>2. Navigate to project search screen | "Add Project" button is visible and clickable | High | Functional |
| TS-CPRJ-02 | Verify Add Project button is hidden for read-only users | 1. Log in as user with Project Read only<br>2. Navigate to project search screen | "Add Project" button is not visible | High | Negative |
| TS-CPRJ-03 | Verify successful project creation with all required fields | 1. Click "Add Project"<br>2. Fill in all required fields with valid data<br>3. Submit the form | New project is created; user can find it via search | High | Functional |
| TS-CPRJ-04 | Verify project creation fails when required fields are missing | 1. Click "Add Project"<br>2. Leave one or more required fields blank<br>3. Attempt to submit | Form validation prevents submission; required fields are highlighted with error indicators | High | Negative |
| TS-CPRJ-05 | Verify project creation with boundary-length values | 1. Click "Add Project"<br>2. Enter maximum-length values for text fields (project name, description)<br>3. Submit the form | Project is created successfully; data is stored without truncation | Medium | Edge Case |
| TS-CPRJ-06 | Verify project creation with special characters | 1. Click "Add Project"<br>2. Enter special characters (e.g., &, <, >, ", ') in text fields<br>3. Submit the form | Project is created successfully; special characters are properly escaped and displayed | Medium | Edge Case |
| TS-CPRJ-07 | Verify newly created project appears in search results | 1. Create a new project<br>2. Return to search screen<br>3. Search for the newly created project | Project appears in search results with correct details | High | Functional |

## 5. Risks and Mitigation
- **Risk**: The user guide does not enumerate the required fields for the Add Project form.
  - **Mitigation**: Determine required fields empirically during test execution; document findings for future reference.
- **Risk**: Search performance may degrade with large datasets.
  - **Mitigation**: Include a basic performance check (search completes within acceptable time) but defer formal performance testing.
