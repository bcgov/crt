/**
 * ============================================================================
 * 05-Financial-Planning - TC-TS-FIN-05: Amount field accepts negative values without decimals
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-FIN-05-negative-amount.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/05-financial-planning/tc-ts-fin-05-negative-amount.spec.ts --headed
 * Headless:               npx playwright test tests/05-financial-planning/tc-ts-fin-05-negative-amount.spec.ts
 * Debug:                  npx playwright test tests/05-financial-planning/tc-ts-fin-05-negative-amount.spec.ts --debug
 * Specific Test:          npx playwright test tests/05-financial-planning/tc-ts-fin-05-negative-amount.spec.ts -g "negative" --headed
 *
 * OVERVIEW:
 * Verifies that the Amount field on the Add Financial Planning form accepts negative
 * integer values. The entry is saved and displays as "-$50,000" in the table. Per
 * Sprint 6 rule, no decimals are allowed in currency fields.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Negative Amount Input:
 *    ✅ Amount field accepts "-50000"
 *    ✅ Field formats as "-$50,000"
 *    ✅ Submit is enabled with negative amount
 *
 * 2. Table Display:
 *    ✅ Row shows "-$50,000" in the Amount column
 *
 * 3. Cleanup:
 *    ✅ Created record is deleted after verification
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-FIN-05 — Amount field accepts negative values without decimals', () => {
  test.setTimeout(180_000);

  test.beforeEach(async ({ page }) => {
    // Navigate to the first project's financial plan dynamically
    await page.goto('/projects');
    await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30000 });
    const projectLink = page.locator('table tbody tr').first().locator('td:nth-child(2) a');
    const projectUrl = await projectLink.getAttribute('href');
    await page.goto(`${projectUrl}/projectplan`);
    await expect(page.locator('h1', { hasText: 'Financial Planning Targets' })).toBeVisible();
  });

  test('Add financial entry with negative amount', async ({ page }) => {
    await test.step('Step 1: Open Add dialog and fill required fields', async () => {
      await page.locator('button[title="Add Finanical Planning Target"]').click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      // Select Fiscal Year 2024/2025
      await dialog.locator('button.dropdown-toggle').first().click();
      await dialog.locator('.dropdown-menu.show button.dropdown-item', { hasText: '2024/2025' }).click();

      // Select Phase "P-Plan"
      await dialog.locator('button.dropdown-toggle').nth(1).click();
      await page.waitForTimeout(300);
      await dialog.locator('.dropdown-menu.show button.dropdown-item', { hasText: 'P-Plan' }).click();

      // Select Element (first available)
      await dialog.locator('button.dropdown-toggle').nth(2).click();
      await page.waitForTimeout(300);
      await dialog.locator('.dropdown-menu.show button.dropdown-item').first().click();

      // Select Funding Type "Allocation"
      await dialog.locator('button.dropdown-toggle').nth(3).click();
      await page.waitForTimeout(300);
      await dialog.locator('.dropdown-menu.show button.dropdown-item', { hasText: 'Allocation' }).click();
    });

    await test.step('Step 2: Enter negative amount and verify formatting', async () => {
      const dialog = page.locator('[role="dialog"]');
      const amountInput = dialog.getByRole('textbox', { name: 'Amount' });

      await amountInput.fill('-50000');
      await expect(amountInput).toHaveValue('-$50,000');
    });

    await test.step('Step 3: Add description and submit', async () => {
      const dialog = page.locator('[role="dialog"]');
      await dialog.getByRole('textbox', { name: 'Description' }).fill('CRT-AUTO negative amount test');
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).not.toBeVisible();
    });

    await test.step('Step 4: Verify negative amount displays in table', async () => {
      const newRow = page.locator('table').first().locator('tbody tr', { hasText: 'CRT-AUTO negative amount test' });
      await expect(newRow).toBeVisible();
      await expect(newRow).toContainText('-$50,000');
      await expect(newRow).toContainText('2024/2025');
      await expect(newRow).toContainText('P-Plan');
      await expect(newRow).toContainText('Allocation');
    });

    await test.step('Cleanup: Delete the created record', async () => {
      const newRow = page.locator('table').first().locator('tbody tr', { hasText: 'CRT-AUTO negative amount test' });
      await newRow.locator('button[title="Delete Record"]').click();

      const deleteConfirm = page.getByRole('button', { name: 'Delete', exact: true });
      await deleteConfirm.waitFor({ state: 'visible', timeout: 5000 });
      await deleteConfirm.click();

      await expect(newRow).not.toBeVisible();
    });
  });
});
