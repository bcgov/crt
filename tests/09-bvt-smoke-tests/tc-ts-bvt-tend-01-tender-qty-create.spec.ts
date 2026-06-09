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

  const projectId = 81;
  const tenderNumber = `BVT-T${Date.now().toString().slice(-6)}`;

  test('Create project with tender and Qty/Accmp data', async ({ page }) => {
    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    await test.step('Step 1: Navigate to Tender Details tab', async () => {
      await page.goto(`/projects/${projectId}/projecttender`);
      await page.waitForTimeout(3000);

      // Verify tender table is visible with expected headers
      const tenderTable = page.locator('table').first();
      await expect(tenderTable.locator('th:has-text("Tender #")')).toBeVisible();
    });

    await test.step('Step 2: Add Tender entry', async () => {
      // Click first "+ Add" button (Tender)
      await page.locator('button:has-text("+ Add"):visible').first().click();
      await page.waitForTimeout(1000);

      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();

      // Fill Tender Number
      await dialog.locator('input[name="tenderNumber"]').fill(tenderNumber);

      // Fill Bid Value ($1,000,000) - use visible textbox (dual-input currency)
      await dialog.getByRole('textbox', { name: 'Winning Bid' }).fill('1000000');
      await page.waitForTimeout(200);

      // Submit
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await page.waitForTimeout(3000);

      // Verify tender appears in table
      const tenderTable = page.locator('table').first();
      const tenderRow = tenderTable.locator(`tbody tr:has-text("${tenderNumber}")`);
      await expect(tenderRow).toBeVisible();

      const rowText = await tenderRow.textContent();
      expect(rowText).toContain('$1,000,000');
    });

    await test.step('Step 3: Add Qty/Accomplishment entry', async () => {
      // Click the Qty "+ Add" button using evaluate (avoids modal interception)
      await page.evaluate(() => {
        const btn = document.querySelector('button[title="Add Quantity or Accomplishment"]');
        if (btn) (btn as HTMLElement).click();
      });
      await page.waitForTimeout(1000);

      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();

      // Select Fiscal Year "2024/2025" (dropdown index 0)
      await page.evaluate(() => {
        const dlg = document.querySelector('[role="dialog"]');
        dlg!.querySelectorAll('button.dropdown-toggle')[0].click();
      });
      await page.waitForTimeout(500);
      await page.evaluate(() => {
        const items = document.querySelectorAll('.dropdown-menu.show button.dropdown-item');
        for (const item of items) {
          if (item.textContent!.includes('2024/2025')) {
            (item as HTMLElement).click();
            return;
          }
        }
      });
      await page.waitForTimeout(500);

      // Select "Quantity" type (dropdown index 1)
      await page.evaluate(() => {
        const dlg = document.querySelector('[role="dialog"]');
        dlg!.querySelectorAll('button.dropdown-toggle')[1].click();
      });
      await page.waitForTimeout(500);
      await page.evaluate(() => {
        const items = document.querySelectorAll('.dropdown-menu.show button.dropdown-item');
        for (const item of items) {
          if (item.textContent!.includes('Quantity')) {
            (item as HTMLElement).click();
            return;
          }
        }
      });
      await page.waitForTimeout(1000);

      // Select first specific Quantity item (dropdown index 2)
      await page.evaluate(() => {
        const dlg = document.querySelector('[role="dialog"]');
        dlg!.querySelectorAll('button.dropdown-toggle')[2].click();
      });
      await page.waitForTimeout(500);
      await page.evaluate(() => {
        const items = document.querySelectorAll('.dropdown-menu.show button.dropdown-item');
        if (items.length > 0) (items[0] as HTMLElement).click();
      });
      await page.waitForTimeout(300);

      // Fill Forecast = 5 (dual-input number field)
      await dialog.getByRole('textbox', { name: 'Forecast' }).fill('5');

      // Submit via evaluate
      await page.evaluate(() => {
        const dlg = document.querySelector('[role="dialog"]');
        const submit = dlg!.querySelector('button[type="submit"]');
        if (submit) (submit as HTMLElement).click();
      });
      await page.waitForTimeout(3000);

      // Verify Qty/Accmp entry appears in table
      const qtyTable = page.locator('table').nth(1);
      const qtyRow = qtyTable.locator('tbody tr:has-text("2024/2025")');
      await expect(qtyRow).toBeVisible();

      const qtyText = await qtyRow.textContent();
      expect(qtyText).toContain('5');
    });

    await test.step('Step 4: Cleanup - delete Qty/Accmp and Tender entries', async () => {
      // Delete Qty entry
      const qtyTable = page.locator('table').nth(1);
      await qtyTable.locator('tbody tr').first().locator('button[title="Delete Record"]').evaluate((el) => el.click());
      await page.waitForTimeout(500);
      await page.evaluate(() => {
        const popovers = document.querySelectorAll('.popover');
        for (const p of popovers) {
          const btns = p.querySelectorAll('button');
          for (const btn of btns) {
            if (btn.textContent && btn.textContent.trim() === 'Delete') {
              btn.click();
              return;
            }
          }
        }
      });
      await page.waitForTimeout(2000);

      // Delete Tender entry
      const tenderTable = page.locator('table').first();
      await tenderTable.locator(`tbody tr:has-text("${tenderNumber}")`).locator('button[title="Delete Record"]').evaluate((el) => el.click());
      await page.waitForTimeout(500);
      await page.evaluate(() => {
        const popovers = document.querySelectorAll('.popover');
        for (const p of popovers) {
          const btns = p.querySelectorAll('button');
          for (const btn of btns) {
            if (btn.textContent && btn.textContent.trim() === 'Delete') {
              btn.click();
              return;
            }
          }
        }
      });
      await page.waitForTimeout(2000);

      // Verify both tables are empty
      expect(await tenderTable.locator(`tbody tr:has-text("${tenderNumber}")`).count()).toBe(0);
      expect(await qtyTable.locator('tbody tr:has-text("2024/2025")').count()).toBe(0);
    });
  });
});
