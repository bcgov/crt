# Project Details Page - Playwright MCP Exploration Log

## Page Information
- **URL:** `https://dev-crt.th.gov.bc.ca/projects/79`
- **Title:** MoTI Capital and Rehabilitation Tracking
- **Explored:** 2026-06-03

## Page Object Model (POM)

```typescript
import { Page, Locator } from '@playwright/test';

export class ProjectDetailsPage {
  readonly page: Page;

  // Sub-Navigation Tabs
  readonly detailsTab: Locator;
  readonly financialPlanTab: Locator;
  readonly tenderTab: Locator;
  readonly segmentTab: Locator;
  readonly closeTab: Locator;

  // Project Details Header
  readonly projectDetailsHeading: Locator;
  readonly editProjectButton: Locator;

  // Project Fields
  readonly projectNumber: Locator;
  readonly projectName: Locator;
  readonly motiRegion: Locator;
  readonly nearestTown: Locator;
  readonly rcNumber: Locator;
  readonly projectManager: Locator;
  readonly capitalIndex: Locator;
  readonly projectClosed: Locator;
  readonly projectDescription: Locator;
  readonly projectScope: Locator;

  // Status Comments
  readonly statusCommentsHeading: Locator;
  readonly addStatusCommentsButton: Locator;
  readonly showAllStatusCommentsButton: Locator;
  readonly statusCommentsTable: Locator;

  // EMR Comments
  readonly emrCommentsHeading: Locator;
  readonly addEmrCommentsButton: Locator;
  readonly showAllEmrCommentsButton: Locator;
  readonly emrCommentsTable: Locator;

  constructor(page: Page) {
    this.page = page;

    // Sub-Navigation Tabs
    this.detailsTab = page.getByRole('listitem', { name: 'Go to Project Details' }).getByRole('link');
    this.financialPlanTab = page.getByRole('listitem', { name: 'Go to Project Plan' }).getByRole('link');
    this.tenderTab = page.getByRole('listitem', { name: 'Go to Project Tenders' }).getByRole('link');
    this.segmentTab = page.getByRole('listitem', { name: 'Go to Project Segments' }).getByRole('link');
    this.closeTab = page.getByRole('listitem', { name: 'Return to Project Search' }).getByRole('link');

    // Project Details Header
    this.projectDetailsHeading = page.getByRole('heading', { name: 'Project Details' });
    this.editProjectButton = page.getByRole('button', { name: 'Edit Project' });

    // Project Fields (using strong/generic elements near label text)
    this.projectNumber = page.locator('[ref=e39]'); // strong containing project number
    this.projectName = page.locator('[ref=e46]'); // strong containing project name
    this.motiRegion = page.locator('[ref=e51]'); // region value
    this.nearestTown = page.locator('[ref=e57]'); // nearest town value
    this.rcNumber = page.locator('[ref=e64]'); // RC number value
    this.projectManager = page.locator('[ref=e70]'); // project manager value
    this.capitalIndex = page.locator('[ref=e77]'); // capital index value
    this.projectClosed = page.locator('[ref=e83]'); // project closed value
    this.projectDescription = page.locator('[ref=e90]'); // description value
    this.projectScope = page.locator('[ref=e97]'); // scope value

    // Status Comments
    this.statusCommentsHeading = page.getByRole('heading', { name: 'Status Comments' });
    this.addStatusCommentsButton = page.getByRole('button', { name: 'Add Status Comments' });
    this.showAllStatusCommentsButton = page.getByRole('button', { name: 'Show all Status Comments' });
    this.statusCommentsTable = page.locator('[ref=e109]');

    // EMR Comments
    this.emrCommentsHeading = page.getByRole('heading', { name: 'EMR Comments' });
    this.addEmrCommentsButton = page.getByRole('button', { name: 'Add EMR Comments' });
    this.showAllEmrCommentsButton = page.getByRole('button', { name: 'Show all EMR Comments' });
    this.emrCommentsTable = page.locator('[ref=e126]');
  }

  async goto(projectId: number) {
    await this.page.goto(`https://dev-crt.th.gov.bc.ca/projects/${projectId}`);
  }

  async clickEditProject() {
    await this.editProjectButton.click();
  }

  async navigateToFinancialPlan() {
    await this.financialPlanTab.click();
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

  async addStatusComment() {
    await this.addStatusCommentsButton.click();
  }

  async showAllStatusComments() {
    await this.showAllStatusCommentsButton.click();
  }

  async addEmrComment() {
    await this.addEmrCommentsButton.click();
  }

  async showAllEmrComments() {
    await this.showAllEmrCommentsButton.click();
  }
}
```

## Accessibility Snapshot (Raw)

```yaml
- generic [ref=e2]:
  - banner [ref=e3]:
    - navigation [ref=e4] (header nav with logos and toggle)
  - generic [ref=e13]:
    - list [ref=e15]: (sub-navigation tabs)
      - listitem "Go to Project Details" [ref=e16]: link "Details" -> /projects/79
      - listitem "Go to Project Plan" [ref=e18]: link "Financial Plan" -> /projects/79/projectplan
      - listitem "Go to Project Tenders" [ref=e20]: link "Tender" -> /projects/79/projecttender
      - listitem "Go to Project Segments" [ref=e22]: link "Segment" -> /projects/79/segments
      - listitem "Return to Project Search" [ref=e24]: link "Close" -> /projects
    - generic [ref=e26]: (Project Details section)
      - heading "Project Details" [level=1] [ref=e28]
        - button "Edit Project" [ref=e29] (pencil icon)
      - Fields:
        - Project Number: "999" [ref=e39]
        - Project Name: "Another test project" [ref=e46]
        - MoTI Region: "1-South Coast" [ref=e51]
        - Nearest Town: "Duncan" [ref=e57]
        - RC Number: "55750" [ref=e64] (tooltip: "Community Safety Enhancement Program")
        - Project Manager: "Devashish Bhargava" [ref=e70]
        - Capital Index: "7" [ref=e77] (tooltip: "Capitalizable-All components>15yrs")
        - Project Closed: "No" [ref=e83]
        - Project Description: "Testing testing 123" [ref=e90]
        - Project Scope: "Making streets safer" [ref=e97]
    - generic [ref=e98]: (Status Comments section)
      - heading "Status Comments" [level=1] [ref=e100]
        - button "Add Status Comments" [ref=e102]
        - button "Show all Status Comments" [ref=e105]
      - table [ref=e109]: columns: Date Added, User, Comment
    - generic [ref=e115]: (EMR Comments section)
      - heading "EMR Comments" [level=1] [ref=e117]
        - button "Add EMR Comments" [ref=e119]
        - button "Show all EMR Comments" [ref=e122]
      - table [ref=e126]: columns: Date Added, User, Comment
  - contentinfo
```

## Key Observations
1. Sub-navigation tabs provide access to: Details, Financial Plan, Tender, Segment, and Close (back to list)
2. Project details are displayed in read-only format with an "Edit Project" pencil button
3. Some fields have info tooltip icons (Project Number, Project Name, Nearest Town, RC Number, Project Manager, Capital Index, Project Closed, Description, Scope)
4. RC Number tooltip shows the program name ("Community Safety Enhancement Program")
5. Capital Index tooltip shows description ("Capitalizable-All components>15yrs")
6. Two comment sections: Status Comments and EMR Comments, each with Add and Show All buttons
7. Comment tables have columns: Date Added, User, Comment
8. Both comment tables appear empty in the current snapshot
