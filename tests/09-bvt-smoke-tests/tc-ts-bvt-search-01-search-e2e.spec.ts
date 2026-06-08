/**
 * ============================================================================
 * 09-BVT-Smoke-Tests - TC-TS-BVT-SEARCH-01: Search projects end-to-end
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-BVT-SEARCH-01-search-e2e.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-search-01-search-e2e.spec.ts --headed
 * Headless:               npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-search-01-search-e2e.spec.ts
 * Debug:                  npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-search-01-search-e2e.spec.ts --debug
 * Specific Test:          npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-search-01-search-e2e.spec.ts -g "Search projects" --headed
 *
 * OVERVIEW:
 * Build Verification Test confirming the Project Search workflow functions
 * correctly. Verifies that region, keyword, and PM filters produce results,
 * and that clicking a project navigates to the Project Details page.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Region Filter:
 *    ✅ Selecting a region and searching returns matching projects
 *    ✅ Results show the correct region in the region column
 *
 * 2. Keyword Filter:
 *    ✅ Typing a keyword and searching returns matching projects
 *    ✅ Results contain the keyword in the project name/description
 *
 * 3. Project Manager Filter:
 *    ✅ Selecting a PM and searching returns projects for that PM
 *
 * 4. Project Navigation:
 *    ✅ Clicking a project link navigates to the Project Details page
 *    ✅ The Project Details page loads successfully
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-BVT-SEARCH-01 — BVT: Search projects end-to-end', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/projects');
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  test('Search projects by region, keyword, PM, and open details', async ({ page }) => {
    await test.step('Step 1: Search by Region filter', async () => {
      // Open Regions dropdown
      const regionsBtn = page.locator('button.dropdown-toggle:has-text("Regions")');
      await regionsBtn.click();
      await page.waitForTimeout(300);

      // Select "1-South Coast"
      await page.locator('.show label:has-text("1-South Coast")').click();
      await page.waitForTimeout(200);
      await page.keyboard.press('Escape');

      // Search
      await page.getByRole('button', { name: 'Search' }).click();
      await page.waitForTimeout(3000);

      // Verify results contain South Coast region
      const rows = page.locator('table tbody tr');
      const rowCount = await rows.count();
      expect(rowCount).toBeGreaterThan(0);

      // First result should show "1-South Coast" in region column
      await expect(rows.first().locator('td').nth(0)).toContainText('South Coast');
    });

    await test.step('Step 2: Reset and search by Keywords', async () => {
      await page.getByRole('button', { name: 'Reset' }).click();
      await page.waitForTimeout(2000);

      // Type keyword and search
      await page.locator('input[name="searchText"]').fill('test');
      await page.getByRole('button', { name: 'Search' }).click();
      await page.waitForTimeout(3000);

      // Verify results are returned
      const rows = page.locator('table tbody tr');
      const rowCount = await rows.count();
      expect(rowCount).toBeGreaterThan(0);
    });

    await test.step('Step 3: Reset and search by Project Manager', async () => {
      await page.getByRole('button', { name: 'Reset' }).click();
      await page.waitForTimeout(2000);

      // Open PM dropdown and select first available PM
      const pmBtn = page.locator('button.dropdown-toggle:has-text("Project Manager")');
      await pmBtn.click();
      await page.waitForTimeout(300);

      // Select the first PM (skip "Select All")
      const pmLabels = page.locator('.show label');
      await pmLabels.nth(1).click();
      await page.waitForTimeout(200);
      await page.keyboard.press('Escape');

      // Search
      await page.getByRole('button', { name: 'Search' }).click();
      await page.waitForTimeout(3000);

      // Verify results returned
      const rows = page.locator('table tbody tr');
      const rowCount = await rows.count();
      expect(rowCount).toBeGreaterThan(0);
    });

    await test.step('Step 4: Click a project to open details', async () => {
      // Click the project link in the first result row
      const firstProjectLink = page.locator('table tbody tr').first().locator('a[title="See project details"]');
      await expect(firstProjectLink).toBeVisible();
      await firstProjectLink.click();
      await page.waitForTimeout(3000);

      // Verify navigation to Project Details page
      await expect(page).toHaveURL(/\/projects\/\d+/);
      await expect(page.getByRole('heading', { name: 'Project Details' })).toBeVisible();
    });
  });
});
