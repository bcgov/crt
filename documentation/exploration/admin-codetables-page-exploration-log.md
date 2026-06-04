# Admin - Code Tables Page - Playwright MCP Exploration Log

## Page Information
- **URL:** `https://dev-crt.th.gov.bc.ca/admin/codetables?codeSet=ACCOMPLISHMENT&isActive=true&pageNumber=1&pageSize=25`
- **Title:** MoTI Capital and Rehabilitation Tracking
- **Explored:** 2026-06-03

## Page Object Model (POM)

```typescript
import { Page, Locator } from '@playwright/test';

export class AdminCodeTablesPage {
  readonly page: Page;

  // Header
  readonly heading: Locator;

  // Search/Filter
  readonly codeSetDropdown: Locator;
  readonly searchTextbox: Locator;
  readonly activeFilter: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;

  // Actions
  readonly addNewButton: Locator;

  // Table
  readonly codeTable: Locator;
  readonly codeValueHeader: Locator;
  readonly codeNameHeader: Locator;
  readonly orderNumberHeader: Locator;

  constructor(page: Page) {
    this.page = page;

    // Header
    this.heading = page.getByRole('heading', { name: 'Code Table Management' });

    // Search/Filter
    this.codeSetDropdown = page.locator('[ref=e576]'); // Code set selector button
    this.searchTextbox = page.getByRole('textbox', { name: 'Searches by code value and name' });
    this.activeFilter = page.getByRole('button', { name: 'Active' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });

    // Actions (label is dynamic based on selected code set)
    this.addNewButton = page.getByRole('button', { name: /Add New/ });

    // Table
    this.codeTable = page.getByRole('table');
    this.codeValueHeader = page.getByRole('columnheader', { name: 'Code Value' });
    this.codeNameHeader = page.getByRole('columnheader', { name: 'Code Name' });
    this.orderNumberHeader = page.getByRole('columnheader', { name: 'Order Number' });
  }

  async goto(codeSet: string = 'ACCOMPLISHMENT') {
    await this.page.goto(`https://dev-crt.th.gov.bc.ca/admin/codetables?codeSet=${codeSet}&isActive=true&pageNumber=1&pageSize=25`);
  }

  async selectCodeSet(codeSetName: string) {
    await this.codeSetDropdown.click();
    // Select from dropdown options
  }

  async searchCode(text: string) {
    await this.searchTextbox.fill(text);
    await this.searchButton.click();
  }

  async resetSearch() {
    await this.resetButton.click();
  }

  async clickAddNew() {
    await this.addNewButton.click();
  }

  async editRecord(rowIndex: number) {
    const rows = this.codeTable.getByRole('row');
    const targetRow = rows.nth(rowIndex + 1);
    await targetRow.getByRole('button', { name: 'Edit Record' }).click();
  }

  async deleteRecord(rowIndex: number) {
    const rows = this.codeTable.getByRole('row');
    const targetRow = rows.nth(rowIndex + 1);
    await targetRow.getByRole('button', { name: 'Delete Record' }).click();
  }

  async sortByCodeValue() {
    await this.codeValueHeader.getByRole('button').click();
  }

  async sortByCodeName() {
    await this.codeNameHeader.getByRole('button').click();
  }

  async sortByOrderNumber() {
    await this.orderNumberHeader.getByRole('button').click();
  }
}
```

## Accessibility Snapshot (Raw)

```yaml
- generic [ref=e28]:
  - generic [ref=e567]:
    - heading "Code Table Management" [level=1] [ref=e569]
    - generic [ref=e571]:
      - button "Accomplishment" [ref=e576] (code set selector dropdown)
      - textbox "Searches by code value and name" [ref=e579] (placeholder: "Search")
      - button "Active" [ref=e582]
      - generic [ref=e584]:
        - button "Search" [ref=e585]
        - button "Reset" [ref=e586]
  - button "Add New Accomplishment" [ref=e589]
  - generic [ref=e590]:
    - table [ref=e592]:
      - headers: Code Value (sortable), Code Name (sortable), Order Number (sortable), Status, (actions)
      - sample rows:
        - (empty) | Active Transportation Project | 10 | Active | Edit/Delete
        - (empty) | Bridge Installed, New (each) | 20 | Active | Edit/Delete
        - (empty) | Bridge Rehabbed (each) | 30 | Active | Edit/Delete
        - (empty) | Bridge Replaced (each) | 40 | Active | Edit/Delete
        - (empty) | Bridge Resurfaced (each) | 50 | Active | Edit/Delete
```

## Key Observations
1. Code Tables are parameterized by `codeSet` query parameter
2. Default code set shown is "ACCOMPLISHMENT"
3. The code set dropdown button shows the currently selected code set name
4. "Add New" button label dynamically changes (e.g., "Add New Accomplishment")
5. Table has Code Value, Code Name, Order Number, Status columns
6. Code Value can be empty for some entries
7. Order Number determines display ordering in dropdowns throughout the app
8. Some rows have "Delete Record" while others have "Disable Record" — may depend on usage
9. Sortable columns: Code Value, Code Name, Order Number
