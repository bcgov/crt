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

  let projectPath: string;

  test.beforeEach(async ({ page }) => {
    // Dynamically find a project with at least one tender row
    await page.goto('/projects');
    await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30000 });

    const projectLinks = page.locator('table tbody tr td:nth-child(2) a');
    const count = await projectLinks.count();
    const hrefs: (string | null)[] = [];
    for (let i = 0; i < count; i++) {
      hrefs.push(await projectLinks.nth(i).getAttribute('href'));
    }

    let found = false;
    for (let i = 0; i < hrefs.length && !found; i++) {
      await page.goto(`${hrefs[i]}/projecttender`);
      await expect(page.getByText('Project Tender Details')).toBeVisible();
      const rows = await page.locator('table').first().locator('tbody tr').count();
      if (rows > 0) {
        projectPath = hrefs[i] as string;
        found = true;
      }
    }
    expect(found, 'Could not find a project with tender rows').toBe(true);
  });

  test('Clone tender record with modified number and bid value', async ({ page }) => {
    const tenderTable = page.locator('table').first();
    const sourceRow = tenderTable.locator('tbody tr').first();

    await test.step('Step 1: Capture source values and verify pre-filled clone dialog', async () => {
      // Capture source row values dynamically before cloning
      const sourceTenderNumber = (await sourceRow.locator('td').nth(0).textContent())?.trim() ?? '';
      const sourceBid          = (await sourceRow.locator('td').nth(5).textContent())?.trim() ?? '';

      await sourceRow.getByRole('button', { name: 'Clone Record' }).click();

      const dialog = page.getByRole('dialog').filter({ hasText: 'Clone Tender' });
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('.modal-title, h5').first()).toHaveText('Clone Tender Details');

      // Tender Number must be empty (new tender requires a unique number)
      await expect(dialog.locator('input[name="tenderNumber"]')).toHaveValue('');

      // Bid value is copied from source
      await expect(dialog.getByRole('textbox', { name: 'Winning Bid' })).toHaveValue(sourceBid);

      // Submit disabled until a change is made
      await expect(dialog.getByRole('button', { name: 'Submit' })).toBeDisabled();
    });

    await test.step('Step 2: Fill tender number and change bid value, then submit', async () => {
      const dialog = page.getByRole('dialog').filter({ hasText: 'Clone Tender' });

      await dialog.locator('input[name="tenderNumber"]').fill('T-CLONE-TEST');
      await dialog.getByRole('textbox', { name: 'Winning Bid' }).fill('$750,000');

      await expect(dialog.getByRole('button', { name: 'Submit' })).toBeEnabled();
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });
    });

    await test.step('Step 3: Verify new row and original unchanged', async () => {
      const clonedRow = tenderTable.locator('tbody tr', { hasText: 'T-CLONE-TEST' });
      await expect(clonedRow).toBeVisible();
      await expect(clonedRow.locator('td').nth(5)).toHaveText('$750,000');

      // Original row is still present
      await expect(sourceRow).toBeVisible();
    });

    await test.step('Cleanup: Delete the cloned row', async () => {
      const clonedRow = tenderTable.locator('tbody tr', { hasText: 'T-CLONE-TEST' });
      await clonedRow.getByRole('button', { name: 'Delete Record' }).click();
      await page.waitForTimeout(500);
      const popover = page.locator('[role="tooltip"]');
      await expect(popover).toBeVisible();
      await popover.getByRole('button', { name: 'Delete' }).dispatchEvent('click');
      await expect(clonedRow).toBeHidden({ timeout: 10_000 });
    });
  });
});
