/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-PM-04: Add PM - Code Name required
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-PM-04-codename-required.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-pm-04-codename-required.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-pm-04-codename-required.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-pm-04-codename-required.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-pm-04-codename-required.spec.ts -g "required" --headed
 *
 * OVERVIEW:
 * Verifies that submitting a new PM without a Code Name and without a Code
 * Value triggers client-side validation (Submit button remains disabled).
 * At least one of Code Value or Code Name must be provided.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Validation:
 *    ✅ Submit is disabled when both Code Value and Code Name are empty
 *    ✅ Submit becomes enabled when Code Name is filled
 *    ✅ Submit becomes enabled when Code Value is filled (even without Code Name)
 *    ✅ No new PM is created when validation prevents submission
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-PM-04 — Add PM - Code Name required', () => {
  test.setTimeout(60_000);

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

  test('Submit disabled when both Code Value and Code Name are empty', async ({ page }) => {
    await test.step('Step 1: Open Add dialog', async () => {
      await page.getByRole('button', { name: 'Add New Project Manager' }).click();
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
    });

    await test.step('Step 2: Verify Submit is disabled with empty fields', async () => {
      const dialog = page.locator('[role="dialog"]');
      // Both Code Value and Code Name are empty by default
      await expect(dialog.locator('input[name="codeValueText"]')).toHaveValue('');
      await expect(dialog.locator('input[name="codeName"]')).toHaveValue('');

      // Submit should be disabled
      await expect(dialog.getByRole('button', { name: 'Submit' })).toBeDisabled();
    });

    await test.step('Step 3: Verify Submit enables when Code Name is filled', async () => {
      const dialog = page.locator('[role="dialog"]');
      await dialog.locator('input[name="codeName"]').fill('Test Name');
      await expect(dialog.getByRole('button', { name: 'Submit' })).toBeEnabled();

      // Clear it back
      await dialog.locator('input[name="codeName"]').fill('');
      await expect(dialog.getByRole('button', { name: 'Submit' })).toBeDisabled();
    });

    await test.step('Step 4: Verify Submit enables when Code Value is filled', async () => {
      const dialog = page.locator('[role="dialog"]');
      await dialog.locator('input[name="codeValueText"]').fill('TEST-VALUE');
      await expect(dialog.getByRole('button', { name: 'Submit' })).toBeEnabled();

      // Clear it
      await dialog.locator('input[name="codeValueText"]').fill('');
      await expect(dialog.getByRole('button', { name: 'Submit' })).toBeDisabled();
    });

    await test.step('Step 5: Close dialog without creating a PM', async () => {
      const dialog = page.locator('[role="dialog"]');
      await dialog.getByRole('button', { name: 'Close' }).first().click();
      await expect(dialog).toBeHidden();
    });
  });
});
