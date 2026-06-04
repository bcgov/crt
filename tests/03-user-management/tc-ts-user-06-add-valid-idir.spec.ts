/**
 * ============================================================================
 * 03 User Management - TC-TS-USER-06: Add user with valid IDIR — auto-populate
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-USER-06-add-valid-idir.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/03-user-management/tc-ts-user-06-add-valid-idir.spec.ts --headed
 * Headless:               npx playwright test tests/03-user-management/tc-ts-user-06-add-valid-idir.spec.ts
 * Debug:                  npx playwright test tests/03-user-management/tc-ts-user-06-add-valid-idir.spec.ts --debug
 * Specific Test:          npx playwright test tests/03-user-management/tc-ts-user-06-add-valid-idir.spec.ts -g "Add user with valid IDIR" --headed
 *
 * OVERVIEW:
 * Verifies that entering a valid IDIR in the Add User wizard triggers a directory
 * lookup and auto-populates the user details (IDIR, First Name, Last Name, Email).
 * The test does NOT create the user — it cancels the form after verifying auto-population.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Add User Wizard Opens:
 *    ✅ Clicking "Add User" opens the wizard dialog
 *    ✅ Wizard shows "Search by IDIR" input field
 *
 * 2. Valid IDIR Lookup:
 *    ✅ Entering a valid IDIR and clicking "Next" triggers directory lookup
 *    ✅ Success alert "User Found" is displayed
 *    ✅ IDIR field is auto-populated with the entered value
 *    ✅ First Name is auto-populated from the directory
 *    ✅ Last Name is auto-populated from the directory
 *    ✅ Email is auto-populated from the directory
 *
 * 3. Wizard Progression:
 *    ✅ "Next" button remains enabled to proceed to role/region assignment
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

// Use a known valid IDIR that exists in the BC Gov directory
const VALID_IDIR = 'PDEWITH';

test.describe('TC-TS-USER-06 — Add user with valid IDIR — auto-populate', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the User Management page
    await page.goto('/admin/users');
    await expect(page.getByRole('heading', { name: 'User Management' })).toBeVisible();
  });

  test('Add user with valid IDIR — auto-populate', async ({ page }) => {
    await test.step('Step 1: Click "Add User" to open the wizard', async () => {
      await page.getByRole('button', { name: 'Add User' }).click();

      // Verify the Add User dialog is displayed
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('.modal-title')).toHaveText('Add User');

      // Verify the IDIR search field is present
      await expect(dialog.locator('input#username')).toBeVisible();
    });

    await test.step('Step 2: Enter a valid IDIR and submit the lookup', async () => {
      const dialog = page.locator('[role="dialog"]');

      // Enter the valid IDIR
      await dialog.locator('input#username').fill(VALID_IDIR);

      // Click "Next" to trigger the directory lookup
      await dialog.locator('button:has-text("Next")').click();
    });

    await test.step('Step 3: Verify auto-populated fields from directory lookup', async () => {
      const dialog = page.locator('[role="dialog"]');

      // Verify success alert "User Found" is displayed
      const alert = dialog.locator('.alert-success');
      await expect(alert).toBeVisible();
      await expect(alert).toContainText('User  Found');

      // Verify IDIR is displayed
      await expect(alert).toContainText(VALID_IDIR);

      // Verify First Name is auto-populated (non-empty)
      const firstNameRow = alert.locator('.row').filter({ hasText: 'First Name' });
      await expect(firstNameRow).toBeVisible();
      const firstName = await firstNameRow.locator('.col').last().textContent();
      expect(firstName!.trim().length).toBeGreaterThan(0);

      // Verify Last Name is auto-populated (non-empty)
      const lastNameRow = alert.locator('.row').filter({ hasText: 'Last Name' });
      await expect(lastNameRow).toBeVisible();
      const lastName = await lastNameRow.locator('.col').last().textContent();
      expect(lastName!.trim().length).toBeGreaterThan(0);

      // Verify Email is auto-populated (non-empty and contains @)
      const emailRow = alert.locator('.row').filter({ hasText: 'Email' });
      await expect(emailRow).toBeVisible();
      const email = await emailRow.locator('.col').last().textContent();
      expect(email!.trim()).toContain('@');

      // Verify "Next" button is enabled (can proceed to role assignment)
      await expect(dialog.locator('button:has-text("Next")')).toBeEnabled();
    });

    await test.step('Step 4: Cancel the form (cleanup — do not save)', async () => {
      const dialog = page.locator('[role="dialog"]');

      // Close the dialog without creating the user
      await dialog.locator('button[aria-label="Close"]').click();
      await expect(dialog).not.toBeVisible();
    });
  });
});
