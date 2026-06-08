/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-CLONE-03: Clone record in Tender Details
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-CLONE-03-clone-tender.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-clone-03-clone-tender.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-clone-03-clone-tender.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-clone-03-clone-tender.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-clone-03-clone-tender.spec.ts -g "Clone" --headed
 *
 * OVERVIEW:
 * Verifies that an existing Tender entry can be cloned, creating a new entry
 * with copied data (dates, amounts, contractor) that can be modified before
 * saving. Uses project 72 (TCL01) which has an existing Tender row.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Clone Dialog:
 *    ✅ "Clone Tender Details" dialog opens with pre-filled data
 *    ✅ Dates, amounts, and contractor are copied from source
 *    ✅ Tender Number field is empty (requires new value)
 *    ✅ Submit disabled until a change is made
 *
 * 2. Clone Result:
 *    ✅ New row appears in table with modified tender number and bid value
 *    ✅ Original row remains unchanged
 *
 * 3. Cleanup:
 *    ✅ Cloned row is deleted
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-CLONE-03 — Clone record in Tender Details', () => {
  test.setTimeout(120_000);

  const PROJECT_ID = 72; // TCL01 - has existing Tender data

  test.beforeEach(async ({ page }) => {
    await page.goto(`/projects/${PROJECT_ID}/projecttender`);
    await expect(page.locator('table').first().locator('tbody tr').first()).toBeVisible();
  });

  test('Clone tender record with modified number and bid value', async ({ page }) => {
    const tenderTable = page.locator('table').first();

    await test.step('Step 1: Click Clone and verify pre-filled dialog', async () => {
      const sourceRow = tenderTable.locator('tbody tr').first();
      await sourceRow.getByRole('button', { name: 'Clone Record' }).click();

      const dialog = page.getByRole('dialog').filter({ hasText: 'Clone Tender' });
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('.modal-title, h5').first()).toHaveText('Clone Tender Details');

      // Tender Number is empty (must be unique)
      await expect(dialog.locator('input[name="tenderNumber"]')).toHaveValue('');

      // Dates are copied
      await expect(dialog.locator('input[name="plannedDate"]')).toHaveValue('2021-04-30');
      await expect(dialog.locator('input[name="actualDate"]')).toHaveValue('2021-04-29');

      // Amounts are copied
      await expect(dialog.getByRole('textbox', { name: 'Ministry Estimate' })).toHaveValue('$3,200');
      await expect(dialog.getByRole('textbox', { name: 'Winning Bid' })).toHaveValue('$32');

      // Contractor dropdown copied
      const contractorToggle = dialog.locator('.dropdown-toggle');
      await expect(contractorToggle).toContainText('Axis Mountain Technical Inc.');

      // Submit disabled until change
      await expect(dialog.getByRole('button', { name: 'Submit' })).toBeDisabled();
    });

    await test.step('Step 2: Fill tender number and change bid value, then submit', async () => {
      const dialog = page.getByRole('dialog').filter({ hasText: 'Clone Tender' });

      // Fill new tender number
      await dialog.locator('input[name="tenderNumber"]').fill('T-002');

      // Change bid value
      await dialog.getByRole('textbox', { name: 'Winning Bid' }).fill('$750,000');

      await expect(dialog.getByRole('button', { name: 'Submit' })).toBeEnabled();
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });
    });

    await test.step('Step 3: Verify new row and original unchanged', async () => {
      const clonedRow = tenderTable.locator('tbody tr', { hasText: 'T-002' });
      await expect(clonedRow).toBeVisible();
      await expect(clonedRow.locator('td').nth(5)).toHaveText('$750,000');

      // Original unchanged
      const originalRow = tenderTable.locator('tbody tr', { hasText: 'Closed-00001' });
      await expect(originalRow).toBeVisible();
      await expect(originalRow.locator('td').nth(5)).toHaveText('$32');
    });

    await test.step('Cleanup: Delete the cloned row', async () => {
      const clonedRow = tenderTable.locator('tbody tr', { hasText: 'T-002' });
      await clonedRow.getByRole('button', { name: 'Delete Record' }).click();
      await page.waitForTimeout(500);
      const popover = page.locator('[role="tooltip"]');
      await expect(popover).toBeVisible();
      await popover.getByRole('button', { name: 'Delete' }).dispatchEvent('click');
      await expect(clonedRow).toBeHidden({ timeout: 10_000 });

      // Only original remains
      await expect(tenderTable.locator('tbody tr')).toHaveCount(1);
    });
  });
});
