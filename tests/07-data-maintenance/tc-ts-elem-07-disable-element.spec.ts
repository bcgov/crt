/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-ELEM-07: Disable element used in data entry
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-ELEM-07-disable-element.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-elem-07-disable-element.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-elem-07-disable-element.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-elem-07-disable-element.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-elem-07-disable-element.spec.ts -g "Disable" --headed
 *
 * OVERVIEW:
 * Verifies that an element used in data entry can be disabled via the "Disable
 * Record" button. After disabling, the element moves from Active to Inactive
 * filter and is no longer visible in the Active list.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Disable Flow:
 *    ✅ "Disable Record" button triggers confirmation popover
 *    ✅ Popover shows "Are you sure?" with "Disable" and "Cancel" buttons
 *    ✅ Confirming removes element from Active view
 *
 * 2. Element Appears in Inactive:
 *    ✅ Disabled element appears in Inactive filter view
 *    ✅ Element status shows as Inactive
 *
 * 3. Cleanup:
 *    ✅ Element is re-enabled after test
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-ELEM-07 — Disable element used in data entry', () => {
  test.setTimeout(120_000);

  test('Disable element and verify it moves to Inactive', async ({ page }) => {
    await test.step('Step 1: Navigate to Elements Management', async () => {
      await page.goto('/admin/elements');
      await expect(page.getByRole('heading', { name: 'Elements Management' })).toBeVisible();
    });

    await test.step('Step 2: Locate element with "Disable Record" button (used in data entry)', async () => {
      // "Bc" (Bridge Coatings) is known to have Disable Record
      await page.locator('input[placeholder="Search"]').fill('Bridge Coatings');
      await page.getByRole('button', { name: 'Search' }).click();
      await page.waitForTimeout(1000);

      const row = page.locator('table tbody tr', { hasText: 'Bridge Coatings' });
      await expect(row).toBeVisible();
      await expect(row.locator('button[title="Disable Record"]')).toBeVisible();
    });

    await test.step('Step 3: Click "Disable Record" and verify confirmation', async () => {
      const row = page.locator('table tbody tr', { hasText: 'Bridge Coatings' });
      await row.locator('button[title="Disable Record"]').click();

      const popover = page.locator('.popover.show');
      await popover.waitFor({ state: 'visible', timeout: 5000 });
      await expect(popover).toContainText('Are you sure?');
      await expect(popover.getByRole('button', { name: 'Disable' })).toBeVisible();
      await expect(popover.getByRole('button', { name: 'Cancel' })).toBeVisible();
    });

    await test.step('Step 4: Confirm disable', async () => {
      const popover = page.locator('.popover.show');
      await popover.getByRole('button', { name: 'Disable' }).click();
      await page.waitForTimeout(1000);

      // Element should no longer be visible in Active view
      await expect(page.locator('table tbody tr', { hasText: 'Bridge Coatings' })).not.toBeVisible();
    });

    await test.step('Step 5: Verify element appears in Inactive filter', async () => {
      await page.getByRole('button', { name: 'Active' }).click();
      await page.waitForTimeout(300);

      const dropdownMenu = page.locator('.dropdown-menu.show');
      await dropdownMenu.locator('input[value="active"]').uncheck();
      await page.waitForTimeout(200);
      await dropdownMenu.locator('input[value="inactive"]').check();
      await page.waitForTimeout(200);

      await page.locator('body').click({ position: { x: 10, y: 10 } });
      await page.waitForTimeout(300);

      await page.locator('input[placeholder="Search"]').fill('Bridge Coatings');
      await page.getByRole('button', { name: 'Search' }).click();
      await page.waitForTimeout(1000);

      const row = page.locator('table tbody tr', { hasText: 'Bridge Coatings' });
      await expect(row).toBeVisible();
      await expect(row).toContainText('Inactive');
    });

    await test.step('Cleanup: Re-enable Bridge Coatings', async () => {
      const row = page.locator('table tbody tr', { hasText: 'Bridge Coatings' });
      await row.locator('button[title="Disable Record"]').click();

      const popover = page.locator('.popover.show');
      await popover.waitFor({ state: 'visible', timeout: 5000 });
      await popover.getByRole('button', { name: 'Activate' }).click();
      await page.waitForTimeout(1000);
    });
  });
});
