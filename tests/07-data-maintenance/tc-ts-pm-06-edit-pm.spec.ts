/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-PM-06: Edit existing PM
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-PM-06-edit-pm.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-pm-06-edit-pm.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-pm-06-edit-pm.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-pm-06-edit-pm.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-pm-06-edit-pm.spec.ts -g "Edit" --headed
 *
 * OVERVIEW:
 * Verifies that an existing PM's Code Name can be modified via the Edit dialog
 * and the change is reflected in both the code table and the Project Details
 * PM dropdown. Creates a test PM, edits it, verifies cross-page, then cleans up.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Edit Dialog:
 *    ✅ "Edit Project Manager" dialog opens with pre-filled values
 *    ✅ Code Set field is disabled
 *    ✅ Submit is disabled until a change is made
 *
 * 2. Edit Effect:
 *    ✅ Updated name appears in the code table
 *    ✅ Old name no longer appears
 *    ✅ Updated name available in Project Details PM dropdown
 *
 * 3. Cleanup:
 *    ✅ Test PM is deleted
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-PM-06 — Edit existing PM', () => {
  test.setTimeout(120_000);

  const ORIGINAL_NAME = 'CRT-AUTO Test Manager';
  const UPDATED_NAME = 'CRT-AUTO Updated Manager';

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

  test('Edit PM Code Name and verify in dropdown', async ({ page }) => {
    await test.step('Step 1: Create a test PM', async () => {
      await page.getByRole('button', { name: 'Add New Project Manager' }).click();
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await dialog.locator('input[name="codeName"]').fill(ORIGINAL_NAME);
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });
      await expect(page.locator('table tbody tr', { hasText: ORIGINAL_NAME })).toBeVisible();
    });

    await test.step('Step 2: Open Edit dialog and verify pre-filled fields', async () => {
      const row = page.locator('table tbody tr', { hasText: ORIGINAL_NAME });
      await row.getByRole('button', { name: 'Edit Record' }).click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('.modal-title, h5').first()).toHaveText('Edit Project Manager');

      // Code Set is disabled
      await expect(dialog.locator('input[name="codeSetName"]')).toBeDisabled();
      await expect(dialog.locator('input[name="codeSetName"]')).toHaveValue('Project Manager');

      // Code Name is pre-filled
      await expect(dialog.locator('input[name="codeName"]')).toHaveValue(ORIGINAL_NAME);

      // Submit is disabled until a change is made
      await expect(dialog.getByRole('button', { name: 'Submit' })).toBeDisabled();
    });

    await test.step('Step 3: Modify Code Name and submit', async () => {
      const dialog = page.locator('[role="dialog"]');
      await dialog.locator('input[name="codeName"]').fill(UPDATED_NAME);
      await expect(dialog.getByRole('button', { name: 'Submit' })).toBeEnabled();
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });
    });

    await test.step('Step 4: Verify updated name in code table', async () => {
      await expect(page.locator('table tbody tr', { hasText: UPDATED_NAME })).toBeVisible();
      await expect(page.locator('table tbody tr', { hasText: ORIGINAL_NAME })).toBeHidden();
    });

    await test.step('Step 5: Verify updated name in Project Details dropdown', async () => {
      await page.goto('/projects/79');
      await expect(page.getByRole('heading', { name: 'Project Details' })).toBeVisible();

      await page.getByRole('button', { name: 'Edit Project' }).click();

      // Open PM dropdown
      const pmDropdown = page.locator('label:has-text("Project Manager")').locator('..').locator('..').locator('.dropdown-toggle');
      await pmDropdown.click();
      await page.waitForTimeout(500);

      await page.locator('input[name="projectMgrLkupId"]').fill('CRT-AUTO');
      await page.waitForTimeout(500);

      await expect(page.getByRole('menuitem', { name: UPDATED_NAME })).toBeVisible();

      await page.getByRole('button', { name: 'Cancel' }).click();
    });

    await test.step('Cleanup: Delete the test PM', async () => {
      await page.goto('/admin/codetables');
      await expect(page.locator('table tbody tr').first()).toBeVisible();

      await page.getByRole('button', { name: 'Accomplishment', exact: true }).click();
      await page.getByRole('menuitem', { name: 'Project Manager' }).click();
      await page.getByRole('button', { name: 'Search' }).click();
      await expect(page).toHaveURL(/codeSet=PROJECT_MANAGER/);

      const row = page.locator('table tbody tr', { hasText: UPDATED_NAME });
      await row.getByRole('button', { name: 'Delete Record' }).click();
      const popover = page.locator('[role="tooltip"]');
      await expect(popover).toBeVisible();
      await popover.getByRole('button', { name: 'Delete' }).dispatchEvent('click');
      await expect(row).toBeHidden({ timeout: 10_000 });
    });
  });
});
