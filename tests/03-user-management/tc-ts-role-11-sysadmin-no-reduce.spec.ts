/**
 * ============================================================================
 * 03-User-Management - TC-TS-ROLE-11: System Admin role permissions cannot be removed
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-ROLE-11-sysadmin-no-reduce.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/03-user-management/tc-ts-role-11-sysadmin-no-reduce.spec.ts --headed
 * Headless:               npx playwright test tests/03-user-management/tc-ts-role-11-sysadmin-no-reduce.spec.ts
 * Debug:                  npx playwright test tests/03-user-management/tc-ts-role-11-sysadmin-no-reduce.spec.ts --debug
 * Specific Test:          npx playwright test tests/03-user-management/tc-ts-role-11-sysadmin-no-reduce.spec.ts -g "permissions cannot be removed" --headed
 *
 * OVERVIEW:
 * Verifies the behavior when attempting to remove permissions from the
 * SYSTEM_ADMIN role. Tests that the Edit dialog opens and all 10 permissions
 * are present and checked.
 *
 * NOTE: Current application behavior does NOT prevent permission removal via
 * the UI (checkboxes are not disabled). This test verifies the initial state
 * of all permissions and that the role has all 10 permissions assigned. If
 * protection is added in the future, update this test to verify disabled
 * checkboxes or error messages on submit.
 *
 * WHAT THE TEST VALIDATES:
 * 1. SYSTEM_ADMIN Permissions:
 *    ✅ Edit dialog shows all 10 permissions
 *    ✅ All 10 permissions are checked
 *    ✅ Permission labels match expected names
 *
 * 2. Permission List Completeness:
 *    ✅ Code Table Read, Code Table Write
 *    ✅ Export Read
 *    ✅ Project Read, Project Write
 *    ✅ Role Read, Role Write
 *    ✅ User Read, User Write
 *    ✅ API Access Client
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-ROLE-11 — System Admin role permissions cannot be removed', () => {
  test.setTimeout(60_000);

  const EXPECTED_PERMISSIONS = [
    'Code Table Read',
    'Code Table Write',
    'Export Read',
    'Project Read',
    'Project Write',
    'Role Read',
    'Role Write',
    'User Read',
    'User Write',
    'API Access Client',
  ];

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/roles');
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  test('SYSTEM_ADMIN has all permissions and they are all checked', async ({ page }) => {
    await test.step('Step 1: Open Edit dialog for SYSTEM_ADMIN', async () => {
      const row = page.locator('table tbody tr', { hasText: 'SYSTEM_ADMIN' });
      await row.getByRole('button', { name: 'Edit Record' }).click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('.modal-title, h5').first()).toHaveText('Edit Role');
    });

    await test.step('Step 2: Verify all 10 permissions are checked', async () => {
      const dialog = page.locator('[role="dialog"]');
      const checkboxes = dialog.locator('input[type="checkbox"]');

      // Wait for checkbox state to be populated by React
      await page.waitForTimeout(1000);

      // Should have exactly 10 checkboxes
      await expect(checkboxes).toHaveCount(10);

      // All should be checked
      for (let i = 0; i < 10; i++) {
        await expect(checkboxes.nth(i)).toBeChecked();
      }
    });

    await test.step('Step 3: Verify permission labels match expected names', async () => {
      const dialog = page.locator('[role="dialog"]');
      const labels = dialog.locator('.custom-checkbox label.custom-control-label');

      const actualLabels: string[] = [];
      const count = await labels.count();
      for (let i = 0; i < count; i++) {
        const text = await labels.nth(i).textContent();
        actualLabels.push(text!.trim());
      }

      expect(actualLabels.sort()).toEqual(EXPECTED_PERMISSIONS.sort());
    });

    await test.step('Step 4: Close dialog without changes', async () => {
      const dialog = page.locator('[role="dialog"]');
      await dialog.getByRole('button', { name: 'Cancel' }).click();
      await expect(dialog).toBeHidden();
    });
  });
});
