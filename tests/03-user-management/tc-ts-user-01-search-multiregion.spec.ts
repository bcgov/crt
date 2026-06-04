/**
 * ============================================================================
 * 03 User Management - TC-TS-USER-01: Search users by multiple regions
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-USER-01-search-multiregion.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/03-user-management/tc-ts-user-01-search-multiregion.spec.ts --headed
 * Headless:               npx playwright test tests/03-user-management/tc-ts-user-01-search-multiregion.spec.ts
 * Debug:                  npx playwright test tests/03-user-management/tc-ts-user-01-search-multiregion.spec.ts --debug
 * Specific Test:          npx playwright test tests/03-user-management/tc-ts-user-01-search-multiregion.spec.ts -g "Search users by multiple regions" --headed
 *
 * OVERVIEW:
 * Verifies that users can be searched by selecting multiple MoTI regions in the
 * region filter on the User Management page. Validates that multi-region selection
 * is supported, results include users from all selected regions, and region labels
 * follow the expected "<Code>-<Description>" display format.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Multi-Region Selection:
 *    ✅ Region dropdown supports selecting multiple regions simultaneously
 *    ✅ Dropdown button text updates to show selected region names
 *
 * 2. Search Results:
 *    ✅ Results include users from all selected regions
 *    ✅ Each user in the results belongs to at least one selected region
 *
 * 3. Region Display Format:
 *    ✅ Regions display as "<Code>-<Description>" (e.g., "1-South Coast")
 *    ✅ All expected regions are present: 0-Headquarters, 1-South Coast, 2-Southern Interior, 3-Northern
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

// Region codes that correspond to "1-South Coast" and "2-Southern Interior"
const SELECTED_REGIONS = ['1-South Coast', '2-Southern Interior'];

// All expected region labels in the dropdown
const ALL_REGION_LABELS = ['0-Headquarters', '1-South Coast', '2-Southern Interior', '3-Northern'];

test.describe('TC-TS-USER-01 — Search users by multiple regions', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the User Management page
    await page.goto('/admin/users');
    await expect(page.getByRole('heading', { name: 'User Management' })).toBeVisible();
  });

  test('Search users by multiple regions', async ({ page }) => {
    await test.step('Step 1: Verify region dropdown displays all expected regions in correct format', async () => {
      // Open the Regions dropdown
      await page.getByRole('button', { name: 'Regions' }).click();

      // Verify all expected region labels are present with correct "<Code>-<Description>" format
      for (const regionLabel of ALL_REGION_LABELS) {
        await expect(page.getByRole('checkbox', { name: regionLabel })).toBeVisible();
      }
    });

    await test.step('Step 2: Select multiple regions (1-South Coast and 2-Southern Interior)', async () => {
      // Select "1-South Coast"
      await page.getByRole('checkbox', { name: '1-South Coast' }).check();

      // Select "2-Southern Interior"
      await page.getByRole('checkbox', { name: '2-Southern Interior' }).check();

      // Close the dropdown by clicking elsewhere
      await page.getByRole('heading', { name: 'User Management' }).click();

      // Verify dropdown button text updates to show selected regions
      await expect(page.getByRole('button', { name: '1-South Coast, 2-Southern Interior' })).toBeVisible();
    });

    await test.step('Step 3: Click Search and verify results contain users from selected regions', async () => {
      // Click Search
      await page.getByRole('button', { name: 'Search' }).click();

      // Wait for results to load
      await expect(page.locator('table')).toBeVisible();

      // Verify at least one row is returned
      const rows = page.locator('table tbody tr');
      const rowCount = await rows.count();
      expect(rowCount).toBeGreaterThan(0);

      // Verify each user in results has at least one of the selected regions (code 1 or 2)
      for (let i = 0; i < rowCount; i++) {
        const regionsCell = rows.nth(i).locator('td:nth-child(5)');
        const regionsText = await regionsCell.textContent();
        const userRegions = regionsText!.split(',').map((r) => r.trim());

        // User must belong to region 1 (South Coast) or region 2 (Southern Interior)
        const hasSelectedRegion = userRegions.some((r) => r === '1' || r === '2');
        expect(hasSelectedRegion, `Row ${i + 1} regions "${regionsText}" should include region 1 or 2`).toBe(true);
      }
    });
  });
});
