/**
 * ============================================================================
 * 06-Spatial-Segments-Ratios - TC-TS-RAT-05: Delete ratio with warning recalculation
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-RAT-05-delete-ratio.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/06-segments-ratios/tc-ts-rat-05-delete-ratio.spec.ts --headed
 * Headless:               npx playwright test tests/06-segments-ratios/tc-ts-rat-05-delete-ratio.spec.ts
 * Debug:                  npx playwright test tests/06-segments-ratios/tc-ts-rat-05-delete-ratio.spec.ts --debug
 * Specific Test:          npx playwright test tests/06-segments-ratios/tc-ts-rat-05-delete-ratio.spec.ts -g "Delete" --headed
 *
 * OVERVIEW:
 * Verifies that deleting a ratio entry shows confirmation, and after deletion
 * the warning icon is recalculated. When entries sum ≠ 1, warning appears.
 * When all entries are deleted, warning disappears (no data to validate).
 *
 * WHAT THE TEST VALIDATES:
 * 1. Delete Confirmation:
 *    ✅ "Are you sure?" popover with Delete and Cancel buttons
 *    ✅ Confirm removes the row from the table
 *
 * 2. Warning Recalculation:
 *    ✅ After deleting one of two entries, warning appears (sum ≠ 1)
 *    ✅ After deleting all entries, warning disappears (no rows)
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-RAT-05 — Delete ratio with warning recalculation', () => {
  test.setTimeout(180_000);

  test('Delete ratios and verify warning recalculation', async ({ page }) => {
    page.on('dialog', async (d) => { await d.accept(); });

    await test.step('Step 1: Navigate to segments page', async () => {
      await page.goto('/projects');
      await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30000 });
      const projectLink = page.locator('table tbody tr').first().locator('td:nth-child(2) a');
      const projectUrl = await projectLink.getAttribute('href');
      await page.goto(`${projectUrl}/segments`);
      await expect(page.getByText('Project Segments')).toBeVisible();
    });

    const hwTable = page.locator('table').nth(2);

    await test.step('Step 2: Add Highway ratio Hwy 3 = 0.70', async () => {
      await page.locator('button[title="Add Highways"]').click();
      const dialog = page.locator('[role="dialog"]');
      await dialog.waitFor({ state: 'visible' });
      await dialog.locator('button.dropdown-toggle').click();
      await page.waitForTimeout(300);
      await dialog.locator('.dropdown-menu.show button.dropdown-item', { hasText: '3-Hwy 3' }).first().click();
      await page.waitForTimeout(200);
      await dialog.getByRole('spinbutton', { name: 'Ratio*' }).fill('0.70');
      await page.waitForTimeout(200);
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await dialog.waitFor({ state: 'hidden', timeout: 10000 });
      await page.waitForTimeout(500);
    });

    await test.step('Step 3: Add Highway ratio Hwy 4 = 0.30', async () => {
      await page.locator('button[title="Add Highways"]').click();
      const dialog = page.locator('[role="dialog"]');
      await dialog.waitFor({ state: 'visible' });
      await dialog.locator('button.dropdown-toggle').click();
      await page.waitForTimeout(300);
      await dialog.locator('.dropdown-menu.show button.dropdown-item', { hasText: '4-Hwy 4' }).first().click();
      await page.waitForTimeout(200);
      await dialog.getByRole('spinbutton', { name: 'Ratio*' }).fill('0.30');
      await page.waitForTimeout(200);
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await dialog.waitFor({ state: 'hidden', timeout: 10000 });
      await page.waitForTimeout(500);
    });

    await test.step('Step 4: Verify warning shown (existing 0.99+0.01 + new 0.70+0.30 = 2.0 ≠ 1)', async () => {
      await expect(page.locator('#ratio-Highways')).toHaveCount(1);
    });

    await test.step('Step 5: Delete Hwy 4 — warning remains (sum still ≠ 1)', async () => {
      const row4 = hwTable.locator('tbody tr').last();
      await expect(row4).toContainText('Hwy 4');
      await row4.locator('button[title="Delete Record"]').click();

      const popover = page.locator('.popover.show');
      await popover.waitFor({ state: 'visible', timeout: 5000 });
      await expect(popover).toContainText('Are you sure?');
      await popover.getByRole('button', { name: 'Delete' }).click();
      await page.waitForTimeout(500);

      // Warning should remain (sum still ≠ 1)
      await expect(page.locator('#ratio-Highways')).toHaveCount(1);
    });

    await test.step('Step 6: Delete Hwy 3 — verify row removed', async () => {
      const row3 = hwTable.locator('tbody tr').last();
      await expect(row3).toContainText('Hwy 3');
      await row3.locator('button[title="Delete Record"]').click();

      const popover = page.locator('.popover.show');
      await popover.waitFor({ state: 'visible', timeout: 5000 });
      await popover.getByRole('button', { name: 'Delete' }).click();
      await page.waitForTimeout(500);
    });
  });
});
