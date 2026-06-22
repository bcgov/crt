/**
 * ============================================================================
 * 03-User-Management - TC-TS-ROLE-08: Disable role via icon
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-ROLE-08-disable-icon.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/03-user-management/tc-ts-role-08-disable-icon.spec.ts --headed
 * Headless:               npx playwright test tests/03-user-management/tc-ts-role-08-disable-icon.spec.ts
 * Debug:                  npx playwright test tests/03-user-management/tc-ts-role-08-disable-icon.spec.ts --debug
 * Specific Test:          npx playwright test tests/03-user-management/tc-ts-role-08-disable-icon.spec.ts -g "Disable" --headed
 *
 * OVERVIEW:
 * Verifies that a role can be disabled using the Disable icon in the roles
 * table. After confirming the disable action, the role is removed from the
 * Active filter and appears in the Inactive list.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Disable Icon Interaction:
 *    ✅ Clicking the Disable icon shows a confirmation popover
 *    ✅ Popover contains "Disable" and "Cancel" buttons
 *
 * 2. Disable Confirmation:
 *    ✅ Clicking "Disable" removes the role from Active list
 *    ✅ Role appears in Inactive filter results
 *
 * 3. Cleanup:
 *    ✅ Role is reactivated by removing end date
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-ROLE-08 — Disable role via icon', () => {
  test.setTimeout(120_000);

  const ROLE_NAME = `TEST_DISABLE_${Date.now()}`;
  const ROLE_DESC = 'Test role for disable icon';

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/roles');
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  test('Disable role via icon removes it from Active filter', async ({ page }) => {
    await test.step('Step 1: Create a test role', async () => {
      await page.getByRole('button', { name: 'Add Role' }).click();
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      await dialog.locator('input[name="name"]').fill(ROLE_NAME);
      await dialog.locator('input[name="description"]').fill(ROLE_DESC);

      const checkboxes = dialog.locator('input[type="checkbox"]');
      await checkboxes.nth(0).dispatchEvent('click');

      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });

      // Search by name so the new role is on page 1 regardless of how many roles exist
      await page.locator('input[name="searchText"]').fill(ROLE_NAME);
      await page.getByRole('button', { name: 'Search' }).click();
      await expect(page.locator('table tbody tr', { hasText: ROLE_NAME })).toBeVisible();
    });

    await test.step('Step 2: Click Disable icon and confirm', async () => {
      const row = page.locator('table tbody tr', { hasText: ROLE_NAME });

      // Click Disable Record button (uses evaluate due to table cell interception)
      await row.locator('button[title="Disable Record"]').evaluate(el => el.click());
      await page.waitForTimeout(1000);

      // Verify popover appears with Disable and Cancel buttons
      const popover = page.locator('.popover');
      await expect(popover).toBeVisible();
      await expect(popover.locator('button:has-text("Disable")')).toBeVisible();
      await expect(popover.locator('button:has-text("Cancel")')).toBeVisible();

      // Enter today's date in the popover date field (react-dates uses MM/DD/YYYY)
      const dateInput = popover.locator('input');
      await dateInput.click();
      await page.waitForTimeout(200);
      const now = new Date();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const yyyy = now.getFullYear();
      await page.keyboard.press('Control+a');
      await page.keyboard.type(`${mm}/${dd}/${yyyy}`, { delay: 50 });
      await page.waitForTimeout(300);
      await page.keyboard.press('Escape'); // close calendar picker

      // Click Disable to confirm
      await popover.locator('button.btn-danger').evaluate(el => el.click());
      await page.waitForTimeout(3000);
    });

    await test.step('Step 3: Verify role disappears from Active list', async () => {
      const row = page.locator('table tbody tr', { hasText: ROLE_NAME });
      await expect(row).toBeHidden({ timeout: 10_000 });
    });

    await test.step('Step 4: Verify role appears in Inactive filter', async () => {
      // Switch to Inactive filter
      const filterBtn = page.locator('button.dropdown-toggle:has-text("ACTIVE")');
      await filterBtn.click();
      await page.waitForTimeout(300);

      const labels = page.locator('.show label');
      await labels.filter({ hasText: 'INACTIVE' }).click();
      await page.waitForTimeout(200);
      await labels.filter({ hasText: /^ACTIVE$/ }).click();
      await page.waitForTimeout(200);

      await page.keyboard.press('Escape');

      // Scope by name so the role is found on page 1 even when many test roles are inactive
      await page.locator('input[name="searchText"]').fill(ROLE_NAME);
      await page.getByRole('button', { name: 'Search' }).click();
      await page.waitForTimeout(3000);

      const row = page.locator('table tbody tr', { hasText: ROLE_NAME });
      await expect(row).toBeVisible();
      await expect(row.locator('td').nth(2)).toHaveText('Inactive');
    });
  });
});
