/**
 * ============================================================================
 * 03 User Management - TC-TS-USER-04: Search by status (Active/Inactive/All)
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-USER-04-search-status.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/03-user-management/tc-ts-user-04-search-status.spec.ts --headed
 * Headless:               npx playwright test tests/03-user-management/tc-ts-user-04-search-status.spec.ts
 * Debug:                  npx playwright test tests/03-user-management/tc-ts-user-04-search-status.spec.ts --debug
 * Specific Test:          npx playwright test tests/03-user-management/tc-ts-user-04-search-status.spec.ts -g "Search by status" --headed
 *
 * OVERVIEW:
 * Verifies that the User Status filter correctly filters users by Active, Inactive,
 * or All (both) statuses. The default filter is Active. Validates that each filter
 * option returns the correct set of users with matching status badges.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Active Status Filter (default):
 *    ✅ Default filter shows "ACTIVE" pre-selected
 *    ✅ All displayed users have "Active" status badge
 *
 * 2. Inactive Status Filter:
 *    ✅ Selecting only "INACTIVE" shows inactive users
 *    ✅ All displayed users have "Inactive" status badge
 *
 * 3. All Users (Select All):
 *    ✅ Selecting both "ACTIVE" and "INACTIVE" shows all users
 *    ✅ Results contain both Active and Inactive users
 *    ✅ Total count is greater than Active-only or Inactive-only
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-USER-04 — Search by status (Active/Inactive/All)', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the User Management page
    await page.goto('/admin/users');
    await expect(page.getByRole('heading', { name: 'User Management' })).toBeVisible();
  });

  test('Search by status (Active/Inactive/All)', async ({ page }) => {
    let activeCount = 0;
    let inactiveCount = 0;

    await test.step('Step 1: Verify default filter is Active and only active users are displayed', async () => {
      // Default status filter should show "ACTIVE"
      await expect(page.getByRole('button', { name: 'ACTIVE' })).toBeVisible();

      // Wait for results
      await expect(page.locator('table')).toBeVisible();
      const rows = page.locator('table tbody tr');
      activeCount = await rows.count();
      expect(activeCount).toBeGreaterThan(0);

      // Verify all displayed users have "Active" status
      for (let i = 0; i < activeCount; i++) {
        const statusCell = rows.nth(i).locator('td:nth-child(6)');
        await expect(statusCell).toHaveText('Active');
      }
    });

    await test.step('Step 2: Select "Inactive" from the status filter and search', async () => {
      // Open the status dropdown
      await page.getByRole('button', { name: 'ACTIVE' }).click();

      // Uncheck ACTIVE
      await page.getByRole('checkbox', { name: 'ACTIVE', exact: true }).uncheck();

      // Check INACTIVE
      await page.getByRole('checkbox', { name: 'INACTIVE' }).check();

      // Close the dropdown before searching
      await page.getByRole('heading', { name: 'User Management' }).click();

      // Click Search and wait for the URL to update
      await page.getByRole('button', { name: 'Search' }).click();
      await page.waitForURL(/isActive=false/);

      // Wait for results table to be visible and populated
      await expect(page.locator('table tbody tr').first()).toBeVisible();
      const rows = page.locator('table tbody tr');
      inactiveCount = await rows.count();
      expect(inactiveCount).toBeGreaterThan(0);

      // Verify all displayed users have "Inactive" status
      for (let i = 0; i < inactiveCount; i++) {
        const statusCell = rows.nth(i).locator('td:nth-child(6)');
        await expect(statusCell).toHaveText('Inactive');
      }
    });

    await test.step('Step 3: Select All (both Active and Inactive) and search', async () => {
      // Open the status dropdown (now showing "INACTIVE")
      await page.getByRole('button', { name: 'INACTIVE' }).click();

      // Click "Select All" to check both ACTIVE and INACTIVE
      await page.getByRole('checkbox', { name: 'Select All' }).check();

      // Close the dropdown before searching
      await page.getByRole('heading', { name: 'User Management' }).click();

      // Click Search and wait for the URL to update (isActive param removed means "all")
      await page.getByRole('button', { name: 'Search' }).click();
      await page.waitForURL(/\/admin\/users\?pageNumber=1/);

      // Wait for results table to be visible and populated
      await expect(page.locator('table tbody tr').first()).toBeVisible();
      const rows = page.locator('table tbody tr');
      const allCount = await rows.count();

      // "All" should return more users than either Active-only or Inactive-only
      expect(allCount).toBeGreaterThan(0);
      expect(allCount).toBeGreaterThanOrEqual(Math.max(activeCount, inactiveCount));

      // Verify results contain both Active and Inactive users
      const statuses = new Set<string>();
      for (let i = 0; i < allCount; i++) {
        const statusCell = rows.nth(i).locator('td:nth-child(6)');
        const statusText = await statusCell.textContent();
        statuses.add(statusText!.trim());
      }
      expect(statuses.has('Active')).toBe(true);
      expect(statuses.has('Inactive')).toBe(true);
    });
  });
});
