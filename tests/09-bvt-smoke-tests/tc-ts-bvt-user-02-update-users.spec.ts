/**
 * ============================================================================
 * 09-BVT-Smoke-Tests - TC-TS-BVT-USER-02: Update users
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-BVT-USER-02-update-users.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-user-02-update-users.spec.ts --headed
 * Headless:               npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-user-02-update-users.spec.ts
 * Debug:                  npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-user-02-update-users.spec.ts --debug
 * Specific Test:          npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-user-02-update-users.spec.ts -g "Update user role" --headed
 *
 * OVERVIEW:
 * Build Verification Test confirming that an admin can modify user properties
 * (specifically roles). The test adds the MANAGER role to an existing user who
 * does not have it, verifies the change persists, then reverts to the original
 * state.
 *
 * NOTE: The test case specifies "DISTRICT_ADMIN" but that role does not exist in
 * the system. Available roles are: MANAGER, READ_ONLY, REGION_ADMIN, SYSTEM_ADMIN.
 * This test uses MANAGER as the target role to add/remove.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Edit User Dialog:
 *    ✅ Clicking "Edit Record" on a user row opens the Edit User dialog
 *    ✅ Dialog shows current roles (checkboxes)
 *    ✅ Target user initially does NOT have MANAGER role
 *
 * 2. Role Update:
 *    ✅ MANAGER checkbox can be toggled on
 *    ✅ Submitting saves the change
 *    ✅ Re-opening edit confirms MANAGER role is now assigned
 *
 * 3. Revert:
 *    ✅ MANAGER checkbox can be toggled off
 *    ✅ Submitting reverts to original state
 *    ✅ Re-opening edit confirms original roles are restored
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-BVT-USER-02 — BVT: Update users', () => {
  test.setTimeout(120_000);

  test('Update user role and revert', async ({ page }) => {
    let targetUsername = '';

    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    await test.step('Step 1: Navigate to User Management page and find target user', async () => {
      await page.goto('/admin/users');
      await expect(page.locator('table th:has-text("IDIR")')).toBeVisible({ timeout: 30_000 });

      // Find the first user who does NOT already have MANAGER role
      const rows = page.locator('table tbody tr');
      const rowCount = await rows.count();
      expect(rowCount).toBeGreaterThan(0);

      for (let i = 0; i < Math.min(rowCount, 10); i++) {
        await rows.nth(i).locator('button[title="Edit Record"]').click();
        const dialog = page.getByRole('dialog');
        await expect(dialog).toBeVisible({ timeout: 10_000 });

        // Find the MANAGER checkbox by its label text (order varies by environment)
        const managerCb = dialog.getByLabel('MANAGER');
        const isChecked = await managerCb.isChecked();

        if (!isChecked) {
          targetUsername = await dialog.locator('input[name="username"]').inputValue();
          await dialog.locator('button[aria-label="Close"]').click();
          await expect(dialog).toBeHidden({ timeout: 5_000 });
          break;
        }
        await dialog.locator('button[aria-label="Close"]').click();
        await expect(dialog).toBeHidden({ timeout: 5_000 });
      }

      expect(targetUsername).toBeTruthy();
    });

    await test.step('Step 2: Open Edit dialog for target user and verify initial state', async () => {
      const table = page.locator('table').first();
      const targetRow = table.locator(`tbody tr:has-text("${targetUsername}")`);
      await expect(targetRow).toBeVisible({ timeout: 10_000 });

      await targetRow.locator('button[title="Edit Record"]').click();
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible({ timeout: 10_000 });

      // Verify the dialog is for the right user
      await expect(dialog.locator('input[name="username"]')).toHaveValue(targetUsername);

      // Verify MANAGER is NOT currently checked
      await expect(dialog.getByLabel('MANAGER')).not.toBeChecked();
    });

    await test.step('Step 3: Add MANAGER role and submit', async () => {
      const dialog = page.getByRole('dialog');

      // Click the MANAGER label to toggle its checkbox (Bootstrap custom-control pattern)
      await dialog.locator('label').filter({ hasText: 'MANAGER' }).click();
      await expect(dialog.getByLabel('MANAGER')).toBeChecked();

      // Submit
      await dialog.getByRole('button', { name: 'Submit' }).dispatchEvent('click');
      await expect(dialog).toBeHidden({ timeout: 10_000 });
    });

    await test.step('Step 4: Re-open edit and verify MANAGER role is saved', async () => {
      const table = page.locator('table').first();
      const targetRow = table.locator(`tbody tr:has-text("${targetUsername}")`);

      await targetRow.locator('button[title="Edit Record"]').click();
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible({ timeout: 10_000 });

      // Verify MANAGER is now checked
      await expect(dialog.getByLabel('MANAGER')).toBeChecked();
    });

    await test.step('Step 5: Revert - remove MANAGER role', async () => {
      const dialog = page.getByRole('dialog');

      // Click the MANAGER label to uncheck it
      await dialog.locator('label').filter({ hasText: 'MANAGER' }).click();
      await expect(dialog.getByLabel('MANAGER')).not.toBeChecked();

      // Submit revert
      await dialog.getByRole('button', { name: 'Submit' }).dispatchEvent('click');
      await expect(dialog).toBeHidden({ timeout: 10_000 });
    });

    await test.step('Step 6: Verify revert - MANAGER role is removed', async () => {
      const table = page.locator('table').first();
      const targetRow = table.locator(`tbody tr:has-text("${targetUsername}")`);

      await targetRow.locator('button[title="Edit Record"]').click();
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible({ timeout: 10_000 });

      // Verify MANAGER is back to unchecked
      await expect(dialog.getByLabel('MANAGER')).not.toBeChecked();

      // Close dialog
      await dialog.locator('button[aria-label="Close"]').click();
      await expect(dialog).toBeHidden({ timeout: 5_000 });
    });
  });
});
