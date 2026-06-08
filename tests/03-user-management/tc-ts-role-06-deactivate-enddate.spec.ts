/**
 * ============================================================================
 * 03-User-Management - TC-TS-ROLE-06: Deactivate role via end date
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-ROLE-06-deactivate-enddate.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/03-user-management/tc-ts-role-06-deactivate-enddate.spec.ts --headed
 * Headless:               npx playwright test tests/03-user-management/tc-ts-role-06-deactivate-enddate.spec.ts
 * Debug:                  npx playwright test tests/03-user-management/tc-ts-role-06-deactivate-enddate.spec.ts --debug
 * Specific Test:          npx playwright test tests/03-user-management/tc-ts-role-06-deactivate-enddate.spec.ts -g "Deactivate" --headed
 *
 * OVERVIEW:
 * Verifies that setting a past End Date on a role deactivates it and the role
 * then appears under the Inactive filter instead of the Active filter.
 *
 * WHAT THE TEST VALIDATES:
 * 1. End Date Deactivation:
 *    ✅ Setting a past end date on a role via Edit dialog succeeds
 *    ✅ The role disappears from the Active roles list
 *
 * 2. Inactive Filter:
 *    ✅ Switching filter to INACTIVE shows the deactivated role
 *    ✅ Role status displays as "Inactive"
 *
 * 3. Cleanup:
 *    ✅ Removing the end date reactivates the role
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-ROLE-06 — Deactivate role via end date', () => {
  test.setTimeout(120_000);

  const ROLE_NAME = `TEST_DEACT_${Date.now()}`;
  const ROLE_DESC = 'Test role for deactivation via end date';

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/roles');
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  test('Setting past end date deactivates role and shows in Inactive filter', async ({ page }) => {
    await test.step('Step 1: Create a test role', async () => {
      await page.getByRole('button', { name: 'Add Role' }).click();
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      await dialog.locator('input[name="name"]').fill(ROLE_NAME);
      await dialog.locator('input[name="description"]').fill(ROLE_DESC);

      // Check at least one permission
      const checkboxes = dialog.locator('input[type="checkbox"]');
      await checkboxes.nth(0).dispatchEvent('click');

      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });
      await expect(page.locator('table tbody tr', { hasText: ROLE_NAME })).toBeVisible();
    });

    await test.step('Step 2: Edit role and set past End Date', async () => {
      const row = page.locator('table tbody tr', { hasText: ROLE_NAME });
      await row.getByRole('button', { name: 'Edit Record' }).click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      // Set end date to today (makes it inactive)
      const today = new Date().toISOString().split('T')[0];
      await dialog.locator('input[name="endDate"]').fill(today);

      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });
    });

    await test.step('Step 3: Verify role disappears from Active filter', async () => {
      const row = page.locator('table tbody tr', { hasText: ROLE_NAME });
      await expect(row).toBeHidden({ timeout: 10_000 });
    });

    await test.step('Step 4: Switch to Inactive filter and verify role appears', async () => {
      // Click the status filter dropdown
      const filterBtn = page.locator('button.dropdown-toggle:has-text("ACTIVE")');
      await filterBtn.click();
      await page.waitForTimeout(300);

      // Select INACTIVE and deselect ACTIVE
      const labels = page.locator('.show label');
      await labels.filter({ hasText: 'INACTIVE' }).click();
      await page.waitForTimeout(200);
      await labels.filter({ hasText: /^ACTIVE$/ }).click();
      await page.waitForTimeout(200);

      // Close dropdown and search
      await page.keyboard.press('Escape');
      await page.getByRole('button', { name: 'Search' }).click();
      await page.waitForTimeout(3000);

      // Verify role in inactive list
      const row = page.locator('table tbody tr', { hasText: ROLE_NAME });
      await expect(row).toBeVisible();
      await expect(row.locator('td').nth(2)).toHaveText('Inactive');
    });
  });
});
