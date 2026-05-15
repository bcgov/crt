# 9. BVT (Build Verification Tests) – UAT Smoke Tests

These are high-level end-to-end tests confirming that core workflows function correctly after a build is deployed to UAT.

> **Preconditions for this file**: Build deployed to UAT environment. `{{IDIR_VALID_ADMIN}}` and `{{IDIR_VALID_USER}}` accounts available in UAT. BVT scenarios are intentionally coarse-grained — when generating tests, link each BVT row to its detailed FT counterparts in files 02–08 (see traceability matrix in [10-risks-traceability.md](10-risks-traceability.md)).

## [CRPDB-116] BVT - Project Search

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-BVT-SEARCH-01 | Search projects end-to-end | 1. Navigate to Project Search<br>2. Use region, keywords, PM filters | Users can find projects using filtering criteria | High | E2E |

---

## [CRPDB-117] BVT - Project Details

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-BVT-DET-01 | Create new project | 1. Click Add Project<br>2. Provide required details<br>3. Save | Project created with sufficient detail | High | E2E |
| TS-BVT-DET-02 | Edit existing project | 1. Search and select project<br>2. Update details<br>3. Save | Information updated and saved | High | E2E |

---

## [CRPDB-137] BVT - Financial Planning & Public Information

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-BVT-FIN-01 | Create project with financial details | 1. Create project<br>2. Continue to Planning<br>3. Add financial planning and public info | Full workflow completes without errors | High | E2E |
| TS-BVT-FIN-02 | Add financial details later | 1. Create project and close<br>2. Navigate back to Planning<br>3. Add information | Can return to add information after initial creation | Medium | E2E |
| TS-BVT-FIN-03 | Edit financial details | 1. Navigate to Planning<br>2. Update existing entries | Can update previously provided information | Medium | E2E |

---

## [CRPDB-138] BVT - Tender and Quantity/Accomplishment

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-BVT-TEND-01 | Create project with tender and Qty/Accmp | 1. Create project<br>2. Continue to Tender<br>3. Add tender and Qty/Accomplishment data | Full workflow completes | High | E2E |
| TS-BVT-TEND-02 | Add tender details later | 1. Create project<br>2. Navigate to Tender later<br>3. Add information | Can add tender data after project creation | Medium | E2E |

---

## [CRPDB-173] BVT - Project Location

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-BVT-LOC-01 | Add project location | 1. Navigate to Segments<br>2. Add start/end points | User can provide location with meaningful description | High | E2E |
| TS-BVT-LOC-02 | Add multiple project locations | 1. Add multiple segments | User can add more than one segment per project | Medium | E2E |

---

## [CRPDB-174] BVT - Project Ratios

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-BVT-RAT-01 | Add ratios manually | 1. Add administrative boundaries and ratios | User informed if ratios over/under 1 | High | E2E |
| TS-BVT-RAT-02 | Determine ratios from segments | 1. Add segments<br>2. Click "Determine Using Segments" | Approximate ratios obtained from spatial data | Medium | E2E |

---

## [CRPDB-238] BVT - Maintain Code Values and Elements

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-BVT-CODE-01 | Maintain dropdown lists | 1. Log in with Code Write permission<br>2. Navigate to Code/Element management<br>3. Add/Edit/Disable values | Administrator can maintain code and element values | High | E2E |
