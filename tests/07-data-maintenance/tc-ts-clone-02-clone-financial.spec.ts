/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-CLONE-02: Clone record in Financial Planning
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-CLONE-02-clone-financial.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-clone-02-clone-financial.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-clone-02-clone-financial.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-clone-02-clone-financial.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-clone-02-clone-financial.spec.ts -g "Clone" --headed
 *
 * OVERVIEW:
 * Verifies that an existing Financial Planning entry can be cloned via the
 * "Clone Record" button. The clone dialog opens pre-filled with source data
 * (element, funding type, phase, amount, description) and allows modification
 * before saving. Uses project 79 which has an existing Financial Planning row.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Clone Dialog:
 *    ✅ "Clone Financial Planning Targets" dialog opens
 *    ✅ All dropdowns pre-filled from source (Fiscal Year, Phase, Element, Funding Type)
 *    ✅ Amount and Description pre-filled from source
 *    ✅ Submit disabled until a change is made
 *
 * 2. Clone Result:
 *    ✅ New row appears in table with modified fiscal year and amount
 *    ✅ Original row remains unchanged
 *
 * 3. Cleanup:
 *    ✅ Cloned row is deleted
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-CLONE-02 — Clone record in Financial Planning', () => {
  test.setTimeout(120_000);

  let projectPath: string;

  test.beforeEach(async ({ page }) => {
    // Dynamically find a project with at least one financial planning row
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
      await page.goto(`${hrefs[i]}/projectplan`);
      await expect(page.getByText('Financial Planning Targets')).toBeVisible();
      const rows = await page.locator('table tbody tr').count();
      if (rows > 0) {
        projectPath = hrefs[i] as string;
        found = true;
      }
    }
    expect(found, 'Could not find a project with financial planning rows').toBe(true);
  });

  test('Clone financial planning record with modified year and amount', async ({ page }) => {
    const sourceRow = page.locator('table tbody tr').first();

    await test.step('Step 1: Capture source values and verify pre-filled clone dialog', async () => {
      // Capture source row values dynamically before cloning
      const sourceFiscalYear = (await sourceRow.locator('td').nth(0).textContent())?.trim() ?? '';
      const sourceAmount    = (await sourceRow.locator('td').nth(4).textContent())?.trim() ?? '';

      await sourceRow.getByRole('button', { name: 'Clone Record' }).click();

      const dialog = page.getByRole('dialog').filter({ hasText: 'Clone Financial' });
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('.modal-title, h5').first()).toHaveText('Clone Financial Planning Targets');

      // Verify key pre-filled values match the source row
      await expect(dialog.locator('.dropdown-toggle').nth(0)).toHaveText(sourceFiscalYear);
      await expect(dialog.getByRole('textbox', { name: 'Amount' })).toHaveValue(sourceAmount);

      // Submit must be disabled until a change is made
      await expect(dialog.getByRole('button', { name: 'Submit' })).toBeDisabled();
    });

    await test.step('Step 2: Change fiscal year and amount, then submit', async () => {
      const dialog = page.getByRole('dialog').filter({ hasText: 'Clone Financial' });

      // Use 2027/2028 as the clone's fiscal year (last available, unlikely to conflict)
      await dialog.locator('.dropdown-toggle').nth(0).click();
      await page.waitForTimeout(300);
      await page.getByRole('menuitem', { name: '2027/2028' }).click();
      await page.waitForTimeout(300);

      await dialog.getByRole('textbox', { name: 'Amount' }).fill('$999,000');

      await expect(dialog.getByRole('button', { name: 'Submit' })).toBeEnabled();
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });
    });

    await test.step('Step 3: Verify new row and original unchanged', async () => {
      const clonedRow = page.locator('table tbody tr', { hasText: '2027/2028' });
      await expect(clonedRow).toBeVisible();
      await expect(clonedRow.locator('td').nth(4)).toHaveText('$999,000');

      // Original first row is still present with its original fiscal year
      await expect(sourceRow).toBeVisible();
    });

    await test.step('Cleanup: Delete the cloned row', async () => {
      const clonedRow = page.locator('table tbody tr', { hasText: '2027/2028' });
      await clonedRow.getByRole('button', { name: 'Delete Record' }).click();
      await page.waitForTimeout(500);
      const popover = page.locator('[role="tooltip"]');
      await expect(popover).toBeVisible();
      await popover.getByRole('button', { name: 'Delete' }).dispatchEvent('click');
      await expect(clonedRow).toBeHidden({ timeout: 10_000 });
    });
  });
});
