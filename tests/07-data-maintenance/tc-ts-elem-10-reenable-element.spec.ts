/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-ELEM-10: Re-enable disabled element
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-ELEM-10-reenable-element.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-elem-10-reenable-element.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-elem-10-reenable-element.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-elem-10-reenable-element.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-elem-10-reenable-element.spec.ts -g "Re-enable" --headed
 *
 * OVERVIEW:
 * Verifies that a disabled (Inactive) element can be re-enabled via the toggle
 * button, making it Active again. The "Disable Record" button on an inactive
 * row acts as a toggle — showing "Activate" in the confirmation popover.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Disable First (Setup):
 *    ✅ Element is disabled and moves to Inactive list
 *
 * 2. Re-enable Flow:
 *    ✅ Inactive element shows "Disable Record" button (toggle)
 *    ✅ Clicking shows "Are you sure?" with "Activate" button
 *    ✅ Confirming removes element from Inactive view
 *
 * 3. Verify Active:
 *    ✅ Re-enabled element appears in Active filter view
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-ELEM-10 — Re-enable disabled element', () => {
  test.setTimeout(120_000);

  test('Re-enable a disabled element', async ({ page }) => {
    await test.step('Step 1: Navigate to Elements and disable Bridge Coatings', async () => {
      await page.goto('/admin/elements');
      await expect(page.getByRole('heading', { name: 'Elements Management' })).toBeVisible();

      await page.locator('input[placeholder="Search"]').fill('Bridge Coatings');
      await page.getByRole('button', { name: 'Search' }).click();
      await page.waitForTimeout(1000);

      const row = page.locator('table tbody tr', { hasText: 'Bridge Coatings' });
      await row.locator('button[title="Disable Record"]').click();

      const popover = page.locator('.popover.show');
      await popover.waitFor({ state: 'visible', timeout: 5000 });
      await popover.getByRole('button', { name: 'Disable' }).click();
      await page.waitForTimeout(1000);
    });

    await test.step('Step 2: Switch to Inactive filter', async () => {
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
    });

    await test.step('Step 3: Click toggle button and verify "Activate" confirmation', async () => {
      const row = page.locator('table tbody tr', { hasText: 'Bridge Coatings' });
      await row.locator('button[title="Disable Record"]').click();

      const popover = page.locator('.popover.show');
      await popover.waitFor({ state: 'visible', timeout: 5000 });
      await expect(popover).toContainText('Are you sure?');
      await expect(popover.getByRole('button', { name: 'Activate' })).toBeVisible();
    });

    await test.step('Step 4: Confirm re-enable', async () => {
      const popover = page.locator('.popover.show');
      await popover.getByRole('button', { name: 'Activate' }).click();
      await page.waitForTimeout(1000);

      // Element should disappear from Inactive view
      await expect(page.locator('table tbody tr', { hasText: 'Bridge Coatings' })).not.toBeVisible();
    });

    await test.step('Step 5: Verify element is back in Active filter', async () => {
      await page.getByRole('button', { name: 'Reset' }).click();
      await page.waitForTimeout(1000);

      await page.locator('input[placeholder="Search"]').fill('Bridge Coatings');
      await page.getByRole('button', { name: 'Search' }).click();
      await page.waitForTimeout(1000);

      const row = page.locator('table tbody tr', { hasText: 'Bridge Coatings' });
      await expect(row).toBeVisible();
      await expect(row).toContainText('Active');
    });
  });
});
