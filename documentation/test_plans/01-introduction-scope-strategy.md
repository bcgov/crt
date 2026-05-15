# 1. Introduction, Scope & Strategy

## 1.1 Introduction

This test plan covers the functional and build verification testing for the CRT application v1.0.0, a project tracking tool used by the BC Ministry of Transportation and Infrastructure (MoTI). The application enables users to manage capital and rehabilitation projects including project details, financial planning, tender information, spatial data, and administrative functions.

**Reference Docs**: Jira project CRPDB (24 test cases exported from Zephyr), Confluence documentation for wireframes and field definitions.

## 1.2 Scope

- **In Scope**:
  - Authentication via KeyCloak/IDIR
  - User management (roles, permissions, user CRUD)
  - Project lifecycle (search, create, edit, close)
  - Financial planning targets and public project information
  - Quantities and accomplishments data entry
  - Tender details management
  - Project spatial data (location segments and ratios)
  - Administrative data maintenance (code tables, PM management)
  - UI enhancements (row duplication, comments, navigation)

- **Out of Scope**:
  - Performance/load testing
  - Security penetration testing
  - Database migration verification
  - Reporting/export functionality
  - OpenShift/infrastructure deployment validation

## 1.3 Test Strategy

- **Test Levels**:
  - **Functional Testing (FT)**: Detailed step-by-step verification of each feature against acceptance criteria. Performed in TST environment.
  - **Build Verification Testing (BVT)**: High-level smoke tests confirming end-to-end user workflows. Performed in UAT environment.

- **Environment**:
  - TST (Test) – for functional testing
  - UAT (User Acceptance Testing) – for BVT/smoke tests

- **Personas**:
  - Application User (standard data entry roles)
  - Administrator (system admin, user management, code table management)

- **Test Data**: Valid/invalid IDIR credentials, MoTI region data, project records, fiscal year ranges (2010/2011–2027/2028)
