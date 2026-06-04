# Financial Plan Page - Playwright MCP Exploration Log

## Page Information
- **URL:** `https://dev-crt.th.gov.bc.ca/projects/79/projectplan`
- **Title:** MoTI Capital and Rehabilitation Tracking
- **Explored:** 2026-06-03

## Page Object Model (POM)

```typescript
import { Page, Locator } from '@playwright/test';

export class FinancialPlanPage {
  readonly page: Page;

  // Sub-Navigation Tabs
  readonly detailsTab: Locator;
  readonly financialPlanTab: Locator;
  readonly tenderTab: Locator;
  readonly segmentTab: Locator;
  readonly closeTab: Locator;

  // Project Header
  readonly projectTitle: Locator;

  // Financial Planning Targets Section
  readonly financialTargetsHeading: Locator;
  readonly showAllFiscalYearsButton: Locator;
  readonly addButton: Locator;
  readonly financialTargetsTable: Locator;
  readonly totalProjectFunding: Locator;

  // Public Project Information Section
  readonly publicInfoHeading: Locator;
  readonly editPublicInfoButton: Locator;
  readonly announcementValue: Locator;
  readonly c035Value: Locator;
  readonly estimatedValue: Locator;
  readonly announcementComment: Locator;

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

    // Financial Planning Targets Section
    this.financialTargetsHeading = page.getByText('Financial Planning Targets');
    this.showAllFiscalYearsButton = page.getByRole('button', { name: 'Show All Fiscal Years' });
    this.addButton = page.getByRole('button', { name: '+ Add' });
    this.financialTargetsTable = page.getByRole('table').first();
    this.totalProjectFunding = page.locator('strong', { hasText: 'Total Project Funding' });

    // Public Project Information Section
    this.publicInfoHeading = page.getByText('Public Project Information');
    this.editPublicInfoButton = page.getByRole('button', { name: 'Edit Public Project Information' });
    this.announcementValue = page.locator('[ref=e91]');
    this.c035Value = page.locator('[ref=e94]');
    this.estimatedValue = page.locator('[ref=e100]');
    this.announcementComment = page.locator('p[ref=e111]');
  }

  async goto(projectId: number) {
    await this.page.goto(`https://dev-crt.th.gov.bc.ca/projects/${projectId}/projectplan`);
  }

  async clickShowAllFiscalYears() {
    await this.showAllFiscalYearsButton.click();
  }

  async clickAdd() {
    await this.addButton.click();
  }

  async editRecord(rowIndex: number) {
    const rows = this.financialTargetsTable.getByRole('row');
    const targetRow = rows.nth(rowIndex + 1); // Skip header row
    await targetRow.getByRole('button', { name: 'Edit Record' }).click();
  }

  async cloneRecord(rowIndex: number) {
    const rows = this.financialTargetsTable.getByRole('row');
    const targetRow = rows.nth(rowIndex + 1);
    await targetRow.getByRole('button', { name: 'Clone Record' }).click();
  }

  async deleteRecord(rowIndex: number) {
    const rows = this.financialTargetsTable.getByRole('row');
    const targetRow = rows.nth(rowIndex + 1);
    await targetRow.getByRole('button', { name: 'Delete Record' }).click();
  }

  async editPublicProjectInfo() {
    await this.editPublicInfoButton.click();
  }

  async navigateToDetails() {
    await this.detailsTab.click();
  }

  async navigateToTender() {
    await this.tenderTab.click();
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
  - list [ref=e15]: (sub-navigation tabs - same as details page)
    - listitem "Go to Project Details": link "Details" -> /projects/79
    - listitem "Go to Project Plan": link "Financial Plan" -> /projects/79/projectplan
    - listitem "Go to Project Tenders": link "Tender" -> /projects/79/projecttender
    - listitem "Go to Project Segments": link "Segment" -> /projects/79/segments
    - listitem "Return to Project Search": link "Close" -> /projects
  - heading "999-Another test project" [level=1] [ref=e27]
  - generic [ref=e31]: (Financial Planning Targets section)
    - heading [ref=e33]:
      - "Financial Planning Targets"
      - button "Show All Fiscal Years" [ref=e40]
      - button "+ Add" [ref=e43]
    - table [ref=e45]:
      - headers: Fiscal Year, Project Phase, Element, Funding Type, Amount, Description, (actions)
      - row [ref=e56]:
        - Fiscal Year: "2022/2023"
        - Project Phase: "P-Plan"
        - Element: "Sp"
        - Funding Type: "Allocation"
        - Amount: "$100,000"
        - Description: "Test financial planning target"
        - Actions: Edit Record [ref=e64], Clone Record [ref=e67], Delete Record [ref=e70]
    - Total Project Funding: $100,000 [ref=e74-e75]
  - generic [ref=e76]: (Public Project Information section)
    - heading [ref=e78]:
      - "Public Project Information"
      - button "Edit Public Project Information" [ref=e82]
    - Fields:
      - Announcement Value: "$100,000" [ref=e91]
      - C-035 Value: (empty) [ref=e94] (has tooltip icon)
      - Estimated Value: (empty) [ref=e100] (has tooltip icon)
      - Announcement Comment: "no comment" [ref=e111]
```

## Key Observations
1. Page shows project number + name as heading ("999-Another test project")
2. Financial Planning Targets table has CRUD operations: Add (+ Add button), Edit, Clone, Delete per row
3. "Show All Fiscal Years" button toggles visibility of historical records
4. Total Project Funding is calculated and displayed below the table
5. Public Project Information section has an edit button and displays:
   - Announcement Value
   - C-035 Value (with tooltip)
   - Estimated Value (with tooltip)
   - Announcement Comment
6. Only 1 financial target row exists for this project (2022/2023)
7. Row actions have icon buttons (pencil for edit, copy for clone, trash for delete)
