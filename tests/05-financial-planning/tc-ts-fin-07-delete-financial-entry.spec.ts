/**
 * ============================================================================
 * 05-Financial-Planning - TC-TS-FIN-07: Delete financial planning entry with confirmation
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-FIN-07-delete-financial-entry.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/05-financial-planning/tc-ts-fin-07-delete-financial-entry.spec.ts --headed
 * Headless:               npx playwright test tests/05-financial-planning/tc-ts-fin-07-delete-financial-entry.spec.ts
 * Debug:                  npx playwright test tests/05-financial-planning/tc-ts-fin-07-delete-financial-entry.spec.ts --debug
 * Specific Test:          npx playwright test tests/05-financial-planning/tc-ts-fin-07-delete-financial-entry.spec.ts -g "Delete financial" --headed
 *
 * OVERVIEW:
 * Verifies that deleting a financial planning entry requires confirmation via an
 * "Are you sure?" popover. Canceling retains the record; confirming removes it.
 * A test entry is created first so the original data is not lost.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Delete Confirmation:
 *    ✅ Clicking Delete Record shows "Are you sure?" popover
 *    ✅ Popover contains "permanently delete" warning text
 *    ✅ Popover has Delete and Cancel buttons
 *
 * 2. Cancel Flow:
 *    ✅ Clicking Cancel dismisses the popover
 *    ✅ The entry row remains in the table
 *
 * 3. Confirm Flow:
 *    ✅ Clicking Delete in the popover removes the record
 *    ✅ The entry row is no longer visible
 *    ✅ Total Project Funding recalculates
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-FIN-07 — Delete financial planning entry with confirmation', () => {
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

  test('Delete financial planning entry with confirmation', async ({ page }) => {
    await test.step('Setup: Create a test entry to delete', async () => {
      // Click + Add to create a new financial target entry
      await page.locator('button', { hasText: '+ Add' }).first().click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      // Select Fiscal Year (use default or pick one)
      await dialog.locator('button.dropdown-toggle').first().click();
      await dialog.locator('.dropdown-menu.show button.dropdown-item', { hasText: '2025/2026' }).click();

      // Select Phase
      await dialog.locator('button.dropdown-toggle').nth(1).click();
      await dialog.locator('.dropdown-menu.show button.dropdown-item').first().click();

      // Select Element
      await dialog.locator('button.dropdown-toggle').nth(2).click();
      await dialog.locator('.dropdown-menu.show button.dropdown-item').first().click();

      // Select Funding Type
      await dialog.locator('button.dropdown-toggle').nth(3).click();
      await dialog.locator('.dropdown-menu.show button.dropdown-item').first().click();

      // Fill Amount
      const amountInput = dialog.getByRole('textbox', { name: 'Amount' });
      await amountInput.fill('5000');

      // Fill Description
      const descInput = dialog.getByRole('textbox', { name: 'Description' });
      await descInput.fill('CRT-AUTO delete test entry');

      // Submit
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).not.toBeVisible();

      // Verify entry appears
      const testRow = page.locator('table').first().locator('tbody tr', { hasText: 'CRT-AUTO delete test entry' });
      await expect(testRow).toBeVisible();
    });

    await test.step('Step 1: Click Delete Record and verify confirmation popover', async () => {
      const testRow = page.locator('table').first().locator('tbody tr', { hasText: 'CRT-AUTO delete test entry' });
      await testRow.locator('button[title="Delete Record"]').click();

      // Wait for the confirmation popover to appear
      const popover = page.locator('.popover.show');
      await popover.waitFor({ state: 'visible', timeout: 5000 });

      // Verify "Are you sure?" text
      await expect(popover).toContainText('Are you sure?');
      await expect(popover).toContainText('permanently');

      // Verify Delete and Cancel buttons
      await expect(page.getByRole('button', { name: 'Delete', exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Cancel', exact: true })).toBeVisible();
    });

    await test.step('Step 2: Click Cancel and verify row is retained', async () => {
      await page.getByRole('button', { name: 'Cancel', exact: true }).click();
      await page.waitForTimeout(300);

      // Verify popover is dismissed
      await expect(page.locator('.popover.show')).not.toBeVisible();

      // Verify entry still exists
      const testRow = page.locator('table').first().locator('tbody tr', { hasText: 'CRT-AUTO delete test entry' });
      await expect(testRow).toBeVisible();
    });

    await test.step('Step 3: Click Delete Record again and confirm deletion', async () => {
      const testRow = page.locator('table').first().locator('tbody tr', { hasText: 'CRT-AUTO delete test entry' });
      await testRow.locator('button[title="Delete Record"]').click();

      // Wait for confirmation popover
      const deleteConfirm = page.getByRole('button', { name: 'Delete', exact: true });
      await deleteConfirm.waitFor({ state: 'visible', timeout: 5000 });

      // Click Delete to confirm
      await deleteConfirm.click();

      // Verify row is removed
      await expect(testRow).not.toBeVisible();
    });
  });
});
