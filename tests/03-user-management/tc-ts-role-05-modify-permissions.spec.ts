/**
 * ============================================================================
 * 03-User-Management - TC-TS-ROLE-05: Modify role permissions
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-ROLE-05-modify-permissions.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/03-user-management/tc-ts-role-05-modify-permissions.spec.ts --headed
 * Headless:               npx playwright test tests/03-user-management/tc-ts-role-05-modify-permissions.spec.ts
 * Debug:                  npx playwright test tests/03-user-management/tc-ts-role-05-modify-permissions.spec.ts --debug
 * Specific Test:          npx playwright test tests/03-user-management/tc-ts-role-05-modify-permissions.spec.ts -g "Modify" --headed
 *
 * OVERVIEW:
 * Verifies that permissions can be toggled on/off for an existing role.
 * Creates a test role, removes a permission, verifies the change persists,
 * then re-adds it.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Remove Permission:
 *    ✅ Unchecking "Code Table Write" and submitting persists the change
 *    ✅ Re-opening Edit shows the permission is unchecked
 *
 * 2. Add Permission Back:
 *    ✅ Checking "Code Table Write" and submitting persists the change
 *    ✅ Re-opening Edit shows the permission is checked again
 *
 * 3. Cleanup:
 *    ✅ Test role is disabled
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-ROLE-05 — Modify role permissions', () => {
  test.setTimeout(120_000);

  const ROLE_NAME = `TEST_MOD_${Date.now()}`;
  const ROLE_DESC = 'Test role for permission modification';

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/roles');
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  test('Toggle permissions on an existing role', async ({ page }) => {
    await test.step('Step 1: Create a test role with Code Table Read + Write', async () => {
      await page.getByRole('button', { name: 'Add Role' }).click();
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      await dialog.locator('input[name="name"]').fill(ROLE_NAME);
      await dialog.locator('input[name="description"]').fill(ROLE_DESC);

      // Check Code Table Read and Write
      const checkboxes = dialog.locator('input[type="checkbox"]');
      await checkboxes.nth(0).dispatchEvent('click'); // Code Table Read
      await checkboxes.nth(1).dispatchEvent('click'); // Code Table Write

      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });
      await expect(page.locator('table tbody tr', { hasText: ROLE_NAME })).toBeVisible();
    });

    await test.step('Step 2: Edit role and remove Code Table Write', async () => {
      const row = page.locator('table tbody tr', { hasText: ROLE_NAME });
      await row.getByRole('button', { name: 'Edit Record' }).click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('.modal-title, h5').first()).toHaveText('Edit Role');

      // Uncheck Code Table Write (2nd checkbox)
      const codeWriteCb = dialog.locator('input[type="checkbox"]').nth(1);
      await expect(codeWriteCb).toBeChecked();
      await codeWriteCb.dispatchEvent('click');

      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });
    });

    await test.step('Step 3: Verify Code Table Write is removed', async () => {
      const row = page.locator('table tbody tr', { hasText: ROLE_NAME });
      await row.getByRole('button', { name: 'Edit Record' }).click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      // Code Table Write should be unchecked
      const codeWriteCb = dialog.locator('input[type="checkbox"]').nth(1);
      await expect(codeWriteCb).not.toBeChecked();

      // Code Table Read should still be checked
      const codeReadCb = dialog.locator('input[type="checkbox"]').nth(0);
      await expect(codeReadCb).toBeChecked();

      await dialog.getByRole('button', { name: 'Cancel' }).click();
    });

    await test.step('Step 4: Re-add Code Table Write', async () => {
      const row = page.locator('table tbody tr', { hasText: ROLE_NAME });
      await row.getByRole('button', { name: 'Edit Record' }).click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      const codeWriteCb = dialog.locator('input[type="checkbox"]').nth(1);
      await codeWriteCb.dispatchEvent('click');

      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });
    });

    await test.step('Step 5: Verify Code Table Write is back', async () => {
      const row = page.locator('table tbody tr', { hasText: ROLE_NAME });
      await row.getByRole('button', { name: 'Edit Record' }).click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      const codeWriteCb = dialog.locator('input[type="checkbox"]').nth(1);
      await expect(codeWriteCb).toBeChecked();

      await dialog.getByRole('button', { name: 'Cancel' }).click();
    });

    await test.step('Cleanup: Disable the test role', async () => {
      const row = page.locator('table tbody tr', { hasText: ROLE_NAME });
      await row.locator('button[title="Edit Record"]').evaluate(el => el.click());
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      // Set end date to today to deactivate
      const today = new Date().toISOString().split('T')[0];
      await dialog.locator('input[name="endDate"]').fill(today);
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });
      await expect(row).toBeHidden({ timeout: 10_000 });
    });
  });
});
