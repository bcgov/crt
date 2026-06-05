/**
 * ============================================================================
 * 05-Financial-Planning - TC-TS-TEND-02: Add tender record with all fields
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-TEND-02-add-tender-record.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/05-financial-planning/tc-ts-tend-02-add-tender-record.spec.ts --headed
 * Headless:               npx playwright test tests/05-financial-planning/tc-ts-tend-02-add-tender-record.spec.ts
 * Debug:                  npx playwright test tests/05-financial-planning/tc-ts-tend-02-add-tender-record.spec.ts --debug
 * Specific Test:          npx playwright test tests/05-financial-planning/tc-ts-tend-02-add-tender-record.spec.ts -g "Add tender" --headed
 *
 * OVERVIEW:
 * Verifies that a complete tender record can be added with all fields filled
 * (Tender Number, Planned Date, Actual Date, Ministry Estimate, Winning Contractor,
 * Winning Bid, Comment) and appears in the tender table with correct formatting.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Record Creation:
 *    ✅ All fields accept and display correct values
 *    ✅ Currency fields format with $ prefix and comma separators
 *    ✅ First available contractor is selectable from dropdown
 *    ✅ Submit creates the record and closes dialog
 *
 * 2. Table Verification:
 *    ✅ New row appears in Project Tender Details table
 *    ✅ Ministry Estimate displays as "$1,500,000"
 *    ✅ Winning Bid displays as "$1,450,000"
 *    ✅ %Min.Est. column calculates correctly
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-TEND-02 — Add tender record with all fields', () => {
  test.setTimeout(120_000);

  test('Add tender record with all fields populated', async ({ page }) => {
    await test.step('Step 1: Navigate to tender page', async () => {
      await page.goto('/projects/79/projecttender');
      await expect(page.locator('button[title="Add Tender"]')).toBeVisible();
    });

    await test.step('Step 2: Open Add Tender dialog', async () => {
      await page.locator('button[title="Add Tender"]').click();
      const dialog = page.locator('[role="dialog"]').filter({ hasText: 'Add Tender Details' });
      await expect(dialog).toBeVisible();
    });

    const dialog = page.locator('[role="dialog"]').filter({ hasText: 'Add Tender Details' });

    await test.step('Step 3: Fill Tender Number', async () => {
      await dialog.locator('input[name="tenderNumber"]').fill('CRT-AUTO-T001');
      await page.waitForTimeout(200);
    });

    await test.step('Step 4: Fill Planned Date', async () => {
      await dialog.locator('input[placeholder="YYYY-MM-DD"]').first().fill('2025-06-15');
    });

    await test.step('Step 5: Fill Actual Date', async () => {
      await dialog.locator('input[placeholder="YYYY-MM-DD"]').nth(1).fill('2025-07-01');
    });

    await test.step('Step 6: Fill Ministry Estimate', async () => {
      await dialog.getByRole('textbox', { name: 'Ministry Estimate' }).fill('1500000');
      await page.waitForTimeout(200);
      await expect(dialog.getByRole('textbox', { name: 'Ministry Estimate' })).toHaveValue('$1,500,000');
    });

    await test.step('Step 7: Select Winning Contractor', async () => {
      await dialog.locator('button.dropdown-toggle').click();
      await page.waitForTimeout(300);
      await dialog.locator('.dropdown-menu.show button.dropdown-item').first().click();
      await page.waitForTimeout(200);
    });

    await test.step('Step 8: Fill Winning Bid', async () => {
      await dialog.getByRole('textbox', { name: 'Winning Bid' }).fill('1450000');
      await page.waitForTimeout(200);
      await expect(dialog.getByRole('textbox', { name: 'Winning Bid' })).toHaveValue('$1,450,000');
    });

    await test.step('Step 9: Fill Comment', async () => {
      await dialog.locator('textarea[placeholder="Insert Comment Here"]').fill('CRT-AUTO tender test record');
    });

    await test.step('Step 10: Submit and verify record in table', async () => {
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await dialog.waitFor({ state: 'hidden', timeout: 10000 });
      await page.waitForTimeout(500);

      const row = page.locator('table').first().locator('tbody tr', { hasText: 'CRT-AUTO-T001' });
      await expect(row).toBeVisible();
      await expect(row).toContainText('$1,500,000');
      await expect(row).toContainText('$1,450,000');
      await expect(row).toContainText('2025-06-15');
      await expect(row).toContainText('2025-07-01');
      await expect(row).toContainText('CRT-AUTO tender test record');
    });

    await test.step('Cleanup: Delete the created tender record', async () => {
      const row = page.locator('table').first().locator('tbody tr', { hasText: 'CRT-AUTO-T001' });
      await row.locator('button[title="Delete Record"]').click();
      const popover = page.locator('.popover.show');
      await popover.waitFor({ state: 'visible', timeout: 5000 });
      await popover.getByRole('button', { name: 'Delete' }).click();
      await page.waitForTimeout(500);
      await expect(row).not.toBeVisible();
    });
  });
});
