/**
 * ============================================================================
 * 04-Project-Search-Details - TC-TS-PROJ-10: Status multi-select Active and Closed
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-PROJ-10-status-multi-select.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/04-project-search-details/tc-ts-proj-10-status-multi-select.spec.ts --headed
 * Headless:               npx playwright test tests/04-project-search-details/tc-ts-proj-10-status-multi-select.spec.ts
 * Debug:                  npx playwright test tests/04-project-search-details/tc-ts-proj-10-status-multi-select.spec.ts --debug
 * Specific Test:          npx playwright test tests/04-project-search-details/tc-ts-proj-10-status-multi-select.spec.ts -g "Status multi-select" --headed
 *
 * OVERVIEW:
 * Verifies that both "Active" and "Closed" status options can be selected
 * simultaneously in the Status dropdown, and that search results include
 * projects of both statuses.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Multi-Select:
 *    ✅ Both "Active" and "Closed" checkboxes can be checked simultaneously
 *
 * 2. Filtered Results:
 *    ✅ After searching, results include projects with "Active" status
 *    ✅ After searching, results include projects with "Closed" status
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-PROJ-10 — Status multi-select Active and Closed', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/projects');
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  test('Status multi-select Active and Closed', async ({ page }) => {
    await test.step('Step 1: Open Status dropdown and select both Active and Closed', async () => {
      // Click the Active/Status button to open dropdown
      await page.getByRole('button', { name: 'Active' }).click();

      const menu = page.locator('[role="menu"].multi.show');
      await expect(menu).toBeVisible();

      // "Active" should already be checked by default
      const activeCheckbox = menu.getByRole('checkbox', { name: 'Active' });
      await expect(activeCheckbox).toBeChecked();

      // Check "Closed" as well
      const closedCheckbox = menu.getByRole('checkbox', { name: 'Closed' });
      await closedCheckbox.check();

      // Verify both are checked simultaneously
      await expect(activeCheckbox).toBeChecked();
      await expect(closedCheckbox).toBeChecked();
    });

    await test.step('Step 2: Click Search and verify results include both statuses', async () => {
      // Click Search
      await page.getByRole('button', { name: 'Search' }).click();

      // Wait for results
      await expect(page.locator('table tbody tr').first()).toBeVisible();

      // Get all status values from the table
      // Status is shown as "Active" or "Closed" text in one of the cells
      const rows = page.locator('table tbody tr');
      const rowCount = await rows.count();
      expect(rowCount).toBeGreaterThan(0);

      // Verify at least one "Active" project exists
      await expect(page.locator('table tbody tr td', { hasText: /^Active$/ }).first()).toBeVisible();

      // Verify at least one "Closed" project exists
      await expect(page.locator('table tbody tr td', { hasText: /^Closed$/ }).first()).toBeVisible();
    });
  });
});
