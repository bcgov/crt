# Admin - Version Page - Playwright MCP Exploration Log

## Page Information
- **URL:** `https://dev-crt.th.gov.bc.ca/version`
- **Title:** MoTI Capital and Rehabilitation Tracking
- **Explored:** 2026-06-03

## Page Object Model (POM)

```typescript
import { Page, Locator } from '@playwright/test';

export class AdminVersionPage {
  readonly page: Page;

  // Header
  readonly heading: Locator;

  // Version fields
  readonly nameValue: Locator;
  readonly descriptionValue: Locator;
  readonly versionValue: Locator;
  readonly frameworkValue: Locator;
  readonly buildTimeValue: Locator;
  readonly runtimeVersionValue: Locator;
  readonly gitCommitApiValue: Locator;
  readonly gitCommitClientValue: Locator;
  readonly environmentValue: Locator;

  constructor(page: Page) {
    this.page = page;

    // Header
    this.heading = page.getByRole('heading', { name: 'Application Version' });

    // Version fields (using locators relative to their labels)
    this.nameValue = page.locator('[ref=e1449]');
    this.descriptionValue = page.locator('[ref=e1453]');
    this.versionValue = page.locator('[ref=e1457]');
    this.frameworkValue = page.locator('[ref=e1461]');
    this.buildTimeValue = page.locator('[ref=e1465]');
    this.runtimeVersionValue = page.locator('[ref=e1469]');
    this.gitCommitApiValue = page.locator('[ref=e1473]');
    this.gitCommitClientValue = page.locator('[ref=e1477]');
    this.environmentValue = page.locator('[ref=e1481]');
  }

  async goto() {
    await this.page.goto('https://dev-crt.th.gov.bc.ca/version');
  }

  async getVersionInfo(): Promise<Record<string, string>> {
    return {
      name: await this.nameValue.textContent() || '',
      description: await this.descriptionValue.textContent() || '',
      version: await this.versionValue.textContent() || '',
      framework: await this.frameworkValue.textContent() || '',
      buildTime: await this.buildTimeValue.textContent() || '',
      runtimeVersion: await this.runtimeVersionValue.textContent() || '',
      gitCommitApi: await this.gitCommitApiValue.textContent() || '',
      gitCommitClient: await this.gitCommitClientValue.textContent() || '',
      environment: await this.environmentValue.textContent() || '',
    };
  }
}
```

## Accessibility Snapshot (Raw)

```yaml
- generic [ref=e1443]:
  - heading "Application Version" [level=1] [ref=e1445]
  - generic: strong "Name" | value: "Crt.Api"
  - generic: strong "Description" | value: "The API server for CRT (Capital Rehabilitation Project Tracking)"
  - generic: strong "Version" | value: "1.0.4.0"
  - generic: strong "Framework" | value: ".NETCoreApp,Version=v7.0"
  - generic: strong "Build Time" | value: "2026-04-29T17:43:26.0000000Z"
  - generic: strong "Runtime Version" | value: "v4.0.30319"
  - generic: strong "Git Commit (API)" | value: "7f45261f9401667884dccbcabfbea76e655372a9"
  - generic: strong "Git Commit (Client)" | value: "83014503487e9796399b25478b48b7f9085287c8"
  - generic: strong "Environment" | value: "DEV"
```

## Key Observations
1. Read-only informational page — no interactive elements
2. Shows both API and Client git commits (separate deployable components)
3. Built on .NET 7.0 (API server)
4. Current environment: DEV
5. Useful for smoke tests — verifying the correct version is deployed
6. Version 1.0.4.0 with build from 2026-04-29
