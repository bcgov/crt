/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-PM-11: PM appears in Project Details dropdown
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-PM-11-in-dropdown.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-pm-11-in-dropdown.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-pm-11-in-dropdown.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-pm-11-in-dropdown.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-pm-11-in-dropdown.spec.ts -g "dropdown" --headed
 *
 * OVERVIEW:
 * Verifies that a newly added active PM immediately appears in the Project
 * Details PM dropdown for assignment. Creates a test PM, navigates to a
 * project edit form, and confirms the PM is available in the type-ahead
 * dropdown.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Active PM in Dropdown:
 *    ✅ Newly added PM appears in Project Details PM dropdown
 *    ✅ PM is found via type-ahead filter
 *    ✅ PM is selectable (menuitem role)
 *
 * 2. Cleanup:
 *    ✅ Test PM is deleted
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-PM-11 — PM appears in Project Details dropdown', () => {
  test.setTimeout(120_000);

  const PM_NAME = 'CRT-AUTO Test Manager';

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

  test('Active PM appears in Project Details PM dropdown', async ({ page }) => {
    await test.step('Step 1: Create an active test PM', async () => {
      await page.getByRole('button', { name: 'Add New Project Manager' }).click();
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await dialog.locator('input[name="codeName"]').fill(PM_NAME);
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });
      await expect(page.locator('table tbody tr', { hasText: PM_NAME })).toBeVisible();
    });

    await test.step('Step 2: Navigate to Project Details and open edit form', async () => {
      await page.goto('/projects/79');
      await expect(page.getByRole('heading', { name: 'Project Details' })).toBeVisible();
      await page.getByRole('button', { name: 'Edit Project' }).click();
      await page.waitForTimeout(1000);
    });

    await test.step('Step 3: Verify PM appears in dropdown via type-ahead', async () => {
      const pmDropdown = page.locator('label:has-text("Project Manager")').locator('..').locator('..').locator('.dropdown-toggle');
      await pmDropdown.click();
      await page.waitForTimeout(500);

      const pmSearch = page.locator('input[name="projectMgrLkupId"]');
      await pmSearch.fill('CRT-AUTO');
      await page.waitForTimeout(500);

      // Verify PM appears and is selectable
      const pmOption = page.getByRole('menuitem', { name: PM_NAME });
      await expect(pmOption).toBeVisible();

      // Cancel without saving
      await page.getByRole('button', { name: 'Cancel' }).click();
    });

    await test.step('Cleanup: Delete the test PM', async () => {
      await page.goto('/admin/codetables');
      await expect(page.locator('table tbody tr').first()).toBeVisible();

      await page.getByRole('button', { name: 'Accomplishment', exact: true }).click();
      await page.getByRole('menuitem', { name: 'Project Manager' }).click();
      await page.getByRole('button', { name: 'Search' }).click();
      await expect(page).toHaveURL(/codeSet=PROJECT_MANAGER/);

      const row = page.locator('table tbody tr', { hasText: PM_NAME });
      await expect(row).toBeVisible();
      await row.getByRole('button', { name: 'Delete Record' }).click();

      const popover = page.locator('[role="tooltip"]');
      await expect(popover).toBeVisible();
      await popover.getByRole('button', { name: 'Delete' }).dispatchEvent('click');
      await expect(row).toBeHidden({ timeout: 10_000 });
    });
  });
});
