# Admin - API Access Page

## Overview
- **Page Name:** REST API Access
- **URL:** `https://dev-crt.th.gov.bc.ca/admin/api-access`
- **Purpose:** Documentation page for REST API access. Provides instructions on creating an API client and using the CRT API programmatically with bearer tokens.

## Key Elements

### Header
| Element | Description | Selector |
|---------|-------------|----------|
| Page Heading | "REST API Access" h1 | `h1` with text "REST API Access" |

### Content Sections
| Section | Description |
|---------|-------------|
| Introduction | Describes that CRT provides a REST API |
| REST API Link | External link to Wikipedia REST API article |
| Swagger Documentation Link | Link to `/swagger/index.html` for API docs |
| API Access Client | Instructions for creating a client |
| Warning Alert | Confidentiality warning about API client credentials |
| Create Client Button | Creates an API access client |
| Usage | Instructions for obtaining and using access tokens |
| Obtaining Access Token | cURL and PowerShell examples |
| Using CRT API | cURL and PowerShell examples with Bearer token |

### Action Buttons
| Element | Description | Selector |
|---------|-------------|----------|
| Create Client | Creates a new API access client | `button` with text "Create Client" |

### Links
| Element | URL | Description |
|---------|-----|-------------|
| REST API | https://en.wikipedia.org/wiki/Representational_state_transfer | External info |
| Swagger documentation | /swagger/index.html | API documentation |
| Bearer Token | https://oauth.net/2/bearer-tokens/ | External info |

### Code Examples
- **Token endpoint:** `https://dev.loginproxy.gov.bc.ca/auth/realms/moti-custom/protocol/openid-connect/token`
- **API base URL:** `https://dev-crt.th.gov.bc.ca/api/`

## Screenshot
![Admin API Access Page](screenshots/admin-api-access-page.png)
