/**
 * ============================================================================
 * 03-User-Management - TC-TS-ROLE-03: Mandatory fields on new role validation
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-ROLE-03-mandatory-fields.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/03-user-management/tc-ts-role-03-mandatory-fields.spec.ts --headed
 * Headless:               npx playwright test tests/03-user-management/tc-ts-role-03-mandatory-fields.spec.ts
 * Debug:                  npx playwright test tests/03-user-management/tc-ts-role-03-mandatory-fields.spec.ts --debug
 * Specific Test:          npx playwright test tests/03-user-management/tc-ts-role-03-mandatory-fields.spec.ts -g "Mandatory" --headed
 *
 * OVERVIEW:
 * Verifies that Role Name, Description, and at least one Permission are
 * mandatory when creating a new role. Attempting to submit with missing fields
 * shows inline validation errors and blocks submission.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Empty Form:
 *    ✅ Submit button is disabled when all fields are empty
 *
 * 2. Partial Form (only name filled):
 *    ✅ Submit is enabled but clicking shows inline validation errors
 *    ✅ "Required" error on Description field (is-invalid class)
 *    ✅ "Require at least one permission" error for permissions
 *    ✅ Dialog remains open (form not submitted)
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-ROLE-03 — Mandatory fields on new role validation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/roles');
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  test('Submit blocked when mandatory fields are empty', async ({ page }) => {
    await test.step('Step 1: Open Add Role dialog', async () => {
      await page.getByRole('button', { name: 'Add Role' }).click();
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('.modal-title, h5').first()).toHaveText('Add Role');
    });

    await test.step('Step 2: Verify Submit disabled when completely empty', async () => {
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog.getByRole('button', { name: 'Submit' })).toBeDisabled();
    });

    await test.step('Step 3: Fill only name and attempt submit', async () => {
      const dialog = page.locator('[role="dialog"]');
      await dialog.locator('input[name="name"]').fill('TEST_ROLE');

      // Submit becomes enabled but should show validation on click
      await expect(dialog.getByRole('button', { name: 'Submit' })).toBeEnabled();
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await page.waitForTimeout(500);
    });

    await test.step('Step 4: Verify inline validation errors', async () => {
      const dialog = page.locator('[role="dialog"]');

      // Dialog should still be open
      await expect(dialog).toBeVisible();

      // Description field shows "Required" error
      await expect(dialog.locator('input[name="description"]')).toHaveClass(/is-invalid/);
      await expect(dialog.locator('.invalid-feedback').first()).toContainText('Required');

      // Permissions error
      await expect(dialog.locator('.invalid-feedback').nth(1)).toContainText('Require at least one permission');

      // Cancel
      await dialog.getByRole('button', { name: 'Cancel' }).dispatchEvent('click');
    });
  });
});
