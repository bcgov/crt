# Add Project Form - Playwright MCP Exploration Log

## Page Information
- **URL:** Modal dialog on `https://dev-crt.th.gov.bc.ca/projects?isInProgress=true&pageNumber=1&pageSize=25`
- **Trigger:** Click "Add Project" button on Projects List page
- **Title:** MoTI Capital and Rehabilitation Tracking
- **Explored:** 2026-06-03

## Page Object Model (POM)

```typescript
import { Page, Locator } from '@playwright/test';

export class AddProjectForm {
  readonly page: Page;

  // Modal
  readonly dialog: Locator;
  readonly modalTitle: Locator;
  readonly closeButton: Locator;

  // Form Fields
  readonly projectNumberInput: Locator;
  readonly projectNameInput: Locator;
  readonly motiRegionDropdown: Locator;
  readonly nearestTownDropdown: Locator;
  readonly rcNumberDropdown: Locator;
  readonly projectManagerDropdown: Locator;
  readonly capitalIndexDropdown: Locator;
  readonly projectDescriptionInput: Locator;
  readonly projectScopeInput: Locator;
  readonly projectClosedCheckbox: Locator;

  // Actions
  readonly submitButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Modal
    this.dialog = page.getByRole('dialog');
    this.modalTitle = this.dialog.getByRole('heading', { name: 'Add Project' });
    this.closeButton = this.dialog.getByRole('button', { name: 'Close' });

    // Form Fields
    this.projectNumberInput = page.getByRole('textbox', { name: 'Project Number*' });
    this.projectNameInput = page.getByRole('textbox', { name: 'Project Name*' });
    this.motiRegionDropdown = page.locator('[ref=e365]'); // button for MoTI Region dropdown
    this.nearestTownDropdown = page.locator('[ref=e376]'); // button for Nearest Town dropdown
    this.rcNumberDropdown = page.locator('[ref=e386]'); // button for RC Number dropdown
    this.projectManagerDropdown = page.locator('[ref=e396]'); // button for Project Manager dropdown
    this.capitalIndexDropdown = page.locator('[ref=e406]'); // button for Capital Index dropdown
    this.projectDescriptionInput = page.getByRole('textbox', { name: 'Project Description' });
    this.projectScopeInput = page.getByRole('textbox', { name: 'Project Scope' });
    this.projectClosedCheckbox = page.getByRole('checkbox', { name: 'Project Closed' });

    // Actions
    this.submitButton = this.dialog.getByRole('button', { name: 'Submit' });
    this.cancelButton = this.dialog.getByRole('button', { name: 'Cancel' });
  }

  async open() {
    // From the Projects List page, click "Add Project"
    await this.page.getByRole('button', { name: 'Add Project' }).click();
    await this.dialog.waitFor({ state: 'visible' });
  }

  async fillProjectNumber(value: string) {
    await this.projectNumberInput.fill(value);
  }

  async fillProjectName(value: string) {
    await this.projectNameInput.fill(value);
  }

  async selectMotiRegion() {
    await this.motiRegionDropdown.click();
    // Then select from the dropdown options that appear
  }

  async selectNearestTown() {
    await this.nearestTownDropdown.click();
  }

  async selectRcNumber() {
    await this.rcNumberDropdown.click();
  }

  async selectProjectManager() {
    await this.projectManagerDropdown.click();
  }

  async selectCapitalIndex() {
    await this.capitalIndexDropdown.click();
  }

  async fillProjectDescription(value: string) {
    await this.projectDescriptionInput.fill(value);
  }

  async fillProjectScope(value: string) {
    await this.projectScopeInput.fill(value);
  }

  async toggleProjectClosed() {
    await this.projectClosedCheckbox.click();
  }

  async submit() {
    await this.submitButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async closeModal() {
    await this.closeButton.click();
  }

  async isSubmitDisabled(): Promise<boolean> {
    return await this.submitButton.isDisabled();
  }
}
```

## Accessibility Snapshot (Raw)

```yaml
- dialog [ref=e332]:
  - document:
    - generic [ref=e334]:
      - generic [ref=e335]: (Modal header)
        - heading "Add Project" [level=5] [ref=e336]
        - button "Close" [ref=e337]: × (X close button)
      - generic [ref=e338]: (Modal body - form)
        - generic [ref=e339]: (Row: Project Number + Project Name)
          - generic [ref=e341]:
            - label: "Project Number*" (with info tooltip img [ref=e344])
            - textbox "Project Number*" [active] [ref=e347] (placeholder: "Project Number")
          - generic [ref=e349]:
            - label: "Project Name*" (with info tooltip img [ref=e352])
            - textbox "Project Name*" [ref=e355] (placeholder: "Project Name")
        - generic [ref=e356]: (Row: MoTI Region + Nearest Town)
          - generic [ref=e358]:
            - label: "MoTI Region*"
            - button (dropdown) [ref=e365]
          - generic [ref=e367]:
            - label: "Nearest Town" (with info tooltip img [ref=e370])
            - button (dropdown) [ref=e376]
        - generic [ref=e377]: (RC Number row)
          - label: "RC Number*" (with info tooltip img [ref=e380])
          - button (dropdown) [ref=e386]
        - generic [ref=e387]: (Project Manager row)
          - label: "Project Manager" (with info tooltip img [ref=e390])
          - button (dropdown) [ref=e396]
        - generic [ref=e397]: (Capital Index row)
          - label: "Capital Index*" (with info tooltip img [ref=e400])
          - button (dropdown) [ref=e406]
        - generic [ref=e407]: (Project Description row)
          - label: "Project Description" (with info tooltip img [ref=e410])
          - textbox "Project Description" [ref=e413]
        - generic [ref=e414]: (Project Scope row)
          - label: "Project Scope" (with info tooltip img [ref=e417])
          - textbox "Project Scope" [ref=e420]
        - generic [ref=e421]: (Project Closed row)
          - label: "Project Closed" (with info tooltip img [ref=e424])
          - checkbox "Project Closed" [ref=e428]
      - generic [ref=e429]: (Modal footer)
        - button "Submit" [disabled] [ref=e430]
        - button "Cancel" [ref=e431]
```

## Key Observations
1. Modal dialog overlays the Projects List page (URL does not change)
2. Form has 10 fields total: 5 required (*), 5 optional
3. Required fields: Project Number, Project Name, MoTI Region, RC Number, Capital Index
4. Optional fields: Nearest Town, Project Manager, Project Description, Project Scope, Project Closed
5. Submit button is **disabled** by default — enables when required fields are filled
6. Dropdown fields (MoTI Region, Nearest Town, RC Number, Project Manager, Capital Index) use button-triggered dropdowns (not native HTML selects)
7. Text inputs: Project Number, Project Name, Project Description, Project Scope
8. Checkbox: Project Closed
9. All fields have info tooltip icons (img elements)
10. Project Number textbox is auto-focused when modal opens ([active] state)
11. Modal can be dismissed via X button (Close), Cancel button, or likely clicking backdrop
