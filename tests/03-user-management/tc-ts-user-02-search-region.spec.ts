/**
 * ============================================================================
 * 03 User Management - TC-TS-USER-02: Search users by single region
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-USER-02-search-region.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/03-user-management/tc-ts-user-02-search-region.spec.ts --headed
 * Headless:               npx playwright test tests/03-user-management/tc-ts-user-02-search-region.spec.ts
 * Debug:                  npx playwright test tests/03-user-management/tc-ts-user-02-search-region.spec.ts --debug
 * Specific Test:          npx playwright test tests/03-user-management/tc-ts-user-02-search-region.spec.ts -g "Search users by single region" --headed
 *
 * OVERVIEW:
 * Verifies that selecting a single region from the region filter on the User
 * Management page returns only users assigned to that region. Ensures no users
 * from other regions appear in the results when a single region is selected.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Single Region Filter:
 *    ✅ Selecting "1-South Coast" filters to only users in that region
 *    ✅ Dropdown button text updates to show the selected region name
 *
 * 2. Search Results Accuracy:
 *    ✅ All returned users have region code "1" in their Regions column
 *    ✅ No users without region "1" appear in the results
 *    ✅ At least one result is returned
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

const SELECTED_REGION = '1-South Coast';
const REGION_CODE = '1';

test.describe('TC-TS-USER-02 — Search users by single region', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the User Management page
    await page.goto('/admin/users');
    await expect(page.getByRole('heading', { name: 'User Management' })).toBeVisible();
  });

  test('Search users by single region', async ({ page }) => {
    await test.step('Step 1: Select "1 - South Coast" from the region filter', async () => {
      // Open the Regions dropdown
      await page.getByRole('button', { name: 'Regions' }).click();

      // Select "1-South Coast"
      await page.getByRole('checkbox', { name: SELECTED_REGION }).check();

      // Close the dropdown by clicking elsewhere
      await page.getByRole('heading', { name: 'User Management' }).click();

      // Verify dropdown button text updates to show selected region
      await expect(page.getByRole('button', { name: SELECTED_REGION })).toBeVisible();
    });

    await test.step('Step 2: Click Search', async () => {
      await page.getByRole('button', { name: 'Search' }).click();

      // Wait for results to load
      await expect(page.locator('table')).toBeVisible();
    });

    await test.step('Step 3: Verify only users from "1 - South Coast" are shown', async () => {
      const rows = page.locator('table tbody tr');
      const rowCount = await rows.count();

      // Verify at least one result is returned
      expect(rowCount).toBeGreaterThan(0);

      // Verify every user in the results has region code "1" (South Coast)
      for (let i = 0; i < rowCount; i++) {
        const regionsCell = rows.nth(i).locator('td:nth-child(5)');
        const regionsText = await regionsCell.textContent();
        const userRegions = regionsText!.split(',').map((r) => r.trim());

        expect(
          userRegions.includes(REGION_CODE),
          `Row ${i + 1} regions "${regionsText}" should include region code "${REGION_CODE}"`
        ).toBe(true);
      }
    });
  });
});
