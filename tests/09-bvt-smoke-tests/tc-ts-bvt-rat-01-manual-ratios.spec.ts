/**
 * ============================================================================
 * 09-BVT-Smoke-Tests - TC-TS-BVT-RAT-01: Add ratios manually
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-BVT-RAT-01-manual-ratios.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-rat-01-manual-ratios.spec.ts --headed
 * Headless:               npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-rat-01-manual-ratios.spec.ts
 * Debug:                  npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-rat-01-manual-ratios.spec.ts --debug
 * Specific Test:          npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-rat-01-manual-ratios.spec.ts -g "Add ratios manually" --headed
 *
 * OVERVIEW:
 * Build Verification Test confirming that administrative boundary ratios can
 * be added manually. Adds two Electoral District ratios that sum to 1.00 and
 * verifies both appear in the table. Then cleans up by deleting both entries.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Ratio Creation:
 *    ✅ Electoral District ratio can be added via "+ Add" dialog
 *    ✅ District dropdown shows available options
 *    ✅ Ratio value is accepted and saved
 *
 * 2. Multiple Ratios:
 *    ✅ Second ratio can be added for a different district
 *    ✅ Both ratios appear in the Electoral Districts table
 *    ✅ Ratios sum to 1.00 (no warning displayed)
 *
 * 3. Cleanup:
 *    ✅ Ratio entries can be deleted via popover confirmation
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-BVT-RAT-01 — BVT: Add ratios manually', () => {
  test.setTimeout(120_000);

  const projectId = 81;

  test('Add ratios manually', async ({ page }) => {
    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    await test.step('Step 1: Navigate to segments/ratios page', async () => {
      await page.goto(`/projects/${projectId}/segments`);
      await page.waitForTimeout(3000);
    });

    await test.step('Step 2: Add first Electoral District ratio (0.60)', async () => {
      // Click "+ Add" for Electoral Districts (index 1 among visible "+ Add" buttons)
      const addBtns = page.locator('button:has-text("+ Add"):visible');
      await addBtns.nth(1).click();
      await page.waitForTimeout(1000);

      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();

      // Select first Electoral District option
      await page.evaluate(() => {
        const dlg = document.querySelector('[role="dialog"]');
        const dds = dlg!.querySelectorAll('button.dropdown-toggle');
        (dds[0] as HTMLElement).click();
      });
      await page.waitForTimeout(500);
      await page.evaluate(() => {
        const items = document.querySelectorAll('.dropdown-menu.show button.dropdown-item');
        if (items.length > 0) (items[0] as HTMLElement).click();
      });
      await page.waitForTimeout(300);

      // Fill ratio value
      await dialog.locator('input[name="ratio"]').fill('0.60');

      // Submit
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await page.waitForTimeout(2000);

      // Verify entry appears in Electoral Districts table
      const edTable = page.locator('table').nth(1);
      const row = edTable.locator('tbody tr').first();
      await expect(row).toBeVisible();
      const rowText = await row.textContent();
      expect(rowText).toContain('0.6');
    });

    await test.step('Step 3: Add second Electoral District ratio (0.40)', async () => {
      const addBtns = page.locator('button:has-text("+ Add"):visible');
      await addBtns.nth(1).click();
      await page.waitForTimeout(1000);

      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();

      // Select second Electoral District option
      await page.evaluate(() => {
        const dlg = document.querySelector('[role="dialog"]');
        const dds = dlg!.querySelectorAll('button.dropdown-toggle');
        (dds[0] as HTMLElement).click();
      });
      await page.waitForTimeout(500);
      await page.evaluate(() => {
        const items = document.querySelectorAll('.dropdown-menu.show button.dropdown-item');
        if (items.length > 1) (items[1] as HTMLElement).click();
      });
      await page.waitForTimeout(300);

      // Fill ratio value
      await dialog.locator('input[name="ratio"]').fill('0.40');

      // Submit
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await page.waitForTimeout(2000);

      // Verify both entries appear
      const edTable = page.locator('table').nth(1);
      const rows = edTable.locator('tbody tr');
      expect(await rows.count()).toBe(2);
    });

    await test.step('Step 4: Verify ratios sum to 1.00 (no warning displayed)', async () => {
      // Check that no warning/danger text is visible on the page
      const warnings = page.locator('.text-danger:visible, .alert-danger:visible');
      expect(await warnings.count()).toBe(0);

      // Verify both ratio values
      const edTable = page.locator('table').nth(1);
      const allRowText = await edTable.locator('tbody').textContent();
      expect(allRowText).toContain('0.6');
      expect(allRowText).toContain('0.4');
    });

    await test.step('Step 5: Cleanup - delete both ratio entries', async () => {
      const edTable = page.locator('table').nth(1);

      // Delete second entry
      await edTable.locator('tbody tr').nth(1).locator('button[title="Delete Record"]').evaluate((el) => el.click());
      await page.waitForTimeout(500);
      await page.evaluate(() => {
        const popovers = document.querySelectorAll('.popover');
        for (const p of popovers) {
          const btns = p.querySelectorAll('button');
          for (const btn of btns) {
            if (btn.textContent && btn.textContent.trim() === 'Delete') {
              btn.click();
              return;
            }
          }
        }
      });
      await page.waitForTimeout(2000);

      // Delete first entry
      await edTable.locator('tbody tr').first().locator('button[title="Delete Record"]').evaluate((el) => el.click());
      await page.waitForTimeout(500);
      await page.evaluate(() => {
        const popovers = document.querySelectorAll('.popover');
        for (const p of popovers) {
          const btns = p.querySelectorAll('button');
          for (const btn of btns) {
            if (btn.textContent && btn.textContent.trim() === 'Delete') {
              btn.click();
              return;
            }
          }
        }
      });
      await page.waitForTimeout(2000);

      // Verify table is empty
      const finalRows = await edTable.locator('tbody tr').count();
      expect(finalRows).toBe(0);
    });
  });
});
