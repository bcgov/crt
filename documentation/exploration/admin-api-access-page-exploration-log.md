# Admin - API Access Page - Playwright MCP Exploration Log

## Page Information
- **URL:** `https://dev-crt.th.gov.bc.ca/admin/api-access`
- **Title:** MoTI Capital and Rehabilitation Tracking
- **Explored:** 2026-06-03

## Page Object Model (POM)

```typescript
import { Page, Locator } from '@playwright/test';

export class AdminApiAccessPage {
  readonly page: Page;

  // Header
  readonly heading: Locator;

  // Content
  readonly restApiLink: Locator;
  readonly swaggerLink: Locator;
  readonly bearerTokenLink: Locator;
  readonly warningAlert: Locator;

  // Actions
  readonly createClientButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Header
    this.heading = page.getByRole('heading', { name: 'REST API Access' });

    // Content
    this.restApiLink = page.getByRole('link', { name: 'REST API' });
    this.swaggerLink = page.getByRole('link', { name: 'Swagger documentation' });
    this.bearerTokenLink = page.getByRole('link', { name: 'Bearer Token' });
    this.warningAlert = page.getByRole('alert');

    // Actions
    this.createClientButton = page.getByRole('button', { name: 'Create Client' });
  }

  async goto() {
    await this.page.goto('https://dev-crt.th.gov.bc.ca/admin/api-access');
  }

  async clickCreateClient() {
    await this.createClientButton.click();
  }

  async navigateToSwagger() {
    await this.swaggerLink.click();
  }
}
```

## Accessibility Snapshot (Raw)

```yaml
- generic [ref=e1411]:
  - heading "REST API Access" [level=1] [ref=e1413]
  - paragraph [ref=e1414]:
    - "CRT provides a complete"
    - link "REST API" -> https://en.wikipedia.org/wiki/Representational_state_transfer
    - ". It can be used to interact with the CRT application directly without the UI."
  - paragraph [ref=e1416]:
    - "Please refer to the"
    - link "Swagger documentation" -> /swagger/index.html
    - "for a list of usable APIs."
  - heading "API Access Client" [level=2] [ref=e1418]
  - paragraph: "An API Access Client is needed to obtain access to the CRT REST API."
  - alert [ref=e1420]:
    - strong: "Warning!"
    - "The API Access Client should be kept confidential..."
  - button "Create Client" [ref=e1422]
  - heading "Usage" [level=2] [ref=e1423]
  - paragraph: "how to obtain an access token (Bearer Token)..."
  - heading "Obtaining Access Token" [level=3] [ref=e1426]
  - code examples (cURL, PowerShell, Sample Response)
  - heading "Using CRT API" [level=3] [ref=e1433]
  - code examples (cURL, PowerShell, Sample Response)
```

## Key Observations
1. This is primarily a documentation/information page (not a CRUD page)
2. Single action: "Create Client" button generates API credentials
3. Token endpoint: `https://dev.loginproxy.gov.bc.ca/auth/realms/moti-custom/protocol/openid-connect/token`
4. Auth method: OAuth2 client_credentials grant type
5. Swagger docs available at `/swagger/index.html`
6. Warning alert about keeping API credentials confidential
7. API version from sample response: 1.0.4.0, .NET 7.0, environment: DEV
