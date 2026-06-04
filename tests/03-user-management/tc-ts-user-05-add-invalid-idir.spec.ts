/**
 * ============================================================================
 * 03 User Management - TC-TS-USER-05: Add user with invalid IDIR
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-USER-05-add-invalid-idir.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/03-user-management/tc-ts-user-05-add-invalid-idir.spec.ts --headed
 * Headless:               npx playwright test tests/03-user-management/tc-ts-user-05-add-invalid-idir.spec.ts
 * Debug:                  npx playwright test tests/03-user-management/tc-ts-user-05-add-invalid-idir.spec.ts --debug
 * Specific Test:          npx playwright test tests/03-user-management/tc-ts-user-05-add-invalid-idir.spec.ts -g "Add user with invalid IDIR" --headed
 *
 * OVERVIEW:
 * Verifies that entering an invalid IDIR in the Add User wizard produces an error
 * and prevents user creation. The IDIR is validated against the directory lookup
 * and a "User Not Found" error is displayed when the IDIR does not exist.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Add User Wizard Opens:
 *    ✅ Clicking "Add User" opens the wizard dialog
 *    ✅ Wizard shows a "Search by IDIR" input field
 *
 * 2. Invalid IDIR Lookup:
 *    ✅ Entering an invalid IDIR and clicking "Next" triggers a directory lookup
 *    ✅ Error alert "User Not Found" is displayed
 *    ✅ The invalid IDIR value is shown in the error message
 *
 * 3. User Creation Blocked:
 *    ✅ "Next" button becomes disabled after the error
 *    ✅ User cannot proceed to create the account
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

const INVALID_IDIR = 'INVALIDUSER123';

test.describe('TC-TS-USER-05 — Add user with invalid IDIR', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the User Management page
    await page.goto('/admin/users');
    await expect(page.getByRole('heading', { name: 'User Management' })).toBeVisible();
  });

  test('Add user with invalid IDIR', async ({ page }) => {
    await test.step('Step 1: Click "Add User" to open the wizard', async () => {
      await page.getByRole('button', { name: 'Add User' }).click();

      // Verify the Add User dialog is displayed
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      await expect(dialog.getByRole('heading', { name: 'Add User' })).toBeVisible();

      // Verify the IDIR search field is present
      await expect(dialog.getByRole('textbox', { name: 'Search by IDIR' })).toBeVisible();
    });

    await test.step('Step 2: Enter an invalid IDIR and submit the lookup', async () => {
      const dialog = page.getByRole('dialog');

      // Enter the invalid IDIR
      await dialog.getByRole('textbox', { name: 'Search by IDIR' }).fill(INVALID_IDIR);

      // "Next" button should become enabled after entering text
      await expect(dialog.getByRole('button', { name: 'Next' })).toBeEnabled();

      // Click "Next" to trigger the directory lookup
      await dialog.getByRole('button', { name: 'Next' }).click();
    });

    await test.step('Step 3: Verify error is displayed and user creation is blocked', async () => {
      const dialog = page.getByRole('dialog');

      // Verify "User Not Found" error alert is displayed
      const alert = dialog.getByRole('alert');
      await expect(alert).toBeVisible();
      await expect(alert).toContainText('User Not Found');

      // Verify the invalid IDIR is shown in the error
      await expect(alert).toContainText(INVALID_IDIR);

      // Verify "Next" button is disabled (cannot proceed)
      await expect(dialog.getByRole('button', { name: 'Next' })).toBeDisabled();

      // Verify "Back" button is available to go back
      await expect(dialog.getByRole('button', { name: 'Back' })).toBeVisible();
    });
  });
});
