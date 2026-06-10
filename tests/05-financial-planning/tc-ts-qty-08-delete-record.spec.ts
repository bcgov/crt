/**
 * ============================================================================
 * 05-Financial-Planning - TC-TS-QTY-08: Delete Qty/Accmp record with "Are you sure?" prompt
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-QTY-08-delete-record.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/05-financial-planning/tc-ts-qty-08-delete-record.spec.ts --headed
 * Headless:               npx playwright test tests/05-financial-planning/tc-ts-qty-08-delete-record.spec.ts
 * Debug:                  npx playwright test tests/05-financial-planning/tc-ts-qty-08-delete-record.spec.ts --debug
 * Specific Test:          npx playwright test tests/05-financial-planning/tc-ts-qty-08-delete-record.spec.ts -g "Delete Qty/Accmp" --headed
 *
 * OVERVIEW:
 * Verifies that deleting a Quantity/Accomplishment record requires confirmation
 * via an "Are you sure?" popover. Canceling retains the record; confirming removes it.
 * A test entry is created first to avoid destroying existing data.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Delete Confirmation:
 *    ✅ Clicking Delete Record shows "Are you sure?" popover
 *    ✅ Popover contains "permanently delete" warning
 *    ✅ Popover has Delete and Cancel buttons
 *
 * 2. Cancel Flow:
 *    ✅ Clicking Cancel dismisses the popover
 *    ✅ The entry row remains in the table
 *
 * 3. Confirm Flow:
 *    ✅ Clicking Delete in the popover removes the record
 *    ✅ The entry row is no longer visible
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-QTY-08 — Delete Qty/Accmp record with "Are you sure?" prompt', () => {
  test.setTimeout(180_000);

  test.beforeEach(async ({ page }) => {
    // Navigate to the first project's tender page dynamically
    await page.goto('/projects');
    await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30000 });
    const projectLink = page.locator('table tbody tr').first().locator('td:nth-child(2) a');
    const projectUrl = await projectLink.getAttribute('href');
    await page.goto(`${projectUrl}/projecttender`);
    await expect(page.locator('h1', { hasText: 'Quantities/Accomplishments' })).toBeVisible();
  });

  test('Delete Qty/Accmp record with Are you sure prompt', async ({ page }) => {
    await test.step('Setup: Create a test entry to delete', async () => {
      await page.locator('button[title="Add Quantity or Accomplishment"]').click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      // Select Fiscal Year 2024/2025
      await dialog.locator('button.dropdown-toggle').first().click();
      await dialog.locator('.dropdown-menu.show button.dropdown-item', { hasText: '2024/2025' }).click();

      // Select Accomplishment
      await dialog.locator('button.dropdown-toggle').nth(1).click();
      await dialog.locator('.dropdown-menu.show button.dropdown-item', { hasText: 'Accomplishment' }).click();
      await page.waitForTimeout(300);

      // Select type
      await dialog.locator('button.dropdown-toggle').nth(2).click();
      await page.waitForTimeout(300);
      await dialog.locator('.dropdown-menu.show button.dropdown-item').first().click();
      await page.waitForTimeout(200);

      // Fill fields
      await dialog.getByRole('textbox', { name: 'Forecast' }).fill('99.999');
      await dialog.getByPlaceholder('Insert Comment Here').fill('CRT-AUTO delete test qty entry');

      // Submit
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).not.toBeVisible();

      // Verify entry exists
      const testRow = page.locator('table').nth(1).locator('tbody tr', { hasText: 'CRT-AUTO delete test qty entry' });
      await expect(testRow).toBeVisible();
    });

    await test.step('Step 1: Click Delete Record and verify confirmation popover', async () => {
      const testRow = page.locator('table').nth(1).locator('tbody tr', { hasText: 'CRT-AUTO delete test qty entry' });
      await testRow.locator('button[title="Delete Record"]').click();

      // Wait for the confirmation popover
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
      const testRow = page.locator('table').nth(1).locator('tbody tr', { hasText: 'CRT-AUTO delete test qty entry' });
      await expect(testRow).toBeVisible();
    });

    await test.step('Step 3: Click Delete Record again and confirm deletion', async () => {
      const testRow = page.locator('table').nth(1).locator('tbody tr', { hasText: 'CRT-AUTO delete test qty entry' });
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
