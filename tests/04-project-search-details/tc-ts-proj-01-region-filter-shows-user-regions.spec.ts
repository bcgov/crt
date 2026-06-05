/**
 * ============================================================================
 * 04-Project-Search-Details - TC-TS-PROJ-01: Region filter shows only user's assigned regions
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-PROJ-01-region-filter-shows-user-regions.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/04-project-search-details/tc-ts-proj-01-region-filter-shows-user-regions.spec.ts --headed
 * Headless:               npx playwright test tests/04-project-search-details/tc-ts-proj-01-region-filter-shows-user-regions.spec.ts
 * Debug:                  npx playwright test tests/04-project-search-details/tc-ts-proj-01-region-filter-shows-user-regions.spec.ts --debug
 * Specific Test:          npx playwright test tests/04-project-search-details/tc-ts-proj-01-region-filter-shows-user-regions.spec.ts -g "Region filter" --headed
 *
 * OVERVIEW:
 * Verifies that the Regions dropdown on the Project Search page only displays
 * regions assigned to the logged-in user. Since we only have one test account
 * (BARRYJIN) with all regions, the test first modifies the user's region
 * assignment via Admin -> Users to only have "1-South Coast", then verifies
 * the Projects Regions filter, and finally restores all regions.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Region Filter Isolation:
 *    ✅ Regions dropdown only shows the user's assigned region (1-South Coast)
 *    ✅ Regions not assigned (0-Headquarters, 2-Southern Interior, 3-Northern) are absent
 *
 * 2. Setup & Cleanup:
 *    ✅ User region is temporarily restricted to 1-South Coast via Admin
 *    ✅ All regions are restored after the test completes
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

const TARGET_USER_IDIR = 'BARRYJIN';

test.describe('TC-TS-PROJ-01 — Region filter shows only user\'s assigned regions', () => {
  test.setTimeout(180_000);

  test('Region filter shows only user\'s assigned regions', async ({ page }) => {
    // ─── SETUP: Restrict BARRYJIN to only region 1-South Coast ───────────────

    await test.step('Setup: Navigate to Admin > Users and edit BARRYJIN', async () => {
      await page.goto('/admin/users');
      await expect(page.getByRole('heading', { name: 'User Management' })).toBeVisible();
      await expect(page.locator('table tbody tr').first()).toBeVisible();

      // Find the BARRYJIN row and click Edit
      const targetRow = page.locator('table tbody tr', { hasText: TARGET_USER_IDIR });
      await expect(targetRow).toBeVisible();
      await targetRow.getByRole('button', { name: 'Edit Record' }).click();

      // Verify the Edit User dialog opens
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('.modal-title')).toHaveText('Edit User');
    });

    await test.step('Setup: Uncheck all regions except 1-South Coast', async () => {
      const dialog = page.locator('[role="dialog"]');
      const regionSection = dialog.locator('.multi-select').nth(1);

      // Uncheck "Select All" first if it's checked (this will uncheck all)
      const selectAllCheckbox = regionSection.locator('input[type="checkbox"]').first();
      if (await selectAllCheckbox.isChecked()) {
        await regionSection.locator('label:has-text("Select All")').click();
      }

      // Now check only "1-South Coast"
      const southCoastCheckbox = regionSection.locator('input[type="checkbox"]').nth(2); // 0=SelectAll, 1=0-HQ, 2=1-SC
      if (!(await southCoastCheckbox.isChecked())) {
        await regionSection.locator('label:has-text("1-South Coast")').click();
      }

      // Verify state: only 1-South Coast is checked
      await expect(regionSection.locator('input[type="checkbox"]').nth(1)).not.toBeChecked(); // 0-HQ
      await expect(regionSection.locator('input[type="checkbox"]').nth(2)).toBeChecked(); // 1-SC
      await expect(regionSection.locator('input[type="checkbox"]').nth(3)).not.toBeChecked(); // 2-SI
      await expect(regionSection.locator('input[type="checkbox"]').nth(4)).not.toBeChecked(); // 3-N
    });

    await test.step('Setup: Submit the user edit to save region restriction', async () => {
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog.getByRole('button', { name: 'Submit' })).toBeEnabled();
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).not.toBeVisible();

      // Verify the change is reflected in the table
      const targetRow = page.locator('table tbody tr', { hasText: TARGET_USER_IDIR });
      const regionsCell = targetRow.locator('td:nth-child(5)');
      await expect(regionsCell).toHaveText('1');
    });

    // ─── TEST: Verify Projects page Regions dropdown ─────────────────────────

    await test.step('Step 1: Navigate to Projects page', async () => {
      await page.goto('/projects');
      await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
    });

    await test.step('Step 2: Click Regions button and verify only 1-South Coast is shown', async () => {
      // Click the Regions dropdown button
      await page.getByRole('button', { name: 'Regions' }).click();

      // Wait for the Regions dropdown menu to appear (it gets the "show" class when open)
      const menu = page.locator('[role="menu"].multi.show');
      await expect(menu).toBeVisible();

      // Verify "1-South Coast" IS present in the dropdown
      await expect(menu.getByText('1-South Coast')).toBeVisible();

      // Verify other regions are NOT present in the dropdown
      await expect(menu.getByText('0-Headquarters')).toHaveCount(0);
      await expect(menu.getByText('2-Southern Interior')).toHaveCount(0);
      await expect(menu.getByText('3-Northern')).toHaveCount(0);
    });

    // ─── CLEANUP: Restore all regions for BARRYJIN ───────────────────────────

    await test.step('Cleanup: Navigate to Admin > Users and edit BARRYJIN', async () => {
      await page.goto('/admin/users');
      await expect(page.getByRole('heading', { name: 'User Management' })).toBeVisible();
      await expect(page.locator('table tbody tr').first()).toBeVisible();

      const targetRow = page.locator('table tbody tr', { hasText: TARGET_USER_IDIR });
      await expect(targetRow).toBeVisible();
      await targetRow.getByRole('button', { name: 'Edit Record' }).click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('.modal-title')).toHaveText('Edit User');
    });

    await test.step('Cleanup: Check "Select All" to restore all regions', async () => {
      const dialog = page.locator('[role="dialog"]');
      const regionSection = dialog.locator('.multi-select').nth(1);

      // Click "Select All" to re-check all regions
      const selectAllCheckbox = regionSection.locator('input[type="checkbox"]').first();
      if (!(await selectAllCheckbox.isChecked())) {
        await regionSection.locator('label:has-text("Select All")').click();
      }

      // Verify all regions are checked
      await expect(regionSection.locator('input[type="checkbox"]').nth(1)).toBeChecked(); // 0-HQ
      await expect(regionSection.locator('input[type="checkbox"]').nth(2)).toBeChecked(); // 1-SC
      await expect(regionSection.locator('input[type="checkbox"]').nth(3)).toBeChecked(); // 2-SI
      await expect(regionSection.locator('input[type="checkbox"]').nth(4)).toBeChecked(); // 3-N
    });

    await test.step('Cleanup: Submit to restore all regions', async () => {
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog.getByRole('button', { name: 'Submit' })).toBeEnabled();
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).not.toBeVisible();

      // Verify the regions are restored in the table
      const targetRow = page.locator('table tbody tr', { hasText: TARGET_USER_IDIR });
      const regionsCell = targetRow.locator('td:nth-child(5)');
      await expect(regionsCell).toHaveText('0,1,2,3');
    });
  });
});
