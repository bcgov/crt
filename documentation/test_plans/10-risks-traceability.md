# 10. Risks & Traceability

## Risks and Mitigation

| Risk | Mitigation |
|------|------------|
| Several test cases reference Confluence wireframes and documentation that may no longer be accessible | Document expected behavior directly in test cases; capture screenshots where available |
| BVT test cases (CRPDB-104, 116, 117, 137, 138, 173, 174, 238) have minimal step detail — high-level scenarios only | Supplement with detailed FT cases; BVTs serve as smoke-test confirmation only |
| Some FT cases were marked complete with "minor bug-fix enhancements" deferred to later sprints | Track deferred items separately; confirm they were addressed in later iterations |
| ~~Test coverage for editing/deleting comments (CRPDB-204) noted as incomplete in original Jira comments~~ | **RESOLVED** — TS-COMMENT-03 through TS-COMMENT-06 now cover edit and delete for both Status and EMR comments |
| "Edit segment" feature was flagged as potentially out of scope in CRPDB-162 | Confirm feature availability before executing segment edit tests |
| Decimal handling changed mid-development (Sprint 6 review) — original tests may allow decimals | Ensure all financial amount tests enforce no-decimal rule per final requirements |
| Disabling a role cascades to all users with that role, removing their application access | TS-ROLE-09 added to verify cascading effect; coordinate with stakeholders before executing in shared environments |
| Element management was only covered at BVT level; no detailed FT validation existed | **RESOLVED** — TS-ELEM-01 through TS-ELEM-12 now provide full functional coverage |

---

## Traceability Matrix

| Feature Area | Functional Test (TST) | BVT (UAT) | Related User Stories |
|---|---|---|---|
| Authentication | CRPDB-76 | — | CRPDB-24 |
| Roles & Permissions | CRPDB-77 | CRPDB-104 | CRPDB-24, 25, 26 |
| User Management | CRPDB-78 | CRPDB-104 | CRPDB-24, 25, 26 |
| Project Search | CRPDB-105 | CRPDB-116 | CRPDB-48, 60, 61 |
| Project Details | CRPDB-106 | CRPDB-117 | CRPDB-49, 64, 65 |
| Financial Planning | CRPDB-111 | CRPDB-137 | CRPDB-50 |
| Qty/Accomplishments | CRPDB-112 | CRPDB-138 | CRPDB-53 |
| Tender Details | CRPDB-113 | CRPDB-138 | CRPDB-56 |
| Location Segments | CRPDB-162 | CRPDB-173 | CRPDB-51 |
| Ratios | CRPDB-163, 218 | CRPDB-174 | CRPDB-52, 125 |
| Code Tables | CRPDB-201 | CRPDB-238 | CRPDB-55, 132, 176 |
| Element Management | TS-ELEM-01–12 | CRPDB-238 | CRPDB-55, 132 |
| PM Management | CRPDB-202 | CRPDB-238 | CRPDB-176 |
| Row Duplication (Clone) | CRPDB-203, TS-CLONE-01–05 | — | CRPDB-187 |
| Comments Enhancement | CRPDB-204, TS-COMMENT-01–06 | — | CRPDB-136 |
| UI Feedback | CRPDB-217 | — | CRPDB-196, 197 |
