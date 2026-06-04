# Projects List Page - Playwright MCP Exploration Log

## Page Information
- **URL:** `https://dev-crt.th.gov.bc.ca/projects?isInProgress=true&pageNumber=1&pageSize=25`
- **Title:** MoTI Capital and Rehabilitation Tracking
- **Explored:** 2026-06-03

## Page Object Model (POM)

```typescript
import { Page, Locator } from '@playwright/test';

export class ProjectsListPage {
  readonly page: Page;
  
  // Navigation
  readonly bcGovLogo: Locator;
  readonly cartLogo: Locator;
  readonly toggleNavigationButton: Locator;

  // Search/Filter
  readonly regionsDropdown: Locator;
  readonly searchTextbox: Locator;
  readonly projectManagerDropdown: Locator;
  readonly statusDropdown: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;

  // Actions
  readonly addProjectButton: Locator;

  // Table
  readonly projectsTable: Locator;
  readonly regionColumnHeader: Locator;
  readonly projectColumnHeader: Locator;
  readonly regionSortButton: Locator;
  readonly projectSortButton: Locator;

  // Pagination
  readonly paginationInfo: Locator;

  constructor(page: Page) {
    this.page = page;

    // Navigation
    this.bcGovLogo = page.getByRole('link', { name: 'B.C. Government Logo' });
    this.cartLogo = page.getByRole('link', { name: 'CaRT Logo' });
    this.toggleNavigationButton = page.getByRole('button', { name: 'Toggle navigation' });

    // Search/Filter
    this.regionsDropdown = page.getByRole('button', { name: 'Regions' });
    this.searchTextbox = page.getByRole('textbox', { name: 'Searches Project Number, Name, Description and Scope fields' });
    this.projectManagerDropdown = page.getByRole('button', { name: 'Project Manager' });
    this.statusDropdown = page.getByRole('button', { name: 'Active' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });

    // Actions
    this.addProjectButton = page.getByRole('button', { name: 'Add Project' });

    // Table
    this.projectsTable = page.getByRole('table');
    this.regionColumnHeader = page.getByRole('columnheader', { name: 'Region' });
    this.projectColumnHeader = page.getByRole('columnheader', { name: 'Project' });
    this.regionSortButton = this.regionColumnHeader.getByRole('button');
    this.projectSortButton = this.projectColumnHeader.getByRole('button');

    // Pagination
    this.paginationInfo = page.locator('[ref=e185]'); // "1 - 8 of 8" text
  }

  async goto() {
    await this.page.goto('https://dev-crt.th.gov.bc.ca/projects?isInProgress=true&pageNumber=1&pageSize=25');
  }

  async searchProject(text: string) {
    await this.searchTextbox.fill(text);
    await this.searchButton.click();
  }

  async resetSearch() {
    await this.resetButton.click();
  }

  async clickAddProject() {
    await this.addProjectButton.click();
  }

  async getProjectRowByName(projectName: string) {
    return this.projectsTable.getByRole('row').filter({ hasText: projectName });
  }

  async navigateToProject(projectName: string) {
    await this.page.getByRole('link', { name: projectName }).click();
  }

  async clickCloseActivateProject(rowIndex: number) {
    const rows = this.projectsTable.getByRole('row');
    // Skip header row (index 0)
    const targetRow = rows.nth(rowIndex + 1);
    await targetRow.getByRole('button', { name: 'Close/Activate Project' }).click();
  }

  async sortByRegion() {
    await this.regionSortButton.click();
  }

  async sortByProject() {
    await this.projectSortButton.click();
  }
}
```

## Accessibility Snapshot (Raw)

```yaml
- generic [ref=e2]:
  - banner [ref=e3]:
    - navigation [ref=e4]:
      - generic [ref=e5]:
        - link "B.C. Government Logo" [ref=e6] [cursor=pointer]:
          - /url: /
          - img "B.C. Government Logo" [ref=e7]
        - generic [ref=e8]: MoTI Capital and Rehabilitation Tracking
        - link "CaRT Logo" [ref=e9] [cursor=pointer]:
          - /url: /
          - img "CaRT Logo" [ref=e10]
        - button "Toggle navigation" [ref=e11] [cursor=pointer]
    - navigation
  - generic [ref=e13]:
    - generic [ref=e14]:
      - heading "Projects" [level=1] [ref=e16]
      - generic [ref=e18]:
        - button "Regions" [ref=e21] [cursor=pointer]
        - textbox "Searches Project Number, Name, Description and Scope fields" [ref=e23]:
          - /placeholder: Number/Name/Description/Scope
        - button "Project Manager" [ref=e26] [cursor=pointer]
        - button "Active" [ref=e29] [cursor=pointer]
        - generic [ref=e31]:
          - button "Search" [ref=e32] [cursor=pointer]
          - button "Reset" [ref=e33] [cursor=pointer]
    - button "Add Project" [ref=e36] [cursor=pointer]
    - generic [ref=e37]:
      - table [ref=e39]:
        - rowgroup [ref=e40]:
          - row [ref=e41]:
            - columnheader "Region" [ref=e42] (sortable)
            - columnheader "Project" [ref=e46] (sortable)
            - columnheader "Planning Targets" [ref=e50]
            - columnheader "Tender Details" [ref=e51]
            - columnheader "Location and Ratios" [ref=e52]
            - columnheader [ref=e53] (status)
            - columnheader [ref=e54] (actions)
        - rowgroup [ref=e55]:
          - row "999-Another test project" [ref=e56] -> /projects/79
          - row "TCL01-Test Closed Project" [ref=e72] -> /projects/72
          - row "TDEMO1-test project for Demo" [ref=e88] -> /projects/78
          - row "Test 123345-Test 123345" [ref=e104] -> /projects/77
          - row "Test123-Test 123 Project for display" [ref=e120] -> /projects/76
          - row "TPR01-Test project 0001" [ref=e136] -> /projects/75
          - row "TPR02-Test Project 2..." [ref=e152] -> /projects/74
          - row "Z99001-Darrel Test" [ref=e168] -> /projects/73
      - generic [ref=e185]: 1 - 8 of 8
  - contentinfo
```

## Key Observations
1. Page redirects from `/` to `/projects?isInProgress=true&pageNumber=1&pageSize=25`
2. Default filter is "Active" projects (isInProgress=true)
3. 8 projects currently visible in the table
4. Each project row has links to: Project Details, Project Plan, Project Tender, and Segments
5. Sort is available on Region and Project columns (via button with img icon in column header)
6. Regions and Project Manager filters appear to be dropdown buttons (likely multi-select)
7. Status filter defaults to "Active"
8. "Close/Activate Project" button available per row for toggling project status
