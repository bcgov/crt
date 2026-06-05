/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-CODE-04: Add new code value to Accomplishment set
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-CODE-04-add-code-value.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-code-04-add-code-value.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-code-04-add-code-value.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-code-04-add-code-value.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-code-04-add-code-value.spec.ts -g "Add new code" --headed
 *
 * OVERVIEW:
 * Verifies that a new code value can be added to the Accomplishment code set.
 * Tests the Add dialog structure (Code Set disabled, Order Number auto-populated),
 * fills in Code Value and Code Name, submits, and verifies the new entry appears
 * in the table. Cleans up by deleting the created entry.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Add Dialog Structure:
 *    ✅ Dialog title is "Add Accomplishment"
 *    ✅ Code Set field is disabled and shows "Accomplishment"
 *    ✅ Order Number is auto-populated with a value
 *    ✅ Submit button starts disabled
 *
 * 2. Successful Add:
 *    ✅ Filling Code Value and Code Name enables Submit
 *    ✅ After submit, dialog closes
 *    ✅ New entry "CRT-AUTO-001" appears in the table
 *    ✅ Code Name "CRT Automated Test Accomplishment" is shown
 *
 * 3. Cleanup:
 *    ✅ Delete the created code value
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-CODE-04 — Add new code value to Accomplishment set', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/codetables');
    await page.waitForLoadState('networkidle');
  });

  test('Add new code value with Code Value and Code Name', async ({ page }) => {
    await test.step('Step 1: Click "Add New Accomplishment" button', async () => {
      await page.getByRole('button', { name: 'Add New Accomplishment' }).click();
      await expect(page.locator('[role="dialog"]')).toBeVisible();
    });

    await test.step('Step 2: Verify dialog structure', async () => {
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog.getByRole('heading', { name: 'Add Accomplishment' })).toBeVisible();

      // Code Set field is disabled and shows "Accomplishment"
      const codeSetInput = dialog.getByRole('textbox', { name: 'Code Set' });
      await expect(codeSetInput).toBeDisabled();
      await expect(codeSetInput).toHaveValue('Accomplishment');

      // Order Number is auto-populated
      const orderNumber = dialog.getByRole('spinbutton', { name: /Order Number/ });
      const orderValue = await orderNumber.inputValue();
      expect(Number(orderValue)).toBeGreaterThan(0);

      // Submit button is disabled
      await expect(dialog.getByRole('button', { name: 'Submit' })).toBeDisabled();
    });

    await test.step('Step 3: Fill Code Value and Code Name', async () => {
      const dialog = page.locator('[role="dialog"]');
      await dialog.getByRole('textbox', { name: 'Code Value' }).fill('CRT-AUTO-001');
      await dialog.getByRole('textbox', { name: /Code Name/ }).fill('CRT Automated Test Accomplishment');
    });

    await test.step('Step 4: Submit and verify', async () => {
      const dialog = page.locator('[role="dialog"]');
      const submitBtn = dialog.getByRole('button', { name: 'Submit' });
      await expect(submitBtn).toBeEnabled();
      await submitBtn.click();

      // Wait for dialog to close
      await expect(page.locator('[role="dialog"]')).toBeHidden({ timeout: 10_000 });
      await page.waitForLoadState('networkidle');
    });

    await test.step('Step 5: Search for new entry and verify it exists', async () => {
      await page.locator('input[name="searchText"]').fill('CRT-AUTO-001');
      await page.getByRole('button', { name: 'Search' }).click();
      await page.waitForLoadState('networkidle');

      const row = page.locator('table tbody tr', { hasText: 'CRT-AUTO-001' });
      await expect(row).toBeVisible();
      await expect(row.locator('td').nth(0)).toHaveText('CRT-AUTO-001');
      await expect(row.locator('td').nth(1)).toHaveText('CRT Automated Test Accomplishment');
    });

    await test.step('Cleanup: Delete the created code value', async () => {
      const row = page.locator('table tbody tr', { hasText: 'CRT-AUTO-001' });
      await row.getByRole('button', { name: 'Delete Record' }).click();

      // Confirm delete in popover
      const popover = page.locator('.popover.show');
      await expect(popover).toBeVisible();
      await popover.getByRole('button', { name: 'Delete' }).click();
      await page.waitForLoadState('networkidle');

      // Verify entry is gone
      await expect(row).toBeHidden({ timeout: 10_000 });
    });
  });
});
