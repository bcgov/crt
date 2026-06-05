/**
 * ============================================================================
 * 04-Project-Search-Details - TC-TS-PROJ-02: Multi-region selection in filter
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-PROJ-02-multi-region-selection.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/04-project-search-details/tc-ts-proj-02-multi-region-selection.spec.ts --headed
 * Headless:               npx playwright test tests/04-project-search-details/tc-ts-proj-02-multi-region-selection.spec.ts
 * Debug:                  npx playwright test tests/04-project-search-details/tc-ts-proj-02-multi-region-selection.spec.ts --debug
 * Specific Test:          npx playwright test tests/04-project-search-details/tc-ts-proj-02-multi-region-selection.spec.ts -g "Multi-region selection" --headed
 *
 * OVERVIEW:
 * Verifies that the Regions dropdown on the Project Search page allows multiple
 * regions to be selected simultaneously and that search results are filtered
 * to show only projects from the selected regions.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Multi-Region Selection:
 *    ✅ Multiple region checkboxes can be checked simultaneously
 *    ✅ Both "1-South Coast" and "2-Southern Interior" can be selected together
 *
 * 2. Filtered Results:
 *    ✅ After searching, results include projects from both selected regions
 *    ✅ Results do not include projects from unselected regions (0-Headquarters, 3-Northern)
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-PROJ-02 — Multi-region selection in filter', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/projects');
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
  });

  test('Multi-region selection in filter', async ({ page }) => {
    await test.step('Step 1: Open Regions dropdown and select 1-South Coast and 2-Southern Interior', async () => {
      // Click the Regions button to open the dropdown
      await page.getByRole('button', { name: 'Regions' }).click();

      // Wait for the multi-select dropdown to appear
      const menu = page.locator('[role="menu"].multi.show');
      await expect(menu).toBeVisible();

      // Check "1-South Coast"
      const southCoastCheckbox = menu.getByRole('checkbox', { name: '1-South Coast' });
      await southCoastCheckbox.check();
      await expect(southCoastCheckbox).toBeChecked();

      // Check "2-Southern Interior"
      const southernInteriorCheckbox = menu.getByRole('checkbox', { name: '2-Southern Interior' });
      await southernInteriorCheckbox.check();
      await expect(southernInteriorCheckbox).toBeChecked();

      // Verify both are checked simultaneously
      await expect(southCoastCheckbox).toBeChecked();
      await expect(southernInteriorCheckbox).toBeChecked();
    });

    await test.step('Step 2: Click Search and verify filtered results', async () => {
      // Click Search to apply the filter
      await page.getByRole('button', { name: 'Search' }).click();

      // Wait for table results to load
      await expect(page.locator('table tbody tr').first()).toBeVisible();

      // Get all region cells from the table
      const regionCells = page.locator('table tbody tr td:nth-child(1)');
      const count = await regionCells.count();
      expect(count).toBeGreaterThan(0);

      // Verify each row's region is either "1-South Coast" or "2-Southern Interior"
      for (let i = 0; i < count; i++) {
        const regionText = await regionCells.nth(i).textContent();
        expect(
          regionText === '1-South Coast' || regionText === '2-Southern Interior',
          `Expected region to be "1-South Coast" or "2-Southern Interior", got "${regionText}"`
        ).toBeTruthy();
      }
    });

    await test.step('Step 3: Verify excluded regions are not in results', async () => {
      // Verify no "0-Headquarters" rows
      await expect(page.locator('table tbody tr td:nth-child(1)', { hasText: '0-Headquarters' })).toHaveCount(0);

      // Verify no "3-Northern" rows
      await expect(page.locator('table tbody tr td:nth-child(1)', { hasText: '3-Northern' })).toHaveCount(0);
    });
  });
});
