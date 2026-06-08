/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-PM-14: Permission boundary - Code Read only
 *                                     cannot modify PMs
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-PM-14-permission-boundary.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-pm-14-permission-boundary.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-pm-14-permission-boundary.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-pm-14-permission-boundary.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-pm-14-permission-boundary.spec.ts -g "Permission" --headed
 *
 * OVERVIEW:
 * Verifies that a user with Code Read permission but NOT Code Write cannot
 * add, edit, disable, or delete PMs. This is a security/permission boundary
 * test that requires authentication as a non-admin user.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Read Access:
 *    ✅ PM list is viewable (Code Read works)
 *
 * 2. Write Actions Blocked:
 *    ✅ "Add New Project Manager" button is NOT visible or disabled
 *    ✅ "Edit Record" buttons are NOT visible or disabled
 *    ✅ "Disable Record" buttons are NOT visible or disabled
 *    ✅ "Delete Record" buttons are NOT visible or disabled
 *
 * PREREQUISITE:
 * This test requires a non-admin user account (Code Read only, no Code Write).
 * Set the environment variable CRT_READONLY_USER to enable this test.
 * The application uses Windows/NTLM authentication, so the test must run
 * under the appropriate Windows session or use HTTP credentials.
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

const READONLY_USER = process.env.CRT_READONLY_USER;

test.describe('TC-TS-PM-14 — Permission boundary: Code Read only cannot modify PMs', () => {
  test.setTimeout(60_000);

  // Skip if no read-only user credentials are configured
  test.skip(!READONLY_USER, 'Requires CRT_READONLY_USER environment variable (non-admin IDIR account)');

  test.beforeEach(async ({ page }) => {
    // NOTE: When CRT_READONLY_USER is configured, the Playwright browser
    // must be launched under that Windows session or with httpCredentials.
    await page.goto('/admin/codetables');
    await expect(page.locator('table tbody tr').first()).toBeVisible();

    // Select Project Manager code set
    await page.getByRole('button', { name: 'Accomplishment', exact: true }).click();
    await page.getByRole('menuitem', { name: 'Project Manager' }).click();
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page).toHaveURL(/codeSet=PROJECT_MANAGER/);
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  test('Read-only user cannot add, edit, disable, or delete PMs', async ({ page }) => {
    await test.step('Step 1: Verify PM list is viewable (read access works)', async () => {
      const rows = page.locator('table tbody tr');
      const count = await rows.count();
      expect(count).toBeGreaterThan(0);
    });

    await test.step('Step 2: Verify Add button is not available', async () => {
      const addBtn = page.getByRole('button', { name: 'Add New Project Manager' });
      // Button should be hidden or disabled for read-only users
      const isVisible = await addBtn.isVisible();
      if (isVisible) {
        await expect(addBtn).toBeDisabled();
      }
    });

    await test.step('Step 3: Verify Edit/Disable/Delete buttons are not available', async () => {
      const firstRow = page.locator('table tbody tr').first();

      // Edit button should be absent or disabled
      const editBtn = firstRow.getByRole('button', { name: 'Edit Record' });
      const editVisible = await editBtn.isVisible();
      if (editVisible) {
        await expect(editBtn).toBeDisabled();
      }

      // Disable button should be absent or disabled
      const disableBtn = firstRow.getByRole('button', { name: 'Disable Record' });
      const disableVisible = await disableBtn.isVisible();
      if (disableVisible) {
        await expect(disableBtn).toBeDisabled();
      }

      // Delete button should be absent or disabled
      const deleteBtn = firstRow.getByRole('button', { name: 'Delete Record' });
      const deleteVisible = await deleteBtn.isVisible();
      if (deleteVisible) {
        await expect(deleteBtn).toBeDisabled();
      }
    });
  });
});
