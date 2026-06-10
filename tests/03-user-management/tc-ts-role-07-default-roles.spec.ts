/**
 * ============================================================================
 * 03-User-Management - TC-TS-ROLE-07: Verify default roles match requirements
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-ROLE-07-default-roles.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/03-user-management/tc-ts-role-07-default-roles.spec.ts --headed
 * Headless:               npx playwright test tests/03-user-management/tc-ts-role-07-default-roles.spec.ts
 * Debug:                  npx playwright test tests/03-user-management/tc-ts-role-07-default-roles.spec.ts --debug
 * Specific Test:          npx playwright test tests/03-user-management/tc-ts-role-07-default-roles.spec.ts -g "default roles" --headed
 *
 * OVERVIEW:
 * Verifies that the four default seeded roles (SYSTEM_ADMIN, REGION_ADMIN or
 * DISTRICT_ADMIN, MANAGER, READ_ONLY) have the correct permissions as per requirements.
 * This is a read-only verification test.
 *
 * WHAT THE TEST VALIDATES:
 * 1. SYSTEM_ADMIN:
 *    ✅ Has all 10 permissions assigned
 *
 * 2. REGION_ADMIN / DISTRICT_ADMIN (environment-dependent):
 *    ✅ Has expected subset (Code Table Read, Export Read, Project Read/Write, Role Read, User Read/Write)
 *
 * 3. MANAGER:
 *    ✅ Has expected subset (Code Table Read, Export Read, Project Read/Write)
 *
 * 4. READ_ONLY:
 *    ✅ Has read-only permissions only (Code Table Read, Project Read, Role Read, User Read)
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-ROLE-07 — Verify default roles match requirements', () => {
  test.setTimeout(120_000);

  const ALL_PERMISSIONS = [
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

  const REGION_ADMIN_PERMISSIONS = [
    'Code Table Read',
    'Export Read',
    'Project Read',
    'Project Write',
    'Role Read',
    'User Read',
    'User Write',
  ];

  const STATIC_EXPECTED_PERMISSIONS: Record<string, string[]> = {
    SYSTEM_ADMIN: ALL_PERMISSIONS,
    MANAGER: ['Code Table Read', 'Export Read', 'Project Read', 'Project Write'],
    READ_ONLY: ['Code Table Read', 'Project Read', 'Role Read', 'User Read'],
  };

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/roles');
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  /** Helper: open Edit dialog for a role and return its checked permissions */
  async function getPermissions(page: any, roleName: string): Promise<string[]> {
    const row = page.locator('table tbody tr', { hasText: roleName });
    await row.getByRole('button', { name: 'Edit Record' }).click();

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Wait for checkbox state to be populated by React
    await page.waitForTimeout(1000);

    const checkboxes = dialog.locator('input[type="checkbox"]');
    const count = await checkboxes.count();
    const permissions: string[] = [];

    for (let i = 0; i < count; i++) {
      const checked = await checkboxes.nth(i).isChecked();
      if (checked) {
        const label = await checkboxes.nth(i).evaluate((el: HTMLElement) => {
          const parent = el.closest('.custom-checkbox');
          const lbl = parent ? parent.querySelector('label') : null;
          return lbl ? lbl.textContent : 'unknown';
        });
        permissions.push(label);
      }
    }

    await dialog.getByRole('button', { name: 'Cancel' }).click();
    await page.waitForTimeout(500);

    return permissions;
  }

  test('Default roles have correct permissions', async ({ page }) => {
    // Detect environment: DEV has REGION_ADMIN, TST has DISTRICT_ADMIN
    const roleNames = await page.locator('table tbody tr td:first-child').allTextContents();
    const adminRoleName = roleNames.find(name => name.includes('REGION')) ? 'REGION_ADMIN' : 'DISTRICT_ADMIN';

    const EXPECTED_PERMISSIONS: Record<string, string[]> = {
      ...STATIC_EXPECTED_PERMISSIONS,
      [adminRoleName]: REGION_ADMIN_PERMISSIONS,
    };

    for (const [roleName, expectedPerms] of Object.entries(EXPECTED_PERMISSIONS)) {
      await test.step(`Verify ${roleName} permissions`, async () => {
        const actual = await getPermissions(page, roleName);
        expect(actual.sort()).toEqual(expectedPerms.sort());
      });
    }
  });
});
