/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-CLONE-04: Clone type restriction — Qty can
 *                                        only clone to Qty
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-CLONE-04-type-restriction.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-clone-04-type-restriction.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-clone-04-type-restriction.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-clone-04-type-restriction.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-clone-04-type-restriction.spec.ts -g "type restriction" --headed
 *
 * OVERVIEW:
 * Verifies that cloning a Quantity record pre-selects the "QUANTITY" category
 * and the type dropdown cannot be changed (menu does not open). This enforces
 * type-safe cloning — a Quantity cannot be cloned into an Accomplishment.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Type Restriction on Clone:
 *    ✅ Clone dialog shows "QUANTITY" pre-selected in type dropdown
 *    ✅ Clicking the type dropdown does NOT open a menu (effectively locked)
 *    ✅ The quantity-specific field (e.g. "Asphalt Mix") is pre-filled
 *
 * 2. Cleanup:
 *    ✅ Source Qty record is deleted
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-CLONE-04 — Clone type restriction: Qty only clones to Qty', () => {
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

  test('Cloning Qty record locks type dropdown to QUANTITY', async ({ page }) => {
    const qtyTable = page.locator('table').nth(1);

    await test.step('Step 1: Create a Quantity-type record', async () => {
      const addBtns = page.locator('button', { hasText: '+ Add' });
      await addBtns.nth(1).click();

      const dialog = page.getByRole('dialog').filter({ hasText: 'Add Quantities' });
      await expect(dialog).toBeVisible();

      // Select type "Quantity"
      const toggles = dialog.locator('.dropdown-toggle');
      await toggles.nth(1).click();
      await page.waitForTimeout(300);
      await page.getByRole('menuitem', { name: 'Quantity' }).click();
      await page.waitForTimeout(300);

      // Select specific quantity
      await dialog.locator('.dropdown-toggle').nth(2).click();
      await page.waitForTimeout(300);
      await page.getByRole('menuitem', { name: 'Asphalt Mix  (tonnes)' }).click();
      await page.waitForTimeout(300);

      // Fill Forecast
      await dialog.getByRole('textbox', { name: 'Forecast' }).fill('50');

      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });
      await expect(qtyTable.locator('tbody tr').first()).toBeVisible();
    });

    await test.step('Step 2: Clone and verify type dropdown is locked', async () => {
      const sourceRow = qtyTable.locator('tbody tr').first();
      await sourceRow.getByRole('button', { name: 'Clone Record' }).click();

      const dialog = page.getByRole('dialog').filter({ hasText: 'Clone Quantities' });
      await expect(dialog).toBeVisible();

      // Verify type shows "QUANTITY"
      const toggles = dialog.locator('.dropdown-toggle');
      await expect(toggles.nth(1)).toHaveText('QUANTITY');

      // Try to click the type dropdown — menu should NOT open
      await toggles.nth(1).click();
      await page.waitForTimeout(500);

      // Verify no dropdown menu opened
      const openMenus = page.locator('.dropdown-menu.show');
      const menuCount = await openMenus.count();
      expect(menuCount).toBe(0);

      // Verify the quantity-specific field is still pre-filled
      await expect(toggles.nth(2)).toContainText('Asphalt Mix');
    });

    await test.step('Cleanup: Cancel and delete source record', async () => {
      const dialog = page.getByRole('dialog').filter({ hasText: 'Clone Quantities' });
      await dialog.getByRole('button', { name: 'Cancel' }).dispatchEvent('click');
      await page.waitForTimeout(1000);

      // Handle potential unsaved changes dialog
      const unsaved = page.getByRole('dialog').filter({ hasText: 'unsaved changes' });
      if (await unsaved.isVisible()) {
        await unsaved.getByRole('button', { name: 'Leave' }).click();
        await page.waitForTimeout(1000);
      }

      const sourceRow = qtyTable.locator('tbody tr').first();
      await sourceRow.getByRole('button', { name: 'Delete Record' }).click();
      await page.waitForTimeout(500);
      const popover = page.locator('[role="tooltip"]');
      await expect(popover).toBeVisible();
      await popover.getByRole('button', { name: 'Delete' }).dispatchEvent('click');
      await expect(sourceRow).toBeHidden({ timeout: 10_000 });
    });
  });
});
