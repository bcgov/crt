# Step 1 — Tech Stack Detection

## Detected Stack

| Category | Technology | Evidence |
|---|---|---|
| **Language (Backend)** | C# (.NET 7) | `api/Crt.Api/Crt.Api.csproj` — `<TargetFramework>net7.0</TargetFramework>` |
| **Framework (Backend)** | ASP.NET Core 7 | `api/Crt.Api/Startup.cs`, `api/Crt.Api/Program.cs` |
| **ORM** | Entity Framework Core 7 | `Microsoft.EntityFrameworkCore.SqlServer` v7.0.9 |
| **Database** | Microsoft SQL Server | `appsettings.json` connection string; `*.sql` schema scripts |
| **Authentication** | JWT Bearer / Keycloak (OIDC) | `Microsoft.AspNetCore.Authentication.JwtBearer` v7.0.9; `Keycloak` config section |
| **Directory Service** | Active Directory / LDAP (IDIR) | `Crt.Domain/Services/LdapService.cs`; `Novell.Directory.Ldap` |
| **Background Jobs** | Hangfire | `Hangfire.AspNetCore` v1.7.18 |
| **Logging** | Serilog | `Serilog.AspNetCore`, `Serilog.Sinks.Async` |
| **HTTP Clients** | .NET HttpClient (typed) | `Crt.HttpClients/` project — GeoServer, Router, DataBC APIs |
| **Language (Frontend)** | JavaScript / React 16 | `client/src/` — `.js` files; `react@^16.14.0` in package.json |
| **State Management** | Redux | `react-redux@^7.2.2`, `redux-thunk@^2.3.0` |
| **HTTP Client (FE)** | axios 0.21.4 | `client/package.json` |
| **CSS** | Bootstrap 4 + SASS | `bootstrap@^4.5.3`, `sass@^1.87.0` |
| **Bundler** | webpack 5.73.0 (via react-scripts 5) | `client/package-lock.json` |
| **Web Server** | nginx 1.25-alpine | `client/Dockerfile` |
| **Container Runtime** | Docker | `api/Dockerfile`, `client/Dockerfile` |
| **Runtime (API)** | .NET ASP.NET 7 (mcr.microsoft.com/dotnet/aspnet:7.0) | `api/Dockerfile` |
| **API Documentation** | Swashbuckle / Swagger | `Swashbuckle.AspNetCore` v5.6.3 |
| **Spatial Libraries** | NetTopologySuite, GeoJSON.Net | Used in `Crt.HttpClients/` and `Crt.Data/` |
| **Dynamic LINQ** | System.Linq.Dynamic.Core | `Crt.Data/IQueryableDynamicExtensions.cs` |

## Dependency Manifests Found

| File | Type |
|---|---|
| `api/Crt.Api/Crt.Api.csproj` | .NET NuGet manifest |
| `api/Crt.Hangfire/Crt.Hangfire.csproj` | .NET NuGet manifest |
| `api/Crt.HttpClients/Crt.HttpClients.csproj` | .NET NuGet manifest |
| `api/Crt.Domain/Crt.Domain.csproj` | .NET NuGet manifest |
| `api/Crt.Model/Crt.Model.csproj` | .NET NuGet manifest |
| `api/Crt.Data/Crt.Data.csproj` | .NET NuGet manifest |
| `client/package.json` | npm manifest |
| `client/package-lock.json` | npm lock file |

## Key Architecture Notes

- The app is a multi-tier SPA: React frontend served by nginx → proxied to ASP.NET Core API → SQL Server database.
- The nginx reverse proxy routes `/api/` → ASP.NET Core API at port 8080.
- The API acts as a secondary reverse proxy for GeoServer requests via the `/ogs-internal/` path (handled by `ReverseProxyMiddleware`).
- Authentication is via Keycloak (OIDC/JWT); users are also synced from Active Directory (IDIR LDAP).
- The `twm/` directory contains a third-party Track-Work Management web application (not fully analyzed due to scan timeout).
