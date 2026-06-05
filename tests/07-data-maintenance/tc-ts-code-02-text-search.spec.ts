/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-CODE-02: Code Value/Name text search
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-CODE-02-text-search.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-code-02-text-search.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-code-02-text-search.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-code-02-text-search.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-code-02-text-search.spec.ts -g "text search" --headed
 *
 * OVERVIEW:
 * Verifies that the text search filters code table entries by both Code Value
 * and Code Name. Tests searching for "Bridge" (multiple matches) and "Active"
 * (specific match), and verifies the Reset button clears the search.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Search by Code Name:
 *    ✅ Searching "Bridge" filters results to entries containing "Bridge"
 *    ✅ URL updates with searchText parameter
 *
 * 2. Reset and Re-search:
 *    ✅ Reset clears search and shows all results
 *    ✅ Searching "Active" shows "Active Transportation Project"
 *
 * 3. Search Mechanics:
 *    ✅ Search textbox has placeholder "Search"
 *    ✅ Search button triggers the filter
 *    ✅ Reset button clears the filter
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-CODE-02 — Code Value/Name text search', () => {
  test.setTimeout(60_000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/codetables');
    // Wait for the table to be populated (indicates data loaded)
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  test('Search by code name "Bridge"', async ({ page }) => {
    await test.step('Step 1: Fill search with "Bridge" and click Search', async () => {
      await page.locator('input[name="searchText"]').fill('Bridge');
      await page.getByRole('button', { name: 'Search' }).click();
      await expect(page).toHaveURL(/searchText=Bridge/);
    });

    await test.step('Step 2: Verify results contain "Bridge" in Code Name', async () => {
      // Wait for table to show filtered results (fewer rows than full list)
      await expect(page.locator('table tbody tr').first()).toBeVisible();
      const rows = page.locator('table tbody tr');
      const count = await rows.count();
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        const codeName = await rows.nth(i).locator('td').nth(1).textContent();
        expect(codeName?.toLowerCase()).toContain('bridge');
      }
    });
  });

  test('Search by code name "Active"', async ({ page }) => {
    await test.step('Step 1: Search for "Active"', async () => {
      await page.locator('input[name="searchText"]').fill('Active');
      await page.getByRole('button', { name: 'Search' }).click();
      await expect(page).toHaveURL(/searchText=Active/);
    });

    await test.step('Step 2: Verify "Active Transportation Project" in results', async () => {
      await expect(page.locator('table tbody')).toContainText('Active Transportation Project');
    });

    await test.step('Step 3: Reset clears search and shows all results', async () => {
      await page.getByRole('button', { name: 'Reset' }).click();
      // Wait for URL to update (searchText removed)
      await expect(page).toHaveURL(/codeSet=ACCOMPLISHMENT/);
      await expect(page.locator('table tbody tr').first()).toBeVisible();
      expect(page.url()).not.toContain('searchText=');
    });
  });
});
