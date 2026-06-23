# Step 3 — Code Analysis (SAST) Findings

## Files Scanned

All C# source files in `api/` excluding `bin/` and `obj/` directories, plus key JavaScript files in `client/src/js/`. Patterns checked: SQL/LINQ injection, LDAP injection, authentication bypasses, SSL validation bypass, sensitive data exposure in logs, insecure cryptography, command injection, path traversal, open redirect, XXE, SSRF, CSRF.

---

## Findings

### VULN-001 — Authentication Bypass: `isApiClient` Hardcoded to `true`

| Field | Value |
|---|---|
| **ID** | VULN-001 |
| **Severity** | **Critical** — Hardcoded value bypasses an authentication branching decision for all users |
| **Category** | Authentication Flaw |
| **Location** | `api/Crt.Api/Authentication/CrtJwtBearerEvents.cs`, lines 74–75 |
| **OWASP** | A07:2021 – Identification and Authentication Failures |
| **CWE** | CWE-287 – Improper Authentication |

**Evidence:**
```csharp
// api/Crt.Api/Authentication/CrtJwtBearerEvents.cs, lines 72-80
_ = bool.TryParse(principal.FindFirstValue(CrtClaimTypes.KcIsApiClient), out bool isApiClient);
isApiClient = true;   // ← hardcoded override
var preferredUsername = principal.FindFirstValue(CrtClaimTypes.PreferredUsername);
string[] usernames = null;
var username = "";
var userGuid = new Guid("00000000-0000-0000-0000-000000000000");
```

**Description:** The claim `KcIsApiClient` is parsed into `isApiClient` from the JWT, but on the immediately following line it is unconditionally overwritten to `true`. This causes *every* authenticated user to be treated as an API client, regardless of their actual JWT claims. The effect: the code path that would normally update the user's username/email in the database (lines 124–130) is always skipped via the `if (isApiClient)` early-return check, and the username used is always the one from the database rather than the token. While this avoids incorrect overwrites, it means any legitimate use of the `KcIsApiClient` claim for differentiated security logic is permanently disabled and invisible.

**Impact:** If `isApiClient` was intended to gate different behaviour (e.g., looser session validation, different claim population), the bypass removes that control. Any regression that relies on this flag for a security decision will never fire.

**Recommendation:** Remove the `isApiClient = true;` override. If the intent is to always treat users as API clients pending a fix, document the decision with a TODO/FIXME and track it as a known deviation. Verify the original intent of the flag and restore correct branching logic.

---

### VULN-002 — LDAP Injection via Unsanitised Filter Parameters

| Field | Value |
|---|---|
| **ID** | VULN-002 |
| **Severity** | **High** — Attacker can manipulate LDAP filter logic |
| **Category** | Injection (LDAP) |
| **Location** | `api/Crt.Domain/Services/LdapService.cs`, lines 47–48 |
| **OWASP** | A03:2021 – Injection |
| **CWE** | CWE-90 – Improper Neutralization of Special Elements used in an LDAP Query |

**Evidence:**
```csharp
// api/Crt.Domain/Services/LdapService.cs, lines 47-48
var filter = $"(&(objectCategory=person)(objectClass=user)({filterAttr}={value}))";
var search = conn.Search("OU=BCGOV,DC=idir,DC=BCGOV", LdapConnection.ScopeSub, filter,
    new string[] { "sAMAccountName", "bcgovGUID", "givenName", "sn", "mail", "displayName" }, false);
```

**Description:** Both `filterAttr` and `value` are interpolated directly into the LDAP search filter string without escaping LDAP special characters (`*`, `(`, `)`, `\`, `\0`). The `value` parameter is controlled by the caller; tracing the call chain shows it originates from the `username` parameter supplied to `GetAdAccountAsync()` in `UserService.cs`, which is passed through from the `UsersController.cs` `GetAdAccountAsync` endpoint parameter. An authenticated user with `UserWrite` permission could inject LDAP filter metacharacters.

**Impact:** LDAP filter manipulation — an attacker with the required permission could enumerate all directory entries, bypass filter restrictions, or cause excessive directory queries.

**Recommendation:** Escape all user-supplied values using LDAP filter encoding before interpolation. Specifically, escape the characters: `\`, `*`, `(`, `)`, `\0` (null byte). In C#, use a utility method that replaces special characters with their escaped equivalents (e.g., `\28` for `(`, `\29` for `)`, `\2a` for `*`, `\5c` for `\`).

---

### VULN-003 — SSL Certificate Validation Bypass on LDAP Connection

| Field | Value |
|---|---|
| **ID** | VULN-003 |
| **Severity** | **High** — TLS certificate validation is effectively disabled |
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

    return true;   // ← always returns true when chain elements exist, even if sslPolicyErrors != None
};
```

**Description:** The certificate validation callback returns `true` whenever `chain.ChainElements` is non-null — which is virtually always the case. The only rejected certificate is one whose chain has no elements at all (malformed/empty chain). Any self-signed certificate, expired certificate, hostname mismatch, or revoked certificate will be accepted as long as the chain object is populated.

**Impact:** Man-in-the-middle attacks on the LDAP/StartTLS connection. An attacker on the network path between the API server and the AD server can intercept the LDAP bind credentials (service account username and password) and all directory queries.

**Recommendation:** Remove the custom delegate and rely on the OS/platform certificate store for validation, or implement strict validation: check `sslPolicyErrors == SslPolicyErrors.None` and return `false` for all other cases. If a self-signed internal CA is in use, add its certificate to the trusted store rather than bypassing validation.

---

### VULN-004 — LINQ Injection via Unsanitised `orderBy` / `direction` Query Parameters

| Field | Value |
|---|---|
| **ID** | VULN-004 |
| **Severity** | **High** — User input is executed as Dynamic LINQ expression |
| **Category** | Injection (LINQ / ORM) |
| **Location** | `api/Crt.Data/Repositories/Base/CrpRepositoryBase.cs`, line 169; `api/Crt.Data/IQueryableDynamicExtensions.cs`, lines 11–14 |
| **OWASP** | A03:2021 – Injection |
| **CWE** | CWE-89 – SQL Injection (analogous — ORM-level injection) |

**Evidence:**
```csharp
// api/Crt.Data/Repositories/Base/CrpRepositoryBase.cs, line 169
var pagedList = list.DynamicOrderBy($"{orderBy} {direction}") as IQueryable<TInput>;

// api/Crt.Data/IQueryableDynamicExtensions.cs, lines 11-14
public static IOrderedQueryable<TSource> DynamicOrderBy<TSource>(
    this IQueryable<TSource> source, string ordering, params object[] args)
{
    return source.OrderBy(ordering, args);  // System.Linq.Dynamic.Core
}
```

**Description:** The `orderBy` and `direction` parameters are accepted directly from HTTP query strings (e.g., `GET /api/users?orderBy=Username&direction=asc`) and concatenated into a Dynamic LINQ expression string without any allowlist validation. `System.Linq.Dynamic.Core` parses this string and can execute arbitrary LINQ/C# expressions — including calling methods, accessing properties not normally visible, and in some versions executing code. The string `$"{orderBy} {direction}"` is user-controlled end-to-end.

**Impact:** An authenticated attacker could use crafted `orderBy` values to access properties not intended to be sortable, potentially extract data from related entities, or trigger exceptions that disclose internal schema details.

**Recommendation:** Validate `orderBy` against a strict allowlist of permitted column names for each entity, and validate `direction` to only `"asc"` or `"desc"`. Example:
```csharp
private static readonly HashSet<string> AllowedOrderByColumns = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
    { "Username", "FirstName", "LastName", "Email" };

if (!AllowedOrderByColumns.Contains(orderBy))
    orderBy = "Username"; // safe default
direction = direction?.ToLowerInvariant() == "desc" ? "desc" : "asc";
```

---

### VULN-005 — API Key Exposed in URL Query String (Router API)

| Field | Value |
|---|---|
| **ID** | VULN-005 |
| **Severity** | **Medium** — API key visible in server logs |
| **Category** | Sensitive Data Exposure |
| **Location** | `api/Crt.HttpClients/RouterApi.cs`, line 29 |
| **OWASP** | A02:2021 – Cryptographic Failures |
| **CWE** | CWE-312 – Cleartext Storage of Sensitive Information |

**Evidence:**
```csharp
// api/Crt.HttpClients/RouterApi.cs, line 29
var query = $"directions.json?criteria={criteria}&points={points}&roundTrip={roundTrip}&apikey={_apiKey}";
```

**Description:** The Router API key is appended as a URL query parameter. URL query strings are routinely recorded in nginx access logs, reverse proxy logs, and the Serilog structured log (`Proxy - {targetUri}`). This means the API key is logged in plaintext on every Router API call.

**Impact:** Any party with access to application logs (including Serilog outputs, nginx access.log) can extract the API key and use it independently.

**Recommendation:** Move API keys to HTTP request headers (e.g., `Authorization` or a custom `X-API-Key` header) rather than URL query parameters. Update the `RouterApi` to use `client.DefaultRequestHeaders.Add("apikey", _apiKey)`.

---

### VULN-006 — Full Response Content Logged on GeoServer / DataBC Exceptions

| Field | Value |
|---|---|
| **ID** | VULN-006 |
| **Severity** | **Medium** — Potentially sensitive API response data logged |
| **Category** | Sensitive Data Exposure |
| **Location** | `api/Crt.HttpClients/DataBCApi.cs`, lines 65 and 104; `api/Crt.HttpClients/GeoServerApi.cs`, lines 116, 167, 206, 244 |
| **OWASP** | A09:2021 – Security Logging and Monitoring Failures |
| **CWE** | CWE-532 – Insertion of Sensitive Information into Log File |

**Evidence:**
```csharp
// api/Crt.HttpClients/DataBCApi.cs, line 65
_logger.LogError($"Exception {ex.Message} - GetPolygonOfInterestForElectoralDistrict({boundingBox}): {query} - {content}");

// api/Crt.HttpClients/GeoServerApi.cs, line 116
_logger.LogError($"Exception: {ex.Message} - GetProjectExtent({projectId}): {query} - {content}");
```

**Description:** On exceptions, the full `content` of external API responses is written to the error log. The `query` variable includes the full constructed URL (potentially including API keys or user-controlled values). The `content` variable holds the raw HTTP response body which may contain spatial or personally identifiable data.

**Impact:** Log files may accumulate sensitive spatial data and API credentials. If logs are accessible to lower-privileged users or aggregated into an insecure logging pipeline, data could be exposed.

**Recommendation:** Log only the exception message, status code, and a truncated request summary. Do not log full response bodies. If debugging is needed, gate full-content logging behind a `LogLevel.Debug` check that is not enabled in production.

---

### VULN-007 — Swagger UI Exposed in All Environments

| Field | Value |
|---|---|
| **ID** | VULN-007 |
| **Severity** | **Medium** — API schema fully visible without authentication |
| **Category** | Security Misconfiguration |
| **Location** | `api/Crt.Api/Extensions/IApplicationBuilderExtensions.cs`, lines 44–50; `api/Crt.Api/Startup.cs`, line 57 |
| **OWASP** | A05:2021 – Security Misconfiguration |
| **CWE** | CWE-16 – Configuration |

**Evidence:**
```csharp
// api/Crt.Api/Extensions/IApplicationBuilderExtensions.cs, lines 44-50
public static void UseCrtSwagger(this IApplicationBuilder app, IWebHostEnvironment env, string url)
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint(url, "CRT REST API v1");
        options.DocExpansion(DocExpansion.None);
    });
}
// api/Crt.Api/Startup.cs, line 57
app.UseCrtSwagger(env, Configuration.GetSection("Constants:SwaggerApiUrl").Value);
// No env.IsDevelopment() guard
```

**Description:** Swagger UI and the OpenAPI specification endpoint (`/swagger/v1/swagger.json`) are enabled unconditionally in all environments. The nginx config also proxies the `/swagger/` path to the API. The Swagger endpoint is not protected by the global `AuthorizeFilter` (the Swagger middleware is added before authentication middleware and its endpoints are exempt).

**Impact:** Any unauthenticated party can access the full API schema, endpoint listing, parameter types, and response models. This substantially aids reconnaissance for attackers.

**Recommendation:** Guard Swagger behind an environment check:
```csharp
if (env.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(...);
}
```
If Swagger must be available in non-dev environments, add an authentication requirement to the Swagger endpoints.

---

### VULN-008 — Missing Security Headers

| Field | Value |
|---|---|
| **ID** | VULN-008 |
| **Severity** | **Medium** — Multiple browser security controls absent |
| **Category** | Security Misconfiguration |
| **Location** | `api/Crt.Api/Extensions/IApplicationBuilderExtensions.cs` (no headers middleware); `client/nginx.conf.tmpl` |
| **OWASP** | A05:2021 – Security Misconfiguration |
| **CWE** | CWE-16 – Configuration |

**Evidence:**
```csharp
// api/Crt.Api/Extensions/IApplicationBuilderExtensions.cs
// No call to app.UseHsts(), no NWebSec or similar middleware
// No UseResponseHeaders / custom header middleware
```

```nginx
# client/nginx.conf.tmpl, lines 65-67 (only headers present)
add_header Last-Modified $date_gmt;
add_header Cache-Control "private, no-store, no-cache, must-revalidate";
# Missing: X-Frame-Options, X-Content-Type-Options, Content-Security-Policy,
#          Strict-Transport-Security, Referrer-Policy, Permissions-Policy
```

**Description:** Neither the ASP.NET Core pipeline nor the nginx configuration applies the following security headers:
- `Strict-Transport-Security` (HSTS) — forces HTTPS-only connections
- `Content-Security-Policy` — prevents XSS via inline script execution
- `X-Frame-Options` — prevents clickjacking
- `X-Content-Type-Options: nosniff` — prevents MIME sniffing
- `Referrer-Policy` — controls referrer information leakage
- `Permissions-Policy` — restricts browser feature access

**Impact:** Without these headers, browsers cannot apply the most effective client-side mitigations for XSS, clickjacking, and information leakage.

**Recommendation:**
- Add security headers in nginx:
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), camera=(), microphone=()" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';" always;
```
- Or add `NetSecurityHeaders` / `NWebSec` middleware to the ASP.NET Core pipeline.

---

### VULN-009 — CORS Registered but Never Applied

| Field | Value |
|---|---|
| **ID** | VULN-009 |
| **Severity** | **Low** — CORS is a no-op; browser cross-origin behaviour is undefined |
| **Category** | Security Misconfiguration |
| **Location** | `api/Crt.Api/Startup.cs`, line 34 and the entire `Configure` method |
| **OWASP** | A05:2021 – Security Misconfiguration |
| **CWE** | CWE-16 – Configuration |

**Evidence:**
```csharp
// api/Crt.Api/Startup.cs, line 34
services.AddCors();

// api/Crt.Api/Startup.cs, Configure method (lines 44-59)
// app.UseCors() is never called — CORS middleware is registered but not activated
```

**Description:** `services.AddCors()` adds the CORS service but no policy is defined, and `app.UseCors()` is never called in the middleware pipeline. As a result, no CORS headers are emitted by the API. The nginx reverse proxy is implicitly the CORS boundary, but since CORS policy is never explicitly defined, cross-origin access control depends entirely on the deployment topology.

**Impact:** If the API is ever exposed directly without nginx (e.g., during development or in a misconfigured deployment), all cross-origin requests will succeed or fail based on browser defaults — not an explicit policy.

**Recommendation:** Either define and apply a CORS policy explicitly, or remove `services.AddCors()` to make the intent clear. If nginx is the intended CORS boundary, document this in the code.

---

## No Findings

The following patterns were checked and no issues were found:

- **SQL Injection**: The application uses Entity Framework Core throughout. The one `ExecuteSqlRawAsync` call in `UserRepository.cs` uses positional parameters (`{0}`, `{1}` etc.) which are correctly parameterised by EF Core — not string concatenation.
- **Insecure Deserialization**: No `BinaryFormatter`, `JsonSerializer` with `TypeNameHandling`, or `XStream` usage found.
- **Path Traversal**: No `File.ReadAllText`, `File.Open`, or similar file operations taking user input found in controllers.
- **Command Injection**: No `Process.Start`, `Runtime.exec()`, or shell invocation patterns found.
- **XXE**: No direct XML parser usage found; all XML/WFS queries use `string.Format` with static templates in `Queries.cs`.
- **Open Redirect**: No `Response.Redirect` or `LocalRedirect` with user-supplied URLs found.
- **Hardcoded Secrets**: Configuration files contain `<placeholder>` tokens, not actual credentials. The `appsettings.json` connection string references `localdb` (development only).
