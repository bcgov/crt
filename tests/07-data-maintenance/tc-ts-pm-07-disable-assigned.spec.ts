/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-PM-07: Disable PM assigned to projects
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-PM-07-disable-assigned.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-pm-07-disable-assigned.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-pm-07-disable-assigned.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-pm-07-disable-assigned.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-pm-07-disable-assigned.spec.ts -g "Disable" --headed
 *
 * OVERVIEW:
 * Verifies that disabling a PM assigned to projects removes it from the
 * Project Details dropdown but leaves existing project assignments unchanged.
 * Uses "Devashish Bhargava" who is assigned to project 79.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Disable Assigned PM:
 *    ✅ Assigned PM shows "Disable Record" button (not Delete)
 *    ✅ Confirmation popover appears on click
 *    ✅ PM disappears from Active list after confirmation
 *
 * 2. Dropdown Removal:
 *    ✅ Disabled PM does NOT appear in Project Details PM dropdown
 *
 * 3. Existing Assignment Preserved:
 *    ✅ Project that had PM assigned still shows it in read-only view
 *
 * 4. Cleanup:
 *    ✅ PM is re-enabled via Inactive view
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-PM-07 — Disable PM assigned to projects', () => {
  test.setTimeout(180_000);

  const PM_NAME = 'Devashish Bhargava';
  const PROJECT_ID = 79;

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/codetables');
    await expect(page.locator('table tbody tr').first()).toBeVisible();

    // Select Project Manager code set
    await page.getByRole('button', { name: 'Accomplishment', exact: true }).click();
    await page.getByRole('menuitem', { name: 'Project Manager' }).click();
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page).toHaveURL(/codeSet=PROJECT_MANAGER/);
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  test('Disable assigned PM and verify removal from dropdown but preserved assignment', async ({ page }) => {
    await test.step('Step 1: Verify PM is active and shows Disable (not Delete)', async () => {
      const row = page.locator('table tbody tr', { hasText: PM_NAME });
      await expect(row).toBeVisible();
      await expect(row.locator('td').nth(3)).toHaveText('Active');
      await expect(row.getByRole('button', { name: 'Disable Record' })).toBeVisible();
      await expect(row.getByRole('button', { name: 'Delete Record' })).toBeHidden();
    });

    await test.step('Step 2: Click Disable and confirm', async () => {
      const row = page.locator('table tbody tr', { hasText: PM_NAME });
      await row.getByRole('button', { name: 'Disable Record' }).click();

      const popover = page.locator('[role="tooltip"]');
      await expect(popover).toBeVisible();
      await expect(popover).toContainText('Are you sure');

      // dispatchEvent bypasses Bootstrap z-index click interception
      await popover.getByRole('button', { name: 'Disable' }).dispatchEvent('click');
      await expect(row).toBeHidden({ timeout: 10_000 });
    });

    await test.step('Step 3: Verify PM NOT in Project Details dropdown', async () => {
      await page.goto(`/projects/${PROJECT_ID}`);
      await expect(page.getByRole('heading', { name: 'Project Details' })).toBeVisible();

      await page.getByRole('button', { name: 'Edit Project' }).click();
      await page.waitForTimeout(1000);

      // Open PM dropdown and search
      const pmDropdown = page.locator('label:has-text("Project Manager")').locator('..').locator('..').locator('.dropdown-toggle');
      await pmDropdown.click();
      await page.waitForTimeout(500);

      const pmSearch = page.locator('input[name="projectMgrLkupId"]');
      await pmSearch.fill('Devashish');
      await page.waitForTimeout(500);

      // Verify PM is NOT in the dropdown (disabled PMs removed from edit options)
      await expect(page.getByRole('menuitem', { name: PM_NAME })).toBeHidden();

      await page.getByRole('button', { name: 'Cancel' }).click();
    });

    await test.step('Step 4: Verify project still shows PM in read-only view', async () => {
      await page.goto(`/projects/${PROJECT_ID}`);
      await expect(page.getByRole('heading', { name: 'Project Details' })).toBeVisible();

      // The PM name should still display in the read-only project details
      await expect(page.locator('text=Project Manager').first().locator('..')).toContainText(PM_NAME);
    });

    await test.step('Cleanup: Re-enable the PM', async () => {
      await page.goto('/admin/codetables');
      await expect(page.locator('table tbody tr').first()).toBeVisible();

      await page.getByRole('button', { name: 'Accomplishment', exact: true }).click();
      await page.getByRole('menuitem', { name: 'Project Manager' }).click();
      await page.getByRole('button', { name: 'Search' }).click();
      await expect(page).toHaveURL(/codeSet=PROJECT_MANAGER/);
      await page.waitForTimeout(1000);

      // Switch to Inactive filter
      await page.getByRole('button', { name: 'Active' }).click();
      await page.waitForTimeout(300);
      await page.getByRole('checkbox', { name: 'Inactive' }).check();
      await page.getByRole('checkbox', { name: 'Active', exact: true }).uncheck();
      await page.getByRole('button', { name: 'Search' }).click();
      await page.waitForTimeout(3000);

      const row = page.locator('table tbody tr', { hasText: PM_NAME });
      await expect(row).toBeVisible();
      await row.getByRole('button', { name: 'Disable Record' }).click();

      const popover = page.locator('[role="tooltip"]');
      await expect(popover).toBeVisible();
      await expect(popover).toContainText('Are you sure');
      await popover.getByRole('button', { name: 'Activate' }).dispatchEvent('click');
      await expect(row).toBeHidden({ timeout: 10_000 });
    });
  });
});
