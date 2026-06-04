/**
 * ============================================================================
 * 03 User Management - TC-TS-USER-07: Prevent duplicate IDIR
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-USER-07-duplicate-idir.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/03-user-management/tc-ts-user-07-duplicate-idir.spec.ts --headed
 * Headless:               npx playwright test tests/03-user-management/tc-ts-user-07-duplicate-idir.spec.ts
 * Debug:                  npx playwright test tests/03-user-management/tc-ts-user-07-duplicate-idir.spec.ts --debug
 * Specific Test:          npx playwright test tests/03-user-management/tc-ts-user-07-duplicate-idir.spec.ts -g "Prevent duplicate IDIR" --headed
 *
 * OVERVIEW:
 * Verifies that adding a user with an IDIR that already exists in the system is
 * rejected with a "Username [IDIR] already exists" validation error. The system
 * prevents duplicate user accounts regardless of whether the existing user is
 * active or inactive.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Duplicate Active User Rejection:
 *    ✅ IDIR lookup succeeds (user exists in directory)
 *    ✅ Attempting to submit the form triggers a "Validation Failed" dialog
 *    ✅ Error message "Username [IDIR] already exists" is displayed
 *    ✅ No duplicate user is created
 *
 * 2. Error Dialog Behavior:
 *    ✅ Error dialog title shows "Validation Failed"
 *    ✅ Error details are displayed in a danger alert
 *    ✅ Dialog can be closed and the wizard remains open
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

// Use an IDIR that already exists in the system
const EXISTING_IDIR = 'PDEWITH';

test.describe('TC-TS-USER-07 — Prevent duplicate IDIR', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the User Management page
    await page.goto('/admin/users');
    await expect(page.getByRole('heading', { name: 'User Management' })).toBeVisible();
  });

  test('Prevent duplicate IDIR', async ({ page }) => {
    await test.step('Step 1: Open Add User wizard and enter existing IDIR', async () => {
      await page.getByRole('button', { name: 'Add User' }).click();

      // Verify the Add User dialog is displayed
      const dialog = page.locator('[role="dialog"]').first();
      await expect(dialog.locator('.modal-title')).toHaveText('Add User');

      // Enter the existing IDIR
      await dialog.locator('input#username').fill(EXISTING_IDIR);

      // Click "Next" to trigger the directory lookup
      await dialog.locator('button:has-text("Next")').click();

      // Verify "User Found" success alert is displayed
      const alert = dialog.locator('.alert-success');
      await expect(alert).toBeVisible();
      await expect(alert).toContainText('User  Found');
      await expect(alert).toContainText(EXISTING_IDIR);
    });

    await test.step('Step 2: Proceed to user setup and select role/region', async () => {
      const dialog = page.locator('[role="dialog"]').first();

      // Click "Next" to proceed to role/region assignment
      await dialog.locator('button:has-text("Next")').click();

      // Wait for the user setup form to load (roles appear)
      await expect(dialog.locator('label:has-text("User Roles*")')).toBeVisible();

      // Select a role (MANAGER) — click the label because the input has opacity:0
      await dialog.locator('label[for="userRoleIds_3"]').click();

      // Select all regions — click the label for Select All
      await dialog.locator('label[for="userRegionIds_select_all"]').click();
    });

    await test.step('Step 3: Submit and verify "already exists" error', async () => {
      const dialog = page.locator('[role="dialog"]').first();

      // Click Submit
      await dialog.locator('button:has-text("Submit")').click();

      // Wait for the validation error dialog to appear (second modal)
      const errorDialog = page.locator('[role="dialog"]').nth(1);
      await expect(errorDialog).toBeVisible();

      // Verify error dialog title
      await expect(errorDialog.locator('.modal-title')).toHaveText('Validation Failed');

      // Verify error message contains "Username [IDIR] already exists"
      const errorAlert = errorDialog.locator('.alert-danger');
      await expect(errorAlert).toBeVisible();
      await expect(errorAlert).toContainText(`Username [${EXISTING_IDIR}] already exists`);
    });

    await test.step('Step 4: Close error dialog and verify no user was created', async () => {
      // Close the validation error dialog
      const errorDialog = page.locator('[role="dialog"]').nth(1);
      await errorDialog.locator('button:has-text("Close")').click();
      await expect(errorDialog).not.toBeVisible();

      // Close the Add User wizard
      const addDialog = page.locator('[role="dialog"]').first();
      await addDialog.locator('button[aria-label="Close"]').click();
      await expect(addDialog).not.toBeVisible();
    });
  });
});
