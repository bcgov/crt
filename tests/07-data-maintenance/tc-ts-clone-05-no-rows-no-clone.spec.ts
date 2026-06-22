/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-CLONE-05: Clone button not available when no
 *                                        rows exist
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-CLONE-05-no-rows-no-clone.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-clone-05-no-rows-no-clone.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-clone-05-no-rows-no-clone.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-clone-05-no-rows-no-clone.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-clone-05-no-rows-no-clone.spec.ts -g "not available" --headed
 *
 * OVERVIEW:
 * Verifies that the Clone Record button is not visible when a project tab has
 * no existing records. Clone is a per-row action, so empty tables have no
 * Clone buttons. The "+ Add" button should still be available.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Empty Tender Table:
 *    ✅ No Clone Record button visible
 *    ✅ "+ Add" button still available
 *
 * 2. Empty Qty/Accomplishment Table:
 *    ✅ No Clone Record button visible
 *    ✅ "+ Add" button still available
 *
 * 3. Data Integrity:
 *    ✅ No data created; no cleanup required
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-CLONE-05 — Clone button not available when no rows exist', () => {
  test.setTimeout(60_000);

  test('Empty tables show no Clone buttons but Add is available', async ({ page }) => {
    await test.step('Step 1: Navigate to a project with empty Tender and Qty tables', async () => {
      await page.goto('/projects');
      await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30000 });

      const projectLinks = page.locator('table tbody tr td:nth-child(2) a');
      const count = await projectLinks.count();
      const hrefs: (string | null)[] = [];
      for (let i = 0; i < count; i++) {
        hrefs.push(await projectLinks.nth(i).getAttribute('href'));
      }

      let found = false;
      for (let i = 0; i < hrefs.length && !found; i++) {
        await page.goto(`${hrefs[i]}/projecttender`);
        await expect(page.locator('table').first()).toBeVisible({ timeout: 15000 });
        const tenderRows = await page.locator('table').first().locator('tbody tr').count();
        const qtyRows    = await page.locator('table').nth(1).locator('tbody tr').count();
        if (tenderRows === 0 && qtyRows === 0) {
          found = true;
        }
      }

      expect(found, 'Could not find a project with both tender and qty tables empty').toBe(true);
    });

    await test.step('Step 2: Verify empty Tender table has no Clone button', async () => {
      const tenderTable = page.locator('table').first();
      await expect(tenderTable.locator('tbody tr')).toHaveCount(0);
      await expect(tenderTable.getByRole('button', { name: 'Clone Record' })).toBeHidden();
    });

    await test.step('Step 3: Verify empty Qty table has no Clone button', async () => {
      const qtyTable = page.locator('table').nth(1);
      await expect(qtyTable.locator('tbody tr')).toHaveCount(0);
      await expect(qtyTable.getByRole('button', { name: 'Clone Record' })).toBeHidden();
    });

    await test.step('Step 4: Verify "+ Add" buttons are still available', async () => {
      const addBtns = page.locator('button', { hasText: '+ Add' });
      // Two "+ Add" buttons (one for Tender, one for Qty)
      await expect(addBtns).toHaveCount(2);
      await expect(addBtns.nth(0)).toBeVisible();
      await expect(addBtns.nth(1)).toBeVisible();
    });
  });
});
