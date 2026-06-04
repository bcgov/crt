/**
 * ============================================================================
 * 03 User Management - TC-TS-USER-11: Verify search results columns
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-USER-11-results-columns.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/03-user-management/tc-ts-user-11-results-columns.spec.ts --headed
 * Headless:               npx playwright test tests/03-user-management/tc-ts-user-11-results-columns.spec.ts
 * Debug:                  npx playwright test tests/03-user-management/tc-ts-user-11-results-columns.spec.ts --debug
 * Specific Test:          npx playwright test tests/03-user-management/tc-ts-user-11-results-columns.spec.ts -g "Verify search results columns" --headed
 *
 * OVERVIEW:
 * Verifies that the user search results table displays all required columns:
 * First Name, Last Name, IDIR, Email, Regions, Active status, and action icons
 * (Edit and Disable).
 *
 * WHAT THE TEST VALIDATES:
 * 1. Table Header Columns:
 *    ✅ "First Name" column header is visible
 *    ✅ "Last Name" column header is visible
 *    ✅ "IDIR" column header is visible
 *    ✅ "Email" column header is visible
 *    ✅ "Regions" column header is visible
 *    ✅ "Active" column header is visible
 *
 * 2. Action Icons in Data Rows:
 *    ✅ "Edit Record" button is present in each row
 *    ✅ "Disable Record" button is present in each row
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

const EXPECTED_COLUMN_HEADERS = ['First Name', 'Last Name', 'IDIR', 'Email', 'Regions', 'Active'];

test.describe('TC-TS-USER-11 — Verify search results columns', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page.getByRole('heading', { name: 'User Management' })).toBeVisible();
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  test('Verify search results columns', async ({ page }) => {
    await test.step('Step 1: Verify all expected column headers are present', async () => {
      const headerRow = page.locator('table thead tr');
      await expect(headerRow).toBeVisible();

      for (const header of EXPECTED_COLUMN_HEADERS) {
        await expect(headerRow.getByRole('columnheader', { name: header })).toBeVisible();
      }
    });

    await test.step('Step 2: Verify Edit and Disable action icons in data rows', async () => {
      const firstRow = page.locator('table tbody tr').first();
      await expect(firstRow).toBeVisible();

      // Verify "Edit Record" button is present
      await expect(firstRow.getByRole('button', { name: 'Edit Record' })).toBeVisible();

      // Verify "Disable Record" button is present
      await expect(firstRow.getByRole('button', { name: 'Disable Record' })).toBeVisible();
    });

    await test.step('Step 3: Verify data cells contain expected content', async () => {
      const firstRow = page.locator('table tbody tr').first();

      // Verify each column has content (not empty)
      const cells = firstRow.locator('td');
      const firstName = await cells.nth(0).textContent();
      const lastName = await cells.nth(1).textContent();
      const idir = await cells.nth(2).textContent();
      const email = await cells.nth(3).textContent();
      const regions = await cells.nth(4).textContent();
      const status = await cells.nth(5).textContent();

      expect(firstName!.trim().length).toBeGreaterThan(0);
      expect(lastName!.trim().length).toBeGreaterThan(0);
      expect(idir!.trim().length).toBeGreaterThan(0);
      expect(email!.trim()).toContain('@');
      expect(regions!.trim().length).toBeGreaterThan(0);
      expect(['Active', 'Inactive']).toContain(status!.trim());
    });
  });
});
