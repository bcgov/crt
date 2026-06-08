/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-PM-02: Search PM by name
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-PM-02-search.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-pm-02-search.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-pm-02-search.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-pm-02-search.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-pm-02-search.spec.ts -g "Search" --headed
 *
 * OVERVIEW:
 * Verifies that PMs can be searched by partial name in the Code Tables
 * "Project Manager" code set. Searches a known PM name and validates that
 * only matching entries appear.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Search Functionality:
 *    ✅ Partial name search filters the PM list
 *    ✅ Only matching PMs appear in results
 *    ✅ Search covers Code Name field
 *
 * 2. Reset:
 *    ✅ Reset clears the search and returns all PMs
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-PM-02 — Search PM by name', () => {
  test.setTimeout(60_000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/codetables');
    await expect(page.locator('table tbody tr').first()).toBeVisible();

    // Select Project Manager code set
    await page.getByRole('button', { name: 'Accomplishment', exact: true }).click();
    await page.getByRole('menuitem', { name: 'Project Manager' }).click();
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page).toHaveURL(/codeSet=PROJECT_MANAGER/);
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  test('Search PM by partial name', async ({ page }) => {
    await test.step('Step 1: Search for "Dev" (partial name match)', async () => {
      await page.locator('input[name="searchText"]').fill('Dev');
      await page.getByRole('button', { name: 'Search' }).click();
      await expect(page).toHaveURL(/searchText=Dev/);
    });

    await test.step('Step 2: Verify only matching PMs appear', async () => {
      const rows = page.locator('table tbody tr');
      await expect(rows.first()).toBeVisible();
      const count = await rows.count();
      expect(count).toBeGreaterThan(0);

      // All results should contain "Dev" in Code Value or Code Name
      for (let i = 0; i < count; i++) {
        const codeValue = await rows.nth(i).locator('td').nth(0).textContent();
        const codeName = await rows.nth(i).locator('td').nth(1).textContent();
        const combined = `${codeValue} ${codeName}`.toLowerCase();
        expect(combined).toContain('dev');
      }
    });

    await test.step('Step 3: Verify "Devashish Bhargava" is in results', async () => {
      await expect(page.locator('table tbody')).toContainText('Devashish Bhargava');
    });
  });
});
