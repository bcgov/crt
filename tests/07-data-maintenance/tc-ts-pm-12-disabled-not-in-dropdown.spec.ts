/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-PM-12: Disabled PM not in Project Details dropdown
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-PM-12-disabled-not-in-dropdown.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-pm-12-disabled-not-in-dropdown.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-pm-12-disabled-not-in-dropdown.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-pm-12-disabled-not-in-dropdown.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-pm-12-disabled-not-in-dropdown.spec.ts -g "Disabled" --headed
 *
 * OVERVIEW:
 * Verifies that a disabled PM does NOT appear in the Project Details PM
 * dropdown for new assignments. Disables an existing PM (Devashish Bhargava),
 * checks the dropdown, and re-enables after verification.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Disabled PM Excluded from Dropdown:
 *    ✅ Disabled PM does not appear in Project Details PM type-ahead
 *    ✅ Only active PMs are listed for new assignments
 *
 * 2. Cleanup:
 *    ✅ PM is re-enabled to restore original state
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-PM-12 — Disabled PM not in Project Details dropdown', () => {
  test.setTimeout(180_000);

  const PM_NAME = 'Devashish Bhargava';

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

  test('Disabled PM does not appear in Project Details dropdown', async ({ page }) => {
    let pmName = '';

    await test.step('Pre-setup: Capture an assigned PM name', async () => {
      // Dynamically find first PM with a Disable Record button (assigned to projects)
      const disableRow = page.locator('table tbody tr:has(button[title="Disable Record"])').first();
      await expect(disableRow).toBeVisible({ timeout: 10_000 });
      pmName = ((await disableRow.locator('td').nth(1).textContent()) ?? '').trim();
      expect(pmName).not.toBe('');
    });

    await test.step('Step 1: Disable PM', async () => {
      const row = page.locator('table tbody tr', { hasText: pmName });
      await expect(row).toBeVisible();
      await row.getByRole('button', { name: 'Disable Record' }).click();

      const popover = page.locator('[role="tooltip"]');
      await expect(popover).toBeVisible();
      await popover.getByRole('button', { name: 'Disable' }).dispatchEvent('click');
      await expect(row).toBeHidden({ timeout: 10_000 });
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

    await test.step('Step 3: Verify disabled PM NOT in dropdown', async () => {
      const pmDropdown = page.locator('label:has-text("Project Manager")').locator('..').locator('..').locator('.dropdown-toggle');
      await expect(pmDropdown).toBeVisible({ timeout: 10_000 });
      await pmDropdown.click();

      const pmSearch = page.locator('input[name="projectMgrLkupId"]');
      await expect(pmSearch).toBeVisible({ timeout: 10_000 });
      await pmSearch.fill(pmName);

      // Verify PM does NOT appear in the dropdown
      await expect(page.getByRole('menuitem', { name: pmName })).toBeHidden();

      await page.getByRole('button', { name: 'Cancel' }).click();
    });

    await test.step('Cleanup: Re-enable the PM', async () => {
      await page.goto('/admin/codetables');
      await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30000 });

      await page.getByRole('button', { name: 'Accomplishment', exact: true }).click();
      await page.getByRole('menuitem', { name: 'Project Manager' }).click();
      await page.getByRole('button', { name: 'Search' }).click();
      await expect(page).toHaveURL(/codeSet=PROJECT_MANAGER/);

      // Switch to Inactive filter
      await page.getByRole('button', { name: 'Active' }).click();
      await page.getByRole('checkbox', { name: 'Inactive' }).check();
      await page.getByRole('checkbox', { name: 'Active', exact: true }).uncheck();
      await page.getByRole('button', { name: 'Search' }).click();

      const row = page.locator('table tbody tr', { hasText: pmName });
      await expect(row).toBeVisible({ timeout: 15_000 });
      await row.getByRole('button', { name: 'Disable Record' }).click();

      const popover = page.locator('[role="tooltip"]');
      await expect(popover).toBeVisible();
      await popover.getByRole('button', { name: 'Activate' }).dispatchEvent('click');
      await expect(row).toBeHidden({ timeout: 10_000 });
    });
  });
});
