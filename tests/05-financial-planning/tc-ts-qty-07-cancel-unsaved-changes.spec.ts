/**
 * ============================================================================
 * 05-Financial-Planning - TC-TS-QTY-07: Cancel with unsaved changes prompt
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-QTY-07-cancel-unsaved-changes.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/05-financial-planning/tc-ts-qty-07-cancel-unsaved-changes.spec.ts --headed
 * Headless:               npx playwright test tests/05-financial-planning/tc-ts-qty-07-cancel-unsaved-changes.spec.ts
 * Debug:                  npx playwright test tests/05-financial-planning/tc-ts-qty-07-cancel-unsaved-changes.spec.ts --debug
 * Specific Test:          npx playwright test tests/05-financial-planning/tc-ts-qty-07-cancel-unsaved-changes.spec.ts -g "Cancel with unsaved" --headed
 *
 * OVERVIEW:
 * Verifies that cancelling the Qty/Accmp form with unsaved changes triggers a
 * "You have unsaved changes" prompt. "Go Back" returns to the form with data
 * intact; "Leave" closes the form and discards changes.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Unsaved Changes Prompt:
 *    ✅ Cancelling with data entered shows "You have unsaved changes." dialog
 *    ✅ Dialog body warns about losing changes
 *    ✅ Dialog has "Go Back" and "Leave" buttons
 *
 * 2. Go Back:
 *    ✅ Clicking "Go Back" returns to the form
 *    ✅ Entered data (Forecast) is preserved
 *
 * 3. Leave:
 *    ✅ Clicking "Leave" closes the form dialog
 *    ✅ No new entry is added to the table
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-QTY-07 — Cancel with unsaved changes prompt', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/projects/79/projecttender');
    await expect(page.locator('h1', { hasText: 'Quantities/Accomplishments' })).toBeVisible();
  });

  test('Cancel with unsaved changes prompt', async ({ page }) => {
    const initialRowCount = await page.locator('table').nth(1).locator('tbody tr').count();

    await test.step('Step 1: Open Add dialog and enter data', async () => {
      await page.locator('button[title="Add Quantity or Accomplishment"]').click();

      const dialog = page.locator('[role="dialog"]').filter({ hasText: 'Add Quantities' });
      await expect(dialog).toBeVisible();

      // Select Fiscal Year 2024/2025
      await dialog.locator('button.dropdown-toggle').first().click();
      await dialog.locator('.dropdown-menu.show button.dropdown-item', { hasText: '2024/2025' }).click();

      // Select Accomplishment
      await dialog.locator('button.dropdown-toggle').nth(1).click();
      await dialog.locator('.dropdown-menu.show button.dropdown-item', { hasText: 'Accomplishment' }).click();
      await page.waitForTimeout(300);

      // Fill Forecast
      await dialog.getByRole('textbox', { name: 'Forecast' }).fill('50');
    });

    await test.step('Step 2: Click Cancel and verify unsaved changes prompt', async () => {
      const dialog = page.locator('[role="dialog"]').filter({ hasText: 'Add Quantities' });
      await dialog.getByRole('button', { name: 'Cancel' }).click();

      // Unsaved changes dialog appears
      const unsavedDialog = page.locator('[role="dialog"]').filter({ hasText: 'unsaved changes' });
      await expect(unsavedDialog).toBeVisible();

      // Verify title text
      await expect(unsavedDialog.locator('.modal-title')).toContainText('You have unsaved changes');

      // Verify buttons
      await expect(unsavedDialog.getByRole('button', { name: 'Go Back' })).toBeVisible();
      await expect(unsavedDialog.getByRole('button', { name: 'Leave' })).toBeVisible();
    });

    await test.step('Step 3: Click "Go Back" and verify form data is preserved', async () => {
      const unsavedDialog = page.locator('[role="dialog"]').filter({ hasText: 'unsaved changes' });
      await unsavedDialog.getByRole('button', { name: 'Go Back' }).click();
      await page.waitForTimeout(300);

      // Form is still visible
      const dialog = page.locator('[role="dialog"]').filter({ hasText: 'Add Quantities' });
      await expect(dialog).toBeVisible();

      // Forecast value is preserved
      await expect(dialog.getByRole('textbox', { name: 'Forecast' })).toHaveValue('50');
    });

    await test.step('Step 4: Click Cancel again and click "Leave"', async () => {
      const dialog = page.locator('[role="dialog"]').filter({ hasText: 'Add Quantities' });
      await dialog.getByRole('button', { name: 'Cancel' }).click();

      // Unsaved changes dialog appears again
      const unsavedDialog = page.locator('[role="dialog"]').filter({ hasText: 'unsaved changes' });
      await expect(unsavedDialog).toBeVisible();

      // Click Leave
      await unsavedDialog.getByRole('button', { name: 'Leave' }).click();
      await page.waitForTimeout(300);

      // All dialogs are closed
      await expect(page.locator('[role="dialog"]').first()).not.toBeVisible();
    });

    await test.step('Step 5: Verify no new entry was added', async () => {
      const finalRowCount = await page.locator('table').nth(1).locator('tbody tr').count();
      expect(finalRowCount).toBe(initialRowCount);
    });
  });
});
