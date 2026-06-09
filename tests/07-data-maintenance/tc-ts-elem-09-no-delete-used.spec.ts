/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-ELEM-09: Cannot delete element used in data entry
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-ELEM-09-no-delete-used.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-elem-09-no-delete-used.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-elem-09-no-delete-used.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-elem-09-no-delete-used.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-elem-09-no-delete-used.spec.ts -g "Cannot" --headed
 *
 * OVERVIEW:
 * Verifies that an element referenced in financial planning entries does not
 * show the Delete icon — only the Disable icon is available. This enforces
 * referential integrity.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Used Element Actions:
 *    ✅ Element used in data entry shows "Disable Record" button
 *    ✅ Element used in data entry does NOT show "Delete Record" button
 *
 * 2. Unused Element Actions (contrast):
 *    ✅ Element never used shows "Delete Record" button
 *    ✅ Element never used does NOT show "Disable Record" button
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-ELEM-09 — Cannot delete element used in data entry', () => {
  test.setTimeout(60_000);

  test('Used element shows Disable, not Delete', async ({ page }) => {
    await test.step('Step 1: Navigate to Elements Management', async () => {
      await page.goto('/admin/elements');
      await expect(page.getByRole('heading', { name: 'Elements Management' })).toBeVisible();
    });

    await test.step('Step 2: Find element used in data entry (Bridge Coatings)', async () => {
      await page.locator('input[placeholder="Search"]').fill('Bridge Coatings');
      await page.getByRole('button', { name: 'Search' }).click();
      await page.waitForTimeout(1000);

      const row = page.locator('table tbody tr', { hasText: 'Bridge Coatings' });
      await expect(row).toBeVisible();
    });

    await test.step('Step 3: Verify "Disable Record" is shown, "Delete Record" is NOT', async () => {
      const row = page.locator('table tbody tr', { hasText: 'Bridge Coatings' });
      await expect(row.locator('button[title="Disable Record"]')).toBeVisible();
      await expect(row.locator('button[title="Delete Record"]')).toHaveCount(0);
    });
  });

  test('Unused element shows Delete, not Disable', async ({ page }) => {
    await test.step('Step 1: Navigate to Elements Management', async () => {
      await page.goto('/admin/elements');
      await expect(page.getByRole('heading', { name: 'Elements Management' })).toBeVisible();
    });

    await test.step('Step 2: Find element never used in data entry (Climate Adaptation)', async () => {
      await page.locator('input[placeholder="Search"]').fill('Climate Adaptation');
      await page.getByRole('button', { name: 'Search' }).click();
      await page.waitForTimeout(1000);

      const row = page.locator('table tbody tr', { hasText: 'Climate Adaptation' });
      await expect(row).toBeVisible();
    });

    await test.step('Step 3: Verify "Delete Record" is shown, "Disable Record" is NOT', async () => {
      const row = page.locator('table tbody tr', { hasText: 'Climate Adaptation' });
      await expect(row.locator('button[title="Delete Record"]')).toBeVisible();
      await expect(row.locator('button[title="Disable Record"]')).toHaveCount(0);
    });
  });
});
