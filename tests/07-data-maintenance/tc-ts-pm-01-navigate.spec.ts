/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-PM-01: Navigate to Project Manager code table
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-PM-01-navigate.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-pm-01-navigate.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-pm-01-navigate.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-pm-01-navigate.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-pm-01-navigate.spec.ts -g "Navigate" --headed
 *
 * OVERVIEW:
 * Verifies that an admin can navigate to the Code Tables screen and select
 * the "Project Manager" code set, displaying the PM list with expected columns
 * and default Active filter.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Navigation:
 *    ✅ "Project Manager" is available in the Code Value Set dropdown
 *    ✅ Selecting it and clicking Search updates the table
 *
 * 2. Table Structure:
 *    ✅ Table shows columns: Code Value, Code Name, Order Number, Status
 *    ✅ PM entries are displayed
 *
 * 3. Default Filter:
 *    ✅ Status filter defaults to Active (isActive=true in URL)
 *    ✅ Only active PMs are shown
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-PM-01 — Navigate to Project Manager code table', () => {
  test.setTimeout(60_000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/codetables');
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  test('Select Project Manager from Code Set dropdown', async ({ page }) => {
    await test.step('Step 1: Open Code Set dropdown and select Project Manager', async () => {
      await page.getByRole('button', { name: 'Accomplishment', exact: true }).click();
      await expect(page.getByRole('menuitem', { name: 'Project Manager' })).toBeVisible();
      await page.getByRole('menuitem', { name: 'Project Manager' }).click();

      // Dropdown button text should update
      await expect(page.getByRole('button', { name: 'Project Manager', exact: true })).toBeVisible();
    });

    await test.step('Step 2: Click Search to load Project Manager data', async () => {
      await page.getByRole('button', { name: 'Search' }).click();
      await expect(page).toHaveURL(/codeSet=PROJECT_MANAGER/);
      await expect(page.locator('table tbody tr').first()).toBeVisible();
    });

    await test.step('Step 3: Verify table columns', async () => {
      const headers = page.locator('table thead th');
      await expect(headers.nth(0)).toHaveText('Code Value');
      await expect(headers.nth(1)).toHaveText('Code Name');
      await expect(headers.nth(2)).toHaveText('Order Number');
      await expect(headers.nth(3)).toHaveText('Status');
    });

    await test.step('Step 4: Verify Active filter is default', async () => {
      await expect(page).toHaveURL(/isActive=true/);
      // All rows should show "Active" status
      const rows = page.locator('table tbody tr');
      const count = await rows.count();
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        await expect(rows.nth(i).locator('td').nth(3)).toHaveText('Active');
      }
    });

    await test.step('Step 5: Verify Add New Project Manager button is available', async () => {
      await expect(page.getByRole('button', { name: 'Add New Project Manager' })).toBeVisible();
    });
  });
});
