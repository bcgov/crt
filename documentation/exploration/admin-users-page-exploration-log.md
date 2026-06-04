# Admin - User Management Page - Playwright MCP Exploration Log

## Page Information
- **URL:** `https://dev-crt.th.gov.bc.ca/admin/users?isActive=true&pageNumber=1&pageSize=25`
- **Title:** MoTI Capital and Rehabilitation Tracking
- **Explored:** 2026-06-03

## Page Object Model (POM)

```typescript
import { Page, Locator } from '@playwright/test';

export class AdminUsersPage {
  readonly page: Page;

  // Header
  readonly heading: Locator;

  // Search/Filter
  readonly regionsDropdown: Locator;
  readonly searchTextbox: Locator;
  readonly activeFilter: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;

  // Actions
  readonly addUserButton: Locator;

  // Table
  readonly usersTable: Locator;
  readonly firstNameHeader: Locator;
  readonly lastNameHeader: Locator;
  readonly idirHeader: Locator;
  readonly emailHeader: Locator;

  constructor(page: Page) {
    this.page = page;

    // Header
    this.heading = page.getByRole('heading', { name: 'User Management' });

    // Search/Filter
    this.regionsDropdown = page.getByRole('button', { name: 'Regions' });
    this.searchTextbox = page.getByRole('textbox', { name: 'IDIR/Name/Email' });
    this.activeFilter = page.getByRole('button', { name: 'ACTIVE' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });

    // Actions
    this.addUserButton = page.getByRole('button', { name: 'Add User' });

    // Table
    this.usersTable = page.getByRole('table');
    this.firstNameHeader = page.getByRole('columnheader', { name: 'First Name' });
    this.lastNameHeader = page.getByRole('columnheader', { name: 'Last Name' });
    this.idirHeader = page.getByRole('columnheader', { name: 'IDIR' });
    this.emailHeader = page.getByRole('columnheader', { name: 'Email' });
  }

  async goto() {
    await this.page.goto('https://dev-crt.th.gov.bc.ca/admin/users?isActive=true&pageNumber=1&pageSize=25');
  }

  async searchUser(text: string) {
    await this.searchTextbox.fill(text);
    await this.searchButton.click();
  }

  async resetSearch() {
    await this.resetButton.click();
  }

  async clickAddUser() {
    await this.addUserButton.click();
  }

  async editUser(rowIndex: number) {
    const rows = this.usersTable.getByRole('row');
    const targetRow = rows.nth(rowIndex + 1); // Skip header
    await targetRow.getByRole('button', { name: 'Edit Record' }).click();
  }

  async disableUser(rowIndex: number) {
    const rows = this.usersTable.getByRole('row');
    const targetRow = rows.nth(rowIndex + 1);
    await targetRow.getByRole('button', { name: 'Disable Record' }).click();
  }

  async sortByFirstName() {
    await this.firstNameHeader.getByRole('button').click();
  }

  async sortByLastName() {
    await this.lastNameHeader.getByRole('button').click();
  }

  async sortByIdir() {
    await this.idirHeader.getByRole('button').click();
  }

  async sortByEmail() {
    await this.emailHeader.getByRole('button').click();
  }

  async getUserRowByIdir(idir: string) {
    return this.usersTable.getByRole('row').filter({ hasText: idir });
  }
}
```

## Accessibility Snapshot (Raw)

```yaml
- generic [ref=e28]:
  - generic [ref=e210]:
    - heading "User Management" [level=1] [ref=e212]
    - generic [ref=e214]: (search/filter section)
      - button "Regions" [ref=e217]
      - textbox "IDIR/Name/Email" [ref=e219]
      - button "ACTIVE" [ref=e222]
      - generic [ref=e224]:
        - button "Search" [ref=e225]
        - button "Reset" [ref=e226]
  - button "Add User" [ref=e229]
  - generic [ref=e230]:
    - table [ref=e232]:
      - headers: First Name (sortable), Last Name (sortable), IDIR (sortable), Email (sortable), Regions, Active, (actions)
      - rows:
        - Barry | Jin | BARRYJIN | Barry.Jin@gov.bc.ca | 0,1,2,3 | Active | Edit/Disable
        - Bruce | Wang | BRWANG | Bruce.Wang@gov.bc.ca | 0,1,2,3 | Active | Edit/Disable
        - Bowen | Wang | BWANG | Bowen.Wang@gov.bc.ca | 0,1,2,3 | Active | Edit/Disable
        - Devashish | Bhargava | DBHARGAV | Devashish.Bhargava@gov.bc.ca | 0,1 | Active | Edit/Disable
        - (more rows...)
```

## Key Observations
1. URL defaults to `isActive=true` filter (showing only active users)
2. Page layout mirrors the Projects List page pattern (heading, filters, add button, table)
3. Table is sortable by First Name, Last Name, IDIR, Email (column header buttons)
4. Row actions are Edit Record and Disable Record (not Delete — users are soft-deleted/disabled)
5. Regions are displayed as comma-separated numbers (0=Headquarters, 1=South Coast, 2=Southern Interior, 3=Northern)
6. Filter options: Regions dropdown, text search (IDIR/Name/Email), Active status toggle
7. Users have @gov.bc.ca email addresses (government employees)
