/**
 * ============================================================================
 * 05-Financial-Planning - TC-TS-FIN-06: Edit financial planning entry with negative amount
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-FIN-06-edit-financial-entry.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/05-financial-planning/tc-ts-fin-06-edit-financial-entry.spec.ts --headed
 * Headless:               npx playwright test tests/05-financial-planning/tc-ts-fin-06-edit-financial-entry.spec.ts
 * Debug:                  npx playwright test tests/05-financial-planning/tc-ts-fin-06-edit-financial-entry.spec.ts --debug
 * Specific Test:          npx playwright test tests/05-financial-planning/tc-ts-fin-06-edit-financial-entry.spec.ts -g "Edit financial" --headed
 *
 * OVERVIEW:
 * Verifies that an existing financial planning entry can be edited to a negative
 * amount. The edit dialog opens pre-filled with existing values, the Amount field
 * accepts negative values, and the table displays the formatted negative currency.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Edit Dialog:
 *    ✅ Edit Record button opens the edit dialog
 *    ✅ Dialog title is "Edit Financial Planning Targets"
 *    ✅ Fields are pre-filled with existing values
 *    ✅ Amount field accepts negative values
 *
 * 2. Updated Display:
 *    ✅ Amount column shows "-$25,000" after edit
 *    ✅ Total Project Funding recalculates with the negative amount
 *
 * 3. Cleanup:
 *    ✅ Amount reverted to original value ($100,000)
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-FIN-06 — Edit financial planning entry with negative amount', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    // Find the first project that has at least one financial planning target row
    await page.goto('/projects');
    await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30_000 });

    const links = page.locator('table tbody tr td:nth-child(2) a');
    const hrefs: string[] = [];
    const linkCount = await links.count();
    for (let i = 0; i < Math.min(linkCount, 10); i++) {
      hrefs.push((await links.nth(i).getAttribute('href')) ?? '');
    }

    for (const href of hrefs) {
      await page.goto(`${href}/projectplan`);
      await expect(page.locator('h1', { hasText: 'Financial Planning Targets' })).toBeVisible({ timeout: 15_000 });
      const rows = await page.locator('table').first().locator('tbody tr').count();
      if (rows > 0) {
        return; // Found a project with existing rows — test can proceed
      }
    }
    // No project with rows found; Step 1 will fail with a clear message
  });

  test('Edit financial planning entry with negative amount', async ({ page }) => {
    let originalAmount: string;
    let originalDescription: string;

    await test.step('Step 1: Click Edit Record on the first entry row', async () => {
      const row = page.locator('table').first().locator('tbody tr').first();
      await expect(row).toBeVisible();

      // Capture original amount for cleanup
      originalAmount = (await row.locator('td').nth(4).textContent())!.trim();

      await row.locator('button[title="Edit Record"]').click();
    });

    await test.step('Step 2: Verify dialog opens with pre-filled values', async () => {
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('.modal-title')).toHaveText('Edit Financial Planning Targets');

      // Verify fields are pre-filled (capture description for reference)
      const amountInput = dialog.getByRole('textbox', { name: 'Amount' });
      await expect(amountInput).toHaveValue(originalAmount);
      originalDescription = await dialog.getByRole('textbox', { name: 'Description' }).inputValue();
    });

    await test.step('Step 3: Change amount to negative value -25000', async () => {
      const dialog = page.locator('[role="dialog"]');
      const amountInput = dialog.getByRole('textbox', { name: 'Amount' });

      await amountInput.fill('');
      await amountInput.fill('-25000');

      // Verify the input displays formatted negative value
      await expect(amountInput).toHaveValue('-$25,000');
    });

    await test.step('Step 4: Submit the edit', async () => {
      const dialog = page.locator('[role="dialog"]');
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).not.toBeVisible();
    });

    await test.step('Step 5: Verify the table displays the negative amount', async () => {
      const row = page.locator('table').first().locator('tbody tr').first();
      await expect(row.locator('td').nth(4)).toHaveText('-$25,000');

      // Verify Total Project Funding recalculated
      await expect(page.locator('text=Total Project Funding').locator('..')).toContainText('-$25,000');
    });

    await test.step('Cleanup: Revert amount to original value', async () => {
      const row = page.locator('table').first().locator('tbody tr').first();
      await row.locator('button[title="Edit Record"]').click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      const amountInput = dialog.getByRole('textbox', { name: 'Amount' });
      await amountInput.fill('');
      // Extract numeric value from formatted original (e.g., "$100,000" -> "100000")
      const numericOriginal = originalAmount.replace(/[$,]/g, '');
      await amountInput.fill(numericOriginal);

      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).not.toBeVisible();

      // Verify reverted
      await expect(row.locator('td').nth(4)).toHaveText(originalAmount);
    });
  });
});
