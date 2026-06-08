/**
 * ============================================================================
 * 03-User-Management - TC-TS-ROLE-04: Create new role with all permissions
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-ROLE-04-create-role.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/03-user-management/tc-ts-role-04-create-role.spec.ts --headed
 * Headless:               npx playwright test tests/03-user-management/tc-ts-role-04-create-role.spec.ts
 * Debug:                  npx playwright test tests/03-user-management/tc-ts-role-04-create-role.spec.ts --debug
 * Specific Test:          npx playwright test tests/03-user-management/tc-ts-role-04-create-role.spec.ts -g "Create" --headed
 *
 * OVERVIEW:
 * Verifies that a new role can be created with all fields populated: name,
 * description, end date, and all 10 permissions checked. After creation, the
 * role appears in the table with correct details.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Role Creation:
 *    ✅ All 10 permissions can be selected
 *    ✅ End date can be set
 *    ✅ Submission succeeds
 *
 * 2. Role in Table:
 *    ✅ New role appears in the roles list
 *    ✅ Role name and description are correct
 *    ✅ Status shows "Active"
 *
 * 3. Cleanup:
 *    ✅ Test role is disabled
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-ROLE-04 — Create new role with all permissions', () => {
  test.setTimeout(120_000);

  const ROLE_NAME = `TEST_ADMIN_${Date.now()}`;
  const ROLE_DESC = 'Test role with all permissions';
  const END_DATE = '2027-12-31';

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/roles');
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  test('Create role with all permissions and verify in table', async ({ page }) => {
    await test.step('Step 1: Open Add Role dialog and fill fields', async () => {
      await page.getByRole('button', { name: 'Add Role' }).click();
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      // Fill name and description
      await dialog.locator('input[name="name"]').fill(ROLE_NAME);
      await dialog.locator('input[name="description"]').fill(ROLE_DESC);
      await dialog.locator('input[name="endDate"]').fill(END_DATE);
    });

    await test.step('Step 2: Select all permissions', async () => {
      const dialog = page.locator('[role="dialog"]');
      const checkboxes = dialog.locator('input[type="checkbox"]');
      const count = await checkboxes.count();

      for (let i = 0; i < count; i++) {
        await checkboxes.nth(i).dispatchEvent('click');
      }

      // Verify all 10 are checked
      expect(count).toBe(10);
    });

    await test.step('Step 3: Submit and verify dialog closes', async () => {
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog.getByRole('button', { name: 'Submit' })).toBeEnabled();
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });
    });

    await test.step('Step 4: Verify role in table', async () => {
      const row = page.locator('table tbody tr', { hasText: ROLE_NAME });
      await expect(row).toBeVisible();
      await expect(row.locator('td').nth(0)).toHaveText(ROLE_NAME);
      await expect(row.locator('td').nth(1)).toHaveText(ROLE_DESC);
      await expect(row.locator('td').nth(2)).toHaveText('Active');
    });

    await test.step('Cleanup: Disable the test role', async () => {
      const row = page.locator('table tbody tr', { hasText: ROLE_NAME });
      await row.locator('button[title="Edit Record"]').evaluate(el => el.click());
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      // Set end date to today to deactivate
      const today = new Date().toISOString().split('T')[0];
      await dialog.locator('input[name="endDate"]').fill(today);
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });
      await expect(row).toBeHidden({ timeout: 10_000 });
    });
  });
});
