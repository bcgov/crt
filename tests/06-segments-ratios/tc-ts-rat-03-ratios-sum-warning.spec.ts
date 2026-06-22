/**
 * ============================================================================
 * 06-Spatial-Segments-Ratios - TC-TS-RAT-03: Ratios do not sum to 1 — warning displayed
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-RAT-03-ratios-sum-warning.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/06-segments-ratios/tc-ts-rat-03-ratios-sum-warning.spec.ts --headed
 * Headless:               npx playwright test tests/06-segments-ratios/tc-ts-rat-03-ratios-sum-warning.spec.ts
 * Debug:                  npx playwright test tests/06-segments-ratios/tc-ts-rat-03-ratios-sum-warning.spec.ts --debug
 * Specific Test:          npx playwright test tests/06-segments-ratios/tc-ts-rat-03-ratios-sum-warning.spec.ts -g "warning" --headed
 *
 * OVERVIEW:
 * Verifies that when ratios for a category do not sum to 1, a warning icon
 * (fa-exclamation-circle) appears and hovering shows the message about
 * the sum needing to be 1.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Warning Behavior:
 *    ✅ Single highway ratio (0.50) creates sum ≠ 1
 *    ✅ Warning icon with id "ratio-Highways" appears in the DOM
 *    ✅ Hovering the icon shows "Sum of Highways ratios needs to be 1"
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-RAT-03 — Ratios do not sum to 1 — warning displayed', () => {
  test.setTimeout(120_000);

  test('Warning icon appears when highway ratio sum ≠ 1', async ({ page }) => {
    page.on('dialog', async (d) => { await d.accept(); });

    await test.step('Step 1: Navigate to segments page', async () => {
      await page.goto('/projects');
      await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30000 });
      const projectLink = page.locator('table tbody tr').first().locator('td:nth-child(2) a');
      const projectUrl = await projectLink.getAttribute('href');
      await page.goto(`${projectUrl}/segments`);
      await expect(page.getByText('Project Segments')).toBeVisible();
    });

    await test.step('Step 2: Add Highway ratio Hwy 3 = 0.50 (pushes sum to 1.5 ≠ 1)', async () => {
      await page.locator('button[title="Add Highways"]').click();
      const dialog = page.locator('[role="dialog"]');
      await dialog.waitFor({ state: 'visible' });
      await dialog.locator('button.dropdown-toggle').click();
      await page.waitForTimeout(300);
      await dialog.locator('.dropdown-menu.show button.dropdown-item', { hasText: '3-Hwy 3' }).first().click();
      await page.waitForTimeout(200);
      await dialog.getByRole('spinbutton', { name: 'Ratio*' }).fill('0.50');
      await page.waitForTimeout(200);
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await dialog.waitFor({ state: 'hidden', timeout: 10000 });
      await page.waitForTimeout(500);
    });

    await test.step('Step 3: Verify warning icon appears', async () => {
      const warningIcon = page.locator('#ratio-Highways');
      await expect(warningIcon).toHaveCount(1);
    });

    await test.step('Step 4: Hover warning icon and verify message', async () => {
      await page.evaluate(() => {
        const svg = document.getElementById('ratio-Highways');
        svg?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        svg?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      });

      const popover = page.locator('.popover-body');
      await popover.waitFor({ state: 'visible', timeout: 5000 });
      await expect(popover).toContainText('Sum of Highways ratios needs to be 1');
    });

    await test.step('Cleanup: Delete test ratio entry', async () => {
      await page.evaluate(() => { document.querySelectorAll('.popover').forEach(p => p.remove()); });
      await page.waitForTimeout(300);

      const hwTable = page.locator('table').nth(2);
      const lastRow = hwTable.locator('tbody tr').last();
      await lastRow.locator('button[title="Delete Record"]').click();
      const popover = page.locator('.popover.show');
      await popover.waitFor({ state: 'visible', timeout: 5000 });
      await popover.getByRole('button', { name: 'Delete' }).click();
      await page.waitForTimeout(500);
    });
  });
});
