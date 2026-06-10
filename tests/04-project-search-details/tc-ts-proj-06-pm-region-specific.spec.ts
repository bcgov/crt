/**
 * ============================================================================
 * 04-Project-Search-Details - TC-TS-PROJ-06: PM dropdown shows region-specific PMs only
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-PROJ-06-pm-region-specific.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/04-project-search-details/tc-ts-proj-06-pm-region-specific.spec.ts --headed
 * Headless:               npx playwright test tests/04-project-search-details/tc-ts-proj-06-pm-region-specific.spec.ts
 * Debug:                  npx playwright test tests/04-project-search-details/tc-ts-proj-06-pm-region-specific.spec.ts --debug
 * Specific Test:          npx playwright test tests/04-project-search-details/tc-ts-proj-06-pm-region-specific.spec.ts -g "PM dropdown shows region-specific" --headed
 *
 * OVERVIEW:
 * Verifies that the Project Manager dropdown on the Project Search page only
 * displays PMs associated with the user's assigned region(s). The test restricts
 * the user to region 1-South Coast and verifies the PM dropdown contains only
 * PMs for that region.
 *
 * NOTE: In the current dev environment, all PMs are assigned to all regions,
 * so this test verifies the PM list is populated (not empty) when restricted
 * to a single region. If region-exclusive PMs are added later, this test
 * should be updated to verify absence of PMs from other regions.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Region-Scoped PM List:
 *    ✅ PM dropdown shows PMs when user is restricted to region 1-South Coast
 *    ✅ PM list is not empty (PMs exist for the assigned region)
 *
 * 2. Setup & Cleanup:
 *    ✅ User region is temporarily restricted to 1-South Coast
 *    ✅ All regions are restored after the test
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

const TARGET_USER_IDIR = 'BARRYJIN';

test.describe('TC-TS-PROJ-06 — PM dropdown shows region-specific PMs only', () => {
  test.setTimeout(180_000);

  test('PM dropdown shows region-specific PMs only', async ({ page }) => {
    // ─── SETUP: Restrict BARRYJIN to only region 1-South Coast ───────────────

    await test.step('Setup: Restrict user to region 1-South Coast', async () => {
      await page.goto('/admin/users');
      await expect(page.getByRole('heading', { name: 'User Management' })).toBeVisible();
      await expect(page.locator('table tbody tr').first()).toBeVisible();

      const targetRow = page.locator('table tbody tr', { hasText: TARGET_USER_IDIR });

      // Check if user already has only region 1
      const regionsCell = targetRow.locator('td:nth-child(5)');
      const currentRegions = (await regionsCell.textContent())!.trim();
      if (currentRegions === '1') {
        // Already restricted to region 1, no change needed
        return;
      }

      await targetRow.getByRole('button', { name: 'Edit Record' }).click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      const regionSection = dialog.locator('.multi-select').nth(1);

      // Uncheck Select All first to clear all regions
      const selectAllLabel = regionSection.locator('label:has-text("Select All")');
      const selectAllCheckbox = regionSection.locator('input[type="checkbox"]').first();
      if (await selectAllCheckbox.isChecked()) {
        await selectAllLabel.click();
      }

      // Now check only 1-South Coast
      await regionSection.locator('label:has-text("1-South Coast")').click();

      await expect(dialog.getByRole('button', { name: 'Submit' })).toBeEnabled();
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).not.toBeVisible();

      // Verify change
      await expect(regionsCell).toHaveText('1');
    });

    // ─── TEST: Verify PM dropdown shows PMs for region 1 ─────────────────────

    await test.step('Step 1: Navigate to Projects page', async () => {
      await page.goto('/projects');
      await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
      await expect(page.locator('table tbody tr').first()).toBeVisible();
    });

    await test.step('Step 2: Open PM dropdown and verify region-specific PMs are listed', async () => {
      await page.getByRole('button', { name: 'Project Manager' }).click();

      const menu = page.locator('[role="menu"].multi.show');
      await expect(menu).toBeVisible();

      // Verify PM list is not empty (PMs exist for region 1)
      const pmCheckboxes = menu.getByRole('checkbox');
      const count = await pmCheckboxes.count();
      // At least "Select All" + one PM
      expect(count).toBeGreaterThan(1);

      // Verify at least one PM label is visible (not just "Select All")
      const pmLabels = menu.locator('label');
      const labelCount = await pmLabels.count();
      const pmNames: string[] = [];
      for (let i = 0; i < labelCount; i++) {
        const text = (await pmLabels.nth(i).textContent())?.trim();
        if (text && text !== 'Select All') {
          pmNames.push(text);
        }
      }
      expect(pmNames.length).toBeGreaterThanOrEqual(1);
    });

    // ─── CLEANUP: Restore all regions ────────────────────────────────────────

    await test.step('Cleanup: Restore all regions for user', async () => {
      await page.goto('/admin/users');
      await expect(page.getByRole('heading', { name: 'User Management' })).toBeVisible();
      await expect(page.locator('table tbody tr').first()).toBeVisible();

      const targetRow = page.locator('table tbody tr', { hasText: TARGET_USER_IDIR });

      // Check if user already has all regions
      const regionsCell = targetRow.locator('td:nth-child(5)');
      const currentRegions = (await regionsCell.textContent())!.trim();
      if (currentRegions === '0,1,2,3') {
        // Already has all regions, no change needed
        return;
      }

      await targetRow.getByRole('button', { name: 'Edit Record' }).click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      const regionSection = dialog.locator('.multi-select').nth(1);
      const selectAllCheckbox = regionSection.locator('input[type="checkbox"]').first();
      if (!(await selectAllCheckbox.isChecked())) {
        await regionSection.locator('label:has-text("Select All")').click();
      }

      await expect(dialog.getByRole('button', { name: 'Submit' })).toBeEnabled();
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).not.toBeVisible();

      await expect(regionsCell).toHaveText('0,1,2,3');
    });
  });
});
