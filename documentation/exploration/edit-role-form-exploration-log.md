# Edit Role Form - Exploration Log

## Page Object Model (POM)

```typescript
class EditRoleForm {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open(roleName: string) {
    await this.page.goto('https://dev-crt.th.gov.bc.ca/admin/roles');
    // Click edit button on the row matching the role name
    const row = this.page.locator('table tbody tr', { hasText: roleName });
    await row.locator('button[title="Edit Record"]').click();
    await this.page.waitForSelector('[role="dialog"]');
  }

  // Form fields
  get roleNameInput() { return this.page.locator('[role="dialog"] input#name'); }
  get roleDescriptionInput() { return this.page.locator('[role="dialog"] input#description'); }
  get endDateInput() { return this.page.locator('[role="dialog"] input#endDate'); }

  // Permissions checkboxes
  getPermissionCheckbox(id: number) {
    return this.page.locator(`[role="dialog"] input#permissions_${id}`);
  }

  get codeTableReadCheckbox() { return this.getPermissionCheckbox(1); }
  get codeTableWriteCheckbox() { return this.getPermissionCheckbox(2); }
  get exportReadCheckbox() { return this.getPermissionCheckbox(3); }
  get projectReadCheckbox() { return this.getPermissionCheckbox(4); }
  get projectWriteCheckbox() { return this.getPermissionCheckbox(5); }
  get roleReadCheckbox() { return this.getPermissionCheckbox(6); }
  get roleWriteCheckbox() { return this.getPermissionCheckbox(7); }
  get userReadCheckbox() { return this.getPermissionCheckbox(8); }
  get userWriteCheckbox() { return this.getPermissionCheckbox(9); }
  get apiAccessClientCheckbox() { return this.getPermissionCheckbox(10); }

  async togglePermission(id: number) {
    await this.getPermissionCheckbox(id).click();
  }

  // Actions
  get submitButton() { return this.page.locator('[role="dialog"] button[type="submit"]'); }
  get cancelButton() { return this.page.locator('[role="dialog"] button:has-text("Cancel")'); }

  async submit() { await this.submitButton.click(); }
  async cancel() { await this.cancelButton.click(); }
}
```

## Exploration Notes

- Modal title: "Edit Role"
- Form layout: 2-column (label left, input right) using Bootstrap `.row.form-group > .col-sm-3 + .col-sm-9`
- Role Name: text input, prepopulated with current value (e.g., "MANAGER")
- Role Description: text input, prepopulated (e.g., "Manager")
- Permissions: multi-select checkbox group inside `.form-control.multi-select` div
- Each permission: `<input type="checkbox" id="permissions_{id}" class="custom-control-input" value="{id}">` + `<label class="custom-control-label">`
- End Date: uses SingleDatePicker component (same as other date fields)
- Submit disabled attribute until form changes are made
- Delete button may also be present (as second action button in table row)
- Table row structure: Role Name | Role Description | Active badge | Edit/Delete buttons

## Roles in system:
- MANAGER (permissions: 1,3,4,5)
- READ_ONLY
- REGION_ADMIN
- SYSTEM_ADMIN
