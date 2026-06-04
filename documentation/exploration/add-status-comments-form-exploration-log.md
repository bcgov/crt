# Add Status Comments Form - Exploration Log

## Page Object Model (POM)

```typescript
class AddStatusCommentsForm {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open(projectId: number) {
    await this.page.goto(`https://dev-crt.th.gov.bc.ca/projects/${projectId}`);
    await this.page.getByRole('button', { name: 'Add Status Comments' }).click();
    await this.page.waitForSelector('[role="dialog"]');
  }

  // Form fields
  get commentTextarea() { return this.page.locator('[role="dialog"] textarea#comment'); }

  // Actions
  get submitButton() { return this.page.locator('[role="dialog"] button[type="submit"]'); }
  get cancelButton() { return this.page.locator('[role="dialog"] button:has-text("Cancel")'); }
  get closeButton() { return this.page.locator('[role="dialog"] button.close'); }

  async fillComment(text: string) {
    await this.commentTextarea.fill(text);
  }

  async submit() { await this.submitButton.click(); }
  async cancel() { await this.cancelButton.click(); }
}
```

## Exploration Notes

- Modal title: "Add Status Comments"
- Dialog size: `modal-lg` (large modal)
- Form: `<form action="#" novalidate="">`
- Textarea: `<textarea name="comment" rows="5" placeholder="Insert Comment Here" id="comment" autocomplete="off" class="form-control">`
- Submit: `<button type="submit" disabled class="btn btn-primary btn-sm disabled"> Submit</button>`
- Cancel: `<button type="button" class="btn btn-secondary btn-sm">Cancel</button>`
- Submit is disabled until textarea has content
- Form uses novalidate attribute
- Section on project details page has a table showing: Date Added, User, Comment
- "Show all Status Comments" button toggles full history display
