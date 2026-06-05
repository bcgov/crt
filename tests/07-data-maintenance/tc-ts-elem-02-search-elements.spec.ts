/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-ELEM-02: Search elements with Active/Inactive filter
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-ELEM-02-search-elements.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-elem-02-search-elements.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-elem-02-search-elements.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-elem-02-search-elements.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-elem-02-search-elements.spec.ts -g "code" --headed
 *
 * OVERVIEW:
 * Verifies that elements can be searched by code or name, and that the
 * Active/Inactive toggle filters results correctly with Active as the default.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Search by Code:
 *    ✅ Searching "Bb" returns row with "Bike BC"
 *
 * 2. Search by Name:
 *    ✅ Searching "Bridge" returns rows with "Bridge" in Description
 *
 * 3. Active/Inactive Filter:
 *    ✅ Active is the default filter state
 *    ✅ Switching to Inactive shows only inactive elements
 *    ✅ Reset clears filters back to default
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-ELEM-02 — Search elements with Active/Inactive filter', () => {
  test.setTimeout(60_000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/elements');
    await expect(page.getByRole('heading', { name: 'Elements Management' })).toBeVisible();
  });

  test('Search by element code', async ({ page }) => {
    await test.step('Step 1: Verify Active filter is default', async () => {
      await expect(page.getByRole('button', { name: 'Active' })).toBeVisible();
      await expect(page).toHaveURL(/isActive=true/);
    });

    await test.step('Step 2: Search by code "Bb"', async () => {
      await page.locator('input[placeholder="Search"]').fill('Bb');
      await page.getByRole('button', { name: 'Search' }).click();
      await page.waitForTimeout(1000);
    });

    await test.step('Step 3: Verify results contain "Bb" and "Bike BC"', async () => {
      const table = page.locator('table');
      const row = table.locator('tbody tr', { hasText: 'Bb' });
      await expect(row).toBeVisible();
      await expect(row).toContainText('Bike BC');
    });
  });

  test('Search by element name', async ({ page }) => {
    await test.step('Step 1: Search by name "Bridge"', async () => {
      await page.locator('input[placeholder="Search"]').fill('Bridge');
      await page.getByRole('button', { name: 'Search' }).click();
      await page.waitForTimeout(1000);
    });

    await test.step('Step 2: Verify results contain "Bridge" in Description', async () => {
      const rows = page.locator('table tbody tr');
      const count = await rows.count();
      expect(count).toBeGreaterThan(0);

      // All visible rows should contain "Bridge"
      for (let i = 0; i < count; i++) {
        await expect(rows.nth(i)).toContainText(/Bridge/i);
      }
    });
  });

  test('Toggle to Inactive filter', async ({ page }) => {
    await test.step('Step 1: Click Active filter button', async () => {
      await page.getByRole('button', { name: 'Active' }).click();
      await page.waitForTimeout(300);
    });

    await test.step('Step 2: Uncheck Active and check Inactive', async () => {
      const dropdownMenu = page.locator('.dropdown-menu.show');
      await dropdownMenu.locator('input[value="active"]').uncheck();
      await page.waitForTimeout(200);
      await dropdownMenu.locator('input[value="inactive"]').check();
      await page.waitForTimeout(200);
    });

    await test.step('Step 3: Close dropdown and search', async () => {
      await page.locator('body').click({ position: { x: 10, y: 10 } });
      await page.waitForTimeout(300);
      await page.getByRole('button', { name: 'Search' }).click();
      await page.waitForTimeout(1000);
    });

    await test.step('Step 4: Verify only inactive elements shown', async () => {
      await expect(page).toHaveURL(/isActive=false/);
      const rows = page.locator('table tbody tr');
      const count = await rows.count();

      // All rows should show "Inactive" status
      for (let i = 0; i < count; i++) {
        await expect(rows.nth(i)).toContainText('Inactive');
      }
    });

    await test.step('Step 5: Reset clears filter', async () => {
      await page.getByRole('button', { name: 'Reset' }).click();
      await page.waitForTimeout(1000);
      await expect(page).toHaveURL(/isActive=true/);
    });
  });
});
