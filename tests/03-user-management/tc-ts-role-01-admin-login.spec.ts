/**
 * ============================================================================
 * 03-User-Management - TC-TS-ROLE-01: Admin login succeeds
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-ROLE-01-admin-login.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/03-user-management/tc-ts-role-01-admin-login.spec.ts --headed
 * Headless:               npx playwright test tests/03-user-management/tc-ts-role-01-admin-login.spec.ts
 * Debug:                  npx playwright test tests/03-user-management/tc-ts-role-01-admin-login.spec.ts --debug
 * Specific Test:          npx playwright test tests/03-user-management/tc-ts-role-01-admin-login.spec.ts -g "Admin login" --headed
 *
 * OVERVIEW:
 * Verifies that an administrator can log in without error and that
 * admin-specific navigation items (Users, Roles and Permissions) are visible
 * after authentication.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Authentication:
 *    ✅ Admin user redirected to CRT home screen
 *    ✅ No error on login
 *
 * 2. Admin Navigation:
 *    ✅ "Users" link visible
 *    ✅ "Roles and Permissions" link visible
 *    ✅ "Code Tables" link visible
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-ROLE-01 — Admin login succeeds', () => {
  test.setTimeout(60_000);

  test('Admin login shows admin navigation tabs', async ({ page }) => {
    await test.step('Step 1: Navigate to CRT and verify login', async () => {
      await page.goto('/');
      // NTLM auto-login should redirect to home (Projects page)
      await expect(page).not.toHaveURL(/error|unauthorized/i);
      await expect(page.locator('h1')).toBeVisible();
    });

    await test.step('Step 2: Verify Admin link is visible in top nav', async () => {
      await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();
    });

    await test.step('Step 3: Open Admin dropdown and verify sub-nav items', async () => {
      // Click the Admin dropdown to reveal menu items
      await page.getByRole('link', { name: 'Admin' }).click();
      await page.waitForTimeout(300);

      // Admin menu items are role="menuitem" inside the dropdown
      await expect(page.getByRole('menuitem', { name: 'Users' })).toBeVisible();
      await expect(page.getByRole('menuitem', { name: 'Roles and Permissions' })).toBeVisible();
      await expect(page.getByRole('menuitem', { name: 'Code Tables' })).toBeVisible();
    });
  });
});
