# Step 3 — Dependency & Component Analysis (SCA) Findings

## Manifests Scanned

| Manifest | Ecosystem | Source |
|---|---|---|
| `client/package-lock.json` | npm (Node.js) | Trivy |
| `api/Crt.Api/Crt.Api.csproj` | NuGet (.NET) | Manual |
| `api/Crt.Hangfire/Crt.Hangfire.csproj` | NuGet (.NET) | Manual |

---

## npm Dependencies — CVE Findings [Trivy]

All findings below are `[Trivy]`-confirmed. Source: `client/package-lock.json`.

### Critical

| Package | Installed | Fixed | CVE | Description | Tag |
|---|---|---|---|---|---|
| `shell-quote` | 1.7.3 | 1.8.4 | CVE-2026-9277 | Command injection via unescaped line terminators in `.op` field. CVSS 4.0: **9.2**. | [Trivy] |
| `webpack` | 5.73.0 | 5.76.0 | CVE-2023-28154 | Cross-realm object access via magic comments in ImportParserPlugin. CVSS 3.1: **9.8**. | [Trivy] |

### High

| Package | Installed | Fixed | CVE / GHSA | Description | Tag |
|---|---|---|---|---|---|
| `axios` | 0.21.4 | 1.x | CVE-2025-27152, CVE-2026-42033, CVE-2026-42035, CVE-2026-42043, CVE-2026-44486–44496 (10 CVEs) | Multiple vulnerabilities in very old axios 0.21.x. Upgrade to 1.7+. | [Trivy] |
| `body-parser` | 1.20.0 | 1.20.3 | CVE-2024-45590 | DoS via deeply nested objects. | [Trivy] |
| `cross-spawn` | 7.0.3 | 7.0.5 | CVE-2024-21538 | ReDoS via malformed shell arguments. | [Trivy] |
| `decode-uri-component` | 0.2.0 | 0.2.1 | CVE-2022-38900 | Crash on malformed URI sequences. | [Trivy] |
| `flatted` | 3.2.5 | 3.x+ | CVE-2026-32141, CVE-2026-33228 | Prototype pollution. | [Trivy] |
| `form-data` | 3.0.1 | 4.x+ | CVE-2025-7783, CVE-2026-12143 | Multiple issues. | [Trivy] |
| `http-proxy-middleware` | 1.3.1, 2.0.6 | 2.0.7+ | CVE-2024-21536 | ReDoS. | [Trivy] |
| `immutable` | 5.1.1 | 4.x+ | CVE-2026-29063 | Prototype pollution. | [Trivy] |
| `json5` | 1.0.1, 2.2.1 | 2.2.2 | CVE-2022-46175 | Prototype pollution via `__proto__`. | [Trivy] |
| `loader-utils` | 2.0.0, 3.2.0 | 2.0.4 | CVE-2022-37601, CVE-2022-37599, CVE-2022-37603 | Prototype pollution, ReDoS. | [Trivy] |
| `lodash` / `lodash-es` | 4.17.21 | 4.x+ | CVE-2026-4800 | Prototype pollution. | [Trivy] |
| `minimatch` | 3.0.4, 3.1.2, 5.1.0 | 3.0.5+ | CVE-2022-3517, CVE-2026-26996, CVE-2026-27903, CVE-2026-27904 | ReDoS and other issues. | [Trivy] |
| `moment` | 2.29.3 | 2.29.4 | CVE-2022-31129 | ReDoS with specific input. | [Trivy] |
| `node-forge` | 1.3.1 | 1.x+ | CVE-2025-12816, CVE-2025-66031, CVE-2026-33891, CVE-2026-33894, CVE-2026-33895, CVE-2026-33896 | Cryptographic/TLS vulnerabilities. | [Trivy] |
| `nth-check` | 1.0.2 | 2.0.1 | CVE-2021-3803 | ReDoS. | [Trivy] |
| `path-to-regexp` | 0.1.7, 1.8.0 | 1.9.0+ | CVE-2024-45296, CVE-2024-52798, CVE-2026-4867 | Catastrophic backtracking / DoS. | [Trivy] |
| `picomatch` | 2.3.1 | 4.x+ | CVE-2026-33671 | ReDoS. | [Trivy] |
| `rollup` | 2.75.6 | 3.x+ | CVE-2024-47068, CVE-2026-27606 | Prototype pollution / DOM clobbering. | [Trivy] |
| `semver` | 6.3.0, 7.0.0, 7.3.5, 7.3.7 | 7.5.2 | CVE-2022-25883 | ReDoS via complex range inputs. | [Trivy] |
| `serialize-javascript` | 4.0.0, 6.0.0 | 7.0.3 | GHSA-5c6j-r48x-rmvq | RCE via `RegExp.flags` injection. | [Trivy] |
| `svgo` | 2.8.0 | 2.8.1 | CVE-2026-29074 | DoS via XML entity expansion. | [Trivy] |
| `terser` | 5.14.1 | 5.14.2 | CVE-2022-25858 | ReDoS. | [Trivy] |
| `webpack-dev-middleware` | 5.3.3 | 5.3.4 | CVE-2024-29180 | Path traversal — file exfiltration on dev server. | [Trivy] |
| `ws` | 7.5.8, 8.8.0 | 7.5.10 / 8.17.1 | CVE-2024-37890, CVE-2026-48779 | DoS via excessive HTTP headers. | [Trivy] |
| `@babel/plugin-transform-modules-systemjs` | 7.18.5 | 7.x+ | CVE-2026-44728 | Code injection. | [Trivy] |

**Total: 2 Critical, 68 High**

> **Note:** Many of these are build-time / devDependency packages (`webpack`, `webpack-dev-middleware`, `terser`, `rollup`, `babel`). They do not execute in the production browser bundle. However, the `axios`, `lodash`, `moment`, `path-to-regexp`, and `body-parser` packages do ship to browsers or run server-side and should be treated as production risks.

---

## .NET NuGet Dependencies [AI-estimated]

Trivy did not scan `.csproj` files (no NuGet lock file present). The following are AI-estimated risk assessments based on package names and versions.

| Package | Version | Risk Assessment | Tag |
|---|---|---|---|
| `Hangfire.AspNetCore` / `HangFire.SqlServer` | 1.7.18 | The Hangfire Dashboard is not configured in the code (no `UseHangfireDashboard()` call found), so there is no exposed admin UI. Version 1.7.18 is older but no critical CVEs confirmed at this version. | [AI-estimated] |
| `Microsoft.AspNetCore.Authentication.JwtBearer` | 7.0.9 | Tied to .NET 7 lifecycle. .NET 7 reached End of Support on May 14, 2024. All .NET 7 packages are now unsupported and no longer receive security patches. | [AI-estimated] |
| `Microsoft.EntityFrameworkCore.SqlServer` | 7.0.9 | Same — .NET 7 EOL concern. | [AI-estimated] |
| `Swashbuckle.AspNetCore` | 5.6.3 | Old version; no critical CVE confirmed. However, this version predates several security improvements. | [AI-estimated] |
| `Novell.Directory.Ldap` | version not inspected | Third-party LDAP library. Custom certificate validation callback overrides library defaults — see VULN-003. | [AI-estimated] |
| `System.Linq.Dynamic.Core` | version not inspected | Used for `DynamicOrderBy`. LINQ injection vector — see VULN-004. | [AI-estimated] |

### ⚠️ .NET 7 End of Life

**All ASP.NET Core 7 packages are no longer supported.** .NET 7 reached End of Support on **May 14, 2024**. Microsoft will not release any further security patches for this runtime. The application should be migrated to .NET 8 LTS (supported until November 2026) or .NET 9.
