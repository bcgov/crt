/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-PM-12: Disabled PM not in Project Details dropdown
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-PM-12-disabled-not-in-dropdown.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-pm-12-disabled-not-in-dropdown.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-pm-12-disabled-not-in-dropdown.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-pm-12-disabled-not-in-dropdown.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-pm-12-disabled-not-in-dropdown.spec.ts -g "Disabled" --headed
 *
 * OVERVIEW:
 * Verifies that a disabled PM does NOT appear in the Project Details PM
 * dropdown for new assignments. Disables an existing PM (Devashish Bhargava),
 * checks the dropdown, and re-enables after verification.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Disabled PM Excluded from Dropdown:
 *    ✅ Disabled PM does not appear in Project Details PM type-ahead
 *    ✅ Only active PMs are listed for new assignments
 *
 * 2. Cleanup:
 *    ✅ PM is re-enabled to restore original state
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-PM-12 — Disabled PM not in Project Details dropdown', () => {
  test.setTimeout(180_000);

  const PM_NAME = 'Devashish Bhargava';

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/codetables');
    await expect(page.locator('table tbody tr').first()).toBeVisible();

    // Select Project Manager code set
    await page.getByRole('button', { name: 'Accomplishment', exact: true }).click();
    await page.getByRole('menuitem', { name: 'Project Manager' }).click();
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page).toHaveURL(/codeSet=PROJECT_MANAGER/);
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  test('Disabled PM does not appear in Project Details dropdown', async ({ page }) => {
    await test.step('Step 1: Disable PM', async () => {
      const row = page.locator('table tbody tr', { hasText: PM_NAME });
      await expect(row).toBeVisible();
      await row.getByRole('button', { name: 'Disable Record' }).click();

      const popover = page.locator('[role="tooltip"]');
      await expect(popover).toBeVisible();
      await popover.getByRole('button', { name: 'Disable' }).dispatchEvent('click');
      await expect(row).toBeHidden({ timeout: 10_000 });
    });

    await test.step('Step 2: Navigate to Project Details and open edit form', async () => {
      await page.goto('/projects/79');
      await expect(page.getByRole('heading', { name: 'Project Details' })).toBeVisible();
      await page.getByRole('button', { name: 'Edit Project' }).click();
      await page.waitForTimeout(1000);
    });

    await test.step('Step 3: Verify disabled PM NOT in dropdown', async () => {
      const pmDropdown = page.locator('label:has-text("Project Manager")').locator('..').locator('..').locator('.dropdown-toggle');
      await pmDropdown.click();
      await page.waitForTimeout(500);

      const pmSearch = page.locator('input[name="projectMgrLkupId"]');
      await pmSearch.fill('Devashish');
      await page.waitForTimeout(500);

      // Verify PM does NOT appear in the dropdown
      await expect(page.getByRole('menuitem', { name: PM_NAME })).toBeHidden();

      await page.getByRole('button', { name: 'Cancel' }).click();
    });

    await test.step('Cleanup: Re-enable the PM', async () => {
      await page.goto('/admin/codetables');
      await expect(page.locator('table tbody tr').first()).toBeVisible();

      await page.getByRole('button', { name: 'Accomplishment', exact: true }).click();
      await page.getByRole('menuitem', { name: 'Project Manager' }).click();
      await page.getByRole('button', { name: 'Search' }).click();
      await expect(page).toHaveURL(/codeSet=PROJECT_MANAGER/);
      await page.waitForTimeout(1000);

      // Switch to Inactive filter
      await page.getByRole('button', { name: 'Active' }).click();
      await page.waitForTimeout(300);
      await page.getByRole('checkbox', { name: 'Inactive' }).check();
      await page.getByRole('checkbox', { name: 'Active', exact: true }).uncheck();
      await page.getByRole('button', { name: 'Search' }).click();
      await page.waitForTimeout(3000);

      const row = page.locator('table tbody tr', { hasText: PM_NAME });
      await expect(row).toBeVisible();
      await row.getByRole('button', { name: 'Disable Record' }).click();

      const popover = page.locator('[role="tooltip"]');
      await expect(popover).toBeVisible();
      await popover.getByRole('button', { name: 'Activate' }).dispatchEvent('click');
      await expect(row).toBeHidden({ timeout: 10_000 });
    });
  });
});
