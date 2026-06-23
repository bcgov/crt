# Step 3 — Configuration & Infrastructure Findings

## Files Scanned

- `api/Crt.Api/appsettings.json`
- `api/Crt.Api/Extensions/IServiceCollectionExtensions.cs`
- `api/Crt.Api/Extensions/IApplicationBuilderExtensions.cs`
- `api/Crt.Api/Startup.cs`
- `api/Dockerfile`
- `client/Dockerfile`
- `client/nginx.conf.tmpl`
- `api/Crt.HttpClients/HttpClientsServiceCollectionExtensions.cs`

---

## Findings

### CFG-001 — `appsettings.json` Contains Development Connection String Committed to Source Control

| Field | Value |
|---|---|
| **ID** | CFG-001 |
| **Severity** | **Medium** — Development credential pattern committed; risk of accidental production use |
| **Category** | Sensitive Data Exposure |
| **Location** | `api/Crt.Api/appsettings.json`, lines 34–36 |
| **OWASP** | A02:2021 – Cryptographic Failures |
| **CWE** | CWE-312 – Cleartext Storage of Sensitive Information |

**Evidence:**
```json
// api/Crt.Api/appsettings.json, lines 34-36
"ConnectionStrings": {
  "CRT": "Server=(localdb)\\mssqllocaldb;Database=CRT_DEV;Trusted_Connection=True;MultipleActiveResultSets=true"
},
```

**Description:** A SQL Server LocalDB connection string targeting a development database named `CRT_DEV` is committed in source control. The service account placeholders in `ServiceAccount`, `Keycloak`, and `Router` sections use clearly marked placeholders (`<ServiceAccount:User>`, `<service-client-id>`, etc.) and are not production credentials. The LocalDB string, however, is a real (if development-only) connection string that reveals database naming conventions and server topology.

**Impact:** Low production risk since LocalDB is not accessible remotely. However, committed config patterns can lead to accidental copy-paste errors where real credentials are committed.

**Recommendation:** Replace the connection string in `appsettings.json` with an obviously invalid placeholder (e.g., `Server=<server>;Database=<database>;...`). Use `appsettings.Development.json` (gitignored) for developer-specific settings. Ensure `.gitignore` excludes all `appsettings.*.json` files except the base template.

---

### CFG-002 — HTTPS Not Enforced at the Application Level

| Field | Value |
|---|---|
| **ID** | CFG-002 |
| **Severity** | **Medium** — Transport encryption is not enforced by the application |
| **Category** | Cryptographic Failures / Transport |
| **Location** | `api/Crt.Api/Startup.cs` (Configure method); `api/Dockerfile` |
| **OWASP** | A02:2021 – Cryptographic Failures |
| **CWE** | CWE-319 – Cleartext Transmission of Sensitive Information |

**Evidence:**
```csharp
// api/Crt.Api/Startup.cs, Configure method — no app.UseHttpsRedirection(), no app.UseHsts()
public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ...)
{
    if (env.IsDevelopment())
        app.UseDeveloperExceptionPage();

    app.UseExceptionMiddleware();
    app.UseCrtHealthCheck();
    app.UseRouting();
    app.UseAuthentication();
    // No UseHttpsRedirection(), no UseHsts()
```

```dockerfile
# api/Dockerfile, line 22
ENV ASPNETCORE_URLS=http://+:8080
# No HTTPS port or certificate
```

**Description:** The API is configured to listen exclusively on HTTP (`http://+:8080`) with no HTTPS redirect. HSTS (`UseHsts()`) is also absent. The application relies on the upstream nginx proxy to terminate TLS — a valid pattern for containerised deployments — but it means any direct access to the API port bypasses TLS entirely. The nginx config correctly uses `$scheme` for `X-Forwarded-Proto`, but does not enforce HTTPS with a redirect.

**Impact:** If the API port is accidentally exposed (misrouted OpenShift route, developer port-forward, etc.), communications including JWT tokens are in cleartext.

**Recommendation:** Add `app.UseHttpsRedirection()` and `app.UseHsts()` for defence-in-depth, or at minimum document the TLS-termination-at-proxy policy. Confirm the nginx deployment enforces HTTPS on the external listener.

---

### CFG-003 — GeoServer Basic Authentication Credentials Sent Without TLS at API Layer

| Field | Value |
|---|---|
| **ID** | CFG-003 |
| **Severity** | **Medium** — Service account credentials transmitted in Authorization header over internal HTTP |
| **Category** | Sensitive Data Exposure |
| **Location** | `api/Crt.HttpClients/HttpClientsServiceCollectionExtensions.cs`, lines 27–31 |
| **OWASP** | A02:2021 – Cryptographic Failures |
| **CWE** | CWE-319 – Cleartext Transmission of Sensitive Information |

**Evidence:**
```csharp
// api/Crt.HttpClients/HttpClientsServiceCollectionExtensions.cs, lines 27-31
var userId = config.GetValue<string>("ServiceAccount:User");
var password = config.GetValue<string>("ServiceAccount:Password");
var basicAuth = Convert.ToBase64String(
    Encoding.GetEncoding("ISO-8859-1").GetBytes($"{userId}:{password}"));
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicAuth);
```

**Description:** The GeoServer HTTP client is configured with Basic Authentication (base64-encoded service account credentials). If the GeoServer URL (`GeoServer{env}:Url`) resolves to an HTTP endpoint (not HTTPS), the service account credentials are transmitted in cleartext on the network.

**Impact:** Any party with network access between the API and GeoServer can capture the service account password.

**Recommendation:** Verify that all GeoServer URLs in all environments use `https://`. Enforce HTTPS in the `HttpClient` configuration by rejecting non-HTTPS base addresses. Consider using bearer tokens instead of Basic Auth where possible.

---

### CFG-004 — DeveloperExceptionPage Enabled in Development Without Explicit Guard

| Field | Value |
|---|---|
| **ID** | CFG-004 |
| **Severity** | **Low** — Correct guard present; informational note |
| **Category** | Information Disclosure |
| **Location** | `api/Crt.Api/Startup.cs`, line 46 |
| **OWASP** | A05:2021 – Security Misconfiguration |
| **CWE** | CWE-209 – Generation of Error Message Containing Sensitive Information |

**Evidence:**
```csharp
// api/Crt.Api/Startup.cs, lines 46-47
if (env.IsDevelopment())
    app.UseDeveloperExceptionPage();
```

**Description:** The developer exception page is correctly guarded by `env.IsDevelopment()`. This finding is informational to confirm the guard is in place. If `ASPNETCORE_ENVIRONMENT` is accidentally set to `Development` in production, full stack traces would be returned to clients.

**Impact:** Low, because the guard is present. Risk only materialises if environment misconfiguration occurs.

**Recommendation:** Confirm that no production deployment sets `ASPNETCORE_ENVIRONMENT=Development`. Add a startup assertion or configuration validation to block startup if `isDevelopment` is true in a production OpenShift environment.

---

### CFG-005 — Nginx Missing Security Headers

Already documented as VULN-008 in code analysis. Summary:

The nginx `nginx.conf.tmpl` only sets `Cache-Control` and `Last-Modified`. Missing:
- `Strict-Transport-Security`
- `Content-Security-Policy`
- `X-Frame-Options`
- `X-Content-Type-Options`
- `Referrer-Policy`
- `Permissions-Policy`

See VULN-008 for full details and recommended fixes.

---

### CFG-006 — API Dockerfile Uses .NET 7 (EOL) Base Image

| Field | Value |
|---|---|
| **ID** | CFG-006 |
| **Severity** | **High** — Running on an end-of-life runtime with no security patching |
| **Category** | Security Misconfiguration / EOL Component |
| **Location** | `api/Dockerfile`, lines 1 and 17 |
| **OWASP** | A06:2021 – Vulnerable and Outdated Components |
| **CWE** | CWE-1104 – Use of Unmaintained Third-Party Components |

**Evidence:**
```dockerfile
# api/Dockerfile, lines 1 and 17
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
...
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS runtime
```

**Description:** The API uses .NET 7 base images, which reached End of Support on **May 14, 2024**. Microsoft no longer releases security patches for the .NET 7 runtime. The `mcr.microsoft.com/dotnet/aspnet:7.0` image will not receive OS-level or runtime-level CVE fixes.

**Impact:** Any runtime-level vulnerability discovered in .NET 7 after May 2024 will remain unpatched. The container surface also includes the underlying OS packages which are equally unpatched.

**Recommendation:** Migrate to .NET 8 LTS (`mcr.microsoft.com/dotnet/aspnet:8.0`) or .NET 9. .NET 8 is supported until November 10, 2026. Update all `.csproj` `<TargetFramework>` values from `net7.0` to `net8.0` and resolve any breaking changes.

---

## No Issues Found

- **CORS**: No wildcard `*` origin found. `services.AddCors()` registers the service but no permissive policy is configured.
- **Debug mode in production**: No evidence that `DEBUG=True` or equivalent is set in production configuration.
- **Template injection**: The nginx config uses `${ENVIRONMENT}` variable substitution via `envsubst` in the start script — this is a deployment-time pattern, not a runtime injection risk.
- **Exposed admin endpoints**: No Hangfire Dashboard (`UseHangfireDashboard`) was found in the codebase; the Hangfire server runs silently.
