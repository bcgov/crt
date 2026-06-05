/**
 * ============================================================================
 * 05-Financial-Planning - TC-TS-TEND-05: Tender cancel with unsaved changes prompt
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-TEND-05-cancel-unsaved-changes.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/05-financial-planning/tc-ts-tend-05-cancel-unsaved-changes.spec.ts --headed
 * Headless:               npx playwright test tests/05-financial-planning/tc-ts-tend-05-cancel-unsaved-changes.spec.ts
 * Debug:                  npx playwright test tests/05-financial-planning/tc-ts-tend-05-cancel-unsaved-changes.spec.ts --debug
 * Specific Test:          npx playwright test tests/05-financial-planning/tc-ts-tend-05-cancel-unsaved-changes.spec.ts -g "unsaved" --headed
 *
 * OVERVIEW:
 * Verifies that cancelling the Add Tender form with unsaved changes triggers the
 * "You have unsaved changes" prompt. Tests that "Go Back" returns to the form
 * with data intact, and "Leave" discards changes and closes the dialog.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Unsaved Changes Detection:
 *    ✅ Prompt appears when cancelling with data entered
 *    ✅ Prompt shows "You have unsaved changes" title
 *    ✅ Prompt has "Go Back" and "Leave" buttons
 *
 * 2. Go Back Flow:
 *    ✅ "Go Back" returns to the form
 *    ✅ Form data (Tender Number) is retained
 *
 * 3. Leave Flow:
 *    ✅ "Leave" closes the form dialog
 *    ✅ No new entry was added to the tender table
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-TEND-05 — Tender cancel with unsaved changes prompt', () => {
  test.setTimeout(60_000);

  test('Cancel with unsaved changes shows prompt with Go Back and Leave', async ({ page }) => {
    await test.step('Step 1: Navigate and open Add Tender dialog', async () => {
      await page.goto('/projects/79/projecttender');
      await page.locator('button[title="Add Tender"]').click();
      const dialog = page.locator('[role="dialog"]').filter({ hasText: 'Add Tender Details' });
      await expect(dialog).toBeVisible();
    });

    const addDialog = page.locator('[role="dialog"]').filter({ hasText: 'Add Tender Details' });
    const unsavedDialog = page.locator('[role="dialog"]').filter({ hasText: 'unsaved changes' });

    await test.step('Step 2: Fill Tender Number with test data', async () => {
      await addDialog.locator('input[name="tenderNumber"]').fill('CRT-AUTO-CANCEL-T001');
      await page.waitForTimeout(200);
    });

    await test.step('Step 3: Cancel triggers unsaved changes prompt', async () => {
      await addDialog.getByRole('button', { name: 'Cancel' }).click();
      await unsavedDialog.waitFor({ state: 'visible', timeout: 5000 });

      await expect(unsavedDialog).toContainText('You have unsaved changes');
      await expect(unsavedDialog.getByRole('button', { name: 'Go Back' })).toBeVisible();
      await expect(unsavedDialog.getByRole('button', { name: 'Leave' })).toBeVisible();
    });

    await test.step('Step 4: Go Back returns to form with data intact', async () => {
      await unsavedDialog.getByRole('button', { name: 'Go Back' }).click();
      await page.waitForTimeout(300);

      await expect(addDialog).toBeVisible();
      await expect(addDialog.locator('input[name="tenderNumber"]')).toHaveValue('CRT-AUTO-CANCEL-T001');
    });

    await test.step('Step 5: Cancel again and Leave discards data', async () => {
      await addDialog.getByRole('button', { name: 'Cancel' }).click();
      await unsavedDialog.waitFor({ state: 'visible', timeout: 5000 });

      await unsavedDialog.getByRole('button', { name: 'Leave' }).click();
      await page.waitForTimeout(500);

      await expect(addDialog).not.toBeVisible();
    });

    await test.step('Step 6: Verify no entry was added to table', async () => {
      const row = page.locator('table').first().locator('tbody tr', { hasText: 'CRT-AUTO-CANCEL-T001' });
      await expect(row).not.toBeVisible();
    });
  });
});
