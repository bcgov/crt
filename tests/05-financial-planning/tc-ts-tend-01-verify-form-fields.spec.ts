/**
 * ============================================================================
 * 05-Financial-Planning - TC-TS-TEND-01: Verify tender form fields
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-TEND-01-verify-form-fields.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/05-financial-planning/tc-ts-tend-01-verify-form-fields.spec.ts --headed
 * Headless:               npx playwright test tests/05-financial-planning/tc-ts-tend-01-verify-form-fields.spec.ts
 * Debug:                  npx playwright test tests/05-financial-planning/tc-ts-tend-01-verify-form-fields.spec.ts --debug
 * Specific Test:          npx playwright test tests/05-financial-planning/tc-ts-tend-01-verify-form-fields.spec.ts -g "Verify" --headed
 *
 * OVERVIEW:
 * Verifies that the Add Tender form contains all expected fields: Tender Number
 * (required), Planned Date, Actual Date, Ministry Estimate ($), Winning Contractor
 * (dropdown), Winning Bid ($), and Comment (free text). Also verifies Submit is
 * disabled until the required Tender Number field is filled.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Form Field Presence:
 *    ✅ Tender Number textbox is present and marked as required
 *    ✅ Planned Date date picker is present
 *    ✅ Actual Date date picker is present
 *    ✅ Ministry Estimate currency field is present (defaults to $0)
 *    ✅ Winning Contractor dropdown is present
 *    ✅ Winning Bid currency field is present (defaults to $0)
 *    ✅ Comment textarea with placeholder "Insert Comment Here" is present
 *
 * 2. Button States:
 *    ✅ Submit button is disabled when Tender Number is empty
 *    ✅ Submit button becomes enabled when Tender Number is filled
 *    ✅ Cancel button is always enabled
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-TEND-01 — Verify tender form fields', () => {
  test.setTimeout(60_000);

  test('Add Tender form contains all expected fields', async ({ page }) => {
    await test.step('Step 1: Navigate to tender page and open Add dialog', async () => {
      await page.goto('/projects/79/projecttender');
      await expect(page.locator('button[title="Add Tender"]')).toBeVisible();
      await page.locator('button[title="Add Tender"]').click();
    });

    const dialog = page.locator('[role="dialog"]').filter({ hasText: 'Add Tender Details' });

    await test.step('Step 2: Verify dialog title and Tender Number field', async () => {
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('h5')).toHaveText('Add Tender Details');

      // Tender Number is required (label shows asterisk)
      const tenderInput = dialog.locator('input[name="tenderNumber"]');
      await expect(tenderInput).toBeVisible();
      await expect(dialog.locator('label[for="tenderNumber"]')).toContainText('Tender Number*');
    });

    await test.step('Step 3: Verify date fields', async () => {
      const dateInputs = dialog.locator('input[placeholder="YYYY-MM-DD"]');
      await expect(dateInputs).toHaveCount(2);
      // Planned Date
      await expect(dialog.locator('text=Planned Date')).toBeVisible();
      // Actual Date
      await expect(dialog.locator('text=Actual Date')).toBeVisible();
    });

    await test.step('Step 4: Verify currency fields', async () => {
      // Ministry Estimate
      const ministryEstimate = dialog.getByRole('textbox', { name: 'Ministry Estimate' });
      await expect(ministryEstimate).toBeVisible();
      await expect(ministryEstimate).toHaveValue('$0');

      // Winning Bid
      const winningBid = dialog.getByRole('textbox', { name: 'Winning Bid' });
      await expect(winningBid).toBeVisible();
      await expect(winningBid).toHaveValue('$0');
    });

    await test.step('Step 5: Verify Winning Contractor dropdown', async () => {
      await expect(dialog.locator('text=Winning Contractor')).toBeVisible();
      await expect(dialog.locator('button.dropdown-toggle')).toBeVisible();
    });

    await test.step('Step 6: Verify Comment textarea', async () => {
      const comment = dialog.locator('textarea[placeholder="Insert Comment Here"]');
      await expect(comment).toBeVisible();
    });

    await test.step('Step 7: Verify Submit is disabled, Cancel is enabled', async () => {
      const submitBtn = dialog.getByRole('button', { name: 'Submit' });
      const cancelBtn = dialog.getByRole('button', { name: 'Cancel' });

      await expect(submitBtn).toBeDisabled();
      await expect(cancelBtn).toBeEnabled();
    });

    await test.step('Step 8: Verify Submit enables when Tender Number is filled', async () => {
      await dialog.locator('input[name="tenderNumber"]').fill('TEST-ENABLE');
      await page.waitForTimeout(200);
      await expect(dialog.getByRole('button', { name: 'Submit' })).toBeEnabled();
    });

    await test.step('Cleanup: Close dialog', async () => {
      await dialog.getByRole('button', { name: 'Cancel' }).click();
      await page.waitForTimeout(300);
      const unsavedDialog = page.locator('[role="dialog"]').filter({ hasText: 'unsaved changes' });
      if (await unsavedDialog.isVisible().catch(() => false)) {
        await unsavedDialog.getByRole('button', { name: 'Leave' }).click();
      }
    });
  });
});
