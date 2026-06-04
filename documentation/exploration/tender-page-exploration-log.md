# Tender Page - Playwright MCP Exploration Log

## Page Information
- **URL:** `https://dev-crt.th.gov.bc.ca/projects/79/projecttender`
- **Title:** MoTI Capital and Rehabilitation Tracking
- **Explored:** 2026-06-03

## Page Object Model (POM)

```typescript
import { Page, Locator } from '@playwright/test';

export class TenderPage {
  readonly page: Page;

  // Sub-Navigation Tabs
  readonly detailsTab: Locator;
  readonly financialPlanTab: Locator;
  readonly tenderTab: Locator;
  readonly segmentTab: Locator;
  readonly closeTab: Locator;

  // Project Header
  readonly projectTitle: Locator;

  // Tender Details Section
  readonly tenderDetailsHeading: Locator;
  readonly addTenderButton: Locator;
  readonly tenderTable: Locator;

  // Quantities/Accomplishments Section
  readonly quantitiesHeading: Locator;
  readonly showAllQtyAccmpButton: Locator;
  readonly showAllFiscalYearsButton: Locator;
  readonly addQuantityButton: Locator;
  readonly quantitiesTable: Locator;

  constructor(page: Page) {
    this.page = page;

    // Sub-Navigation Tabs
    this.detailsTab = page.getByRole('listitem', { name: 'Go to Project Details' }).getByRole('link');
    this.financialPlanTab = page.getByRole('listitem', { name: 'Go to Project Plan' }).getByRole('link');
    this.tenderTab = page.getByRole('listitem', { name: 'Go to Project Tenders' }).getByRole('link');
    this.segmentTab = page.getByRole('listitem', { name: 'Go to Project Segments' }).getByRole('link');
    this.closeTab = page.getByRole('listitem', { name: 'Return to Project Search' }).getByRole('link');

    // Project Header
    this.projectTitle = page.getByRole('heading', { level: 1 }).first();

    // Tender Details Section
    this.tenderDetailsHeading = page.getByText('Project Tender Details');
    this.addTenderButton = page.getByRole('heading', { name: 'Project Tender Details' }).getByRole('button', { name: '+ Add' });
    this.tenderTable = page.getByRole('table').first();

    // Quantities/Accomplishments Section
    this.quantitiesHeading = page.getByText('Quantities/Accomplishments');
    this.showAllQtyAccmpButton = page.getByRole('button', { name: 'Show All Qty/Accmp' });
    this.showAllFiscalYearsButton = page.getByRole('button', { name: 'Show All Fiscal Years' });
    this.addQuantityButton = page.getByRole('heading', { name: 'Quantities/Accomplishments' }).getByRole('button', { name: '+ Add' });
    this.quantitiesTable = page.getByRole('table').nth(1);
  }

  async goto(projectId: number) {
    await this.page.goto(`https://dev-crt.th.gov.bc.ca/projects/${projectId}/projecttender`);
  }

  async clickAddTender() {
    await this.addTenderButton.click();
  }

  async clickAddQuantity() {
    await this.addQuantityButton.click();
  }

  async clickShowAllQtyAccmp() {
    await this.showAllQtyAccmpButton.click();
  }

  async clickShowAllFiscalYears() {
    await this.showAllFiscalYearsButton.click();
  }

  async editTenderRecord(rowIndex: number) {
    const rows = this.tenderTable.getByRole('row');
    const targetRow = rows.nth(rowIndex + 1); // Skip header row
    await targetRow.getByRole('button', { name: 'Edit Record' }).click();
  }

  async deleteTenderRecord(rowIndex: number) {
    const rows = this.tenderTable.getByRole('row');
    const targetRow = rows.nth(rowIndex + 1);
    await targetRow.getByRole('button', { name: 'Delete Record' }).click();
  }

  async editQuantityRecord(rowIndex: number) {
    const rows = this.quantitiesTable.getByRole('row');
    const targetRow = rows.nth(rowIndex + 1);
    await targetRow.getByRole('button', { name: 'Edit Record' }).click();
  }

  async deleteQuantityRecord(rowIndex: number) {
    const rows = this.quantitiesTable.getByRole('row');
    const targetRow = rows.nth(rowIndex + 1);
    await targetRow.getByRole('button', { name: 'Delete Record' }).click();
  }

  async navigateToDetails() {
    await this.detailsTab.click();
  }

  async navigateToFinancialPlan() {
    await this.financialPlanTab.click();
  }

  async navigateToSegment() {
    await this.segmentTab.click();
  }

  async closeAndReturnToList() {
    await this.closeTab.click();
  }
}
```

## Accessibility Snapshot (Raw)

```yaml
- generic [ref=e13]:
  - list [ref=e15]: (sub-navigation tabs)
    - listitem "Go to Project Details": link "Details" -> /projects/79
    - listitem "Go to Project Plan": link "Financial Plan" -> /projects/79/projectplan
    - listitem "Go to Project Tenders": link "Tender" -> /projects/79/projecttender
    - listitem "Go to Project Segments": link "Segment" -> /projects/79/segments
    - listitem "Return to Project Search": link "Close" -> /projects
  - heading "999-Another test project" [level=1] [ref=e27]
  - generic [ref=e30]: (Project Tender Details section)
    - heading [ref=e32]:
      - "Project Tender Details"
      - button "+ Add" [ref=e36]
    - table [ref=e38]:
      - headers: Tender #, Planned Date, Actual Date, Ministry Estimate, Winning Contractor, Winning Bid, %Min.Est., Comment, (actions)
      - body: (empty)
  - generic [ref=e50]: (Quantities/Accomplishments section)
    - heading [ref=e52]:
      - "Quantities/Accomplishments"
      - button "Show All Qty/Accmp" [ref=e59]
      - button "Show All Fiscal Years" [ref=e65]
      - button "+ Add" [ref=e68]
    - table [ref=e70]:
      - headers: Fiscal Year, Accomplishment/Quantity, Forecast, Schedule7, Actual, Comment, (actions)
      - body: (empty)
```

## Key Observations
1. Page has two main sections: Tender Details and Quantities/Accomplishments
2. Both tables are empty for this project (project 79)
3. Each section has its own "+ Add" button for creating new records
4. Quantities section has two filter/toggle buttons: "Show All Qty/Accmp" and "Show All Fiscal Years"
5. Tender table columns suggest tracking of bid process (planned vs actual dates, ministry estimate vs winning bid)
6. "%Min.Est." column likely shows winning bid as percentage of ministry estimate
7. To see populated data, would need to check a project with tender records (e.g., project 72 or 73 which showed contractor names on the list page)
