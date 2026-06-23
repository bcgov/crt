# Security Assessment Report
## CRT (Capital Rehabilitation Tracking) Application
**Date:** 2026-06-23  
**Assessor:** GitHub Copilot Security Scanner (LOCAL-MOTT-security-scanner)

---

## 0. Scan Metadata

| Field | Value |
|---|---|
| **Trivy Scan** | Ran — Trivy 0.69.3, DB updated 2026-06-23 |
| **Trivy Duration** | ~7 minutes (after DB update) |
| **Vuln DB Date** | 2026-06-23 (freshly downloaded) |
| **Languages** | C# (.NET 7), JavaScript (React 16) |
| **Frameworks** | ASP.NET Core 7, Entity Framework Core 7, Redux |
| **Template Engines** | None (React JSX with auto-escaping) |
| **Databases** | Microsoft SQL Server |
| **Build Tools** | MSBuild (.NET 7 SDK), webpack 5 (via react-scripts 5) |
| **Container** | Docker — nginx 1.25-alpine (FE), mcr.microsoft.com/dotnet/aspnet:7.0 (API) |
| **Dependency Manifests** | `client/package-lock.json` (npm, scanned by Trivy), `api/*.csproj` (NuGet, AI-estimated) |
| **File Counts** | ~250 C# files, ~100 JS files, 61 SQL files, 60 config files |
| **Exclusion Note** | `twm/` directory excluded (scan timeout); requires separate assessment |

---

## 1. Executive Summary

### Overall Security Posture: **HIGH** risk

The application has one Critical and multiple High severity issues requiring prompt remediation.

| Severity | Code/Config Findings | Dependency CVEs | Total |
|---|---|---|---|
| **Critical** | 1 | 2 | **3** |
| **High** | 5 | 68 | **73** |
| **Medium** | 3 | 0 | **3** |
| **Low** | 1 | 0 | **1** |

### Top 3 Most Critical Issues

1. **VULN-001 (Critical)** — `isApiClient` is unconditionally hardcoded to `true` in `CrtJwtBearerEvents.cs`, bypassing the JWT claim-driven authentication branching logic for every user.
2. **VULN-003 (High)** — The LDAP TLS certificate validation callback accepts any certificate that has a non-empty chain, effectively disabling MITM protection on LDAP connections and exposing the AD service account credentials.
3. **VULN-004 (High)** — User-supplied `orderBy` and `direction` query parameters are directly injected into Dynamic LINQ expressions without allowlist validation, enabling LINQ injection across all paginated API endpoints.

---

## 2. Vulnerability Findings

---

### VULN-001 — Authentication Bypass: `isApiClient` Hardcoded to `true`

| Field | Value |
|---|---|
| **ID** | VULN-001 |
| **Severity** | **Critical** |
| **Category** | Authentication Flaw |
| **Location** | `api/Crt.Api/Authentication/CrtJwtBearerEvents.cs`, lines 74–75 |
| **OWASP** | A07:2021 – Identification and Authentication Failures |
| **CWE** | CWE-287 – Improper Authentication |

**Evidence:**
```csharp
// api/Crt.Api/Authentication/CrtJwtBearerEvents.cs, lines 72-80
_ = bool.TryParse(principal.FindFirstValue(CrtClaimTypes.KcIsApiClient), out bool isApiClient);
isApiClient = true;   // ← hardcoded override — ALL users treated as API clients

var preferredUsername = principal.FindFirstValue(CrtClaimTypes.PreferredUsername);
var userGuid = new Guid("00000000-0000-0000-0000-000000000000");
```

**Description:** The `KcIsApiClient` JWT claim is parsed then immediately overwritten with `true`. Every authenticated user is treated as an API client, disabling the branch that syncs user information from Active Directory and making `isApiClient` logic permanently inert.

**Impact:** Any security decision downstream that depends on the `isApiClient` flag will never evaluate the `false` branch. This also prevents username/email updates from LDAP from ever being applied to the database.

**Recommendation:** Remove line 75 (`isApiClient = true;`). Audit whether this was a debug shortcut left in by mistake. Restore correct branching per the original intent of the `KcIsApiClient` claim.

---

### VULN-002 — LDAP Injection

| Field | Value |
|---|---|
| **ID** | VULN-002 |
| **Severity** | **High** |
| **Category** | Injection (LDAP) |
| **Location** | `api/Crt.Domain/Services/LdapService.cs`, lines 47–48 |
| **OWASP** | A03:2021 – Injection |
| **CWE** | CWE-90 – Improper Neutralization of Special Elements used in an LDAP Query |

**Evidence:**
```csharp
// api/Crt.Domain/Services/LdapService.cs, lines 47-48
var filter = $"(&(objectCategory=person)(objectClass=user)({filterAttr}={value}))";
var search = conn.Search("OU=BCGOV,DC=idir,DC=BCGOV", LdapConnection.ScopeSub, filter, ...);
```

**Description:** `filterAttr` and `value` are interpolated into the LDAP filter without escaping LDAP metacharacters. `value` traces to the `username` parameter of `UsersController.GetAdAccountAsync()` — an HTTP query parameter supplied by an authenticated user with `UserWrite` permission.

**Impact:** LDAP filter manipulation — attacker can enumerate directory entries beyond the intended scope.

**Recommendation:** Escape all LDAP special characters (`\`, `*`, `(`, `)`, null byte) in both `filterAttr` and `value` before interpolation. Validate `filterAttr` against a strict allowlist of permitted attributes.

---

### VULN-003 — SSL Certificate Validation Bypass (LDAP)

| Field | Value |
|---|---|
| **ID** | VULN-003 |
| **Severity** | **High** |
| **Category** | Insecure Cryptography / Transport |
| **Location** | `api/Crt.Domain/Services/LdapService.cs`, lines 35–44 |
| **OWASP** | A02:2021 – Cryptographic Failures |
| **CWE** | CWE-295 – Improper Certificate Validation |

**Evidence:**
```csharp
// api/Crt.Domain/Services/LdapService.cs, lines 35-44
conn.UserDefinedServerCertValidationDelegate += (sender, certificate, chain, sslPolicyErrors) =>
{
    if (sslPolicyErrors == SslPolicyErrors.None)
        return true;

    if (chain.ChainElements == null)
        return false;

    return true;   // ← accepts ANY cert with a non-empty chain, regardless of errors
};
```

**Description:** The certificate validation callback accepts any certificate as long as the chain object is non-null — which is virtually always true. Self-signed, expired, and hostname-mismatched certificates are all accepted.

**Impact:** Man-in-the-middle attack on the LDAP/StartTLS channel exposing the Active Directory service account credentials (username and password) that are bound in `LdapService.LdapSearch`.

**Recommendation:** Replace the delegate with strict validation: return `sslPolicyErrors == SslPolicyErrors.None`. If the LDAP server uses an internal CA, add that CA to the OS trusted certificate store rather than bypassing validation in code.

---

### VULN-004 — LINQ Injection via Unsanitised Sort Parameters

| Field | Value |
|---|---|
| **ID** | VULN-004 |
| **Severity** | **High** |
| **Category** | Injection (LINQ / ORM) |
| **Location** | `api/Crt.Data/Repositories/Base/CrpRepositoryBase.cs`, line 169 |
| **OWASP** | A03:2021 – Injection |
| **CWE** | CWE-89 – SQL Injection (analogous at ORM level) |

**Evidence:**
```csharp
// api/Crt.Data/Repositories/Base/CrpRepositoryBase.cs, line 169
var pagedList = list.DynamicOrderBy($"{orderBy} {direction}") as IQueryable<TInput>;

// api/Crt.Data/IQueryableDynamicExtensions.cs
return source.OrderBy(ordering, args);   // System.Linq.Dynamic.Core — executes ordering string
```

**Description:** The `orderBy` and `direction` HTTP query parameters are interpolated into a `System.Linq.Dynamic.Core` expression string without any allowlist check. Dynamic LINQ can execute arbitrary expressions including method calls and property access not intended to be exposed. Every paginated endpoint is affected.

**Impact:** An authenticated attacker can craft `orderBy` values to access unexpected entity properties, disclose schema information, or trigger errors that reveal internal data structures.

**Recommendation:** Validate `orderBy` and `direction` against per-entity allowlists before calling `DynamicOrderBy`. Reject or default-replace any value not on the allowlist.

---

### VULN-005 — API Key in URL Query String (Router API)

| Field | Value |
|---|---|
| **ID** | VULN-005 |
| **Severity** | **Medium** |
| **Category** | Sensitive Data Exposure |
| **Location** | `api/Crt.HttpClients/RouterApi.cs`, line 29 |
| **OWASP** | A02:2021 – Cryptographic Failures |
| **CWE** | CWE-312 – Cleartext Storage of Sensitive Information |

**Evidence:**
```csharp
// api/Crt.HttpClients/RouterApi.cs, line 29
var query = $"directions.json?criteria={criteria}&points={points}&roundTrip={roundTrip}&apikey={_apiKey}";
```

**Description:** The BC Router API key is appended as a URL query parameter. The full URL (including the key) is logged by Serilog and nginx access logs on every request.

**Impact:** The API key is exposed in application and proxy logs accessible to any party with log access.

**Recommendation:** Move the API key to an HTTP request header (`Authorization` or `X-API-Key`).

---

### VULN-006 — Full HTTP Response Body Logged on External API Exceptions

| Field | Value |
|---|---|
| **ID** | VULN-006 |
| **Severity** | **Medium** |
| **Category** | Sensitive Data Exposure |
| **Location** | `api/Crt.HttpClients/DataBCApi.cs`, lines 65, 104; `api/Crt.HttpClients/GeoServerApi.cs`, lines 116, 167, 206, 244 |
| **OWASP** | A09:2021 – Security Logging and Monitoring Failures |
| **CWE** | CWE-532 – Insertion of Sensitive Information into Log File |

**Evidence:**
```csharp
// api/Crt.HttpClients/DataBCApi.cs, line 65
_logger.LogError($"Exception {ex.Message} - GetPolygonOfInterestForElectoralDistrict({boundingBox}): {query} - {content}");
```

**Description:** On exceptions, the full HTTP response body (`content`) and the constructed query URL (which may contain API parameters) are written to error logs.

**Impact:** Sensitive spatial data and API credentials accumulate in log files.

**Recommendation:** Log only the exception message and HTTP status code. Gate full-body logging behind `LogLevel.Debug`.

---

### VULN-007 — Swagger UI Exposed in All Environments

| Field | Value |
|---|---|
| **ID** | VULN-007 |
| **Severity** | **Medium** |
| **Category** | Security Misconfiguration |
| **Location** | `api/Crt.Api/Extensions/IApplicationBuilderExtensions.cs`, lines 44–50 |
| **OWASP** | A05:2021 – Security Misconfiguration |
| **CWE** | CWE-16 – Configuration |

**Evidence:**
```csharp
// UseCrtSwagger called unconditionally in Startup.cs
app.UseCrtSwagger(env, Configuration.GetSection("Constants:SwaggerApiUrl").Value);
// No env.IsDevelopment() guard
```

**Description:** Swagger UI and the OpenAPI spec (`/swagger/v1/swagger.json`) are active in all environments including production. The nginx config proxies the `/swagger/` path externally.

**Impact:** Unauthenticated access to the full API schema aids attacker reconnaissance.

**Recommendation:** Guard `UseCrtSwagger` behind `if (env.IsDevelopment())` or add authentication to the Swagger endpoints.

---

### VULN-008 — Missing HTTP Security Headers

| Field | Value |
|---|---|
| **ID** | VULN-008 |
| **Severity** | **High** |
| **Category** | Security Misconfiguration |
| **Location** | `client/nginx.conf.tmpl`; `api/Crt.Api/Extensions/IApplicationBuilderExtensions.cs` |
| **OWASP** | A05:2021 – Security Misconfiguration |
| **CWE** | CWE-16 – Configuration |

**Evidence:**
```nginx
# client/nginx.conf.tmpl — only these headers are set:
add_header Last-Modified $date_gmt;
add_header Cache-Control "private, no-store, no-cache, must-revalidate";
# Missing: HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
```

**Description:** Six standard browser security headers are absent from the nginx configuration and no security headers middleware is configured in the ASP.NET Core pipeline.

**Impact:** Without these headers, the browser cannot enforce XSS content restrictions, clickjacking protection, HTTPS enforcement, or MIME sniffing prevention.

**Recommendation:** Add to `nginx.conf.tmpl`:
```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; ..." always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), camera=(), microphone=()" always;
```

---

### VULN-009 — .NET 7 Runtime and Base Images Are End-of-Life

| Field | Value |
|---|---|
| **ID** | VULN-009 |
| **Severity** | **High** |
| **Category** | Vulnerable and Outdated Components |
| **Location** | `api/Dockerfile`, lines 1 and 17; all `api/**/*.csproj` files |
| **OWASP** | A06:2021 – Vulnerable and Outdated Components |
| **CWE** | CWE-1104 – Use of Unmaintained Third-Party Components |

**Evidence:**
```dockerfile
# api/Dockerfile
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS runtime
```

**Description:** .NET 7 reached End of Support on **May 14, 2024**. No further security patches will be released. The production runtime is unpatched for any runtime-level CVE discovered after that date.

**Impact:** Runtime-level vulnerabilities will remain permanently unpatched.

**Recommendation:** Migrate to .NET 8 LTS (supported until November 10, 2026) or .NET 9. Update all `.csproj` `<TargetFramework>net7.0</TargetFramework>` entries and Dockerfile base images.

---

## 3. Dependency Risk Summary

### npm — Critical

| Package | Version | CVE | Risk | Fixed Version | Tag |
|---|---|---|---|---|---|
| `shell-quote` | 1.7.3 | CVE-2026-9277 | Command injection via line terminators in `.op` field; CVSS 4.0: 9.2 | 1.8.4 | [Trivy] |
| `webpack` | 5.73.0 | CVE-2023-28154 | Cross-realm object access; arbitrary object property access; CVSS: 9.8 | 5.76.0 | [Trivy] |

### npm — Selected High (full list in step_3_security_scanning/dependencies/findings.md)

| Package | Version | CVEs | Risk | Tag |
|---|---|---|---|---|
| `axios` | 0.21.4 | 10 CVEs (CVE-2025-27152, CVE-2026-42033, etc.) | Very old version with multiple unpatched issues. Upgrade to 1.7+. | [Trivy] |
| `serialize-javascript` | 4.0.0, 6.0.0 | GHSA-5c6j-r48x-rmvq | RCE via `RegExp.flags` injection when serialized output is eval'd | [Trivy] |
| `webpack-dev-middleware` | 5.3.3 | CVE-2024-29180 | Path traversal allowing local file exfiltration | [Trivy] |
| `node-forge` | 1.3.1 | 6 CVEs | Multiple cryptographic/TLS vulnerabilities | [Trivy] |
| `ws` | 7.5.8, 8.8.0 | CVE-2024-37890, CVE-2026-48779 | DoS via excessive HTTP headers | [Trivy] |
| `path-to-regexp` | 0.1.7, 1.8.0 | CVE-2024-45296, CVE-2024-52798, CVE-2026-4867 | Catastrophic backtracking / DoS | [Trivy] |
| `moment` | 2.29.3 | CVE-2022-31129 | ReDoS | [Trivy] |
| `semver` (4 versions) | 6.3.0–7.3.7 | CVE-2022-25883 | ReDoS | [Trivy] |

> ⚠️ **Note on build-time vs runtime packages:** `webpack`, `webpack-dev-middleware`, `terser`, `rollup`, `babel` are devDependencies that do not ship in the production browser bundle. However, `axios`, `lodash`, `moment`, `path-to-regexp`, and `body-parser` are production runtime dependencies.

### .NET NuGet — Selected Risks

| Package | Risk | Tag |
|---|---|---|
| All `Microsoft.*` 7.x packages | .NET 7 EOL — no security patches since May 2024 | [AI-estimated] |
| `System.Linq.Dynamic.Core` | LINQ injection vector if input not validated (see VULN-004) | [AI-estimated] |
| `Novell.Directory.Ldap` | Custom cert validation bypasses TLS checks (see VULN-003) | [AI-estimated] |

---

## 4. Configuration Review

| Issue | Severity | Location |
|---|---|---|
| `appsettings.json` development connection string in source control | Medium | `api/Crt.Api/appsettings.json` |
| HTTPS not enforced at application layer (TLS terminated at proxy only) | Medium | `api/Crt.Api/Startup.cs`, `api/Dockerfile` |
| GeoServer Basic Auth credentials over potentially non-TLS internal channel | Medium | `api/Crt.HttpClients/HttpClientsServiceCollectionExtensions.cs` |
| DeveloperExceptionPage guard present (informational) | Low | `api/Crt.Api/Startup.cs` |
| .NET 7 EOL base images | High | `api/Dockerfile` |

**Missing Security Headers (nginx):**

| Header | Status |
|---|---|
| `Strict-Transport-Security` | ❌ Missing |
| `Content-Security-Policy` | ❌ Missing |
| `X-Frame-Options` | ❌ Missing |
| `X-Content-Type-Options` | ❌ Missing |
| `Referrer-Policy` | ❌ Missing |
| `Permissions-Policy` | ❌ Missing |

**CORS:** `services.AddCors()` is registered but `app.UseCors()` is never called — CORS middleware is inactive. No permissive CORS policy was found.

---

## 5. Prioritised Action Items

### Critical — Fix Immediately

| # | Issue | Location | Action |
|---|---|---|---|
| C-1 | `isApiClient = true` hardcoded — auth bypass | `CrtJwtBearerEvents.cs:75` | Remove the override line; restore correct claim-based branching |

### High Priority — Next Sprint

| # | Issue | Location | Action |
|---|---|---|---|
| H-1 | LDAP TLS certificate validation disabled | `LdapService.cs:35-44` | Replace callback with strict `sslPolicyErrors == None` check |
| H-2 | LDAP filter injection | `LdapService.cs:47-48` | Escape LDAP metacharacters; allowlist `filterAttr` |
| H-3 | LINQ injection via `orderBy`/`direction` params | `CrpRepositoryBase.cs:169` | Add per-entity allowlist validation for sort parameters |
| H-4 | Missing security headers (HSTS, CSP, X-Frame, etc.) | `nginx.conf.tmpl` | Add 6 security headers to nginx config |
| H-5 | .NET 7 EOL runtime and Docker base images | `api/Dockerfile`, all `.csproj` | Migrate to .NET 8 LTS |
| H-6 | npm — 2 Critical CVEs (shell-quote, webpack) | `client/package-lock.json` | Run `npm audit fix --force`; pin to fixed versions |
| H-7 | npm — 68 High CVEs (axios, lodash, moment, etc.) | `client/package-lock.json` | Upgrade affected packages; prioritise production runtime deps first |

### Medium / Low — Backlog

| # | Issue | Location | Action |
|---|---|---|---|
| M-1 | Swagger UI in all environments | `IApplicationBuilderExtensions.cs` | Guard behind `env.IsDevelopment()` |
| M-2 | API key in Router URL query string | `RouterApi.cs:29` | Move to request header |
| M-3 | Full response body logged on external API errors | `DataBCApi.cs`, `GeoServerApi.cs` | Log only status code and message |
| M-4 | Development connection string in `appsettings.json` | `appsettings.json` | Replace with placeholder |
| M-5 | GeoServer Basic Auth over internal HTTP | `HttpClientsServiceCollectionExtensions.cs` | Verify HTTPS and consider token-based auth |
| L-1 | CORS middleware registered but never activated | `Startup.cs` | Either apply explicit policy or remove `services.AddCors()` |
| OOS | `twm/` directory not scanned | — | Run Trivy separately: `trivy fs twm/` |

---

## 6. Scan Coverage Limitations

This assessment used LLM-based static analysis with the following known limitations:

- **Single-file pattern matching only** — data flow between files (e.g., tracing `orderBy` from HTTP request through service layer to repository) was performed manually for high-confidence findings but may miss indirect paths.
- **NuGet packages not scanned by Trivy** — no `packages.lock.json` was present. NuGet dependency assessments are `[AI-estimated]`.
- **`twm/` directory excluded** — the third-party web-mapping application was not scanned.
- **Dynamic application behaviour not assessed** — runtime CORS policy, actual HTTP headers in deployment, OpenShift network policies, and Keycloak realm configuration were not reviewed.

For high-assurance assessment, supplement with: **Semgrep** (SAST), **OWASP Dependency-Check** or **Snyk** (SCA for .NET), and **OWASP ZAP** (DAST).

---

## THIS ASSESSMENT CONTAINS A CRITICAL VULNERABILITY
