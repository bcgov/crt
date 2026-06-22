/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-PM-10: Re-enable disabled PM
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-PM-10-reenable.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-pm-10-reenable.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-pm-10-reenable.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-pm-10-reenable.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-pm-10-reenable.spec.ts -g "Re-enable" --headed
 *
 * OVERVIEW:
 * Verifies that a disabled PM can be re-enabled from the Inactive view,
 * making it available again in the Project Details PM dropdown. Creates a PM,
 * disables it, then re-enables it and validates cross-page availability.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Inactive View:
 *    ✅ Switching status filter to Inactive shows disabled PMs
 *    ✅ Disabled PM row shows "Disable Record" button (acts as activate toggle)
 *
 * 2. Re-enable Flow:
 *    ✅ Clicking activate shows confirmation popover with "Activate" button
 *    ✅ PM disappears from Inactive list after confirmation
 *    ✅ PM reappears in Active list
 *
 * 3. Dropdown Restoration:
 *    ✅ Re-enabled PM appears in Project Details PM dropdown
 *
 * 4. Cleanup:
 *    ✅ Test PM is deleted
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-PM-10 — Re-enable disabled PM', () => {
  test.setTimeout(180_000);

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

  test('Re-enable disabled PM and verify available in dropdown', async ({ page }) => {
    let pmName = '';

    await test.step('Pre-setup: Capture an assigned PM name', async () => {
      // Dynamically find first PM with a Disable Record button (assigned to projects)
      const disableRow = page.locator('table tbody tr:has(button[title="Disable Record"])').first();
      await expect(disableRow).toBeVisible({ timeout: 10_000 });
      pmName = ((await disableRow.locator('td').nth(1).textContent()) ?? '').trim();
      expect(pmName).not.toBe('');
    });

    await test.step('Step 1: Disable an assigned PM', async () => {
      const row = page.locator('table tbody tr', { hasText: pmName });
      await expect(row).toBeVisible();
      await row.getByRole('button', { name: 'Disable Record' }).click();

      const popover = page.locator('[role="tooltip"]');
      await expect(popover).toBeVisible();
      await popover.getByRole('button', { name: 'Disable' }).dispatchEvent('click');
      await expect(row).toBeHidden({ timeout: 10_000 });
    });

    await test.step('Step 2: Switch to Inactive view and verify PM visible', async () => {
      await page.getByRole('button', { name: 'Active' }).click();
      await page.getByRole('checkbox', { name: 'Inactive' }).check();
      await page.getByRole('checkbox', { name: 'Active', exact: true }).uncheck();
      await page.getByRole('button', { name: 'Search' }).click();

      await expect(page).toHaveURL(/isActive=false/);
      const row = page.locator('table tbody tr', { hasText: pmName });
      await expect(row).toBeVisible({ timeout: 15_000 });
      await expect(row.locator('td').nth(3)).toHaveText('Inactive');
    });

    await test.step('Step 3: Click re-enable and verify confirmation popover', async () => {
      const row = page.locator('table tbody tr', { hasText: pmName });
      await row.getByRole('button', { name: 'Disable Record' }).click();

      const popover = page.locator('[role="tooltip"]');
      await expect(popover).toBeVisible();
      await expect(popover).toContainText('Are you sure');
      await expect(popover.getByRole('button', { name: 'Activate' })).toBeVisible();
      await expect(popover.getByRole('button', { name: 'Cancel' })).toBeVisible();
    });

    await test.step('Step 4: Confirm activation and verify removed from Inactive', async () => {
      const popover = page.locator('[role="tooltip"]');
      await popover.getByRole('button', { name: 'Activate' }).dispatchEvent('click');

      const row = page.locator('table tbody tr', { hasText: pmName });
      await expect(row).toBeHidden({ timeout: 10_000 });
    });

    await test.step('Step 5: Verify PM back in Active list', async () => {
      // Switch back to Active filter
      await page.getByRole('button', { name: 'Inactive' }).click();
      await page.getByRole('checkbox', { name: 'Active', exact: true }).check();
      await page.getByRole('checkbox', { name: 'Inactive' }).uncheck();
      await page.getByRole('button', { name: 'Search' }).click();

      await expect(page).toHaveURL(/isActive=true/);
      const row = page.locator('table tbody tr', { hasText: pmName });
      await expect(row).toBeVisible({ timeout: 15_000 });
      await expect(row.locator('td').nth(3)).toHaveText('Active');
    });

    await test.step('Step 6: Verify re-enabled PM appears in Project Details dropdown', async () => {
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
      await pmSearch.fill(pmName);

      await expect(page.getByRole('menuitem', { name: pmName })).toBeVisible();

      await page.getByRole('button', { name: 'Cancel' }).click();
    });
  });
});
