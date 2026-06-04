# Add EMR Comments Form - Exploration Log

## Page Object Model (POM)

```typescript
class AddEMRCommentsForm {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open(projectId: number) {
    await this.page.goto(`https://dev-crt.th.gov.bc.ca/projects/${projectId}`);
    await this.page.getByRole('button', { name: 'Add EMR Comments' }).click();
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

- Modal title: "Add EMR Comments"
- Identical HTML structure to "Add Status Comments" form
- Dialog size: `modal-lg`
- Textarea: `<textarea name="comment" rows="5" placeholder="Insert Comment Here" id="comment" autocomplete="off" class="form-control">`
- Submit disabled until textarea has content
- EMR = Executive Management Review
- Section on project details page below Status Comments
- Table columns: Date Added, User, Comment
