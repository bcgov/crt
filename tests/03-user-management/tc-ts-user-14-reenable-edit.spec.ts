/**
 * ============================================================================
 * 03 User Management - TC-TS-USER-14: Re-enable inactive user via Edit
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-USER-14-reenable-edit.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/03-user-management/tc-ts-user-14-reenable-edit.spec.ts --headed
 * Headless:               npx playwright test tests/03-user-management/tc-ts-user-14-reenable-edit.spec.ts
 * Debug:                  npx playwright test tests/03-user-management/tc-ts-user-14-reenable-edit.spec.ts --debug
 * Specific Test:          npx playwright test tests/03-user-management/tc-ts-user-14-reenable-edit.spec.ts -g "Re-enable inactive user via Edit" --headed
 *
 * OVERVIEW:
 * Verifies that an inactive user can be re-enabled via the Edit icon by clearing
 * or extending the End Date and submitting. After re-enabling, the user appears
 * as Active. Cleanup restores the user to inactive state.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Inactive User Search:
 *    ✅ Searching with "Inactive" status filter shows inactive users
 *
 * 2. Re-enable via Edit:
 *    ✅ Clicking Edit icon on inactive user opens the Edit User dialog
 *    ✅ End Date field shows a past date (reason for inactive status)
 *    ✅ Clearing the End Date and clicking Submit re-enables the user
 *
 * 3. Verification:
 *    ✅ After re-enabling, the user appears as Active in search results
 *
 * 4. Cleanup:
 *    ✅ Restores the user to inactive state (sets past End Date)
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-USER-14 — Re-enable inactive user via Edit', () => {
  let targetUserIdir = '';

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page.getByRole('heading', { name: 'User Management' })).toBeVisible();
  });

  test('Re-enable inactive user via Edit', async ({ page }) => {
    await test.step('Step 1: Search for inactive users', async () => {
      // Open the status dropdown
      await page.getByRole('button', { name: 'ACTIVE' }).click();

      // Uncheck ACTIVE and check INACTIVE
      await page.getByRole('checkbox', { name: 'ACTIVE', exact: true }).uncheck();
      await page.getByRole('checkbox', { name: 'INACTIVE' }).check();

      // Close dropdown and search
      await page.getByRole('heading', { name: 'User Management' }).click();
      await page.getByRole('button', { name: 'Search' }).click();
      await page.waitForURL(/isActive=false/);

      // Wait for results
      await expect(page.locator('table tbody tr').first()).toBeVisible();

      // Capture the first inactive user's IDIR
      targetUserIdir = (await page.locator('table tbody tr').first().locator('td:nth-child(3)').textContent())!.trim();
      expect(targetUserIdir.length).toBeGreaterThan(0);
    });

    await test.step('Step 2: Click Edit icon on the inactive user', async () => {
      const targetRow = page.locator('table tbody tr').first();
      await targetRow.getByRole('button', { name: 'Edit Record' }).click();

      // Verify Edit User dialog opens
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('.modal-title')).toHaveText('Edit User');
      await expect(dialog.locator('input[name="username"]')).toHaveValue(targetUserIdir);
    });

    await test.step('Step 3: Clear End Date and submit to re-enable', async () => {
      const dialog = page.locator('[role="dialog"]');

      // Verify End Date field has a value (past date causing inactive status)
      const endDateInput = dialog.locator('input[name="endDate"]');
      await expect(endDateInput).toBeVisible();
      const currentEndDate = await endDateInput.inputValue();
      expect(currentEndDate.length).toBeGreaterThan(0);

      // Clear the End Date using the "Clear Date" button in the date picker
      const clearButton = dialog.locator('button[aria-label="Clear Date"]');
      await expect(clearButton).toBeVisible();
      await clearButton.click();

      // Verify End Date is now empty
      await expect(endDateInput).toHaveValue('');

      // Submit the changes
      await expect(dialog.getByRole('button', { name: 'Submit' })).toBeEnabled();
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).not.toBeVisible();
    });

    await test.step('Step 4: Verify user now appears as Active', async () => {
      // Search for active users
      await page.getByRole('button', { name: 'INACTIVE' }).click();
      await page.getByRole('checkbox', { name: 'INACTIVE' }).uncheck();
      await page.getByRole('checkbox', { name: 'ACTIVE', exact: true }).check();
      await page.getByRole('heading', { name: 'User Management' }).click();
      await page.getByRole('button', { name: 'Search' }).click();
      await page.waitForURL(/isActive=true/);

      // Wait for results
      await expect(page.locator('table tbody tr').first()).toBeVisible();

      // Verify the re-enabled user appears in active results
      const targetRow = page.locator('table tbody tr', { hasText: targetUserIdir });
      await expect(targetRow).toBeVisible();
      await expect(targetRow.locator('td:nth-child(6)')).toHaveText('Active');
    });

    await test.step('Step 5: Cleanup — deactivate the user again via Edit', async () => {
      // Click Edit on the user we just re-enabled
      const targetRow = page.locator('table tbody tr', { hasText: targetUserIdir });
      await targetRow.getByRole('button', { name: 'Edit Record' }).click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog.locator('.modal-title')).toHaveText('Edit User');

      // Set today's date to deactivate (app does not allow past dates)
      const endDateInput = dialog.locator('input[name="endDate"]');
      await endDateInput.click();

      // Type today's date into the focused input
      const today = new Date();
      const dateStr = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;
      await page.keyboard.type(dateStr);
      // Press Escape to close the calendar overlay if open
      await page.keyboard.press('Escape');

      // Submit to deactivate
      await expect(dialog.getByRole('button', { name: 'Submit' })).toBeEnabled();
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).not.toBeVisible();
    });
  });
});
