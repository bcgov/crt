# Admin - Version Page

## Overview
- **Page Name:** Application Version
- **URL:** `https://dev-crt.th.gov.bc.ca/version`
- **Purpose:** Displays application version information including build details, framework, and git commit hashes.

## Key Elements

### Header
| Element | Description | Selector |
|---------|-------------|----------|
| Page Heading | "Application Version" h1 | `h1` with text "Application Version" |

### Version Information (Read-Only)
| Field | Description | Example Value |
|-------|-------------|---------------|
| Name | Application name | "Crt.Api" |
| Description | Application description | "The API server for CRT (Capital Rehabilitation Project Tracking)" |
| Version | Semantic version | "1.0.4.0" |
| Framework | Target framework | ".NETCoreApp,Version=v7.0" |
| Build Time | When the app was built | "2026-04-29T17:43:26.0000000Z" |
| Runtime Version | CLR runtime version | "v4.0.30319" |
| Git Commit (API) | API repository git hash | "7f45261f9401667884dccbcabfbea76e655372a9" |
| Git Commit (Client) | Client repository git hash | "83014503487e9796399b25478b48b7f9085287c8" |
| Environment | Deployment environment | "DEV" |

## Notes
- This is a read-only informational page with no interactive elements (no edit/add/delete)
- Useful for verifying deployments and troubleshooting

## Screenshot
![Admin Version Page](screenshots/admin-version-page.png)
