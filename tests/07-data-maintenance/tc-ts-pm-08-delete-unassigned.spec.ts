/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-PM-08: Delete PM (unassigned)
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-PM-08-delete-unassigned.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-pm-08-delete-unassigned.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-pm-08-delete-unassigned.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-pm-08-delete-unassigned.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-pm-08-delete-unassigned.spec.ts -g "Delete" --headed
 *
 * OVERVIEW:
 * Verifies that a PM not assigned to any project can be permanently deleted.
 * Creates a fresh test PM (unassigned), verifies the Delete button is present,
 * confirms deletion via popover, and verifies removal from both the table and
 * the Project Details PM dropdown.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Delete Button Availability:
 *    ✅ Unassigned PM shows "Delete Record" button
 *
 * 2. Delete Confirmation:
 *    ✅ Popover shows "permanently delete" warning text
 *    ✅ PM is removed from the table after confirmation
 *
 * 3. Cross-Page Verification:
 *    ✅ Deleted PM does NOT appear in Project Details PM dropdown
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-PM-08 — Delete PM (unassigned)', () => {
  test.setTimeout(120_000);

  const PM_NAME = 'CRT-AUTO Test Manager';

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/codetables');
    await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30000 });

    // Select Project Manager code set
    await page.getByRole('button', { name: 'Accomplishment', exact: true }).click();
    await page.getByRole('menuitem', { name: 'Project Manager' }).click();
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page).toHaveURL(/codeSet=PROJECT_MANAGER/);
    await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30000 });
  });

  test('Delete unassigned PM and verify removal from table and dropdown', async ({ page }) => {
    await test.step('Setup: Delete any leftover test PM from a prior run', async () => {
      const leftover = page.locator('table tbody tr', { hasText: PM_NAME });
      if (await leftover.isVisible()) {
        await leftover.getByRole('button', { name: 'Delete Record' }).click();
        const popover = page.locator('[role="tooltip"]');
        await expect(popover).toBeVisible();
        await popover.getByRole('button', { name: 'Delete' }).dispatchEvent('click');
        await expect(leftover).toBeHidden({ timeout: 10_000 });
      }
    });

    await test.step('Step 1: Create an unassigned test PM', async () => {
      await page.getByRole('button', { name: 'Add New Project Manager' }).click();
      const dialog = page.getByRole('dialog').filter({ hasText: 'Add Project Manager' });
      await expect(dialog).toBeVisible();
      await dialog.locator('input[name="codeName"]').fill(PM_NAME);
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });
      await expect(page.locator('table tbody tr', { hasText: PM_NAME })).toBeVisible();
    });

    await test.step('Step 2: Verify Delete button is available (not Disable)', async () => {
      const row = page.locator('table tbody tr', { hasText: PM_NAME });
      await expect(row.getByRole('button', { name: 'Delete Record' })).toBeVisible();
    });

    await test.step('Step 3: Click Delete and verify confirmation popover', async () => {
      const row = page.locator('table tbody tr', { hasText: PM_NAME });
      await row.getByRole('button', { name: 'Delete Record' }).click();

      const popover = page.locator('[role="tooltip"]');
      await expect(popover).toBeVisible();
      await expect(popover).toContainText('permanently delete');
      await expect(popover.getByRole('button', { name: 'Delete' })).toBeVisible();
      await expect(popover.getByRole('button', { name: 'Cancel' })).toBeVisible();
    });

    await test.step('Step 4: Confirm deletion and verify row removed', async () => {
      const popover = page.locator('[role="tooltip"]');
      // dispatchEvent bypasses Bootstrap z-index click interception
      await popover.getByRole('button', { name: 'Delete' }).dispatchEvent('click');

      const row = page.locator('table tbody tr', { hasText: PM_NAME });
      await expect(row).toBeHidden({ timeout: 10_000 });
    });

    await test.step('Step 5: Verify PM NOT in Project Details dropdown', async () => {
      await page.goto('/projects');
      await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30000 });
      const firstProjectLink = page.locator('table tbody tr td:nth-child(2) a').first();
      const href = await firstProjectLink.getAttribute('href');
      await page.goto(href as string);
      await expect(page.getByRole('heading', { name: 'Project Details' })).toBeVisible({ timeout: 30000 });

      await page.getByRole('button', { name: 'Edit Project' }).click();

      const pmDropdown = page.locator('label:has-text("Project Manager")').locator('..').locator('..').locator('.dropdown-toggle');
      await expect(pmDropdown).toBeVisible({ timeout: 10_000 });
      await pmDropdown.click();

      const pmSearch = page.locator('input[name="projectMgrLkupId"]');
      await expect(pmSearch).toBeVisible({ timeout: 10_000 });
      await pmSearch.fill('CRT-AUTO');

      await expect(page.getByRole('menuitem', { name: PM_NAME })).toBeHidden();

      await page.getByRole('button', { name: 'Cancel' }).click();
    });
  });
});
