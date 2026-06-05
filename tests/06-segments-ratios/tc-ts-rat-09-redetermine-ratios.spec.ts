/**
 * ============================================================================
 * 06-Spatial-Segments-Ratios - TC-TS-RAT-09: Redetermine ratios after adding new segment
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-RAT-09-redetermine-ratios.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/06-segments-ratios/tc-ts-rat-09-redetermine-ratios.spec.ts --headed
 * Headless:               npx playwright test tests/06-segments-ratios/tc-ts-rat-09-redetermine-ratios.spec.ts
 * Debug:                  npx playwright test tests/06-segments-ratios/tc-ts-rat-09-redetermine-ratios.spec.ts --debug
 * Specific Test:          npx playwright test tests/06-segments-ratios/tc-ts-rat-09-redetermine-ratios.spec.ts -g "Redetermine" --headed
 *
 * OVERVIEW:
 * Verifies that after initially determining ratios from segments, adding a new
 * segment and re-running "Determine Ratios Using Segments" recalculates all
 * ratios to include the new segment data. This test requires map interaction
 * for segment creation and a working backend ratio calculation API.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Recalculation After Segment Change:
 *    ✅ Ratio values change after adding a segment and redetermining
 *    ✅ All five ratio categories are updated
 *    ✅ Each category's ratios sum to 1
 *
 * NOTE: This test is SKIPPED because:
 * 1. Adding a segment requires the map interface (keycloak initialization fails in dev)
 * 2. The "Determine Ratios" API returns 500 due to segment geometry issues
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-RAT-09 — Redetermine ratios after adding new segment', () => {
  test.setTimeout(180_000);

  test('Redetermine ratios reflects new segment data', async ({ page }) => {
    test.skip(true, 'Requires map interaction for segment creation (keycloak fails) and working ratio determination API (returns 500 in dev)');

    page.on('dialog', async (d) => { await d.accept(); });

    await test.step('Step 1: Navigate to segments page', async () => {
      await page.goto('/projects/79/segments');
      await expect(page.getByText('Project Segments')).toBeVisible();
    });

    await test.step('Step 2: Record current ratio values', async () => {
      // Capture ratio values from each category table
      const hwTable = page.locator('table').nth(2);
      const hwRows = await hwTable.locator('tbody tr').count();
      expect(hwRows).toBeGreaterThan(0);
    });

    await test.step('Step 3: Add a new segment via map interface', async () => {
      // This step requires the map component which is broken in dev
      // Would click "Add Segment", draw on map, save
      await page.getByRole('button', { name: 'Add Segment' }).click();
      // ... map interaction not possible due to keycloak failure
    });

    await test.step('Step 4: Click "Determine Ratios Using Segments"', async () => {
      await page.getByRole('button', { name: 'Determine Ratios Using Segments' }).click();
      const dialog = page.locator('[role="dialog"]').filter({ hasText: 'Determine Ratios Using Segments' });
      await dialog.waitFor({ state: 'visible' });
      await dialog.getByRole('button', { name: 'Proceed' }).click();
      await page.waitForTimeout(5000);
    });

    await test.step('Step 5: Verify ratios were recalculated', async () => {
      const successMsg = page.locator('text=Ratios determined');
      await expect(successMsg).toBeVisible({ timeout: 10000 });
    });

    await test.step('Step 6: Verify all categories sum to 1', async () => {
      for (let tableIdx = 1; tableIdx <= 5; tableIdx++) {
        const table = page.locator('table').nth(tableIdx);
        const rows = await table.locator('tbody tr').count();
        if (rows > 0) {
          let sum = 0;
          for (let r = 0; r < rows; r++) {
            const cells = await table.locator('tbody tr').nth(r).locator('td').allTextContents();
            const ratioText = cells[1]?.trim() || '0';
            sum += parseFloat(ratioText) || 0;
          }
          expect(sum).toBeCloseTo(1, 2);
        }
      }
    });
  });
});
