/**
 * ============================================================================
 * 09-BVT-Smoke-Tests - TC-TS-BVT-TEND-01: Create project with tender and Qty/Accmp data
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-BVT-TEND-01-tender-qty-create.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-tend-01-tender-qty-create.spec.ts --headed
 * Headless:               npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-tend-01-tender-qty-create.spec.ts
 * Debug:                  npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-tend-01-tender-qty-create.spec.ts --debug
 * Specific Test:          npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-tend-01-tender-qty-create.spec.ts -g "Create project with tender" --headed
 *
 * OVERVIEW:
 * Build Verification Test confirming the full workflow: navigate to project tender
 * page, add a tender entry, add a Qty/Accomplishment entry, then verify both
 * display correctly and clean up.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Tender Creation:
 *    ✅ "+ Add" opens "Add Tender Details" dialog
 *    ✅ Tender Number and Bid Value can be filled
 *    ✅ Submission creates the entry in the table
 *    ✅ Table shows tender number and formatted bid value
 *
 * 2. Qty/Accomplishment Creation:
 *    ✅ "+ Add" opens "Add Quantities and Accomplishments" dialog
 *    ✅ Fiscal Year, Quantity type, and specific item can be selected
 *    ✅ Forecast value can be entered
 *    ✅ Submission creates the entry in the Qty table
 *
 * 3. Cleanup:
 *    ✅ Both entries can be deleted via popover confirmation
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-BVT-TEND-01 — BVT: Create project with tender and Qty/Accmp data', () => {
  test.setTimeout(180_000);

  const tenderNumber = `BVT-T${Date.now().toString().slice(-6)}`;

  test('Create project with tender and Qty/Accmp data', async ({ page }) => {
    let projectTenderUrl = '';
    let selectedFiscalYear = '';

    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    await test.step('Step 1: Navigate to Tender Details tab', async () => {
      // Discover first project dynamically
      await page.goto('/projects');
      await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30_000 });
      const firstLink = page.locator('table tbody tr td:nth-child(2) a').first();
      const href = await firstLink.getAttribute('href');
      projectTenderUrl = `${href}/projecttender`;

      await page.goto(projectTenderUrl);

      // Verify tender table is visible with expected headers
      const tenderTable = page.locator('table').first();
      await expect(tenderTable.locator('th:has-text("Tender #")')).toBeVisible({ timeout: 30_000 });
    });

    await test.step('Step 2: Add Tender entry', async () => {
      // Click first "+ Add" button (Tender section)
      await page.locator('button:has-text("+ Add")').first().dispatchEvent('click');

      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible({ timeout: 15_000 });

      // Fill Tender Number
      await dialog.locator('input[name="tenderNumber"]').fill(tenderNumber);

      // Fill Bid Value ($1,000,000)
      await dialog.getByRole('textbox', { name: 'Winning Bid' }).fill('1000000');

      // Submit
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });

      // Verify tender appears in table
      const tenderTable = page.locator('table').first();
      const tenderRow = tenderTable.locator(`tbody tr:has-text("${tenderNumber}")`);
      await expect(tenderRow).toBeVisible({ timeout: 15_000 });

      const rowText = await tenderRow.textContent();
      expect(rowText).toContain('$1,000,000');
    });

    await test.step('Step 3: Add Qty/Accomplishment entry', async () => {
      // Click Qty "+ Add" button (identified by its unique title)
      await page.getByTitle('Add Quantity or Accomplishment').dispatchEvent('click');

      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible({ timeout: 15_000 });

      // Select Fiscal Year (first available option; capture the value for later assertions)
      await dialog.locator('button.dropdown-toggle').nth(0).click();
      const fyMenu = page.locator('.dropdown-menu.show');
      await expect(fyMenu).toBeVisible({ timeout: 5_000 });
      const fyFirstItem = fyMenu.locator('button.dropdown-item').first();
      selectedFiscalYear = ((await fyFirstItem.textContent()) ?? '').trim();
      expect(selectedFiscalYear).toBeTruthy();
      await fyFirstItem.click();
      await expect(fyMenu).toBeHidden({ timeout: 5_000 });

      // Select "Quantity" type
      await dialog.locator('button.dropdown-toggle').nth(1).click();
      const typeMenu = page.locator('.dropdown-menu.show');
      await expect(typeMenu).toBeVisible({ timeout: 5_000 });
      await typeMenu.locator('button.dropdown-item').filter({ hasText: 'Quantity' }).first().click();
      await expect(typeMenu).toBeHidden({ timeout: 5_000 });

      // Select first specific Quantity item (populated after type selection)
      await dialog.locator('button.dropdown-toggle').nth(2).click();
      const itemMenu = page.locator('.dropdown-menu.show');
      await expect(itemMenu.locator('button.dropdown-item').first()).toBeVisible({ timeout: 10_000 });
      await itemMenu.locator('button.dropdown-item').first().click();

      // Fill Forecast = 5
      await dialog.getByRole('textbox', { name: 'Forecast' }).fill('5');

      // Submit
      await dialog.getByRole('button', { name: 'Submit' }).dispatchEvent('click');
      await expect(dialog).toBeHidden({ timeout: 10_000 });

      // Verify Qty/Accmp entry appears in table
      const qtyTable = page.locator('table').nth(1);
      const qtyRow = qtyTable.locator(`tbody tr:has-text("${selectedFiscalYear}")`).first();
      await expect(qtyRow).toBeVisible({ timeout: 15_000 });

      const qtyText = await qtyRow.textContent();
      expect(qtyText).toContain('5');
    });

    await test.step('Step 4: Cleanup - delete Qty/Accmp and Tender entries', async () => {
      // Delete Qty entry
      const qtyTable = page.locator('table').nth(1);
      const qtyRow = qtyTable.locator(`tbody tr:has-text("${selectedFiscalYear}")`).first();
      await qtyRow.locator('button[title="Delete Record"]').click();
      const popover1 = page.locator('[role="tooltip"]');
      await expect(popover1).toBeVisible({ timeout: 5_000 });
      await popover1.getByRole('button', { name: 'Delete' }).dispatchEvent('click');
      await expect(qtyRow).toBeHidden({ timeout: 10_000 });

      // Delete Tender entry
      const tenderTable = page.locator('table').first();
      const tenderRow = tenderTable.locator(`tbody tr:has-text("${tenderNumber}")`);
      await tenderRow.locator('button[title="Delete Record"]').click();
      const popover2 = page.locator('[role="tooltip"]');
      await expect(popover2).toBeVisible({ timeout: 5_000 });
      await popover2.getByRole('button', { name: 'Delete' }).dispatchEvent('click');
      await expect(tenderRow).toBeHidden({ timeout: 10_000 });
    });
  });
});
