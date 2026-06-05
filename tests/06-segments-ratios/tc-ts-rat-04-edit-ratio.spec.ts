/**
 * ============================================================================
 * 06-Spatial-Segments-Ratios - TC-TS-RAT-04: Edit ratio value
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-RAT-04-edit-ratio.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/06-segments-ratios/tc-ts-rat-04-edit-ratio.spec.ts --headed
 * Headless:               npx playwright test tests/06-segments-ratios/tc-ts-rat-04-edit-ratio.spec.ts
 * Debug:                  npx playwright test tests/06-segments-ratios/tc-ts-rat-04-edit-ratio.spec.ts --debug
 * Specific Test:          npx playwright test tests/06-segments-ratios/tc-ts-rat-04-edit-ratio.spec.ts -g "Edit" --headed
 *
 * OVERVIEW:
 * Verifies that an existing ratio entry can be edited to change its value, and
 * that the warning icon updates accordingly. Tests editing a ratio from a value
 * that causes sum ≠ 1 to a value that makes sum = 1, verifying the warning
 * icon disappears.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Edit Flow:
 *    ✅ Edit Record opens dialog with current ratio value pre-filled
 *    ✅ Ratio value can be changed and submitted
 *    ✅ Table reflects the new value after save
 *
 * 2. Warning Recalculation:
 *    ✅ Warning icon present when sum ≠ 1
 *    ✅ Warning icon disappears after edit makes sum = 1
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-RAT-04 — Edit ratio value', () => {
  test.setTimeout(120_000);

  test('Edit ratio and verify warning recalculation', async ({ page }) => {
    page.on('dialog', async (d) => { await d.accept(); });

    await test.step('Step 1: Navigate to segments page', async () => {
      await page.goto('/projects/79/segments');
      await expect(page.getByText('Project Segments')).toBeVisible();
    });

    const hwTable = page.locator('table').nth(2);

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

    await test.step('Step 3: Verify warning icon is displayed (sum = 1.5 ≠ 1)', async () => {
      await expect(page.locator('#ratio-Highways')).toHaveCount(1);
    });

    await test.step('Step 4: Click Edit Record on the ratio row', async () => {
      const row = hwTable.locator('tbody tr', { hasText: 'Hwy 3' });
      await row.locator('button[title="Edit Record"]').click();
      const dialog = page.locator('[role="dialog"]');
      await dialog.waitFor({ state: 'visible' });

      // Verify pre-filled value
      const ratioField = dialog.getByRole('spinbutton', { name: 'Ratio*' });
      await expect(ratioField).toHaveValue('0.5');
    });

    await test.step('Step 5: Change ratio to 0 and submit (sum back to 1.0)', async () => {
      const dialog = page.locator('[role="dialog"]');
      const ratioField = dialog.getByRole('spinbutton', { name: 'Ratio*' });
      await ratioField.fill('0');
      await page.waitForTimeout(200);
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await dialog.waitFor({ state: 'hidden', timeout: 10000 });
      await page.waitForTimeout(500);
    });

    await test.step('Step 6: Verify updated value and warning icon gone', async () => {
      const row = hwTable.locator('tbody tr', { hasText: 'Hwy 3' });
      await expect(row).toContainText('0');

      // Warning icon should be removed from DOM (sum = 1)
      await expect(page.locator('#ratio-Highways')).toHaveCount(0);
    });

    await test.step('Cleanup: Delete test ratio entry', async () => {
      const row = hwTable.locator('tbody tr', { hasText: 'Hwy 3' });
      await row.locator('button[title="Delete Record"]').click();
      const popover = page.locator('.popover.show');
      await popover.waitFor({ state: 'visible', timeout: 5000 });
      await popover.getByRole('button', { name: 'Delete' }).click();
      await page.waitForTimeout(500);
    });
  });
});
