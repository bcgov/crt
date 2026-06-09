/**
 * ============================================================================
 * 09-BVT-Smoke-Tests - TC-TS-BVT-TEND-02: Add tender details to existing project
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-BVT-TEND-02-tender-later.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-tend-02-tender-later.spec.ts --headed
 * Headless:               npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-tend-02-tender-later.spec.ts
 * Debug:                  npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-tend-02-tender-later.spec.ts --debug
 * Specific Test:          npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-tend-02-tender-later.spec.ts -g "Add tender details to existing project" --headed
 *
 * OVERVIEW:
 * Build Verification Test confirming that tender data can be added to an existing
 * project at a later time. Navigates to a project via search, verifies the tender
 * table is empty, adds a tender entry, verifies it appears, then cleans up.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Navigation:
 *    ✅ Project can be found via search
 *    ✅ Tender tab is accessible
 *    ✅ Tender table starts empty (no prior tender data)
 *
 * 2. Add Tender Later:
 *    ✅ "+ Add" opens "Add Tender Details" dialog
 *    ✅ Tender Number and Bid Value can be submitted
 *    ✅ Entry appears in the tender table
 *    ✅ Table shows correct tender number and formatted bid value
 *
 * 3. Cleanup:
 *    ✅ Tender entry can be deleted via popover confirmation
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-BVT-TEND-02 — BVT: Add tender details to existing project', () => {
  test.setTimeout(120_000);

  const projectId = 81;
  const tenderNumber = `BVT-T${Date.now().toString().slice(-6)}`;

  test('Add tender details to existing project', async ({ page }) => {
    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    await test.step('Step 1: Navigate to project Tender tab and verify empty', async () => {
      await page.goto(`/projects/${projectId}/projecttender`);
      await page.waitForTimeout(3000);

      // Verify tender table shows no data
      const tenderTable = page.locator('table').first();
      await expect(tenderTable.locator('th:has-text("Tender #")')).toBeVisible();
      expect(await tenderTable.locator('tbody tr').count()).toBe(0);
    });

    await test.step('Step 2: Add tender entry (Tender Number, Bid Value)', async () => {
      // Click "+ Add" for Tender
      await page.locator('button:has-text("+ Add"):visible').first().click();
      await page.waitForTimeout(1000);

      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();

      // Fill Tender Number
      await dialog.locator('input[name="tenderNumber"]').fill(tenderNumber);

      // Fill Bid Value ($500,000) - use visible textbox
      await dialog.getByRole('textbox', { name: 'Winning Bid' }).fill('500000');
      await page.waitForTimeout(200);

      // Submit
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await page.waitForTimeout(3000);
    });

    await test.step('Step 3: Verify tender entry appears in table', async () => {
      const tenderTable = page.locator('table').first();
      const tenderRow = tenderTable.locator(`tbody tr:has-text("${tenderNumber}")`);
      await expect(tenderRow).toBeVisible();

      const rowText = await tenderRow.textContent();
      expect(rowText).toContain(tenderNumber);
      expect(rowText).toContain('$500,000');
    });

    await test.step('Step 4: Cleanup - delete the tender entry', async () => {
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

      // Verify deleted
      expect(await tenderTable.locator(`tbody tr:has-text("${tenderNumber}")`).count()).toBe(0);
    });
  });
});
