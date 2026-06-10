/**
 * ============================================================================
 * 05-Financial-Planning - TC-TS-FIN-02: Add financial planning entry with all fields
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-FIN-02-add-financial-entry.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/05-financial-planning/tc-ts-fin-02-add-financial-entry.spec.ts --headed
 * Headless:               npx playwright test tests/05-financial-planning/tc-ts-fin-02-add-financial-entry.spec.ts
 * Debug:                  npx playwright test tests/05-financial-planning/tc-ts-fin-02-add-financial-entry.spec.ts --debug
 * Specific Test:          npx playwright test tests/05-financial-planning/tc-ts-fin-02-add-financial-entry.spec.ts -g "Add financial" --headed
 *
 * OVERVIEW:
 * Verifies that a user can add a financial planning target entry with all required
 * and optional fields. The entry appears in the table with correct formatting.
 * Uses "Sp - Safety Program" for Element since "Gp - General Paving" is not in
 * the current dev environment data.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Add Dialog:
 *    ✅ "+ Add" button opens "Add Financial Planning Targets" dialog
 *    ✅ All dropdowns (Fiscal Year, Phase, Element, Funding Type) are selectable
 *    ✅ Amount field accepts integer values
 *    ✅ Description field accepts free text
 *
 * 2. Created Record:
 *    ✅ Row appears with Fiscal Year "2024/2025"
 *    ✅ Phase shows "P-Plan"
 *    ✅ Element shows "Sp" (code only in table)
 *    ✅ Funding Type shows "Allocation"
 *    ✅ Amount displays as "$500,000"
 *
 * 3. Cleanup:
 *    ✅ Created record is deleted after verification
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-FIN-02 — Add financial planning entry with all fields', () => {
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

  test('Add financial planning entry with all fields', async ({ page }) => {
    await test.step('Step 1: Open Add Financial Planning Targets dialog', async () => {
      await page.locator('button[title="Add Finanical Planning Target"]').click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('.modal-title')).toHaveText('Add Financial Planning Targets');
    });

    await test.step('Step 2: Select Fiscal Year 2024/2025', async () => {
      const dialog = page.locator('[role="dialog"]');
      await dialog.locator('button.dropdown-toggle').first().click();
      await dialog.locator('.dropdown-menu.show button.dropdown-item', { hasText: '2024/2025' }).click();
    });

    await test.step('Step 3: Select Phase "P-Plan"', async () => {
      const dialog = page.locator('[role="dialog"]');
      await dialog.locator('button.dropdown-toggle').nth(1).click();
      await page.waitForTimeout(300);
      await dialog.locator('.dropdown-menu.show button.dropdown-item', { hasText: 'P-Plan' }).click();
    });

    await test.step('Step 4: Select Element "Sp - Safety Program"', async () => {
      const dialog = page.locator('[role="dialog"]');
      await dialog.locator('button.dropdown-toggle').nth(2).click();
      await page.waitForTimeout(300);

      // Use search filter to find element
      const searchInput = dialog.locator('.dropdown-menu.show input');
      await searchInput.fill('Safety');
      await page.waitForTimeout(400);
      await dialog.locator('.dropdown-menu.show button.dropdown-item', { hasText: 'Safety Program' }).click();
    });

    await test.step('Step 5: Select Funding Type "Allocation"', async () => {
      const dialog = page.locator('[role="dialog"]');
      await dialog.locator('button.dropdown-toggle').nth(3).click();
      await page.waitForTimeout(300);
      await dialog.locator('.dropdown-menu.show button.dropdown-item', { hasText: 'Allocation' }).click();
    });

    await test.step('Step 6: Fill Amount and Description', async () => {
      const dialog = page.locator('[role="dialog"]');

      const amountInput = dialog.getByRole('textbox', { name: 'Amount' });
      await amountInput.fill('500000');
      await expect(amountInput).toHaveValue('$500,000');

      const descInput = dialog.getByRole('textbox', { name: 'Description' });
      await descInput.fill('CRT-AUTO financial target test entry');
    });

    await test.step('Step 7: Submit and verify record in table', async () => {
      const dialog = page.locator('[role="dialog"]');
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).not.toBeVisible();

      // Verify new row in table
      const newRow = page.locator('table').first().locator('tbody tr', { hasText: 'CRT-AUTO financial target test entry' });
      await expect(newRow).toBeVisible();

      await expect(newRow).toContainText('2024/2025');
      await expect(newRow).toContainText('P-Plan');
      await expect(newRow).toContainText('Sp');
      await expect(newRow).toContainText('Allocation');
      await expect(newRow).toContainText('$500,000');
    });

    await test.step('Cleanup: Delete the created record', async () => {
      const newRow = page.locator('table').first().locator('tbody tr', { hasText: 'CRT-AUTO financial target test entry' });
      await newRow.locator('button[title="Delete Record"]').click();

      const deleteConfirm = page.getByRole('button', { name: 'Delete', exact: true });
      await deleteConfirm.waitFor({ state: 'visible', timeout: 5000 });
      await deleteConfirm.click();

      await expect(newRow).not.toBeVisible();
    });
  });
});
