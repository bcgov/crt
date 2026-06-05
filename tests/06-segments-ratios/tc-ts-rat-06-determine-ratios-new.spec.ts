/**
 * ============================================================================
 * 06-Spatial-Segments-Ratios - TC-TS-RAT-06: Determine ratios using segments — no existing data
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-RAT-06-determine-ratios-new.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/06-segments-ratios/tc-ts-rat-06-determine-ratios-new.spec.ts --headed
 * Headless:               npx playwright test tests/06-segments-ratios/tc-ts-rat-06-determine-ratios-new.spec.ts
 * Debug:                  npx playwright test tests/06-segments-ratios/tc-ts-rat-06-determine-ratios-new.spec.ts --debug
 * Specific Test:          npx playwright test tests/06-segments-ratios/tc-ts-rat-06-determine-ratios-new.spec.ts -g "Determine" --headed
 *
 * OVERVIEW:
 * Verifies that the "Determine Ratios Using Segments" button calculates ratios
 * from the project's segment data when no existing ratio data is present.
 * A success message should be displayed and category tables populated.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Button Behavior:
 *    ✅ "Determine Ratios Using Segments" button triggers auto-calculation
 *    ✅ Success message appears after determination
 *
 * 2. Ratio Calculation:
 *    ✅ Ratio entries are populated in one or more category tables
 *    ✅ Calculated ratios sum to 1 within each populated category
 *
 * NOTE: This test is SKIPPED because the "Determine Ratios Using Segments" API
 * returns a 500 error in the dev environment. The segment in project 79 does not
 * have proper spatial line geometry (only start/end coordinates), which prevents
 * the backend from calculating intersections with administrative boundaries.
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-RAT-06 — Determine ratios using segments — no existing data', () => {
  test.setTimeout(120_000);

  test('Determine ratios populates category tables when no ratios exist', async ({ page }) => {
    test.skip(true, 'Server returns 500 for ratio determination — segment geometry not available in dev environment');

    page.on('dialog', async (d) => { await d.accept(); });

    await test.step('Step 1: Navigate to segments page', async () => {
      await page.goto('/projects/79/segments');
      await expect(page.getByText('Project Segments')).toBeVisible();
    });

    await test.step('Step 2: Delete all existing ratios (establish clean state)', async () => {
      // Delete all ratios from each category table to establish "no existing data" state
      for (let tableIdx = 1; tableIdx <= 5; tableIdx++) {
        const table = page.locator('table').nth(tableIdx);
        let rows = await table.locator('tbody tr').count();
        while (rows > 0) {
          await table.locator('tbody tr').first().locator('button[title="Delete Record"]').click();
          const popover = page.locator('.popover.show');
          await popover.waitFor({ state: 'visible', timeout: 5000 });
          await popover.getByRole('button', { name: 'Delete' }).click();
          await page.waitForTimeout(500);
          rows = await table.locator('tbody tr').count();
        }
      }
    });

    await test.step('Step 3: Click "Determine Ratios Using Segments"', async () => {
      const btn = page.getByRole('button', { name: 'Determine Ratios Using Segments' });
      await expect(btn).toBeVisible();
      await btn.click();
      await page.waitForTimeout(3000);
    });

    await test.step('Step 4: Verify success message', async () => {
      const successMsg = page.locator('text=Ratios determined');
      await expect(successMsg).toBeVisible({ timeout: 10000 });
    });

    await test.step('Step 5: Verify ratio entries populated', async () => {
      // At least one category table should have rows
      let totalRows = 0;
      for (let tableIdx = 1; tableIdx <= 5; tableIdx++) {
        const table = page.locator('table').nth(tableIdx);
        totalRows += await table.locator('tbody tr').count();
      }
      expect(totalRows).toBeGreaterThan(0);
    });

    await test.step('Step 6: Verify ratios sum to 1 in populated categories', async () => {
      for (let tableIdx = 1; tableIdx <= 5; tableIdx++) {
        const table = page.locator('table').nth(tableIdx);
        const rows = await table.locator('tbody tr').count();
        if (rows > 0) {
          let sum = 0;
          for (let r = 0; r < rows; r++) {
            const cells = await table.locator('tbody tr').nth(r).locator('td').allTextContents();
            // Ratio value is typically the second cell (after the name)
            const ratioText = cells[1]?.trim() || '0';
            sum += parseFloat(ratioText) || 0;
          }
          expect(sum).toBeCloseTo(1, 2);
        }
      }
    });
  });
});
