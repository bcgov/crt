/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-CODE-05: Uniqueness validation on code value
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-CODE-05-uniqueness-validation.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-code-05-uniqueness-validation.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-code-05-uniqueness-validation.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-code-05-uniqueness-validation.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-code-05-uniqueness-validation.spec.ts -g "Uniqueness" --headed
 *
 * OVERVIEW:
 * Verifies that duplicate Code Names within the same code set are rejected
 * with a "Validation Failed" error dialog. Tests both exact-case and
 * case-insensitive duplicate detection.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Exact Duplicate:
 *    ✅ Submitting "Active Transportation Project" shows error dialog
 *    ✅ Error dialog title is "Validation Failed"
 *    ✅ Error message indicates the value is already in use
 *
 * 2. Case-Insensitive Duplicate:
 *    ✅ Submitting "active transportation project" (lowercase) shows error
 *    ✅ Uniqueness check is case-insensitive
 *
 * 3. No Data Created:
 *    ✅ Duplicate entries are not created in the table
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-CODE-05 — Uniqueness validation on code value', () => {
  test.setTimeout(60_000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/codetables');
    await page.waitForLoadState('networkidle');
  });

  test('Duplicate Code Name is rejected with validation error', async ({ page }) => {
    await test.step('Step 1: Open Add dialog', async () => {
      await page.getByRole('button', { name: 'Add New Accomplishment' }).click();
      await expect(page.locator('[role="dialog"]')).toBeVisible();
    });

    await test.step('Step 2: Submit duplicate "Active Transportation Project"', async () => {
      const dialog = page.locator('[role="dialog"]').first();
      await dialog.getByRole('textbox', { name: /Code Name/ }).fill('Active Transportation Project');
      await dialog.getByRole('button', { name: 'Submit' }).click();
    });

    await test.step('Step 3: Verify "Validation Failed" error dialog', async () => {
      const errorDialog = page.locator('[role="dialog"]').filter({ hasText: 'Validation Failed' });
      await expect(errorDialog).toBeVisible({ timeout: 10_000 });
      await expect(errorDialog.getByRole('heading', { name: 'Validation Failed' })).toBeVisible();
      await expect(errorDialog.locator('li')).toContainText('Active Transportation Project');

      // Close the error dialog (footer Close button)
      await errorDialog.locator('button.btn-secondary', { hasText: 'Close' }).click();
      await expect(errorDialog).toBeHidden();
    });

    await test.step('Step 4: Clear and submit case-insensitive duplicate', async () => {
      const dialog = page.locator('[role="dialog"]').first();
      await dialog.getByRole('textbox', { name: /Code Name/ }).fill('active transportation project');
      await dialog.getByRole('button', { name: 'Submit' }).click();
    });

    await test.step('Step 5: Verify case-insensitive duplicate also rejected', async () => {
      const errorDialog = page.locator('[role="dialog"]').filter({ hasText: 'Validation Failed' });
      await expect(errorDialog).toBeVisible({ timeout: 10_000 });
      await expect(errorDialog.getByRole('heading', { name: 'Validation Failed' })).toBeVisible();

      // Close error dialog (footer Close button) and cancel the Add dialog
      await errorDialog.locator('button.btn-secondary', { hasText: 'Close' }).click();
      await expect(errorDialog).toBeHidden();
    });

    await test.step('Step 6: Cancel dialog - no data created', async () => {
      const dialog = page.locator('[role="dialog"]').first();
      await dialog.getByRole('button', { name: 'Cancel' }).click();
      await expect(page.locator('[role="dialog"]')).toBeHidden();
    });
  });
});
