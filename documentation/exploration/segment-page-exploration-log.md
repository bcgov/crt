# Segment Page - Playwright MCP Exploration Log

## Page Information
- **URL:** `https://dev-crt.th.gov.bc.ca/projects/79/segments`
- **Title:** MoTI Capital and Rehabilitation Tracking
- **Explored:** 2026-06-03

## Page Object Model (POM)

```typescript
import { Page, Locator } from '@playwright/test';

export class SegmentPage {
  readonly page: Page;

  // Sub-Navigation Tabs
  readonly detailsTab: Locator;
  readonly financialPlanTab: Locator;
  readonly tenderTab: Locator;
  readonly segmentTab: Locator;
  readonly closeTab: Locator;

  // Project Header
  readonly projectTitle: Locator;

  // Project Segments Section
  readonly projectSegmentsHeading: Locator;
  readonly addSegmentViewMapButton: Locator;
  readonly segmentsTable: Locator;

  // Project Ratios Section
  readonly projectRatiosHeading: Locator;
  readonly determineRatiosButton: Locator;

  // Electoral Districts
  readonly electoralDistrictsHeading: Locator;
  readonly addElectoralDistrictButton: Locator;
  readonly electoralDistrictsTable: Locator;

  // Highways
  readonly highwaysHeading: Locator;
  readonly addHighwayButton: Locator;
  readonly highwaysTable: Locator;

  // Service Areas
  readonly serviceAreasHeading: Locator;
  readonly addServiceAreaButton: Locator;
  readonly serviceAreasTable: Locator;

  // Districts
  readonly districtsHeading: Locator;
  readonly addDistrictButton: Locator;
  readonly districtsTable: Locator;

  // Economic Regions
  readonly economicRegionsHeading: Locator;
  readonly addEconomicRegionButton: Locator;
  readonly economicRegionsTable: Locator;

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

    // Project Segments Section
    this.projectSegmentsHeading = page.getByText('Project Segments');
    this.addSegmentViewMapButton = page.getByRole('button', { name: '+ Add Segment / View Map' });
    this.segmentsTable = page.getByRole('table').first();

    // Project Ratios Section
    this.projectRatiosHeading = page.getByText('Project Ratios');
    this.determineRatiosButton = page.getByRole('button', { name: 'Determine Ratios Using Segments' });

    // Electoral Districts
    this.electoralDistrictsHeading = page.getByRole('heading', { name: 'Electoral Districts' });
    this.addElectoralDistrictButton = page.getByRole('heading', { name: 'Electoral Districts' }).getByRole('button', { name: '+ Add' });
    this.electoralDistrictsTable = page.locator('[ref=e78]');

    // Highways
    this.highwaysHeading = page.getByRole('heading', { name: 'Highways' });
    this.addHighwayButton = page.getByRole('heading', { name: 'Highways' }).getByRole('button', { name: '+ Add' });
    this.highwaysTable = page.locator('[ref=e105]');

    // Service Areas
    this.serviceAreasHeading = page.getByRole('heading', { name: 'Service Areas' });
    this.addServiceAreaButton = page.getByRole('heading', { name: 'Service Areas' }).getByRole('button', { name: '+ Add' });
    this.serviceAreasTable = page.locator('[ref=e142]');

    // Districts
    this.districtsHeading = page.getByRole('heading', { name: 'Districts' });
    this.addDistrictButton = page.getByRole('heading', { name: 'Districts' }).getByRole('button', { name: '+ Add' });
    this.districtsTable = page.locator('[ref=e171]');

    // Economic Regions
    this.economicRegionsHeading = page.getByRole('heading', { name: 'Economic Regions' });
    this.addEconomicRegionButton = page.getByRole('heading', { name: 'Economic Regions' }).getByRole('button', { name: '+ Add' });
    this.economicRegionsTable = page.locator('[ref=e198]');
  }

  async goto(projectId: number) {
    await this.page.goto(`https://dev-crt.th.gov.bc.ca/projects/${projectId}/segments`);
  }

  async clickAddSegmentViewMap() {
    await this.addSegmentViewMapButton.click();
  }

  async clickDetermineRatios() {
    await this.determineRatiosButton.click();
  }

  // Segment table actions
  async editSegment(rowIndex: number) {
    const rows = this.segmentsTable.getByRole('row');
    const targetRow = rows.nth(rowIndex + 1);
    await targetRow.getByRole('button', { name: 'Edit Record' }).click();
  }

  async deleteSegment(rowIndex: number) {
    const rows = this.segmentsTable.getByRole('row');
    const targetRow = rows.nth(rowIndex + 1);
    await targetRow.getByRole('button', { name: 'Delete Record' }).click();
  }

  // Electoral District actions
  async addElectoralDistrict() {
    await this.addElectoralDistrictButton.click();
  }

  async editElectoralDistrict(rowIndex: number) {
    const rows = this.electoralDistrictsTable.getByRole('row');
    const targetRow = rows.nth(rowIndex + 1);
    await targetRow.getByRole('button', { name: 'Edit Record' }).click();
  }

  async deleteElectoralDistrict(rowIndex: number) {
    const rows = this.electoralDistrictsTable.getByRole('row');
    const targetRow = rows.nth(rowIndex + 1);
    await targetRow.getByRole('button', { name: 'Delete Record' }).click();
  }

  // Highway actions
  async addHighway() {
    await this.addHighwayButton.click();
  }

  async editHighway(rowIndex: number) {
    const rows = this.highwaysTable.getByRole('row');
    const targetRow = rows.nth(rowIndex + 1);
    await targetRow.getByRole('button', { name: 'Edit Record' }).click();
  }

  async deleteHighway(rowIndex: number) {
    const rows = this.highwaysTable.getByRole('row');
    const targetRow = rows.nth(rowIndex + 1);
    await targetRow.getByRole('button', { name: 'Delete Record' }).click();
  }

  // Service Area actions
  async addServiceArea() {
    await this.addServiceAreaButton.click();
  }

  async editServiceArea(rowIndex: number) {
    const rows = this.serviceAreasTable.getByRole('row');
    const targetRow = rows.nth(rowIndex + 1);
    await targetRow.getByRole('button', { name: 'Edit Record' }).click();
  }

  async deleteServiceArea(rowIndex: number) {
    const rows = this.serviceAreasTable.getByRole('row');
    const targetRow = rows.nth(rowIndex + 1);
    await targetRow.getByRole('button', { name: 'Delete Record' }).click();
  }

  // District actions
  async addDistrict() {
    await this.addDistrictButton.click();
  }

  async editDistrict(rowIndex: number) {
    const rows = this.districtsTable.getByRole('row');
    const targetRow = rows.nth(rowIndex + 1);
    await targetRow.getByRole('button', { name: 'Edit Record' }).click();
  }

  async deleteDistrict(rowIndex: number) {
    const rows = this.districtsTable.getByRole('row');
    const targetRow = rows.nth(rowIndex + 1);
    await targetRow.getByRole('button', { name: 'Delete Record' }).click();
  }

  // Economic Region actions
  async addEconomicRegion() {
    await this.addEconomicRegionButton.click();
  }

  async editEconomicRegion(rowIndex: number) {
    const rows = this.economicRegionsTable.getByRole('row');
    const targetRow = rows.nth(rowIndex + 1);
    await targetRow.getByRole('button', { name: 'Edit Record' }).click();
  }

  async deleteEconomicRegion(rowIndex: number) {
    const rows = this.economicRegionsTable.getByRole('row');
    const targetRow = rows.nth(rowIndex + 1);
    await targetRow.getByRole('button', { name: 'Delete Record' }).click();
  }

  async navigateToDetails() {
    await this.detailsTab.click();
  }

  async navigateToFinancialPlan() {
    await this.financialPlanTab.click();
  }

  async navigateToTender() {
    await this.tenderTab.click();
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
  - heading "999-Another test project" [level=1] [ref=e27]
  - generic [ref=e31]: (Project Segments section)
    - heading [ref=e33]:
      - "Project Segments"
      - button "+ Add Segment / View Map" [ref=e37]
    - table [ref=e40]:
      - headers: Segment start coordinates, Segment end coordinates, Description, (actions)
      - row [ref=e48]:
        - Start: "48.816870,-123.718150"
        - End: "48.769420,-123.698870"
        - Description: "Duncan bypass improvements boys rd to hwy 18"
        - Actions: Edit Record [ref=e54], Delete Record [ref=e57]
  - generic [ref=e60]: (Project Ratios section)
    - heading [ref=e62]:
      - "Project Ratios"
      - button "Determine Ratios Using Segments" [ref=e66]
    - Electoral Districts [ref=e69]:
      - heading "Electoral Districts" + button "+ Add" [ref=e75]
      - table [ref=e78]: Cowichan Valley | 1 | Edit/Delete
    - Highways [ref=e96]:
      - heading "Highways" + button "+ Add" [ref=e102]
      - table [ref=e105]: Hwy 1 | 0.99 | Edit/Delete; Hwy 18 | 0.01 | Edit/Delete
    - Service Areas [ref=e133]:
      - heading "Service Areas" + button "+ Add" [ref=e139]
      - table [ref=e142]: South Island | 1 | Edit/Delete
    - Districts [ref=e160]:
      - heading "Districts" + button "+ Add" [ref=e168]
      - table [ref=e171]: Vancouver Island | 1 | Edit/Delete
    - Economic Regions [ref=e189]:
      - heading "Economic Regions" + button "+ Add" [ref=e195]
      - table [ref=e198]: Vancouver Island and Coast | 1 | Edit/Delete
```

## Key Observations
1. Page has two main sections: Project Segments and Project Ratios
2. Segments are defined by start/end GPS coordinates (lat,lng) with a description
3. "+ Add Segment / View Map" button likely opens a map interface for visual segment creation
4. "Determine Ratios Using Segments" auto-calculates all ratio tables based on segment geography
5. Five ratio categories, each with its own table and "+ Add" button:
   - Electoral Districts (e.g., Cowichan Valley: 1)
   - Highways (e.g., Hwy 1: 0.99, Hwy 18: 0.01 — totals to 1.0)
   - Service Areas (e.g., South Island: 1)
   - Districts (e.g., Vancouver Island: 1)
   - Economic Regions (e.g., Vancouver Island and Coast: 1)
6. All ratio tables have columns: Name, Ratios, Actions (Edit/Delete)
7. Ratios are decimal values that should sum to 1.0 within each category
8. Each row in every table has Edit Record and Delete Record buttons
