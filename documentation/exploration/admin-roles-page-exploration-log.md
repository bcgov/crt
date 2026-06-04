# Admin - Roles and Permissions Page - Playwright MCP Exploration Log

## Page Information
- **URL:** `https://dev-crt.th.gov.bc.ca/admin/roles?isActive=true&pageNumber=1&pageSize=25`
- **Title:** MoTI Capital and Rehabilitation Tracking
- **Explored:** 2026-06-03

## Page Object Model (POM)

```typescript
import { Page, Locator } from '@playwright/test';

export class AdminRolesPage {
  readonly page: Page;

  // Header
  readonly heading: Locator;

  // Search/Filter
  readonly searchTextbox: Locator;
  readonly activeFilter: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;

  // Actions
  readonly addRoleButton: Locator;

  // Table
  readonly rolesTable: Locator;
  readonly roleNameHeader: Locator;
  readonly roleDescriptionHeader: Locator;

  constructor(page: Page) {
    this.page = page;

    // Header
    this.heading = page.getByRole('heading', { name: 'Role and Permissions Management' });

    // Search/Filter
    this.searchTextbox = page.getByRole('textbox', { name: 'Role/Description' });
    this.activeFilter = page.getByRole('button', { name: 'ACTIVE' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });

    // Actions
    this.addRoleButton = page.getByRole('button', { name: 'Add Role' });

    // Table
    this.rolesTable = page.getByRole('table');
    this.roleNameHeader = page.getByRole('columnheader', { name: 'Role Name' });
    this.roleDescriptionHeader = page.getByRole('columnheader', { name: 'Role Description' });
  }

  async goto() {
    await this.page.goto('https://dev-crt.th.gov.bc.ca/admin/roles?isActive=true&pageNumber=1&pageSize=25');
  }

  async searchRole(text: string) {
    await this.searchTextbox.fill(text);
    await this.searchButton.click();
  }

  async resetSearch() {
    await this.resetButton.click();
  }

  async clickAddRole() {
    await this.addRoleButton.click();
  }

  async editRole(rowIndex: number) {
    const rows = this.rolesTable.getByRole('row');
    const targetRow = rows.nth(rowIndex + 1);
    await targetRow.getByRole('button', { name: 'Edit Record' }).click();
  }

  async disableRole(rowIndex: number) {
    const rows = this.rolesTable.getByRole('row');
    const targetRow = rows.nth(rowIndex + 1);
    await targetRow.getByRole('button', { name: 'Disable Record' }).click();
  }

  async sortByRoleName() {
    await this.roleNameHeader.getByRole('button').click();
  }

  async sortByRoleDescription() {
    await this.roleDescriptionHeader.getByRole('button').click();
  }
}
```

## Accessibility Snapshot (Raw)

```yaml
- generic [ref=e28]:
  - generic [ref=e482]:
    - heading "Role and Permissions Management" [level=1] [ref=e484]
    - generic [ref=e486]:
      - textbox "Role/Description" [ref=e488]
      - button "ACTIVE" [ref=e491]
      - generic [ref=e495]:
        - button "Search" [ref=e496]
        - button "Reset" [ref=e497]
  - button "Add Role" [ref=e500]
  - generic [ref=e501]:
    - table [ref=e503]:
      - headers: Role Name (sortable), Role Description (sortable), Active, (actions)
      - rows:
        - MANAGER | Manager | Active | Edit/Disable
        - READ_ONLY | Read Only | Active | Edit/Disable
        - REGION_ADMIN | Region Administrator | Active | Edit/Disable
        - SYSTEM_ADMIN | System Administrator | Active | Edit/Disable
    - pagination: "1 - 4 of 4"
```

## Key Observations
1. 4 roles defined: MANAGER, READ_ONLY, REGION_ADMIN, SYSTEM_ADMIN
2. Table is sortable by Role Name and Role Description
3. Row actions are Edit Record and Disable Record (soft delete)
4. Simple search by role name or description text
5. Active filter toggle (defaults to showing active roles only)
