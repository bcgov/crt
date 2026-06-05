/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-CODE-09: Enable inactive code value
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-CODE-09-enable-code.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-code-09-enable-code.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-code-09-enable-code.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-code-09-enable-code.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-code-09-enable-code.spec.ts -g "Enable" --headed
 *
 * OVERVIEW:
 * Verifies that an inactive code value can be re-enabled. Disables "Culvert <3m"
 * as setup, switches to Inactive view, clicks the toggle button (shows "Activate"
 * in popover), confirms, and verifies the entry returns to Active view.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Inactive View:
 *    ✅ Switching to Inactive filter shows disabled entries
 *    ✅ Inactive entry has toggle button (titled "Disable Record")
 *
 * 2. Enable Confirmation:
 *    ✅ Clicking the button shows "Are you sure?" popover
 *    ✅ Popover has "Activate" and "Cancel" buttons
 *
 * 3. Enable Effect:
 *    ✅ After confirming, entry disappears from Inactive view
 *    ✅ Entry returns to Active view
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-CODE-09 — Enable inactive code value', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/codetables');
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  test('Enable inactive code value via Activate confirmation', async ({ page }) => {
    await test.step('Step 1: Disable "Culvert <3m" as setup', async () => {
      const row = page.locator('table tbody tr', { hasText: 'Culvert <3m' });
      await expect(row).toBeVisible();
      await row.getByRole('button', { name: 'Disable Record' }).click();

      const popover = page.locator('[role="tooltip"]');
      await expect(popover).toBeVisible();
      await popover.getByRole('button', { name: 'Disable' }).click();
      await expect(row).toBeHidden({ timeout: 10_000 });
    });

    await test.step('Step 2: Switch to Inactive view', async () => {
      await page.getByRole('button', { name: 'Active' }).click();
      await page.getByRole('checkbox', { name: 'Inactive' }).check();
      await page.getByRole('checkbox', { name: 'Active', exact: true }).uncheck();
      await page.getByRole('button', { name: 'Search' }).click();

      await expect(page).toHaveURL(/isActive=false/);
      await expect(page.locator('table tbody tr', { hasText: 'Culvert <3m' })).toBeVisible();
    });

    await test.step('Step 3: Click enable button and verify "Activate" popover', async () => {
      const row = page.locator('table tbody tr', { hasText: 'Culvert <3m' });
      // Button is titled "Disable Record" but acts as toggle — shows "Activate" in popover
      await row.getByRole('button', { name: 'Disable Record' }).click();

      const popover = page.locator('[role="tooltip"]');
      await expect(popover).toBeVisible();
      await expect(popover.locator('h3')).toHaveText('Are you sure?');
      await expect(popover.getByRole('button', { name: 'Activate' })).toBeVisible();
      await expect(popover.getByRole('button', { name: 'Cancel' })).toBeVisible();
    });

    await test.step('Step 4: Confirm Activate and verify entry removed from Inactive', async () => {
      const popover = page.locator('[role="tooltip"]');
      await popover.getByRole('button', { name: 'Activate' }).click();
      await expect(page.locator('table tbody tr', { hasText: 'Culvert <3m' })).toBeHidden({ timeout: 10_000 });
    });

    await test.step('Step 5: Switch to Active and verify entry is back', async () => {
      // Click the filter button (now shows "Inactive" as current selection)
      await page.getByRole('button', { name: 'Inactive' }).click();
      await page.getByRole('checkbox', { name: 'Active', exact: true }).check();
      await page.getByRole('checkbox', { name: 'Inactive' }).uncheck();
      await page.getByRole('button', { name: 'Search' }).click();

      await expect(page).toHaveURL(/isActive=true/);
      await expect(page.locator('table tbody tr', { hasText: 'Culvert <3m' })).toBeVisible();
    });
  });
});
