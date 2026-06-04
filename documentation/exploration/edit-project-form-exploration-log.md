# Edit Project Form - Exploration Log

## Page Object Model (POM)

```typescript
class EditProjectForm {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigation
  async open(projectId: number) {
    await this.page.goto(`https://dev-crt.th.gov.bc.ca/projects/${projectId}`);
    await this.page.getByRole('button', { name: 'Edit' }).click();
    await this.page.waitForSelector('[role="dialog"]');
  }

  // Form fields
  get projectNameInput() { return this.page.locator('[role="dialog"] input[name="projectName"]'); }
  get descriptionTextarea() { return this.page.locator('[role="dialog"] textarea[name="description"]'); }
  get endDateInput() { return this.page.locator('[role="dialog"] input[name="endDate"]'); }

  // Dropdowns (Bootstrap-style)
  get regionDropdown() { return this.page.locator('[role="dialog"] .dropdown').nth(0).locator('button'); }
  get capitalIndexDropdown() { return this.page.locator('[role="dialog"] .dropdown').nth(1).locator('button'); }
  get rcNumberDropdown() { return this.page.locator('[role="dialog"] .dropdown').nth(2).locator('button'); }

  async selectRegion(value: string) {
    await this.regionDropdown.click();
    await this.page.locator('.dropdown-menu.show .dropdown-item').filter({ hasText: value }).click();
  }

  async selectCapitalIndex(value: string) {
    await this.capitalIndexDropdown.click();
    await this.page.locator('.dropdown-menu.show .dropdown-item').filter({ hasText: value }).click();
  }

  async selectRcNumber(value: string) {
    await this.rcNumberDropdown.click();
    await this.page.locator('.dropdown-menu.show .dropdown-item').filter({ hasText: value }).click();
  }

  // Actions
  get saveButton() { return this.page.locator('[role="dialog"] button:has-text("Save")'); }
  get cancelButton() { return this.page.locator('[role="dialog"] button:has-text("Cancel")'); }

  async save() { await this.saveButton.click(); }
  async cancel() { await this.cancelButton.click(); }
}
```

## Exploration Notes

- Edit button located on project details page header area
- Opens a Bootstrap modal dialog
- Form uses custom Bootstrap dropdown components (not native `<select>`)
- MoTI Region options: "", "0-Headquarters", "1-South Coast", "2-Southern Interior", "3-Northern"
- Capital Index options: 11 values from "0-Expense" to "10-Capitalizable"
- RC Number: 25+ project cost center codes
- Dropdowns open via button click, items are `.dropdown-item` inside `.dropdown-menu.show`
- Save button disabled until valid changes made
