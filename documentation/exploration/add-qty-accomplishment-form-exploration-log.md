# Add Quantities/Accomplishments Form - Exploration Log

## Page Object Model (POM)

```typescript
class AddQtyAccomplishmentForm {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open(projectId: number) {
    await this.page.goto(`https://dev-crt.th.gov.bc.ca/projects/${projectId}/projecttender`);
    // Click second "+ Add" button (for Quantities, not Tender Details)
    const addButtons = await this.page.getByRole('button', { name: '+ Add' }).all();
    await addButtons[1].click();
    await this.page.waitForSelector('[role="dialog"]');
  }

  // Dropdowns
  get fiscalYearDropdown() { return this.page.locator('[role="dialog"] .dropdown').nth(0).locator('button'); }
  get qtyAccmpDropdown() { return this.page.locator('[role="dialog"] .dropdown').nth(1).locator('button'); }

  async selectFiscalYear(value: string) {
    await this.fiscalYearDropdown.click();
    await this.page.locator('.dropdown-menu.show .dropdown-item').filter({ hasText: value }).click();
  }

  async selectQtyOrAccomplishment(value: string) {
    await this.qtyAccmpDropdown.click();
    await this.page.locator('.dropdown-menu.show .dropdown-item').filter({ hasText: value }).click();
  }

  // Actions
  get submitButton() { return this.page.locator('[role="dialog"] button:has-text("Submit")'); }
  get cancelButton() { return this.page.locator('[role="dialog"] button:has-text("Cancel")'); }

  async submit() { await this.submitButton.click(); }
  async cancel() { await this.cancelButton.click(); }
}
```

## Exploration Notes

- Modal title: "Add Quantities and Accomplishments"
- Fiscal Year defaults to current FY (e.g., "2026/2027")
- Quantity or Accomplishment dropdown: "", "Accomplishment", "Quantity"
- Submit disabled until both dropdowns have values
- Same Bootstrap custom dropdown pattern as other forms
- Section header has toggle buttons: "Show All Qty/Accmp", "Show All Fiscal Years"
- Table columns: Fiscal Year, Accomplishment/Quantity, Forecast, Schedule7, Actual, Comment
