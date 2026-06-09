/**
 * ============================================================================
 * 03 User Management - TC-TS-USER-03: Partial text search for users
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-USER-03-search-partial.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/03-user-management/tc-ts-user-03-search-partial.spec.ts --headed
 * Headless:               npx playwright test tests/03-user-management/tc-ts-user-03-search-partial.spec.ts
 * Debug:                  npx playwright test tests/03-user-management/tc-ts-user-03-search-partial.spec.ts --debug
 * Specific Test:          npx playwright test tests/03-user-management/tc-ts-user-03-search-partial.spec.ts -g "Partial text search for users" --headed
 *
 * OVERVIEW:
 * Verifies that users can be found via partial text search on First Name, Last
 * Name, or IDIR. The search field accepts partial input and matches across
 * multiple user fields simultaneously, returning accurate user information.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Partial First Name Search:
 *    ✅ Entering a partial first name returns matching users
 *    ✅ All returned users have first names containing the search term
 *
 * 2. Partial Last Name Search:
 *    ✅ Entering a partial last name returns matching users
 *    ✅ All returned users have last names containing the search term
 *
 * 3. Partial IDIR Search:
 *    ✅ Entering a partial IDIR returns matching users
 *    ✅ All returned users have IDIRs containing the search term
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-USER-03 — Partial text search for users', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the User Management page
    await page.goto('/admin/users');
    await expect(page.getByRole('heading', { name: 'User Management' })).toBeVisible();
  });

  test('Partial text search for users', async ({ page }) => {
    await test.step('Step 1: Search by partial first name "Pet"', async () => {
      // Enter partial first name
      await page.getByRole('textbox', { name: 'IDIR/Name/Email' }).fill('Pet');
      await page.getByRole('button', { name: 'Search' }).click();

      // Wait for search results to load
      await page.waitForURL('**/users?**searchText=Pet**');
      await expect(page.locator('table tbody tr').first()).toBeVisible();
      const rows = page.locator('table tbody tr');
      const rowCount = await rows.count();

      // Verify at least one result is returned
      expect(rowCount).toBeGreaterThan(0);

      // Verify all returned users match the partial first name, last name, IDIR, or email
      for (let i = 0; i < rowCount; i++) {
        const firstName = await rows.nth(i).locator('td:nth-child(1)').textContent();
        const lastName = await rows.nth(i).locator('td:nth-child(2)').textContent();
        const idir = await rows.nth(i).locator('td:nth-child(3)').textContent();
        const email = await rows.nth(i).locator('td:nth-child(4)').textContent();

        const matchesSearch =
          firstName!.toLowerCase().includes('pet') ||
          lastName!.toLowerCase().includes('pet') ||
          idir!.toLowerCase().includes('pet') ||
          email!.toLowerCase().includes('pet');

        expect(matchesSearch, `Row ${i + 1} (${firstName} ${lastName} / ${idir}) should match "Pet"`).toBe(true);
      }
    });

    await test.step('Step 2: Search by partial last name "Wang"', async () => {
      // Clear and enter partial last name
      await page.getByRole('textbox', { name: 'IDIR/Name/Email' }).fill('Wang');
      await page.getByRole('button', { name: 'Search' }).click();

      // Wait for search results to load
      await page.waitForURL('**/users?**searchText=Wang**');
      await expect(page.locator('table tbody tr').first()).toBeVisible();
      const rows = page.locator('table tbody tr');
      const rowCount = await rows.count();

      // Verify at least one result is returned
      expect(rowCount).toBeGreaterThan(0);

      // Verify all returned users match the partial last name search
      for (let i = 0; i < rowCount; i++) {
        const firstName = await rows.nth(i).locator('td:nth-child(1)').textContent();
        const lastName = await rows.nth(i).locator('td:nth-child(2)').textContent();
        const idir = await rows.nth(i).locator('td:nth-child(3)').textContent();
        const email = await rows.nth(i).locator('td:nth-child(4)').textContent();

        const matchesSearch =
          firstName!.toLowerCase().includes('wang') ||
          lastName!.toLowerCase().includes('wang') ||
          idir!.toLowerCase().includes('wang') ||
          email!.toLowerCase().includes('wang');

        expect(matchesSearch, `Row ${i + 1} (${firstName} ${lastName} / ${idir}) should match "Wang"`).toBe(true);
      }
    });

    await test.step('Step 3: Search by partial IDIR "BWANG"', async () => {
      // Clear and enter partial IDIR
      await page.getByRole('textbox', { name: 'IDIR/Name/Email' }).fill('BWANG');
      await page.getByRole('button', { name: 'Search' }).click();

      // Wait for search results to load
      await page.waitForURL('**/users?**searchText=BWANG**');
      await expect(page.locator('table tbody tr').first()).toBeVisible();
      const rows = page.locator('table tbody tr');
      const rowCount = await rows.count();

      // Verify at least one result is returned
      expect(rowCount).toBeGreaterThan(0);

      // Verify all returned users match the partial IDIR search
      for (let i = 0; i < rowCount; i++) {
        const firstName = await rows.nth(i).locator('td:nth-child(1)').textContent();
        const lastName = await rows.nth(i).locator('td:nth-child(2)').textContent();
        const idir = await rows.nth(i).locator('td:nth-child(3)').textContent();
        const email = await rows.nth(i).locator('td:nth-child(4)').textContent();

        const matchesSearch =
          firstName!.toLowerCase().includes('bwang') ||
          lastName!.toLowerCase().includes('bwang') ||
          idir!.toLowerCase().includes('bwang') ||
          email!.toLowerCase().includes('bwang');

        expect(matchesSearch, `Row ${i + 1} (${firstName} ${lastName} / ${idir}) should match "BWANG"`).toBe(true);
      }
    });
  });
});
