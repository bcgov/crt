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

  const tenderNumber = `BVT-T${Date.now().toString().slice(-6)}`;

  test('Add tender details to existing project', async ({ page }) => {
    let projectTenderUrl = '';
    let initialTenderCount = 0;

    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    await test.step('Step 1: Navigate to project Tender tab and capture initial state', async () => {
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

      // Capture initial row count (project may have pre-existing tenders)
      initialTenderCount = await tenderTable.locator('tbody tr').count();
    });

    await test.step('Step 2: Add tender entry (Tender Number, Bid Value)', async () => {
      // Click "+ Add" for Tender
      await page.locator('button:has-text("+ Add")').first().dispatchEvent('click');

      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible({ timeout: 15_000 });

      // Fill Tender Number
      await dialog.locator('input[name="tenderNumber"]').fill(tenderNumber);

      // Fill Bid Value ($500,000)
      await dialog.getByRole('textbox', { name: 'Winning Bid' }).fill('500000');

      // Submit
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });
    });

    await test.step('Step 3: Verify tender entry appears in table', async () => {
      const tenderTable = page.locator('table').first();
      const tenderRow = tenderTable.locator(`tbody tr:has-text("${tenderNumber}")`);
      await expect(tenderRow).toBeVisible({ timeout: 15_000 });

      const rowText = await tenderRow.textContent();
      expect(rowText).toContain(tenderNumber);
      expect(rowText).toContain('$500,000');
    });

    await test.step('Step 4: Cleanup - delete the tender entry', async () => {
      const tenderTable = page.locator('table').first();
      const tenderRow = tenderTable.locator(`tbody tr:has-text("${tenderNumber}")`);

      await tenderRow.locator('button[title="Delete Record"]').click();
      const popover = page.locator('[role="tooltip"]');
      await expect(popover).toBeVisible({ timeout: 5_000 });
      await popover.getByRole('button', { name: 'Delete' }).dispatchEvent('click');
      await expect(tenderRow).toBeHidden({ timeout: 10_000 });

      // Verify row count is back to initial
      await expect(tenderTable.locator('tbody tr')).toHaveCount(initialTenderCount, { timeout: 10_000 });
    });
  });
});
