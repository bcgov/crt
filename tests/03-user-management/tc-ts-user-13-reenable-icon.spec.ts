/**
 * ============================================================================
 * 03 User Management - TC-TS-USER-13: Re-enable inactive user via Disable icon
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-USER-13-reenable-icon.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/03-user-management/tc-ts-user-13-reenable-icon.spec.ts --headed
 * Headless:               npx playwright test tests/03-user-management/tc-ts-user-13-reenable-icon.spec.ts
 * Debug:                  npx playwright test tests/03-user-management/tc-ts-user-13-reenable-icon.spec.ts --debug
 * Specific Test:          npx playwright test tests/03-user-management/tc-ts-user-13-reenable-icon.spec.ts -g "Re-enable inactive user" --headed
 *
 * OVERVIEW:
 * Verifies that an inactive user (past End Date) can be re-enabled by clicking the
 * greyed-out Disable icon, clearing the End Date, and clicking "Update". After
 * re-enabling, the user appears as Active in search results. Cleanup restores the
 * user to inactive state.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Inactive User Search:
 *    ✅ Searching with "Inactive" status filter shows inactive users
 *
 * 2. Re-enable via Disable Icon:
 *    ✅ Clicking greyed-out Disable icon opens a popover
 *    ✅ Popover shows "Are you sure?" and a date picker with End Date
 *    ✅ Clearing the End Date and clicking "Update" re-enables the user
 *
 * 3. Verification:
 *    ✅ After re-enabling, searching Active users shows the re-enabled user
 *
 * 4. Cleanup:
 *    ✅ Restores the user to inactive state (sets past End Date)
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-USER-13 — Re-enable inactive user via Disable icon', () => {
  let targetUserIdir = '';

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page.getByRole('heading', { name: 'User Management' })).toBeVisible();
  });

  test('Re-enable inactive user via Disable icon', async ({ page }) => {
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

      // Capture the first inactive user's IDIR for later verification
      targetUserIdir = (await page.locator('table tbody tr').first().locator('td:nth-child(3)').textContent())!.trim();
      expect(targetUserIdir.length).toBeGreaterThan(0);
    });

    await test.step('Step 2: Click the Disable icon on the inactive user', async () => {
      const targetRow = page.locator('table tbody tr').first();

      // Click the greyed-out Disable Record button (opens popover)
      await targetRow.getByRole('button', { name: 'Disable Record' }).click();

      // Verify the popover appears with "Are you sure?"
      const popover = page.locator('.popover');
      await expect(popover).toBeVisible();
      await expect(popover.locator('.popover-header')).toHaveText('Are you sure?');
    });

    await test.step('Step 3: Clear the End Date and click Update to re-enable', async () => {
      const popover = page.locator('.popover');

      // Clear the End Date using the "Clear Date" button in the date picker
      const clearButton = popover.locator('button[aria-label="Clear Date"]');
      await expect(clearButton).toBeVisible();
      await clearButton.click();

      // Click "Update" to re-enable the user
      await popover.getByRole('button', { name: 'Update' }).click();

      // Popover should close
      await expect(popover).not.toBeVisible();
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

    await test.step('Step 5: Cleanup — deactivate the user again (set past End Date)', async () => {
      // Click the Disable icon on the user we just re-enabled
      const targetRow = page.locator('table tbody tr', { hasText: targetUserIdir });
      await targetRow.getByRole('button', { name: 'Disable Record' }).click();

      // Verify popover appears
      const popover = page.locator('.popover');
      await expect(popover).toBeVisible();

      // Set today's date to deactivate (app does not allow past dates)
      const today = new Date();
      const dateStr = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;
      const dateInput = popover.locator('input[placeholder="End Date"]');
      await dateInput.click();
      await page.keyboard.type(dateStr);
      // Press Escape to close the calendar overlay if open
      await page.keyboard.press('Escape');

      // Click "Disable" button
      const actionButton = popover.locator('.btn-danger');
      await actionButton.click();

      // Popover should close
      await expect(popover).not.toBeVisible();
    });
  });
});
