/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-CLONE-01: Clone record in Qty/Accomplishment
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-CLONE-01-clone-qty.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-clone-01-clone-qty.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-clone-01-clone-qty.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-clone-01-clone-qty.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-clone-01-clone-qty.spec.ts -g "Clone" --headed
 *
 * OVERVIEW:
 * Verifies that an existing Qty/Accomplishment record can be cloned, creating
 * a new entry with copied data that can be modified before saving. The original
 * row remains unchanged after the clone.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Clone Dialog:
 *    ✅ "Clone Quantities and Accomplishments" dialog opens with pre-filled data
 *    ✅ Fiscal Year, type, quantity, and forecast are copied from source
 *    ✅ Submit is disabled until a change is made
 *
 * 2. Clone Result:
 *    ✅ New row appears in table with modified values
 *    ✅ Original row remains unchanged
 *
 * 3. Cleanup:
 *    ✅ Both test rows (source + clone) are deleted
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-CLONE-01 — Clone record in Qty/Accomplishment', () => {
  test.setTimeout(120_000);

  let projectPath: string;

  test.beforeEach(async ({ page }) => {
    // Dynamically pick the first project from the list
    await page.goto('/projects');
    await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30000 });
    const firstLink = page.locator('table tbody tr td:nth-child(2) a').first();
    projectPath = (await firstLink.getAttribute('href')) as string;
    await page.goto(`${projectPath}/projecttender`);
    await expect(page.locator('table').first()).toBeVisible({ timeout: 30000 });
  });

  test('Clone Qty record with modified fiscal year and forecast', async ({ page }) => {
    const qtyTable = page.locator('table').nth(1);

    await test.step('Step 1: Create a source Qty record', async () => {
      // Click the second "+ Add" button (for Qty/Accomplishments)
      const addBtns = page.locator('button', { hasText: '+ Add' });
      await addBtns.nth(1).click();

      const dialog = page.getByRole('dialog').filter({ hasText: 'Add Quantities' });
      await expect(dialog).toBeVisible();

      // Select Fiscal Year 2024/2025
      const toggles = dialog.locator('.dropdown-toggle');
      await toggles.nth(0).click();
      await page.waitForTimeout(300);
      await page.getByRole('menuitem', { name: '2024/2025' }).click();
      await page.waitForTimeout(300);

      // Select type "Quantity"
      await toggles.nth(1).click();
      await page.waitForTimeout(300);
      await page.getByRole('menuitem', { name: 'Quantity' }).click();
      await page.waitForTimeout(300);

      // Select quantity "Asphalt Mix (tonnes)"
      await dialog.locator('.dropdown-toggle').nth(2).click();
      await page.waitForTimeout(300);
      await page.getByRole('menuitem', { name: 'Asphalt Mix  (tonnes)' }).click();
      await page.waitForTimeout(300);

      // Fill Forecast
      await dialog.getByRole('textbox', { name: 'Forecast' }).fill('100');

      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });
      await expect(qtyTable.locator('tbody tr', { hasText: '2024/2025' })).toBeVisible();
    });

    await test.step('Step 2: Clone the record and verify pre-filled dialog', async () => {
      const sourceRow = qtyTable.locator('tbody tr', { hasText: '2024/2025' });
      await sourceRow.getByRole('button', { name: 'Clone Record' }).click();

      const dialog = page.getByRole('dialog').filter({ hasText: 'Clone Quantities' });
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('.modal-title, h5').first()).toHaveText('Clone Quantities and Accomplishments');

      // Verify pre-filled values
      const toggles = dialog.locator('.dropdown-toggle');
      await expect(toggles.nth(0)).toHaveText('2024/2025');
      await expect(toggles.nth(1)).toHaveText('QUANTITY');
      await expect(toggles.nth(2)).toContainText('Asphalt Mix');
      await expect(dialog.getByRole('textbox', { name: 'Forecast' })).toHaveValue('100');

      // Submit is disabled until change
      await expect(dialog.getByRole('button', { name: 'Submit' })).toBeDisabled();
    });

    await test.step('Step 3: Modify fiscal year and forecast, then submit', async () => {
      const dialog = page.getByRole('dialog').filter({ hasText: 'Clone Quantities' });
      const toggles = dialog.locator('.dropdown-toggle');

      // Change fiscal year to 2025/2026
      await toggles.nth(0).click();
      await page.waitForTimeout(300);
      await page.getByRole('menuitem', { name: '2025/2026' }).click();
      await page.waitForTimeout(300);

      // Change forecast to 200
      await dialog.getByRole('textbox', { name: 'Forecast' }).fill('200');

      await expect(dialog.getByRole('button', { name: 'Submit' })).toBeEnabled();
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });
    });

    await test.step('Step 4: Verify both rows exist with correct values', async () => {
      const clonedRow = qtyTable.locator('tbody tr', { hasText: '2025/2026' });
      await expect(clonedRow).toBeVisible();
      await expect(clonedRow.locator('td').nth(2)).toHaveText('200');

      // Original remains unchanged
      const originalRow = qtyTable.locator('tbody tr', { hasText: '2024/2025' });
      await expect(originalRow).toBeVisible();
      await expect(originalRow.locator('td').nth(2)).toHaveText('100');
    });

    await test.step('Cleanup: Delete both Qty records', async () => {
      const rows = qtyTable.locator('tbody tr');
      const count = await rows.count();
      for (let i = count - 1; i >= 0; i--) {
        await rows.nth(i).getByRole('button', { name: 'Delete Record' }).click();
        await page.waitForTimeout(500);
        const popover = page.locator('[role="tooltip"]');
        await expect(popover).toBeVisible();
        await popover.getByRole('button', { name: 'Delete' }).dispatchEvent('click');
        await page.waitForTimeout(2000);
      }
      await expect(qtyTable.locator('tbody tr')).toHaveCount(0);
    });
  });
});
