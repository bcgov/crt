# Admin - Elements Page - Playwright MCP Exploration Log

## Page Information
- **URL:** `https://dev-crt.th.gov.bc.ca/admin/elements?isActive=true&pageNumber=1&pageSize=25`
- **Title:** MoTI Capital and Rehabilitation Tracking
- **Explored:** 2026-06-03

## Page Object Model (POM)

```typescript
import { Page, Locator } from '@playwright/test';

export class AdminElementsPage {
  readonly page: Page;

  // Header
  readonly heading: Locator;

  // Search/Filter
  readonly searchTextbox: Locator;
  readonly activeFilter: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;

  // Actions
  readonly addNewElementButton: Locator;

  // Table
  readonly elementsTable: Locator;
  readonly elementHeader: Locator;
  readonly descriptionHeader: Locator;
  readonly orderNumberHeader: Locator;

  constructor(page: Page) {
    this.page = page;

    // Header
    this.heading = page.getByRole('heading', { name: 'Elements Management' });

    // Search/Filter
    this.searchTextbox = page.getByRole('textbox', { name: 'Searches through element, description, program category, program and service line.' });
    this.activeFilter = page.getByRole('button', { name: 'Active' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });

    // Actions
    this.addNewElementButton = page.getByRole('button', { name: 'Add New Element' });

    // Table
    this.elementsTable = page.getByRole('table');
    this.elementHeader = page.getByRole('columnheader', { name: 'Element' });
    this.descriptionHeader = page.getByRole('columnheader', { name: 'Description' });
    this.orderNumberHeader = page.getByRole('columnheader', { name: 'Order Number' });
  }

  async goto() {
    await this.page.goto('https://dev-crt.th.gov.bc.ca/admin/elements?isActive=true&pageNumber=1&pageSize=25');
  }

  async searchElement(text: string) {
    await this.searchTextbox.fill(text);
    await this.searchButton.click();
  }

  async resetSearch() {
    await this.resetButton.click();
  }

  async clickAddNewElement() {
    await this.addNewElementButton.click();
  }

  async editRecord(rowIndex: number) {
    const rows = this.elementsTable.getByRole('row');
    const targetRow = rows.nth(rowIndex + 1);
    await targetRow.getByRole('button', { name: 'Edit Record' }).click();
  }

  async deleteRecord(rowIndex: number) {
    const rows = this.elementsTable.getByRole('row');
    const targetRow = rows.nth(rowIndex + 1);
    await targetRow.getByRole('button', { name: 'Delete Record' }).click();
  }

  async sortByElement() {
    await this.elementHeader.getByRole('button').click();
  }

  async sortByDescription() {
    await this.descriptionHeader.getByRole('button').click();
  }

  async sortByOrderNumber() {
    await this.orderNumberHeader.getByRole('button').click();
  }
}
```

## Accessibility Snapshot (Raw)

```yaml
- generic [ref=e28]:
  - generic [ref=e952]:
    - heading "Elements Management" [level=1] [ref=e954]
    - generic [ref=e956]:
      - textbox (placeholder: "Search") [ref=e958]
      - button "Active" [ref=e961]
      - generic [ref=e963]:
        - button "Search" [ref=e964]
        - button "Reset" [ref=e965]
  - button "Add New Element" [ref=e968]
  - generic [ref=e969]:
    - table [ref=e971]:
      - headers: Element (sortable), Description (sortable), Program Category, Program, Service Line, Order Number (sortable), Status, (actions)
      - sample rows:
        - Bb | Bike BC | Capital | Grants - Bike BC | 0 | 60 | Active | Edit/Delete
        - Bc | Bridge Coatings | Preservation | HRP-Bridges | 62175 | 70 | Active | Edit/Disable
        - Bd | Bridge Deck Resurfacing | Preservation | HRP-Bridges | 62560 | 80 | Active | Edit/Disable
```

## Key Observations
1. Elements are short codes (2 characters typically, e.g., "Bb", "Bc", "Bd")
2. Each element maps to a Program Category, Program, and Service Line
3. Service Line appears to be a numeric code
4. Some rows have "Delete Record" while others have "Disable Record" — likely depends on whether the element is in use
5. Search covers element, description, program category, program, and service line fields
6. Sortable columns: Element, Description, Order Number
7. Elements are used in the Financial Planning Targets table (Element column)
