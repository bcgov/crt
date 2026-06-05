/**
 * ============================================================================
 * 04-Project-Search-Details - TC-TS-PROJ-09: Status filter options and default value
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-PROJ-09-status-filter-default.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/04-project-search-details/tc-ts-proj-09-status-filter-default.spec.ts --headed
 * Headless:               npx playwright test tests/04-project-search-details/tc-ts-proj-09-status-filter-default.spec.ts
 * Debug:                  npx playwright test tests/04-project-search-details/tc-ts-proj-09-status-filter-default.spec.ts --debug
 * Specific Test:          npx playwright test tests/04-project-search-details/tc-ts-proj-09-status-filter-default.spec.ts -g "Status filter options" --headed
 *
 * OVERVIEW:
 * Verifies that the Status dropdown on the Project Search page contains the
 * expected options (Active, Closed) and that "Active" is selected by default
 * on page load.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Default State:
 *    ✅ The status button displays "Active" by default on page load
 *
 * 2. Dropdown Options:
 *    ✅ Opening the dropdown reveals "Active" and "Closed" options
 *    ✅ "Active" checkbox is checked by default
 *    ✅ "Closed" checkbox is unchecked by default
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-PROJ-09 — Status filter options and default value', () => {
  test.setTimeout(60_000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/projects');
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
  });

  test('Status filter options and default value', async ({ page }) => {
    await test.step('Step 1: Verify "Active" button is visible as default status', async () => {
      const statusButton = page.getByRole('button', { name: 'Active' });
      await expect(statusButton).toBeVisible();
      await expect(statusButton).toHaveText('Active');
    });

    await test.step('Step 2: Open status dropdown and verify options', async () => {
      // Click the Active/Status button to open dropdown
      await page.getByRole('button', { name: 'Active' }).click();

      const menu = page.locator('[role="menu"].multi.show');
      await expect(menu).toBeVisible();

      // Verify "Active" option is present and checked
      const activeCheckbox = menu.getByRole('checkbox', { name: 'Active' });
      await expect(activeCheckbox).toBeVisible();
      await expect(activeCheckbox).toBeChecked();

      // Verify "Closed" option is present and unchecked
      const closedCheckbox = menu.getByRole('checkbox', { name: 'Closed' });
      await expect(closedCheckbox).toBeVisible();
      await expect(closedCheckbox).not.toBeChecked();
    });
  });
});
