# Add Tender Form - Exploration Log

## Page Object Model (POM)

```typescript
class AddTenderForm {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open(projectId: number) {
    await this.page.goto(`https://dev-crt.th.gov.bc.ca/projects/${projectId}/projecttender`);
    // Click first "+ Add" button (for Tender Details, not Quantities)
    await this.page.getByRole('button', { name: '+ Add' }).first().click();
    await this.page.waitForSelector('[role="dialog"]');
  }

  // Form fields
  get tenderNumberInput() { return this.page.locator('[role="dialog"] input[name="tenderNumber"]'); }
  get plannedDateInput() { return this.page.locator('[role="dialog"] input').nth(1); } // Date picker
  get actualDateInput() { return this.page.locator('[role="dialog"] input').nth(2); } // Date picker
  get ministryEstimateInput() { return this.page.locator('[role="dialog"] input').nth(3); } // Currency
  get winningContractorDropdown() { return this.page.locator('[role="dialog"] .dropdown button'); }
  get winningBidInput() { return this.page.locator('[role="dialog"] input').nth(4); } // Currency
  get commentTextarea() { return this.page.locator('[role="dialog"] textarea[placeholder="Insert Comment Here"]'); }

  async selectWinningContractor(value: string) {
    await this.winningContractorDropdown.click();
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

- Modal title: "Add Tender Details"
- Tender Number is required (Submit disabled without it)
- Date fields use YYYY-MM-DD format with date picker
- Currency fields display with $ prefix and comma formatting
- Winning Contractor is a dropdown with contractor names
- Comment field has placeholder "Insert Comment Here"
- Submit disabled until required fields are filled
