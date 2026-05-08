---
source: [System Security](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302718/System+Security)
last_updated: 2026-05-08
---

# System Security

## CRT Authentication

CRT uses Keycloak for authorization where there is only one identity provider - IDIR.

### Keycloak configurations (realm kmas316h)

- **DEV:** https://dev.oidc.gov.bc.ca/auth/admin/kmas316h/console/
- **TEST:** https://test.oidc.gov.bc.ca/auth/admin/kmas316h/console/
- **PROD:** https://oidc.gov.bc.ca/auth/admin/kmas316h/console/

## Client Mappers Configuration

Clients used in Keycloak must have the correct Mappers configured, otherwise the token will not contain the necessary information needed to identify the users. CRT uses `moti-idir-{env}` client where env can be dev, test or prod.

### IDIR USER GUID

IDIR users can be uniquely identified using their GUID. This value is not included in the JWT token by default and therefore must be mapped manually.

#### IDIR GUID Mapper

| Setting | Value |
|---------|-------|
| Protocol | openid-connect |
| Name | idir_userid |
| Mapper Type | User Attribute |
| User Attribute | idir_userid |
| Token Claim Name | idir_userid |
| Claim JSON Type | String |
| Add to ID token | On |
| Add to access token | On |
| Add to userinfo | On |

#### Audience Mapper

| Setting | Value |
|---------|-------|
| Protocol | openid-connect |
| Name | audience |
| Mapper Type | Audience |
| Included Client Audience | moti-idir-{env} |
| Include Custom Audience | moti-idir-{env} |
| Add to ID token | Off |
| Add to access token | On |
