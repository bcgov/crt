# Add User Form - Exploration Log

## Page Object Model (POM)

```typescript
class AddUserForm {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open() {
    await this.page.goto('https://dev-crt.th.gov.bc.ca/admin/users');
    await this.page.getByRole('button', { name: 'Add User' }).click();
    await this.page.waitForSelector('[role="dialog"]');
  }

  // Step 1 - IDIR Search
  get idirInput() { return this.page.locator('[role="dialog"] input#username'); }
  get nextButton() { return this.page.locator('[role="dialog"] button:has-text("Next")'); }
  get cancelButton() { return this.page.locator('[role="dialog"] button:has-text("Cancel")'); }
  get closeButton() { return this.page.locator('[role="dialog"] button.close'); }

  async searchIdir(idir: string) {
    await this.idirInput.fill(idir);
    await this.nextButton.click();
  }

  async cancel() { await this.cancelButton.click(); }
}
```

## Exploration Notes

- Modal HTML structure: `.modal-dialog > .modal-content > .modal-header + form > .modal-body + .modal-footer`
- Input: `<input name="username" id="username" placeholder="IDIR" autocomplete="off" type="text" class="form-control">`
- Next button: `<button type="button" disabled class="btn btn-primary btn-sm disabled"> Next</button>`
- Cancel button: `<button type="button" class="btn btn-secondary btn-sm">Cancel</button>`
- Close X: `<button type="button" class="close" aria-label="Close"><span aria-hidden="true">×</span></button>`
- Form wraps body+footer with `action="#"`
- Next button becomes enabled when input has value
- Two-step wizard flow: IDIR search → role/region assignment
