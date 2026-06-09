/**
 * ============================================================================
 * 09-BVT-Smoke-Tests - TC-TS-BVT-USER-02: Update users
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-BVT-USER-02-update-users.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-user-02-update-users.spec.ts --headed
 * Headless:               npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-user-02-update-users.spec.ts
 * Debug:                  npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-user-02-update-users.spec.ts --debug
 * Specific Test:          npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-user-02-update-users.spec.ts -g "Update user role" --headed
 *
 * OVERVIEW:
 * Build Verification Test confirming that an admin can modify user properties
 * (specifically roles). The test adds the MANAGER role to an existing user who
 * does not have it, verifies the change persists, then reverts to the original
 * state.
 *
 * NOTE: The test case specifies "DISTRICT_ADMIN" but that role does not exist in
 * the system. Available roles are: MANAGER, READ_ONLY, REGION_ADMIN, SYSTEM_ADMIN.
 * This test uses MANAGER as the target role to add/remove.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Edit User Dialog:
 *    ✅ Clicking "Edit Record" on a user row opens the Edit User dialog
 *    ✅ Dialog shows current roles (checkboxes)
 *    ✅ Target user initially does NOT have MANAGER role
 *
 * 2. Role Update:
 *    ✅ MANAGER checkbox can be toggled on
 *    ✅ Submitting saves the change
 *    ✅ Re-opening edit confirms MANAGER role is now assigned
 *
 * 3. Revert:
 *    ✅ MANAGER checkbox can be toggled off
 *    ✅ Submitting reverts to original state
 *    ✅ Re-opening edit confirms original roles are restored
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-BVT-USER-02 — BVT: Update users', () => {
  test.setTimeout(120_000);

  // Target user: PDEWITH - has only REGION_ADMIN, does NOT have MANAGER
  const targetUsername = 'PDEWITH';

  test('Update user role and revert', async ({ page }) => {
    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    await test.step('Step 1: Navigate to User Management page', async () => {
      await page.goto('/admin/users');
      await page.waitForTimeout(3000);

      // Verify we're on the user management page
      await expect(page.locator('table th:has-text("IDIR")')).toBeVisible();
    });

    await test.step('Step 2: Open Edit dialog for target user and verify initial state', async () => {
      const table = page.locator('table').first();
      const targetRow = table.locator(`tbody tr:has-text("${targetUsername}")`);
      await expect(targetRow).toBeVisible();

      // Click Edit Record
      await targetRow.locator('button[title="Edit Record"]').click();
      await page.waitForTimeout(1000);

      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();

      // Verify the dialog is for the right user
      const usernameInput = dialog.locator('input[name="username"]');
      await expect(usernameInput).toHaveValue(targetUsername);

      // Verify MANAGER is NOT currently checked (checkbox index 0)
      const managerChecked = await page.evaluate(() => {
        const dlg = document.querySelector('[role="dialog"]');
        const checks = dlg!.querySelectorAll('input[type="checkbox"]');
        return (checks[0] as HTMLInputElement).checked;
      });
      expect(managerChecked).toBe(false);
    });

    await test.step('Step 3: Add MANAGER role and submit', async () => {
      // Click MANAGER checkbox to enable it
      await page.evaluate(() => {
        const dlg = document.querySelector('[role="dialog"]');
        const checks = dlg!.querySelectorAll('input[type="checkbox"]');
        (checks[0] as HTMLElement).click(); // MANAGER
      });
      await page.waitForTimeout(300);

      // Verify checkbox is now checked
      const nowChecked = await page.evaluate(() => {
        const dlg = document.querySelector('[role="dialog"]');
        const checks = dlg!.querySelectorAll('input[type="checkbox"]');
        return (checks[0] as HTMLInputElement).checked;
      });
      expect(nowChecked).toBe(true);

      // Submit
      await page.evaluate(() => {
        const dlg = document.querySelector('[role="dialog"]');
        const submit = dlg!.querySelector('button[type="submit"]');
        if (submit) (submit as HTMLElement).click();
      });
      await page.waitForTimeout(3000);

      // Verify dialog closed
      const dialog = page.getByRole('dialog');
      await expect(dialog).not.toBeVisible();
    });

    await test.step('Step 4: Re-open edit and verify MANAGER role is saved', async () => {
      const table = page.locator('table').first();
      const targetRow = table.locator(`tbody tr:has-text("${targetUsername}")`);

      await targetRow.locator('button[title="Edit Record"]').click();
      await page.waitForTimeout(1000);

      // Verify MANAGER is now checked
      const managerSaved = await page.evaluate(() => {
        const dlg = document.querySelector('[role="dialog"]');
        const checks = dlg!.querySelectorAll('input[type="checkbox"]');
        return (checks[0] as HTMLInputElement).checked;
      });
      expect(managerSaved).toBe(true);
    });

    await test.step('Step 5: Revert - remove MANAGER role', async () => {
      // Uncheck MANAGER
      await page.evaluate(() => {
        const dlg = document.querySelector('[role="dialog"]');
        const checks = dlg!.querySelectorAll('input[type="checkbox"]');
        (checks[0] as HTMLElement).click(); // Uncheck MANAGER
      });
      await page.waitForTimeout(300);

      // Submit revert
      await page.evaluate(() => {
        const dlg = document.querySelector('[role="dialog"]');
        const submit = dlg!.querySelector('button[type="submit"]');
        if (submit) (submit as HTMLElement).click();
      });
      await page.waitForTimeout(3000);

      // Verify dialog closed
      const dialog = page.getByRole('dialog');
      await expect(dialog).not.toBeVisible();
    });

    await test.step('Step 6: Verify revert - MANAGER role is removed', async () => {
      const table = page.locator('table').first();
      const targetRow = table.locator(`tbody tr:has-text("${targetUsername}")`);

      await targetRow.locator('button[title="Edit Record"]').click();
      await page.waitForTimeout(1000);

      // Verify MANAGER is back to unchecked
      const managerReverted = await page.evaluate(() => {
        const dlg = document.querySelector('[role="dialog"]');
        const checks = dlg!.querySelectorAll('input[type="checkbox"]');
        return (checks[0] as HTMLInputElement).checked;
      });
      expect(managerReverted).toBe(false);

      // Close dialog
      const dialog = page.getByRole('dialog');
      await dialog.locator('button[aria-label="Close"]').click();
      await page.waitForTimeout(500);
    });
  });
});
