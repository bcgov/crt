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

  const PROJECT_ID = 79;

  test.beforeEach(async ({ page }) => {
    await page.goto(`/projects/${PROJECT_ID}/projectplan`);
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  test('Clone financial planning record with modified year and amount', async ({ page }) => {
    await test.step('Step 1: Click Clone and verify pre-filled dialog', async () => {
      const sourceRow = page.locator('table tbody tr').first();
      await sourceRow.getByRole('button', { name: 'Clone Record' }).click();

      const dialog = page.getByRole('dialog').filter({ hasText: 'Clone Financial' });
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('.modal-title, h5').first()).toHaveText('Clone Financial Planning Targets');

      // Verify pre-filled dropdowns
      const toggles = dialog.locator('.dropdown-toggle');
      await expect(toggles.nth(0)).toHaveText('2022/2023'); // Fiscal Year
      await expect(toggles.nth(1)).toHaveText('P-Plan'); // Phase
      await expect(toggles.nth(2)).toContainText('Safety Program'); // Element
      await expect(toggles.nth(3)).toHaveText('Allocation'); // Funding Type

      // Verify pre-filled amount and description
      await expect(dialog.getByRole('textbox', { name: 'Amount' })).toHaveValue('$100,000');
      await expect(dialog.locator('textarea[name="description"]')).toHaveValue('Test financial planning target');

      // Submit disabled until change
      await expect(dialog.getByRole('button', { name: 'Submit' })).toBeDisabled();
    });

    await test.step('Step 2: Change fiscal year and amount, then submit', async () => {
      const dialog = page.getByRole('dialog').filter({ hasText: 'Clone Financial' });
      const toggles = dialog.locator('.dropdown-toggle');

      // Change fiscal year to 2025/2026
      await toggles.nth(0).click();
      await page.waitForTimeout(300);
      await page.getByRole('menuitem', { name: '2025/2026' }).click();
      await page.waitForTimeout(300);

      // Change amount
      await dialog.getByRole('textbox', { name: 'Amount' }).fill('$1,500,000');

      await expect(dialog.getByRole('button', { name: 'Submit' })).toBeEnabled();
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });
    });

    await test.step('Step 3: Verify new row and original unchanged', async () => {
      const clonedRow = page.locator('table tbody tr', { hasText: '2025/2026' });
      await expect(clonedRow).toBeVisible();
      await expect(clonedRow.locator('td').nth(4)).toHaveText('$1,500,000');
      await expect(clonedRow.locator('td').nth(5)).toHaveText('Test financial planning target');

      // Original unchanged
      const originalRow = page.locator('table tbody tr', { hasText: '2022/2023' });
      await expect(originalRow).toBeVisible();
      await expect(originalRow.locator('td').nth(4)).toHaveText('$100,000');
    });

    await test.step('Cleanup: Delete the cloned row', async () => {
      const clonedRow = page.locator('table tbody tr', { hasText: '2025/2026' });
      await clonedRow.getByRole('button', { name: 'Delete Record' }).click();
      await page.waitForTimeout(500);
      const popover = page.locator('[role="tooltip"]');
      await expect(popover).toBeVisible();
      await popover.getByRole('button', { name: 'Delete' }).dispatchEvent('click');
      await expect(clonedRow).toBeHidden({ timeout: 10_000 });

      // Verify only original remains
      await expect(page.locator('table tbody tr')).toHaveCount(1);
    });
  });
});
