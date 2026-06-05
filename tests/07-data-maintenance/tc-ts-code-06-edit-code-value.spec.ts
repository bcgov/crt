/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-CODE-06: Edit code value
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-CODE-06-edit-code-value.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-code-06-edit-code-value.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-code-06-edit-code-value.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-code-06-edit-code-value.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-code-06-edit-code-value.spec.ts -g "Edit code" --headed
 *
 * OVERVIEW:
 * Verifies that an existing code value can be edited. Creates a test entry,
 * opens the Edit dialog, modifies the Code Name, submits, and verifies the
 * update is reflected in the table. Cleans up by deleting the test entry.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Edit Dialog Structure:
 *    ✅ Dialog title is "Edit Accomplishment"
 *    ✅ Code Set field is disabled
 *    ✅ Fields are pre-filled with current values
 *
 * 2. Edit Flow:
 *    ✅ Modifying Code Name enables Submit
 *    ✅ After submit, table shows updated value
 *
 * 3. Cleanup:
 *    ✅ Test entry is deleted after verification
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-CODE-06 — Edit code value', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/codetables');
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  test('Edit code value — modify Code Name and verify update', async ({ page }) => {
    await test.step('Step 1: Create a test entry for editing', async () => {
      await page.getByRole('button', { name: 'Add New Accomplishment' }).click();
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await dialog.getByRole('textbox', { name: 'Code Value' }).fill('CRT-AUTO-EDIT');
      await dialog.getByRole('textbox', { name: /Code Name/ }).fill('CRT Auto Edit Original');
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });
    });

    await test.step('Step 2: Search for the test entry', async () => {
      await page.locator('input[name="searchText"]').fill('CRT-AUTO-EDIT');
      await page.getByRole('button', { name: 'Search' }).click();
      await expect(page.locator('table tbody tr', { hasText: 'CRT-AUTO-EDIT' })).toBeVisible();
    });

    await test.step('Step 3: Open Edit dialog and verify pre-filled values', async () => {
      const row = page.locator('table tbody tr', { hasText: 'CRT-AUTO-EDIT' });
      await row.getByRole('button', { name: 'Edit Record' }).click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await expect(dialog.getByRole('heading', { name: 'Edit Accomplishment' })).toBeVisible();

      // Code Set is disabled
      await expect(dialog.getByRole('textbox', { name: 'Code Set' })).toBeDisabled();
      await expect(dialog.getByRole('textbox', { name: 'Code Set' })).toHaveValue('Accomplishment');

      // Fields are pre-filled
      await expect(dialog.getByRole('textbox', { name: 'Code Value' })).toHaveValue('CRT-AUTO-EDIT');
      await expect(dialog.getByRole('textbox', { name: /Code Name/ })).toHaveValue('CRT Auto Edit Original');
    });

    await test.step('Step 4: Modify Code Name and submit', async () => {
      const dialog = page.locator('[role="dialog"]');
      await dialog.getByRole('textbox', { name: /Code Name/ }).fill('CRT Auto Edit Modified');
      await expect(dialog.getByRole('button', { name: 'Submit' })).toBeEnabled();
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });
    });

    await test.step('Step 5: Verify the updated value in table', async () => {
      await page.locator('input[name="searchText"]').fill('CRT-AUTO-EDIT');
      await page.getByRole('button', { name: 'Search' }).click();
      await expect(page.locator('table tbody tr', { hasText: 'CRT Auto Edit Modified' })).toBeVisible();
    });

    await test.step('Cleanup: Delete the test entry', async () => {
      const row = page.locator('table tbody tr', { hasText: 'CRT-AUTO-EDIT' });
      await row.getByRole('button', { name: 'Delete Record' }).click();
      const popover = page.locator('[role="tooltip"]');
      await expect(popover).toBeVisible();
      await popover.getByRole('button', { name: 'Delete' }).click();
      await expect(row).toBeHidden({ timeout: 10_000 });
    });
  });
});
