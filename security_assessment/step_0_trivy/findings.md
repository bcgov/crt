# Step 0 — Trivy Automated Scan Findings

## Scan Metadata

| Field | Value |
|---|---|
| **Trivy Version** | 0.69.3 |
| **Scan Date** | 2026-06-23 |
| **Vulnerability DB Updated** | 2026-06-23 (freshly downloaded) |
| **Scan Scope** | `trivy fs --scanners vuln,secret,misconfig --severity HIGH,CRITICAL` |
| **Skipped Dirs** | `node_modules, target, .git, dist, build, vendor, bin, obj, twm` |
| **Note** | The `twm/` directory was excluded due to a scan timeout caused by the large bundled `ol-mapbox-style-6.3.0/node_modules` sub-tree. Re-scan `twm/` in isolation if needed. |

---

## Vulnerabilities — client/package-lock.json (70 findings)

| CVE / GHSA ID | Package | Installed | Fixed | Severity |
|---|---|---|---|---|
| CVE-2026-44728 | @babel/plugin-transform-modules-systemjs | 7.18.5 | 7.x+ | HIGH |
| CVE-2025-27152 | axios | 0.21.4 | 1.x | HIGH |
| CVE-2026-25639 | axios | 0.21.4 | 1.x | HIGH |
| CVE-2026-42033 | axios | 0.21.4 | 1.x | HIGH |
| CVE-2026-42035 | axios | 0.21.4 | 1.x | HIGH |
| CVE-2026-42043 | axios | 0.21.4 | 1.x | HIGH |
| CVE-2026-44486 | axios | 0.21.4 | 1.x | HIGH |
| CVE-2026-44487 | axios | 0.21.4 | 1.x | HIGH |
| CVE-2026-44492 | axios | 0.21.4 | 1.x | HIGH |
| CVE-2026-44495 | axios | 0.21.4 | 1.x | HIGH |
| CVE-2026-44496 | axios | 0.21.4 | 1.x | HIGH |
| CVE-2024-45590 | body-parser | 1.20.0 | 1.20.3 | HIGH |
| CVE-2024-21538 | cross-spawn | 7.0.3 | 7.0.5 | HIGH |
| CVE-2022-38900 | decode-uri-component | 0.2.0 | 0.2.1 | HIGH |
| CVE-2026-32141 | flatted | 3.2.5 | 3.x+ | HIGH |
| CVE-2026-33228 | flatted | 3.2.5 | 3.x+ | HIGH |
| CVE-2025-7783 | form-data | 3.0.1 | 2.x+/4.x+ | HIGH |
| CVE-2026-12143 | form-data | 3.0.1 | 2.x+/4.x+ | HIGH |
| CVE-2024-21536 | http-proxy-middleware | 1.3.1 | 2.0.7+ | HIGH |
| CVE-2024-21536 | http-proxy-middleware | 2.0.6 | 2.0.7+ | HIGH |
| CVE-2026-29063 | immutable | 5.1.1 | 4.x+ | HIGH |
| CVE-2022-46175 | json5 | 1.0.1 | 2.2.2 | HIGH |
| CVE-2022-46175 | json5 | 2.2.1 | 2.2.2 | HIGH |
| CVE-2022-37601 | loader-utils | 2.0.0 | 2.0.4 | HIGH |
| CVE-2022-37599 | loader-utils | 2.0.0 | 1.4.2 | HIGH |
| CVE-2022-37603 | loader-utils | 2.0.0 | 1.4.2 | HIGH |
| CVE-2022-37599 | loader-utils | 3.2.0 | 1.4.2 | HIGH |
| CVE-2022-37603 | loader-utils | 3.2.0 | 1.4.2 | HIGH |
| CVE-2026-4800 | lodash | 4.17.21 | 4.x+ | HIGH |
| CVE-2026-4800 | lodash-es | 4.17.21 | 4.x+ | HIGH |
| CVE-2022-3517 | minimatch | 3.0.4 | 3.0.5 | HIGH |
| CVE-2026-26996 | minimatch | 3.0.4 | 1.x+ | HIGH |
| CVE-2026-27903 | minimatch | 3.0.4 | 1.x+ | HIGH |
| CVE-2026-27904 | minimatch | 3.0.4 | 1.x+ | HIGH |
| CVE-2026-26996 | minimatch | 3.1.2 | 1.x+ | HIGH |
| CVE-2026-27903 | minimatch | 3.1.2 | 1.x+ | HIGH |
| CVE-2026-27904 | minimatch | 3.1.2 | 1.x+ | HIGH |
| CVE-2026-26996 | minimatch | 5.1.0 | 1.x+ | HIGH |
| CVE-2026-27903 | minimatch | 5.1.0 | 1.x+ | HIGH |
| CVE-2026-27904 | minimatch | 5.1.0 | 1.x+ | HIGH |
| CVE-2022-31129 | moment | 2.29.3 | 2.29.4 | HIGH |
| CVE-2025-12816 | node-forge | 1.3.1 | 1.x+ | HIGH |
| CVE-2025-66031 | node-forge | 1.3.1 | 1.x+ | HIGH |
| CVE-2026-33891 | node-forge | 1.3.1 | 1.x+ | HIGH |
| CVE-2026-33894 | node-forge | 1.3.1 | 1.x+ | HIGH |
| CVE-2026-33895 | node-forge | 1.3.1 | 1.x+ | HIGH |
| CVE-2026-33896 | node-forge | 1.3.1 | 1.x+ | HIGH |
| CVE-2021-3803 | nth-check | 1.0.2 | 2.0.1 | HIGH |
| CVE-2024-45296 | path-to-regexp | 0.1.7 | 1.x+ | HIGH |
| CVE-2024-52798 | path-to-regexp | 0.1.7 | 0.1.12 | HIGH |
| CVE-2026-4867 | path-to-regexp | 0.1.7 | 0.1.x+ | HIGH |
| CVE-2024-45296 | path-to-regexp | 1.8.0 | 1.x+ | HIGH |
| CVE-2026-33671 | picomatch | 2.3.1 | 4.x+ | HIGH |
| CVE-2024-47068 | rollup | 2.75.6 | 3.x+ | HIGH |
| CVE-2026-27606 | rollup | 2.75.6 | 2.x+ | HIGH |
| CVE-2022-25883 | semver | 6.3.0 | 7.5.2 | HIGH |
| CVE-2022-25883 | semver | 7.0.0 | 7.5.2 | HIGH |
| CVE-2022-25883 | semver | 7.3.5 | 7.5.2 | HIGH |
| CVE-2022-25883 | semver | 7.3.7 | 7.5.2 | HIGH |
| GHSA-5c6j-r48x-rmvq | serialize-javascript | 4.0.0 | 7.0.3 | HIGH |
| GHSA-5c6j-r48x-rmvq | serialize-javascript | 6.0.0 | 7.0.3 | HIGH |
| **CVE-2026-9277** | **shell-quote** | **1.7.3** | **1.8.4** | **CRITICAL** |
| CVE-2026-29074 | svgo | 2.8.0 | 2.8.1 | HIGH |
| CVE-2022-25858 | terser | 5.14.1 | 4.8.1 / 5.14.2 | HIGH |
| **CVE-2023-28154** | **webpack** | **5.73.0** | **5.76.0** | **CRITICAL** |
| CVE-2024-29180 | webpack-dev-middleware | 5.3.3 | 5.3.4 | HIGH |
| CVE-2024-37890 | ws | 7.5.8 | 7.5.10 | HIGH |
| CVE-2026-48779 | ws | 7.5.8 | 5.x+ | HIGH |
| CVE-2024-37890 | ws | 8.8.0 | 8.17.1 | HIGH |
| CVE-2026-48779 | ws | 8.8.0 | 8.x+ | HIGH |

### Summary: 68 HIGH, 2 CRITICAL

---

## Misconfigurations — Dockerfile

| Location | AVDID | Title | Severity |
|---|---|---|---|
| `client/node_modules/@surma/rollup-plugin-off-main-thread/Dockerfile` | — | `RUN <package-manager> update` instruction alone | HIGH |

**Note:** This Dockerfile is inside a vendored build-time dependency (`node_modules` sub-directory of a dev tool). It is not a deployed Dockerfile and poses no production risk. It is flagged for completeness.

---

## Secrets

No secrets were detected by Trivy in this scan.

---

## Not Scanned

The `twm/` directory was excluded. It contains a third-party web-mapping application (`ol-mapbox-style-6.3.0`) with a large node_modules tree that caused a timeout on the Trivy dockerfile scanner. Manual analysis of `twm/` is recommended.
