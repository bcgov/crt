# Navigation Menu - Playwright MCP Exploration Log

## Page Information
- **Location:** Header bar on all pages
- **Explored:** 2026-06-03

## Page Object Model (POM)

```typescript
import { Page, Locator } from '@playwright/test';

export class NavigationMenu {
  readonly page: Page;

  // Logo/Brand
  readonly bcGovLogo: Locator;
  readonly cartLogo: Locator;
  readonly toggleNavigationButton: Locator;

  // Main Nav Links
  readonly projectsLink: Locator;
  readonly reportsDropdown: Locator;
  readonly adminDropdown: Locator;

  // Reports Dropdown Items
  readonly powerBIReportsItem: Locator;

  // Admin Dropdown Items
  readonly usersItem: Locator;
  readonly rolesAndPermissionsItem: Locator;
  readonly codeTablesItem: Locator;
  readonly elementsItem: Locator;
  readonly apiAccessItem: Locator;
  readonly versionItem: Locator;

  // User
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Logo/Brand
    this.bcGovLogo = page.getByRole('link', { name: 'B.C. Government Logo' });
    this.cartLogo = page.getByRole('link', { name: 'CaRT Logo' });
    this.toggleNavigationButton = page.locator('button[aria-label="Toggle navigation"]');

    // Main Nav Links
    this.projectsLink = page.getByRole('link', { name: 'Projects' });
    this.reportsDropdown = page.getByRole('link', { name: 'Reports' });
    this.adminDropdown = page.getByRole('link', { name: 'Admin' });

    // Reports Dropdown Items
    this.powerBIReportsItem = page.getByRole('menuitem', { name: 'PowerBI Reports' });

    // Admin Dropdown Items
    this.usersItem = page.getByRole('menuitem', { name: 'Users' });
    this.rolesAndPermissionsItem = page.getByRole('menuitem', { name: 'Roles and Permissions' });
    this.codeTablesItem = page.getByRole('menuitem', { name: 'Code Tables' });
    this.elementsItem = page.getByRole('menuitem', { name: 'Elements' });
    this.apiAccessItem = page.getByRole('menuitem', { name: 'API Access' });
    this.versionItem = page.getByRole('menuitem', { name: 'Version' });

    // User
    this.logoutButton = page.getByRole('button', { name: /Logout/ });
  }

  async navigateToProjects() {
    await this.projectsLink.click();
  }

  async openReportsDropdown() {
    await this.reportsDropdown.click();
  }

  async openAdminDropdown() {
    await this.adminDropdown.click();
  }

  async navigateToPowerBIReports() {
    await this.openReportsDropdown();
    await this.powerBIReportsItem.click();
  }

  async navigateToUsers() {
    await this.openAdminDropdown();
    await this.usersItem.click();
  }

  async navigateToRolesAndPermissions() {
    await this.openAdminDropdown();
    await this.rolesAndPermissionsItem.click();
  }

  async navigateToCodeTables() {
    await this.openAdminDropdown();
    await this.codeTablesItem.click();
  }

  async navigateToElements() {
    await this.openAdminDropdown();
    await this.elementsItem.click();
  }

  async navigateToApiAccess() {
    await this.openAdminDropdown();
    await this.apiAccessItem.click();
  }

  async navigateToVersion() {
    await this.openAdminDropdown();
    await this.versionItem.click();
  }

  async logout() {
    await this.logoutButton.click();
  }
}
```

## Accessibility Snapshot (Raw)

```yaml
Navigation structure (from expanded nav at 1280px viewport):
- navigation [ref=e4]: (top bar with logos)
  - link "B.C. Government Logo" -> /
  - generic: "MoTI Capital and Rehabilitation Tracking"
  - link "CaRT Logo" -> /
  - button "Toggle navigation" (only visible on narrow viewports)

- navigation [ref=e13]: (main nav)
  - list [ref=e16]: (left nav items)
    - listitem: link "Projects" -> /projects
    - listitem: link "Reports" -> "#" (dropdown)
      - menu (when expanded):
        - menuitem "PowerBI Reports" -> opens new tab to https://dev-dwpbi.th.gov.bc.ca/reports/browse/CRT
    - listitem: link "Admin" -> "#" (dropdown)
      - menu (when expanded):
        - menuitem "Users" -> /admin/users
        - menuitem "Roles and Permissions" -> (TBD)
        - menuitem "Code Tables" -> (TBD)
        - menuitem "Elements" -> (TBD)
        - menuitem "API Access" -> (TBD)
        - menuitem "Version" -> (TBD)
  - list [ref=e23]: (right nav items)
    - listitem:
      - button "BARRYJIN, Logout" (with user icon)
```

## Key Observations
1. Navigation has three main sections: Projects, Reports, Admin
2. Reports is a dropdown with a single item: "PowerBI Reports" (opens external site in new tab)
3. Admin is a dropdown with 6 items: Users, Roles and Permissions, Code Tables, Elements, API Access, Version
4. User logout button is on the right side showing username "BARRYJIN, Logout"
5. Toggle navigation hamburger button is for responsive/mobile views
6. Home links (both logos) redirect to `/projects` list
7. The navigation bar uses Bootstrap-style classes (navbar-toggler, etc.)
