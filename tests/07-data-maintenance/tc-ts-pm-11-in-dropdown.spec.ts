/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-PM-11: PM appears in Project Details dropdown
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-PM-11-in-dropdown.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-pm-11-in-dropdown.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-pm-11-in-dropdown.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-pm-11-in-dropdown.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-pm-11-in-dropdown.spec.ts -g "dropdown" --headed
 *
 * OVERVIEW:
 * Verifies that a newly added active PM immediately appears in the Project
 * Details PM dropdown for assignment. Creates a test PM, navigates to a
 * project edit form, and confirms the PM is available in the type-ahead
 * dropdown.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Active PM in Dropdown:
 *    ✅ Newly added PM appears in Project Details PM dropdown
 *    ✅ PM is found via type-ahead filter
 *    ✅ PM is selectable (menuitem role)
 *
 * 2. Cleanup:
 *    ✅ Test PM is deleted
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-PM-11 — PM appears in Project Details dropdown', () => {
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

  test('Active PM appears in Project Details PM dropdown', async ({ page }) => {
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

    await test.step('Step 1: Create an active test PM', async () => {
      await page.getByRole('button', { name: 'Add New Project Manager' }).click();
      const dialog = page.getByRole('dialog').filter({ hasText: 'Add Project Manager' });
      await expect(dialog).toBeVisible();
      await dialog.locator('input[name="codeName"]').fill(PM_NAME);
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });
      await expect(page.locator('table tbody tr', { hasText: PM_NAME })).toBeVisible();
    });

    await test.step('Step 2: Navigate to Project Details and open edit form', async () => {
      await page.goto('/projects');
      await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30000 });
      const firstProjectLink = page.locator('table tbody tr td:nth-child(2) a').first();
      const href = await firstProjectLink.getAttribute('href');
      await page.goto(href as string);
      await expect(page.getByRole('heading', { name: 'Project Details' })).toBeVisible({ timeout: 30000 });
      await page.getByRole('button', { name: 'Edit Project' }).click();
    });

    await test.step('Step 3: Verify PM appears in dropdown via type-ahead', async () => {
      const pmDropdown = page.locator('label:has-text("Project Manager")').locator('..').locator('..').locator('.dropdown-toggle');
      await expect(pmDropdown).toBeVisible({ timeout: 10_000 });
      await pmDropdown.click();

      const pmSearch = page.locator('input[name="projectMgrLkupId"]');
      await expect(pmSearch).toBeVisible({ timeout: 10_000 });
      await pmSearch.fill('CRT-AUTO');

      // Verify PM appears and is selectable
      const pmOption = page.getByRole('menuitem', { name: PM_NAME });
      await expect(pmOption).toBeVisible();

      // Cancel without saving
      await page.getByRole('button', { name: 'Cancel' }).click();
    });

    await test.step('Cleanup: Delete the test PM', async () => {
      await page.goto('/admin/codetables');
      await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30000 });

      await page.getByRole('button', { name: 'Accomplishment', exact: true }).click();
      await page.getByRole('menuitem', { name: 'Project Manager' }).click();
      await page.getByRole('button', { name: 'Search' }).click();
      await expect(page).toHaveURL(/codeSet=PROJECT_MANAGER/);

      const row = page.locator('table tbody tr', { hasText: PM_NAME });
      await expect(row).toBeVisible();
      await row.getByRole('button', { name: 'Delete Record' }).click();

      const popover = page.locator('[role="tooltip"]');
      await expect(popover).toBeVisible();
      await popover.getByRole('button', { name: 'Delete' }).dispatchEvent('click');
      await expect(row).toBeHidden({ timeout: 10_000 });
    });
  });
});
