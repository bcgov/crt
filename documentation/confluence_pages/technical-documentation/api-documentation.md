---
source: [API Documentation](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302648/API+Documentation)
last_updated: 2026-05-08
---

# API Documentation

## Swagger (Dev environment)

[https://dev-crt.th.gov.bc.ca/swagger/index.html](https://dev-crt.th.gov.bc.ca/swagger/index.html)

## Postman Setup

For testing CRT API, Postman can be used. To authorize, the following setup is required:

1. Click Authorization tab
2. Select OAuth 2.0 in the type dropdown
3. Select Request Headers in the authorization data to dropdown

<!-- IMAGE: Postman authorization tab - image2021-5-20_13-7-48.png -->

4. Click Get New Access Token button and type in the following for the DEV environment:

<!-- IMAGE: Postman token config - image2021-1-8_9-22-55.png -->

- **Callback URL:** https://dev-crt.th.gov.bc.ca/
- **Auth URL:** https://dev.oidc.gov.bc.ca/auth/realms/kmas316h/protocol/openid-connect/auth
- **Access Token URL:** https://dev.oidc.gov.bc.ca/auth/realms/kmas316h/protocol/openid-connect/token
- **Client ID:** moti-idir-dev
