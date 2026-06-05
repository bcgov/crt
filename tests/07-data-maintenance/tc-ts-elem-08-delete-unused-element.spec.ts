/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-ELEM-08: Delete element never used in data entry
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-ELEM-08-delete-unused-element.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-elem-08-delete-unused-element.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-elem-08-delete-unused-element.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-elem-08-delete-unused-element.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-elem-08-delete-unused-element.spec.ts -g "Delete" --headed
 *
 * OVERVIEW:
 * Verifies that an element never used in data entry can be permanently deleted.
 * Creates a test element, confirms it shows "Delete Record" (not Disable), then
 * deletes it and verifies it no longer exists.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Delete Flow:
 *    ✅ Unused element shows "Delete Record" button (not Disable)
 *    ✅ Confirmation popover shows "Are you sure? This will permanently delete the record."
 *    ✅ "Delete" and "Cancel" buttons in popover
 *
 * 2. Permanent Removal:
 *    ✅ After confirming, element is gone from table
 *    ✅ Searching for deleted element returns no results
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-ELEM-08 — Delete element never used in data entry', () => {
  test.setTimeout(120_000);

  test('Delete unused element permanently', async ({ page }) => {
    await test.step('Step 1: Navigate to Elements Management', async () => {
      await page.goto('/admin/elements');
      await expect(page.getByRole('heading', { name: 'Elements Management' })).toBeVisible();
    });

    await test.step('Step 2: Create a test element (never used in data entry)', async () => {
      await page.getByRole('button', { name: 'Add New Element' }).click();
      const dialog = page.locator('[role="dialog"]');
      await dialog.waitFor({ state: 'visible' });

      await dialog.locator('input[name="code"]').fill('Zt');
      await dialog.locator('input[name="description"]').fill('CRT-AUTO Delete Test');

      // Program Category
      await dialog.locator('button.dropdown-toggle').first().click();
      await page.waitForTimeout(300);
      await dialog.locator('.dropdown-menu.show button.dropdown-item', { hasText: 'Capital-Capital Expansion Program' }).click();
      await page.waitForTimeout(300);

      // Program
      await dialog.locator('button.dropdown-toggle').nth(1).click();
      await page.waitForTimeout(300);
      await dialog.locator('.dropdown-menu.show button.dropdown-item', { hasText: 'CapitalEx-Gen-Capital Expansion - General' }).click();
      await page.waitForTimeout(300);

      // Service Line
      await dialog.locator('button.dropdown-toggle').nth(2).click();
      await page.waitForTimeout(300);
      await dialog.locator('.dropdown-menu.show button.dropdown-item').filter({ hasText: /^0-Other$/ }).click();
      await page.waitForTimeout(300);

      await dialog.getByRole('button', { name: 'Submit' }).click();
      await dialog.waitFor({ state: 'hidden', timeout: 10000 });
      await page.waitForTimeout(500);
    });

    await test.step('Step 3: Search for the test element and verify Delete button', async () => {
      await page.locator('input[placeholder="Search"]').fill('Zt');
      await page.getByRole('button', { name: 'Search' }).click();
      await page.waitForTimeout(1000);

      const row = page.locator('table tbody tr', { hasText: 'CRT-AUTO Delete Test' });
      await expect(row).toBeVisible();
      // Unused element should have "Delete Record" (not "Disable Record")
      await expect(row.locator('button[title="Delete Record"]')).toBeVisible();
    });

    await test.step('Step 4: Click "Delete Record" and verify confirmation', async () => {
      const row = page.locator('table tbody tr', { hasText: 'CRT-AUTO Delete Test' });
      await row.locator('button[title="Delete Record"]').click();

      const popover = page.locator('.popover.show');
      await popover.waitFor({ state: 'visible', timeout: 5000 });
      await expect(popover).toContainText('Are you sure?');
      await expect(popover).toContainText('This will permanently delete the record');
      await expect(popover.getByRole('button', { name: 'Delete' })).toBeVisible();
      await expect(popover.getByRole('button', { name: 'Cancel' })).toBeVisible();
    });

    await test.step('Step 5: Confirm delete', async () => {
      const popover = page.locator('.popover.show');
      await popover.getByRole('button', { name: 'Delete' }).click();
      await page.waitForTimeout(1000);

      // Row should be gone
      await expect(page.locator('table tbody tr', { hasText: 'CRT-AUTO Delete Test' })).not.toBeVisible();
    });

    await test.step('Step 6: Verify element is permanently gone', async () => {
      await page.locator('input[placeholder="Search"]').fill('Zt');
      await page.getByRole('button', { name: 'Search' }).click();
      await page.waitForTimeout(1000);

      const rows = await page.locator('table tbody tr').count();
      expect(rows).toBe(0);
    });
  });
});
