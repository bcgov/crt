/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-CODE-08: Delete active unused code value
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-CODE-08-delete-unused-code.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-code-08-delete-unused-code.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-code-08-delete-unused-code.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-code-08-delete-unused-code.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-code-08-delete-unused-code.spec.ts -g "Delete" --headed
 *
 * OVERVIEW:
 * Verifies that an active code value never used in data can be permanently
 * deleted via the Delete (trash) icon with confirmation. Creates a test entry,
 * verifies it has the Delete button, clicks it, confirms, and verifies removal.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Delete Availability:
 *    ✅ Unused code value shows "Delete Record" button (not Disable)
 *
 * 2. Delete Confirmation:
 *    ✅ Clicking Delete shows "Are you sure?" popover
 *    ✅ Popover includes "This will permanently delete the record."
 *    ✅ Popover has "Delete" and "Cancel" buttons
 *
 * 3. Delete Effect:
 *    ✅ After confirm, entry is permanently removed from table
 *    ✅ Searching for deleted entry returns no results
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-CODE-08 — Delete active unused code value', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/codetables');
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  test('Delete unused code value "CRT-AUTO-DEL" permanently', async ({ page }) => {
    await test.step('Step 1: Create a test entry for deletion', async () => {
      await page.getByRole('button', { name: 'Add New Accomplishment' }).click();
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await dialog.getByRole('textbox', { name: 'Code Value' }).fill('CRT-AUTO-DEL');
      await dialog.getByRole('textbox', { name: /Code Name/ }).fill('CRT Auto Delete Test');
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });
    });

    await test.step('Step 2: Search for the test entry and verify Delete button', async () => {
      await page.locator('input[name="searchText"]').fill('CRT-AUTO-DEL');
      await page.getByRole('button', { name: 'Search' }).click();

      const row = page.locator('table tbody tr', { hasText: 'CRT-AUTO-DEL' });
      await expect(row).toBeVisible();
      await expect(row.getByRole('button', { name: 'Delete Record' })).toBeVisible();
      // Unused entries should NOT have Disable button
      await expect(row.getByRole('button', { name: 'Disable Record' })).toBeHidden();
    });

    await test.step('Step 3: Click Delete and verify confirmation popover', async () => {
      const row = page.locator('table tbody tr', { hasText: 'CRT-AUTO-DEL' });
      await row.getByRole('button', { name: 'Delete Record' }).click();

      const popover = page.locator('[role="tooltip"]');
      await expect(popover).toBeVisible();
      await expect(popover.locator('h3')).toHaveText('Are you sure?');
      await expect(popover).toContainText('permanently delete the record');
      await expect(popover.getByRole('button', { name: 'Delete' })).toBeVisible();
      await expect(popover.getByRole('button', { name: 'Cancel' })).toBeVisible();
    });

    await test.step('Step 4: Confirm delete and verify entry is gone', async () => {
      const popover = page.locator('[role="tooltip"]');
      await popover.getByRole('button', { name: 'Delete' }).click();

      // Entry should disappear
      await expect(page.locator('table tbody tr', { hasText: 'CRT-AUTO-DEL' })).toBeHidden({ timeout: 10_000 });
    });

    await test.step('Step 5: Verify searching returns no results', async () => {
      await page.locator('input[name="searchText"]').fill('CRT-AUTO-DEL');
      await page.getByRole('button', { name: 'Search' }).click();
      await expect(page).toHaveURL(/searchText=CRT-AUTO-DEL/);
      await expect(page.locator('table tbody tr', { hasText: 'CRT-AUTO-DEL' })).toBeHidden();
    });
  });
});
