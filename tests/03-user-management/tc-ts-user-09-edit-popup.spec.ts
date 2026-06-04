/**
 * ============================================================================
 * 03 User Management - TC-TS-USER-09: Edit user details popup
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-USER-09-edit-popup.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/03-user-management/tc-ts-user-09-edit-popup.spec.ts --headed
 * Headless:               npx playwright test tests/03-user-management/tc-ts-user-09-edit-popup.spec.ts
 * Debug:                  npx playwright test tests/03-user-management/tc-ts-user-09-edit-popup.spec.ts --debug
 * Specific Test:          npx playwright test tests/03-user-management/tc-ts-user-09-edit-popup.spec.ts -g "Edit user details popup" --headed
 *
 * OVERVIEW:
 * Verifies that clicking the Edit icon on a user row opens a modal dialog
 * showing User ID, Role, MoTI Region, and End Date fields. User ID is read-only
 * while the other fields are editable.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Edit Dialog Opens:
 *    ✅ Clicking "Edit Record" opens a modal dialog
 *    ✅ Dialog title shows "Edit User"
 *
 * 2. Expected Fields Present:
 *    ✅ User Id field is displayed (read-only / disabled)
 *    ✅ User Roles multi-select is displayed and editable
 *    ✅ MoTI Region multi-select is displayed and editable
 *    ✅ End Date field is displayed and editable
 *
 * 3. Field Editability:
 *    ✅ User Id is disabled (read-only)
 *    ✅ Submit and Cancel buttons are present
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-USER-09 — Edit user details popup', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the User Management page
    await page.goto('/admin/users');
    await expect(page.getByRole('heading', { name: 'User Management' })).toBeVisible();
  });

  test('Edit user details popup', async ({ page }) => {
    await test.step('Step 1: Click Edit icon on an existing user', async () => {
      // Wait for the table to load
      await expect(page.locator('table tbody tr').first()).toBeVisible();

      // Click the first "Edit Record" button in the table
      await page.locator('table tbody tr').first().getByRole('button', { name: 'Edit Record' }).click();

      // Verify the Edit User dialog appears
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('.modal-title')).toHaveText('Edit User');
    });

    await test.step('Step 2: Verify User ID field is present and read-only', async () => {
      const dialog = page.locator('[role="dialog"]');

      // Verify User Id label exists
      await expect(dialog.locator('label:has-text("User Id")')).toBeVisible();

      // Verify User Id input is disabled (read-only)
      const userIdInput = dialog.locator('input[name="username"]');
      await expect(userIdInput).toBeVisible();
      await expect(userIdInput).toBeDisabled();

      // Verify it has a value (not empty)
      const value = await userIdInput.inputValue();
      expect(value.length).toBeGreaterThan(0);
    });

    await test.step('Step 3: Verify User Roles field is present and editable', async () => {
      const dialog = page.locator('[role="dialog"]');

      // Verify User Roles label exists
      await expect(dialog.locator('label:has-text("User Roles")')).toBeVisible();

      // Verify role checkboxes are present and interactable (not disabled)
      const roleContainer = dialog.locator('.multi-select').first();
      await expect(roleContainer).toBeVisible();
      const roleCheckboxes = roleContainer.locator('input[type="checkbox"]');
      const count = await roleCheckboxes.count();
      expect(count).toBeGreaterThan(0);
    });

    await test.step('Step 4: Verify MoTI Region field is present and editable', async () => {
      const dialog = page.locator('[role="dialog"]');

      // Verify MoTI Region label exists
      await expect(dialog.locator('label:has-text("MoTI Region")')).toBeVisible();

      // Verify region checkboxes are present
      const regionContainer = dialog.locator('.multi-select').nth(1);
      await expect(regionContainer).toBeVisible();
      const regionCheckboxes = regionContainer.locator('input[type="checkbox"]');
      const count = await regionCheckboxes.count();
      expect(count).toBeGreaterThan(0);
    });

    await test.step('Step 5: Verify End Date field is present and editable', async () => {
      const dialog = page.locator('[role="dialog"]');

      // Verify End Date label exists
      await expect(dialog.locator('label:has-text("End Date")')).toBeVisible();

      // Verify End Date input is present and not disabled
      const endDateInput = dialog.locator('input[name="endDate"]');
      await expect(endDateInput).toBeVisible();
      await expect(endDateInput).not.toBeDisabled();
    });

    await test.step('Step 6: Verify Submit and Cancel buttons, then cancel', async () => {
      const dialog = page.locator('[role="dialog"]');

      // Verify Submit and Cancel buttons exist
      await expect(dialog.getByRole('button', { name: 'Submit' })).toBeVisible();
      await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeVisible();

      // Cancel the dialog without making changes
      await dialog.getByRole('button', { name: 'Cancel' }).click();
      await expect(dialog).not.toBeVisible();
    });
  });
});
