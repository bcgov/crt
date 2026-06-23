# Step 4 — Pre-Summary Validation Report

## Validation Date: 2026-06-23

---

## Checklist

### 1. Required Output Files

| File | Status |
|---|---|
| `step_0_trivy/findings.md` | ✅ Present, contains full Trivy output table (70 CVEs, 1 misconfig) |
| `step_1_tech_stack/detection.md` | ✅ Present, full stack table |
| `step_2_file_inventory/inventory.md` | ✅ Present, categorised file listing |
| `step_3_security_scanning/code_analysis/findings.md` | ✅ Present, 9 findings |
| `step_3_security_scanning/dependencies/findings.md` | ✅ Present, 70+ CVEs |
| `step_3_security_scanning/configuration/findings.md` | ✅ Present, 6 findings |
| `step_3_security_scanning/database/findings.md` | ✅ Present, 1 informational finding |

---

### 2. Evidence Standards Spot-Check

| Finding | File | Line | Code Snippet Present | PASS/FAIL |
|---|---|---|---|---|
| VULN-001 (isApiClient hardcoded) | `CrtJwtBearerEvents.cs` | 74–75 | ✅ | PASS |
| VULN-002 (LDAP Injection) | `LdapService.cs` | 47–48 | ✅ | PASS |
| VULN-003 (SSL bypass) | `LdapService.cs` | 35–44 | ✅ | PASS |
| VULN-004 (LINQ injection) | `CrpRepositoryBase.cs` | 169 | ✅ | PASS |
| CFG-006 (.NET 7 EOL) | `api/Dockerfile` | 1, 17 | ✅ | PASS |

All spot-checked findings include exact file path, line numbers, and fenced code snippets. ✅

---

### 3. False Positive Sweep

| Check | Result |
|---|---|
| SQL injection on parameterised queries | ✅ Cleared — `ExecuteSqlRawAsync` in `UserRepository.cs` uses positional parameters `{0}..{5}`. No raw string concat in SQL calls. |
| XSS on static HTML | ✅ No JSP/Razor/template engine found in API. React frontend uses JSX with auto-escaping. No `dangerouslySetInnerHTML` patterns found. |
| Hardcoded secrets on obvious placeholders | ✅ Cleared — `<ServiceAccount:User>`, `<service-client-secret>`, `apiKey` values are clearly placeholders. The `localdb` connection string is a development artifact, not a production credential. |
| VULN-001 `isApiClient = true` | Confirmed — this is a real override, not a placeholder or test value. The line immediately follows a `TryParse` call, overwriting the parsed value. |
| VULN-004 LINQ injection | Confirmed — `DynamicOrderBy($"{orderBy} {direction}")` directly embeds user query string values. Checked all 10+ callers; none apply allowlist validation. |

---

### 4. CVE Source Tagging

All CVE findings in `step_3_security_scanning/dependencies/findings.md` are tagged `[Trivy]` (for npm findings confirmed by Trivy) or `[AI-estimated]` (for .NET NuGet package assessments where no lock file was available for Trivy scanning). ✅

---

### 5. Coverage Check

| Step 2 Category | Covered By |
|---|---|
| C# Source files (api/) | Step 3 Code Analysis |
| JavaScript source files (client/src/) | Step 3 Code Analysis (referenced) |
| SQL database scripts | Step 3 Database Analysis |
| Configuration files (.json, .yaml, nginx.conf.tmpl) | Step 3 Configuration Review |
| Dockerfiles | Step 3 Configuration Review |
| npm packages (package-lock.json) | Step 0 Trivy + Step 3 Dependencies |
| .NET NuGet packages (.csproj) | Step 3 Dependencies |

**Gap:** The `twm/` directory was excluded from the Trivy scan due to timeout. The TWM web-mapping application and its dependencies have not been assessed. ⚠️ Recommended: run `trivy fs --scanners vuln,secret,misconfig --severity HIGH,CRITICAL --format json twm/` separately.

---

### 6. No Placeholder Text

Reviewed all findings files — no `TODO`, `TBD`, or `[fill in]` content found. ✅

---

## Validation Result: **PASS** (with gap noted for `twm/` directory)

All checks pass. Summary report may proceed. The `twm/` directory gap is documented.
