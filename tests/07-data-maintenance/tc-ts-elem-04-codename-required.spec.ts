/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-ELEM-04: Add element — Code Name required validation
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-ELEM-04-codename-required.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-elem-04-codename-required.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-elem-04-codename-required.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-elem-04-codename-required.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-elem-04-codename-required.spec.ts -g "required" --headed
 *
 * OVERVIEW:
 * Verifies that the Submit button starts disabled and becomes enabled only after
 * the Description field has text. Also verifies that submitting without all
 * required fields shows inline validation errors.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Button State:
 *    ✅ Submit button starts disabled when dialog opens
 *    ✅ Filling Description enables Submit
 *
 * 2. Inline Validation:
 *    ✅ Submitting with only Description shows "Code is required" error
 *    ✅ Submitting shows "Program Category is required" error
 *    ✅ Dialog stays open (element not created)
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-ELEM-04 — Add element — Code Name required validation', () => {
  test.setTimeout(60_000);

  test('Submit disabled without Description, inline errors on partial submit', async ({ page }) => {
    await test.step('Step 1: Navigate to Elements Management', async () => {
      await page.goto('/admin/elements');
      await expect(page.getByRole('heading', { name: 'Elements Management' })).toBeVisible();
    });

    await test.step('Step 2: Open Add Element dialog — Submit is disabled', async () => {
      await page.getByRole('button', { name: 'Add New Element' }).click();
      const dialog = page.locator('[role="dialog"]');
      await dialog.waitFor({ state: 'visible' });
      await page.waitForTimeout(500);

      await expect(dialog.getByRole('button', { name: 'Submit' })).toBeDisabled();
    });

    await test.step('Step 3: Fill Description — Submit becomes enabled', async () => {
      const dialog = page.locator('[role="dialog"]');
      await dialog.locator('input[name="description"]').fill('Test Only Desc');
      await page.waitForTimeout(300);

      await expect(dialog.getByRole('button', { name: 'Submit' })).toBeEnabled();
    });

    await test.step('Step 4: Submit without other required fields — inline errors shown', async () => {
      const dialog = page.locator('[role="dialog"]');
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await page.waitForTimeout(1000);

      // Dialog stays open
      await expect(dialog).toBeVisible();

      // Inline errors for missing required fields
      await expect(dialog.locator('text=Code is required')).toBeVisible();
      await expect(dialog.locator('text=Program Category is required')).toBeVisible();
    });

    await test.step('Cleanup: Cancel dialog', async () => {
      const dialog = page.locator('[role="dialog"]');
      await dialog.getByRole('button', { name: 'Cancel' }).click();
      await dialog.waitFor({ state: 'hidden', timeout: 5000 });
    });
  });
});
