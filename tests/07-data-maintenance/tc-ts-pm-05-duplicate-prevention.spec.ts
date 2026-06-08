/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-PM-05: Add PM - duplicate prevention
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-PM-05-duplicate-prevention.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-pm-05-duplicate-prevention.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-pm-05-duplicate-prevention.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-pm-05-duplicate-prevention.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-pm-05-duplicate-prevention.spec.ts -g "duplicate" --headed
 *
 * OVERVIEW:
 * Verifies that adding a PM with the same Code Name as an existing active PM
 * is rejected with a "Validation Failed" error dialog. Creates a test PM first,
 * then attempts to create a duplicate, and verifies the rejection.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Duplicate Prevention:
 *    ✅ Submitting a duplicate Code Name triggers "Validation Failed" dialog
 *    ✅ Error message indicates the name is already in use
 *    ✅ The duplicate PM is not created
 *
 * 2. Cleanup:
 *    ✅ Original test PM is deleted
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-PM-05 — Add PM - duplicate prevention', () => {
  test.setTimeout(120_000);

  const PM_NAME = 'CRT-AUTO Duplicate Test PM';

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

  test('Duplicate PM Code Name is rejected', async ({ page }) => {
    await test.step('Step 1: Create the initial PM', async () => {
      await page.getByRole('button', { name: 'Add New Project Manager' }).click();
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await dialog.locator('input[name="codeName"]').fill(PM_NAME);
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });

      // Verify it appears in the table
      await expect(page.locator('table tbody tr', { hasText: PM_NAME })).toBeVisible();
    });

    await test.step('Step 2: Attempt to create a duplicate PM', async () => {
      await page.getByRole('button', { name: 'Add New Project Manager' }).click();
      const dialog = page.locator('[role="dialog"]').filter({ hasText: 'Add Project Manager' });
      await expect(dialog).toBeVisible();
      await dialog.locator('input[name="codeName"]').fill(PM_NAME);
      await dialog.getByRole('button', { name: 'Submit' }).click();
    });

    await test.step('Step 3: Verify "Validation Failed" error dialog', async () => {
      const errorDialog = page.locator('[role="dialog"]').filter({ hasText: 'Validation Failed' });
      await expect(errorDialog).toBeVisible({ timeout: 10_000 });

      // Error message indicates uniqueness violation
      await expect(errorDialog).toContainText(PM_NAME);
      await expect(errorDialog).toContainText('in use');

      // Close error dialog
      await errorDialog.locator('button.btn-secondary').click();
      await expect(errorDialog).toBeHidden();
    });

    await test.step('Step 4: Close the add dialog', async () => {
      const addDialog = page.locator('[role="dialog"]').filter({ hasText: 'Add Project Manager' });
      await addDialog.getByRole('button', { name: 'Close' }).first().click();
      await expect(addDialog).toBeHidden();
    });

    await test.step('Cleanup: Delete the original test PM', async () => {
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
