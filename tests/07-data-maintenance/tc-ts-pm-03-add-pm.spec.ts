/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-PM-03: Add new PM
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-PM-03-add-pm.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-pm-03-add-pm.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-pm-03-add-pm.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-pm-03-add-pm.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-pm-03-add-pm.spec.ts -g "Add" --headed
 *
 * OVERVIEW:
 * Verifies that a new Project Manager can be added via the Code Tables
 * "Project Manager" code set, appears in the table, and is available in the
 * Project Details PM dropdown. Cleans up by deleting the test PM.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Add Dialog:
 *    ✅ "Add Project Manager" dialog opens with correct fields
 *    ✅ Code Set is disabled and shows "Project Manager"
 *    ✅ Order Number is auto-populated
 *
 * 2. PM Creation:
 *    ✅ New PM appears in code table after submission
 *    ✅ PM is available in Project Details PM dropdown (cross-page integration)
 *
 * 3. Cleanup:
 *    ✅ Test PM is deleted from Code Tables
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-PM-03 — Add new PM', () => {
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

  test('Add new PM and verify in code table and project dropdown', async ({ page }) => {
    await test.step('Step 1: Open Add dialog and verify fields', async () => {
      await page.getByRole('button', { name: 'Add New Project Manager' }).click();
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('.modal-title, h5').first()).toHaveText('Add Project Manager');

      // Code Set is disabled and pre-filled
      const codeSetInput = dialog.locator('input[name="codeSetName"]');
      await expect(codeSetInput).toBeDisabled();
      await expect(codeSetInput).toHaveValue('Project Manager');

      // Order Number is auto-populated
      const orderInput = dialog.locator('input[name="displayOrder"]');
      const orderValue = await orderInput.inputValue();
      expect(Number(orderValue)).toBeGreaterThan(0);
    });

    await test.step('Step 2: Fill Code Name and submit', async () => {
      const dialog = page.locator('[role="dialog"]');
      await dialog.locator('input[name="codeName"]').fill(PM_NAME);
      await expect(dialog.getByRole('button', { name: 'Submit' })).toBeEnabled();
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });
    });

    await test.step('Step 3: Verify new PM appears in the table', async () => {
      const row = page.locator('table tbody tr', { hasText: PM_NAME });
      await expect(row).toBeVisible();
      await expect(row.locator('td').nth(1)).toHaveText(PM_NAME);
      await expect(row.locator('td').nth(3)).toHaveText('Active');
    });

    await test.step('Step 4: Verify PM appears in Project Details dropdown', async () => {
      await page.goto('/projects/79');
      await expect(page.getByRole('heading', { name: 'Project Details' })).toBeVisible();

      // Enter edit mode
      await page.getByRole('button', { name: 'Edit Project' }).click();

      // Open PM dropdown and search
      const pmDropdown = page.locator('label:has-text("Project Manager")').locator('..').locator('..').locator('.dropdown-toggle');
      await pmDropdown.click();
      await page.waitForTimeout(500);

      const pmSearch = page.locator('input[name="projectMgrLkupId"]');
      await pmSearch.fill('CRT-AUTO');
      await page.waitForTimeout(500);

      // Verify our PM is in the dropdown
      await expect(page.getByRole('menuitem', { name: PM_NAME })).toBeVisible();

      // Cancel edit (don't save)
      await page.getByRole('button', { name: 'Cancel' }).click();
    });

    await test.step('Cleanup: Delete the test PM', async () => {
      await page.goto('/admin/codetables');
      await expect(page.locator('table tbody tr').first()).toBeVisible();

      // Select PM code set
      await page.getByRole('button', { name: 'Accomplishment', exact: true }).click();
      await page.getByRole('menuitem', { name: 'Project Manager' }).click();
      await page.getByRole('button', { name: 'Search' }).click();
      await expect(page).toHaveURL(/codeSet=PROJECT_MANAGER/);

      const row = page.locator('table tbody tr', { hasText: PM_NAME });
      await expect(row).toBeVisible();
      await row.getByRole('button', { name: 'Delete Record' }).click();

      const popover = page.locator('[role="tooltip"]');
      await expect(popover).toBeVisible();
      // dispatchEvent bypasses Bootstrap modal table cell intercepting popover pointer events
      await popover.getByRole('button', { name: 'Delete' }).dispatchEvent('click');
      await expect(row).toBeHidden({ timeout: 10_000 });
    });
  });
});
