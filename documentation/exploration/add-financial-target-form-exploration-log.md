# Add Financial Target Form - Exploration Log

## Page Object Model (POM)

```typescript
class AddFinancialTargetForm {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open(projectId: number) {
    await this.page.goto(`https://dev-crt.th.gov.bc.ca/projects/${projectId}/projectplan`);
    await this.page.getByRole('button', { name: '+ Add' }).click();
    await this.page.waitForSelector('[role="dialog"]');
  }

  // Dropdowns (Bootstrap custom dropdowns)
  get fiscalYearDropdown() { return this.page.locator('[role="dialog"] .dropdown').nth(0).locator('button'); }
  get phaseDropdown() { return this.page.locator('[role="dialog"] .dropdown').nth(1).locator('button'); }
  get elementDropdown() { return this.page.locator('[role="dialog"] .dropdown').nth(2).locator('button'); }
  get fundingTypeDropdown() { return this.page.locator('[role="dialog"] .dropdown').nth(3).locator('button'); }

  // Currency input
  get forecastAmountInput() { return this.page.locator('[role="dialog"] input[type="text"]').first(); }

  // Textarea
  get descriptionTextarea() { return this.page.locator('[role="dialog"] textarea'); }

  async selectFiscalYear(value: string) {
    await this.fiscalYearDropdown.click();
    await this.page.locator('.dropdown-menu.show .dropdown-item').filter({ hasText: value }).click();
  }

  async selectPhase(value: string) {
    await this.phaseDropdown.click();
    await this.page.locator('.dropdown-menu.show .dropdown-item').filter({ hasText: value }).click();
  }

  async selectElement(value: string) {
    await this.elementDropdown.click();
    await this.page.locator('.dropdown-menu.show .dropdown-item').filter({ hasText: value }).click();
  }

  async selectFundingType(value: string) {
    await this.fundingTypeDropdown.click();
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

- Modal title: "Add Target"
- Form uses Bootstrap custom dropdown components (not native `<select>`)
- Fiscal Year defaults to current fiscal year (e.g., "2026/2027")
- Phase, Element, Funding Type default to empty
- Forecasted Amount shows as "$0" with currency formatting
- Submit button disabled until Fiscal Year is selected (required field)
- All dropdowns use `.dropdown-menu.show .dropdown-item` pattern
- Element dropdown has 50+ options - use filter/search approach
