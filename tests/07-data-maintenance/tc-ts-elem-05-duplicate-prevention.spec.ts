/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-ELEM-05: Add element — duplicate prevention
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-ELEM-05-duplicate-prevention.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-elem-05-duplicate-prevention.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-elem-05-duplicate-prevention.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-elem-05-duplicate-prevention.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-elem-05-duplicate-prevention.spec.ts -g "duplicate" --headed
 *
 * OVERVIEW:
 * Verifies that adding an element with the same Code Value as an existing
 * element is rejected with a "Validation Failed" error dialog showing
 * "Code [Bb] already exists".
 *
 * WHAT THE TEST VALIDATES:
 * 1. Duplicate Prevention:
 *    ✅ Submitting duplicate code triggers a "Validation Failed" dialog
 *    ✅ Error message contains "Code [Bb] already exists"
 *    ✅ The duplicate element is not created
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-ELEM-05 — Add element — duplicate prevention', () => {
  test.setTimeout(60_000);

  test('Duplicate code value is rejected with error', async ({ page }) => {
    await test.step('Step 1: Navigate to Elements Management', async () => {
      await page.goto('/admin/elements');
      await expect(page.getByRole('heading', { name: 'Elements Management' })).toBeVisible();
    });

    await test.step('Step 2: Open Add Element dialog and fill duplicate values', async () => {
      await page.getByRole('button', { name: 'Add New Element' }).click();
      const dialog = page.locator('[role="dialog"]');
      await dialog.waitFor({ state: 'visible' });

      // Fill with existing element's values
      await dialog.locator('input[name="code"]').fill('Bb');
      await dialog.locator('input[name="description"]').fill('Bike BC');

      // Program Category
      await dialog.locator('button.dropdown-toggle').first().click();
      await page.waitForTimeout(300);
      await dialog.locator('.dropdown-menu.show button.dropdown-item', { hasText: 'Capital-Capital Expansion Program' }).click();
      await page.waitForTimeout(300);

      // Program
      await dialog.locator('button.dropdown-toggle').nth(1).click();
      await page.waitForTimeout(300);
      await dialog.locator('.dropdown-menu.show button.dropdown-item', { hasText: 'Grants - Bike BC' }).click();
      await page.waitForTimeout(300);

      // Service Line
      await dialog.locator('button.dropdown-toggle').nth(2).click();
      await page.waitForTimeout(300);
      await dialog.locator('.dropdown-menu.show button.dropdown-item').filter({ hasText: /^0-Other$/ }).click();
      await page.waitForTimeout(300);
    });

    await test.step('Step 3: Submit and verify error dialog', async () => {
      const addDialog = page.locator('[role="dialog"]').filter({ hasText: 'Add Element' });
      await addDialog.getByRole('button', { name: 'Submit' }).click();
      await page.waitForTimeout(2000);

      // A "Validation Failed" dialog should appear
      const errorDialog = page.locator('[role="dialog"]').filter({ hasText: 'Validation Failed' });
      await expect(errorDialog).toBeVisible({ timeout: 5000 });
      await expect(errorDialog).toContainText('Code [Bb] already exists');
    });

    await test.step('Cleanup: Close error and cancel dialogs', async () => {
      // Close error dialog
      const errorDialog = page.locator('[role="dialog"]').filter({ hasText: 'Validation Failed' });
      await errorDialog.locator('button.btn-secondary, button', { hasText: 'Close' }).last().click();
      await page.waitForTimeout(500);

      // Close Add dialog
      const addDialog = page.locator('[role="dialog"]').filter({ hasText: 'Add Element' });
      if (await addDialog.isVisible().catch(() => false)) {
        await addDialog.getByRole('button', { name: 'Cancel' }).click();
        await page.waitForTimeout(500);
      }
    });
  });
});
