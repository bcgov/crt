/**
 * ============================================================================
 * 09-BVT-Smoke-Tests - TC-TS-BVT-RAT-01: Add ratios manually
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-BVT-RAT-01-manual-ratios.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-rat-01-manual-ratios.spec.ts --headed
 * Headless:               npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-rat-01-manual-ratios.spec.ts
 * Debug:                  npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-rat-01-manual-ratios.spec.ts --debug
 * Specific Test:          npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-rat-01-manual-ratios.spec.ts -g "Add ratios manually" --headed
 *
 * OVERVIEW:
 * Build Verification Test confirming that administrative boundary ratios can
 * be added manually. Adds two Electoral District ratios that sum to 1.00 and
 * verifies both appear in the table. Then cleans up by deleting both entries.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Ratio Creation:
 *    ✅ Electoral District ratio can be added via "+ Add" dialog
 *    ✅ District dropdown shows available options
 *    ✅ Ratio value is accepted and saved
 *
 * 2. Multiple Ratios:
 *    ✅ Second ratio can be added for a different district
 *    ✅ Both ratios appear in the Electoral Districts table
 *    ✅ Ratios sum to 1.00 (no warning displayed)
 *
 * 3. Cleanup:
 *    ✅ Ratio entries can be deleted via popover confirmation
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-BVT-RAT-01 — BVT: Add ratios manually', () => {
  test.setTimeout(120_000);

  // projectId discovered dynamically at runtime

  test('Add ratios manually', async ({ page }) => {
    let projectId = 0;
    let initialRowCount = 0;

    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    await test.step('Step 1: Navigate to segments/ratios page', async () => {
      await page.goto('/projects');
      await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30000 });
      const href = await page.locator('table tbody tr td:nth-child(2) a').first().getAttribute('href');
      const match = href?.match(/\/projects\/(\d+)/);
      projectId = match ? parseInt(match[1]) : 0;
      expect(projectId).toBeGreaterThan(0);

      await page.goto(`${href}/segments`);
      await expect(page.locator('h1, h2, h3').first()).toBeVisible({ timeout: 30000 });

      // Defensive cleanup: remove any leftover ratio rows with values 0.6 or 0.4 from a prior run
      const edTable = page.locator('table').nth(1);
      for (const ratioText of ['0.6', '0.4']) {
        const leftover = edTable.locator(`tbody tr:has-text("${ratioText}")`);
        if (await leftover.isVisible()) {
          await leftover.locator('button[title="Delete Record"]').click();
          const popover = page.locator('[role="tooltip"]');
          await expect(popover).toBeVisible();
          await popover.getByRole('button', { name: 'Delete' }).dispatchEvent('click');
          await expect(leftover).toBeHidden({ timeout: 10_000 });
        }
      }
      initialRowCount = await edTable.locator('tbody tr').count();
    });

    await test.step('Step 2: Add first Electoral District ratio (0.60)', async () => {
      // Click "+ Add" for Electoral Districts (index 1 among visible "+ Add" buttons)
      const addBtns = page.locator('button:has-text("+ Add"):visible');
      await addBtns.nth(1).click();

      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();

      // Open district dropdown and select first option
      const ddToggle = dialog.locator('button.dropdown-toggle').first();
      await ddToggle.click();
      const ddMenu = page.locator('.dropdown-menu.show');
      await expect(ddMenu).toBeVisible({ timeout: 5000 });
      await ddMenu.locator('button.dropdown-item').first().click();

      // Fill ratio value
      await dialog.locator('input[name="ratio"]').fill('0.60');

      // Submit
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });

      // Verify entry appears in Electoral Districts table
      const edTable = page.locator('table').nth(1);
      await expect(edTable.locator('tbody tr').first()).toBeVisible({ timeout: 10_000 });
      const allText = await edTable.locator('tbody').textContent();
      expect(allText).toContain('0.6');
    });

    await test.step('Step 3: Add second Electoral District ratio (0.40)', async () => {
      const addBtns = page.locator('button:has-text("+ Add"):visible');
      await addBtns.nth(1).click();

      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();

      // Open district dropdown and select second option
      const ddToggle = dialog.locator('button.dropdown-toggle').first();
      await ddToggle.click();
      const ddMenu = page.locator('.dropdown-menu.show');
      await expect(ddMenu).toBeVisible({ timeout: 5000 });
      await ddMenu.locator('button.dropdown-item').nth(1).click();

      // Fill ratio value
      await dialog.locator('input[name="ratio"]').fill('0.40');

      // Submit
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });

      // Verify both ratio values are present in the table
      const edTable = page.locator('table').nth(1);
      const rowCount = await edTable.locator('tbody tr').count();
      expect(rowCount).toBe(initialRowCount + 2);
    });

    await test.step('Step 4: Verify ratios sum to 1.00 (no warning displayed)', async () => {
      // Check that no warning/danger text is visible on the page
      const warnings = page.locator('.text-danger:visible, .alert-danger:visible');
      expect(await warnings.count()).toBe(0);

      // Verify both ratio values
      const edTable = page.locator('table').nth(1);
      const allRowText = await edTable.locator('tbody').textContent();
      expect(allRowText).toContain('0.6');
      expect(allRowText).toContain('0.4');
    });

    await test.step('Step 5: Cleanup - delete both ratio entries', async () => {
      const edTable = page.locator('table').nth(1);

      // Delete by ratio value to avoid affecting pre-existing rows
      const row40 = edTable.locator('tbody tr:has-text("0.4")');
      await row40.locator('button[title="Delete Record"]').click();
      const popover40 = page.locator('[role="tooltip"]');
      await expect(popover40).toBeVisible();
      await popover40.getByRole('button', { name: 'Delete' }).dispatchEvent('click');
      await expect(row40).toBeHidden({ timeout: 10_000 });

      const row60 = edTable.locator('tbody tr:has-text("0.6")');
      await row60.locator('button[title="Delete Record"]').click();
      const popover60 = page.locator('[role="tooltip"]');
      await expect(popover60).toBeVisible();
      await popover60.getByRole('button', { name: 'Delete' }).dispatchEvent('click');
      await expect(row60).toBeHidden({ timeout: 10_000 });

      // Verify row count returned to initial
      const finalRows = await edTable.locator('tbody tr').count();
      expect(finalRows).toBe(initialRowCount);
    });
  });
});
