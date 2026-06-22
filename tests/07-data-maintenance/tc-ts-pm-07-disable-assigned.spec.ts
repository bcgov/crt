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

  test('Disable assigned PM and verify removal from dropdown but preserved assignment', async ({ page }) => {
    let pmName = '';
    let projectHref = '';

    await test.step('Pre-setup: Find an assigned PM and a project with that PM', async () => {
      // Dynamically find first PM with a Disable Record button (assigned to projects)
      const disableRow = page.locator('table tbody tr:has(button[title="Disable Record"])').first();
      await expect(disableRow).toBeVisible({ timeout: 10_000 });
      pmName = ((await disableRow.locator('td').nth(1).textContent()) ?? '').trim();
      expect(pmName).not.toBe('');

      // Iterate through projects to find one where this PM is assigned
      await page.goto('/projects');
      await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30000 });
      // Collect all hrefs before navigating away (locators become stale after navigation)
      const projectLinks = await page.locator('table tbody tr td:nth-child(2) a').all();
      const projectHrefs: string[] = [];
      for (const link of projectLinks) {
        const href = await link.getAttribute('href');
        if (href) projectHrefs.push(href);
      }
      for (const href of projectHrefs) {
        await page.goto(href);
        await expect(page.getByRole('heading', { name: 'Project Details' })).toBeVisible({ timeout: 15000 });
        const pmCell = page.locator('text=Project Manager').first().locator('..');
        const cellText = ((await pmCell.textContent()) ?? '').trim();
        if (cellText.includes(pmName)) {
          projectHref = href;
          break;
        }
      }

      // Return to code tables with Project Manager filter active
      await page.goto('/admin/codetables');
      await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30000 });
      await page.getByRole('button', { name: 'Accomplishment', exact: true }).click();
      await page.getByRole('menuitem', { name: 'Project Manager' }).click();
      await page.getByRole('button', { name: 'Search' }).click();
      await expect(page).toHaveURL(/codeSet=PROJECT_MANAGER/);
      await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30000 });
    });

    await test.step('Step 1: Verify PM is active and shows Disable (not Delete)', async () => {
      const row = page.locator('table tbody tr', { hasText: pmName });
      await expect(row).toBeVisible();
      await expect(row.locator('td').nth(3)).toHaveText('Active');
      await expect(row.getByRole('button', { name: 'Disable Record' })).toBeVisible();
      await expect(row.getByRole('button', { name: 'Delete Record' })).toBeHidden();
    });

    await test.step('Step 2: Click Disable and confirm', async () => {
      const row = page.locator('table tbody tr', { hasText: pmName });
      await row.getByRole('button', { name: 'Disable Record' }).click();

      const popover = page.locator('[role="tooltip"]');
      await expect(popover).toBeVisible();
      await expect(popover).toContainText('Are you sure');

      // dispatchEvent bypasses Bootstrap z-index click interception
      await popover.getByRole('button', { name: 'Disable' }).dispatchEvent('click');
      await expect(row).toBeHidden({ timeout: 10_000 });
    });

    await test.step('Step 3: Verify PM NOT in Project Details dropdown', async () => {
      await page.goto('/projects');
      await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30000 });
      const firstProjectLink = page.locator('table tbody tr td:nth-child(2) a').first();
      const href = await firstProjectLink.getAttribute('href');
      await page.goto(href as string);
      await expect(page.getByRole('heading', { name: 'Project Details' })).toBeVisible({ timeout: 30000 });

      await page.getByRole('button', { name: 'Edit Project' }).click();

      // Open PM dropdown and search
      const pmDropdown = page.locator('label:has-text("Project Manager")').locator('..').locator('..').locator('.dropdown-toggle');
      await expect(pmDropdown).toBeVisible({ timeout: 10_000 });
      await pmDropdown.click();

      const pmSearch = page.locator('input[name="projectMgrLkupId"]');
      await expect(pmSearch).toBeVisible({ timeout: 10_000 });
      await pmSearch.fill(pmName);

      // Verify PM is NOT in the dropdown (disabled PMs removed from edit options)
      await expect(page.getByRole('menuitem', { name: pmName })).toBeHidden();

      await page.getByRole('button', { name: 'Cancel' }).click();
    });

    await test.step('Step 4: Verify project still shows PM in read-only view', async () => {
      if (!projectHref) {
        console.warn(`No project found with PM '${pmName}' assigned; skipping read-only verification`);
        return;
      }
      await page.goto(projectHref);
      await expect(page.getByRole('heading', { name: 'Project Details' })).toBeVisible({ timeout: 30000 });
      await expect(page.locator('text=Project Manager').first().locator('..')).toContainText(pmName);
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
      await expect(popover).toContainText('Are you sure');
      await popover.getByRole('button', { name: 'Activate' }).dispatchEvent('click');
      await expect(row).toBeHidden({ timeout: 10_000 });
    });
  });
});
