/**
 * ============================================================================
 * 03-User-Management - TC-TS-ROLE-02: Search roles with partial name
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-ROLE-02-search-roles.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/03-user-management/tc-ts-role-02-search-roles.spec.ts --headed
 * Headless:               npx playwright test tests/03-user-management/tc-ts-role-02-search-roles.spec.ts
 * Debug:                  npx playwright test tests/03-user-management/tc-ts-role-02-search-roles.spec.ts --debug
 * Specific Test:          npx playwright test tests/03-user-management/tc-ts-role-02-search-roles.spec.ts -g "Search" --headed
 *
 * OVERVIEW:
 * Verifies that roles can be searched by partial name and that the Active
 * filter is selected by default on the Roles & Permissions page.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Default State:
 *    ✅ Active filter is selected by default (URL has isActive=true)
 *    ✅ All 4 active roles are displayed
 *
 * 2. Partial Name Search:
 *    ✅ Searching a unique partial name (e.g. "REGION" or "DISTRICT") returns only the matching role
 *    ✅ Other roles are filtered out
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-ROLE-02 — Search roles with partial name', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/roles');
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  test('Search roles by partial name', async ({ page }) => {
    await test.step('Step 1: Verify Active filter is default', async () => {
      await expect(page).toHaveURL(/isActive=true/);
      await expect(page.getByRole('button', { name: 'ACTIVE' })).toBeVisible();

      // Default roles are visible (at least the 4 seeded roles)
      const rows = page.locator('table tbody tr');
      await expect(rows.first()).toBeVisible();
      expect(await rows.count()).toBeGreaterThanOrEqual(4);
    });

    await test.step('Step 2: Search with partial name unique to one role', async () => {
      // Determine search term based on environment (DEV has REGION_ADMIN, TST has DISTRICT_ADMIN)
      const roleNames = await page.locator('table tbody tr td:first-child').allTextContents();
      const hasRegionAdmin = roleNames.some(name => name.includes('REGION'));
      const searchTerm = hasRegionAdmin ? 'REGION' : 'DISTRICT';
      const expectedRole = hasRegionAdmin ? 'REGION_ADMIN' : 'DISTRICT_ADMIN';

      await page.locator('input[name="searchText"]').fill(searchTerm);
      await page.getByRole('button', { name: 'Search' }).click();

      // Only the matching role appears
      const rows = page.locator('table tbody tr');
      await expect(rows).toHaveCount(1);
      await expect(rows.first().locator('td').first()).toHaveText(expectedRole);
    });
  });
});
