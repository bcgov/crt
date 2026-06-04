# Add Code Value Form - Exploration Log

## Page Object Model (POM)

```typescript
class AddCodeValueForm {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open(codeSet: string) {
    await this.page.goto('https://dev-crt.th.gov.bc.ca/admin/codetables');
    // Select code set from dropdown
    await this.page.locator('.dropdown button').first().click();
    await this.page.locator('.dropdown-menu.show .dropdown-item').filter({ hasText: codeSet }).click();
    await this.page.waitForTimeout(500);
    // Click "Add {codeSet}" button
    await this.page.getByRole('button', { name: new RegExp(`Add ${codeSet}`, 'i') }).click();
    await this.page.waitForSelector('[role="dialog"]');
  }

  // Form fields
  get codeSetInput() { return this.page.locator('[role="dialog"] input#codeSetName'); } // disabled
  get codeValueInput() { return this.page.locator('[role="dialog"] input#codeValueText'); }
  get codeNameInput() { return this.page.locator('[role="dialog"] input#codeName'); }
  get orderNumberInput() { return this.page.locator('[role="dialog"] input#displayOrder'); }

  // Actions
  get submitButton() { return this.page.locator('[role="dialog"] button[type="submit"]'); }
  get cancelButton() { return this.page.locator('[role="dialog"] button:has-text("Cancel")'); }

  async fillCodeValue(value: string) { await this.codeValueInput.fill(value); }
  async fillCodeName(name: string) { await this.codeNameInput.fill(name); }
  async fillOrderNumber(order: string) { await this.orderNumberInput.fill(order); }

  async submit() { await this.submitButton.click(); }
  async cancel() { await this.cancelButton.click(); }
}

class CodeTablesPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto('https://dev-crt.th.gov.bc.ca/admin/codetables');
  }

  // Code Set filter dropdown
  get codeSetDropdown() { return this.page.locator('.dropdown button').first(); }

  async selectCodeSet(codeSet: string) {
    await this.codeSetDropdown.click();
    await this.page.locator('.dropdown-menu.show .dropdown-item').filter({ hasText: codeSet }).click();
  }

  // Search/filter
  get searchInput() { return this.page.locator('input[placeholder*="Code"]'); }
  get activeToggle() { return this.page.locator('button:has-text("ACTIVE")'); }
  get searchButton() { return this.page.getByRole('button', { name: 'Search' }); }
  get resetButton() { return this.page.getByRole('button', { name: 'Reset' }); }

  // Table
  get table() { return this.page.locator('table'); }
  get tableRows() { return this.page.locator('table tbody tr'); }

  // Edit existing code value
  async editCodeValue(rowIndex: number) {
    await this.tableRows.nth(rowIndex).locator('button[title="Edit Record"]').click();
    await this.page.waitForSelector('[role="dialog"]');
  }
}
```

## Exploration Notes

- Modal HTML structure: `.modal-dialog > .modal-content > form > .modal-header + .modal-body + .modal-footer`
- Form layout: 2-column with `.row.form-group > .col-sm-3 (label) + .col-sm-9 (input)`
- Code Set field: `<input name="codeSetName" id="codeSetName" disabled autocomplete="off" type="text" class="form-control" value="Accomplishment">`
- Code Value: `<input name="codeValueText" id="codeValueText" autocomplete="off" type="text" class="form-control">`
- Code Name: `<input name="codeName" id="codeName" autocomplete="off" type="text" class="form-control">` (required)
- Order Number: `<input name="displayOrder" id="displayOrder" autocomplete="off" type="number" class="form-control" value="370">` (required, auto-populated)
- Submit disabled until Code Name is filled
- Tooltip icons (?) are SVG font-awesome question-circle icons with id patterns like `codeValueText__tooltip`, `codeName__tooltip`

## Available Code Sets:
"", "Accomplishment", "Capital Index", "Contractor", "Economic Region", "Electoral District", "Fiscal Year", "Funding Type", "Highway", "Nearest Town", "Phase", "Program", "Quantity", "RC Number", "Service Line", "Program Category", "Project Manager"
