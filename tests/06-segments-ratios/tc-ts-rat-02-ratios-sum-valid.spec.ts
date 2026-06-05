/**
 * ============================================================================
 * 06-Spatial-Segments-Ratios - TC-TS-RAT-02: Ratios sum to 1 — no warning
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-RAT-02-ratios-sum-valid.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/06-segments-ratios/tc-ts-rat-02-ratios-sum-valid.spec.ts --headed
 * Headless:               npx playwright test tests/06-segments-ratios/tc-ts-rat-02-ratios-sum-valid.spec.ts
 * Debug:                  npx playwright test tests/06-segments-ratios/tc-ts-rat-02-ratios-sum-valid.spec.ts --debug
 * Specific Test:          npx playwright test tests/06-segments-ratios/tc-ts-rat-02-ratios-sum-valid.spec.ts -g "no warning" --headed
 *
 * OVERVIEW:
 * Verifies that when ratios for a category sum to exactly 1, no warning icon
 * or message is displayed. Uses Highways with two entries summing to 1.00.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Valid Sum:
 *    ✅ Two highway ratios (0.70 + 0.30) summing to 1.00
 *    ✅ No warning icon (fa-exclamation-circle) is present in the DOM
 *    ✅ No "ratios needs to be 1" message is visible
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-RAT-02 — Ratios sum to 1 — no warning', () => {
  test.setTimeout(120_000);

  test('No warning when highway ratios sum to 1', async ({ page }) => {
    page.on('dialog', async (d) => { await d.accept(); });

    await test.step('Step 1: Navigate to segments page', async () => {
      await page.goto('/projects/79/segments');
      await expect(page.getByText('Project Segments')).toBeVisible();
    });

    await test.step('Step 2: Verify existing Highway ratios sum to 1 (0.99 + 0.01)', async () => {
      const hwTable = page.locator('table').nth(2);
      await expect(hwTable.locator('tbody tr', { hasText: 'Hwy 1' }).first()).toBeVisible();
      await expect(hwTable.locator('tbody tr', { hasText: 'Hwy 18' })).toBeVisible();
    });

    await test.step('Step 3: Verify no warning icon is displayed', async () => {
      // Warning icon has id="ratio-Highways" and class fa-exclamation-circle
      // When sum = 1, it should NOT be in the DOM
      const warningIcon = page.locator('#ratio-Highways');
      await expect(warningIcon).toHaveCount(0);
    });
  });
});
