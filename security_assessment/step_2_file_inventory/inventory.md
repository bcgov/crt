# Step 2 — File Inventory (Coverage Baseline)

## File Count Summary

| Category | Extensions | Approx Count | Security Relevant |
|---|---|---|---|
| C# Source (API) | `.cs` | ~250 | Yes |
| JavaScript (Frontend) | `.js` | ~100 | Yes |
| SQL Database Scripts | `.sql` | 61 | Yes |
| Configuration | `.json`, `.yaml`, `.xml`, `.tmpl` | ~60 | Yes |
| Dockerfiles | `Dockerfile*` | 4 | Yes |
| Documentation | `.md`, `.txt` | ~15 | Informational |
| CSS/SCSS | `.css`, `.scss` | ~10 | No |
| Other (images, fonts) | — | ~20 | No |

**Note:** Counts exclude `bin/`, `obj/`, and `node_modules/` trees.

---

## Security-Relevant File Listing

### Backend — API (C#, ASP.NET Core 7)

| Path | Purpose | Scanned |
|---|---|---|
| `api/Crt.Api/Startup.cs` | App pipeline, middleware, DI registration | Yes |
| `api/Crt.Api/Program.cs` | Host configuration, Serilog setup | Yes |
| `api/Crt.Api/appsettings.json` | App configuration, JWT settings, connection strings | Yes |
| `api/Crt.Api/Authentication/CrtJwtBearerEvents.cs` | JWT validation, user population | Yes |
| `api/Crt.Api/Authorization/PermissionHandler.cs` | Permission-based authorization | Yes |
| `api/Crt.Api/Authorization/RequiresPermissionFilter.cs` | Permission filter | Yes |
| `api/Crt.Api/Middlewares/ExceptionMiddleware.cs` | Global exception handling | Yes |
| `api/Crt.Api/Middlewares/ReverseProxyMiddleware.cs` | GeoServer reverse proxy | Yes |
| `api/Crt.Api/Extensions/IServiceCollectionExtensions.cs` | DI/auth/CORS/Swagger setup | Yes |
| `api/Crt.Api/Extensions/IApplicationBuilderExtensions.cs` | Middleware pipeline setup | Yes |
| `api/Crt.Api/Controllers/ProjectController.cs` | Project CRUD endpoints | Yes |
| `api/Crt.Api/Controllers/UsersController.cs` | User management endpoints | Yes |
| `api/Crt.Api/Controllers/SpatialController.cs` | Router proxy endpoint | Yes |
| `api/Crt.Api/Controllers/VersionController.cs` | Version info endpoint | Yes |
| `api/Crt.Domain/Services/LdapService.cs` | LDAP/AD authentication | Yes |
| `api/Crt.Domain/Services/KeyCloakService.cs` | Keycloak admin operations | Yes |
| `api/Crt.Domain/Services/UserService.cs` | User business logic | Yes |
| `api/Crt.Data/Repositories/Base/CrpRepositoryBase.cs` | Base repository with dynamic ordering | Yes |
| `api/Crt.Data/Repositories/UserRepository.cs` | User data access, raw SQL update | Yes |
| `api/Crt.Data/IQueryableDynamicExtensions.cs` | Dynamic LINQ order-by | Yes |
| `api/Crt.HttpClients/HttpClientsServiceCollectionExtensions.cs` | HTTP client registration | Yes |
| `api/Crt.HttpClients/GeoServerApi.cs` | GeoServer API client | Yes |
| `api/Crt.HttpClients/RouterApi.cs` | BC Router API client | Yes |
| `api/Crt.HttpClients/DataBCApi.cs` | DataBC API client | Yes |
| `api/Crt.Model/Constants.cs` | App-wide constants, permissions | Yes |
| `api/Crt.Model/RegexDefs.cs` | Input validation regex patterns | Yes |
| `api/Dockerfile` | API container definition | Yes |

### Frontend (JavaScript / React)

| Path | Purpose | Scanned |
|---|---|---|
| `client/src/js/Api.js` | Axios API wrapper | Referenced |
| `client/src/js/Keycloak.js` | Keycloak integration | Referenced |
| `client/package.json` | npm dependencies | Yes |
| `client/package-lock.json` | npm lock (Trivy source) | Yes (Trivy) |
| `client/Dockerfile` | Frontend container | Yes |
| `client/nginx.conf.tmpl` | nginx reverse proxy config | Yes |

### Database

| Path | Purpose | Scanned |
|---|---|---|
| `database/S00_01_CREATE_DB.sql` | DB creation | Yes |
| `database/S01_01_APP_CRT_USER_ACCESS_V2_dbCreate_ddl.sql` | User/role schema | Yes |
| `database/DataMigration/*.sql` (14 files) | ETL migration scripts | Yes |
| All other `database/S*.sql` files | Schema/data migrations | Yes |

---

## Excluded Paths

| Path | Reason |
|---|---|
| `api/*/bin/`, `api/*/obj/` | Compiled output, not source |
| `client/node_modules/` | Third-party packages (scanned by Trivy) |
| `twm/` | Third-party app; caused Trivy timeout (large bundled node_modules); requires separate scan |
| `client/build/` | Compiled frontend output |
