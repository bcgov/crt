/**
 * ============================================================================
 * 04-Project-Search-Details - TC-TS-PROJ-05: PM multi-select with look-ahead filtering
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-PROJ-05-pm-multi-select-look-ahead.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/04-project-search-details/tc-ts-proj-05-pm-multi-select-look-ahead.spec.ts --headed
 * Headless:               npx playwright test tests/04-project-search-details/tc-ts-proj-05-pm-multi-select-look-ahead.spec.ts
 * Debug:                  npx playwright test tests/04-project-search-details/tc-ts-proj-05-pm-multi-select-look-ahead.spec.ts --debug
 * Specific Test:          npx playwright test tests/04-project-search-details/tc-ts-proj-05-pm-multi-select-look-ahead.spec.ts -g "PM multi-select" --headed
 *
 * OVERVIEW:
 * Verifies that the Project Manager dropdown on the Project Search page allows
 * multiple PMs to be selected and supports type-ahead filtering. Typing a partial
 * name narrows the list to matching PMs only.
 *
 * WHAT THE TEST VALIDATES:
 * 1. PM Dropdown Opens with List:
 *    ✅ Clicking "Project Manager" opens a dropdown with PM checkboxes
 *    ✅ Multiple PMs are listed
 *
 * 2. Type-Ahead Filtering:
 *    ✅ Typing "Dev" in the search input filters list to matching PMs
 *    ✅ "Devashish Bhargava" appears after filtering
 *    ✅ Non-matching PMs are hidden
 *
 * 3. Multi-Select:
 *    ✅ Multiple PM checkboxes can be checked simultaneously
 *    ✅ Selections persist while selecting additional PMs
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-PROJ-05 — PM multi-select with look-ahead filtering', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/projects');
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  test('PM multi-select with look-ahead filtering', async ({ page }) => {
    await test.step('Step 1: Open Project Manager dropdown and verify PM list', async () => {
      // Click the Project Manager button
      await page.getByRole('button', { name: 'Project Manager' }).click();

      // Wait for the multi-select dropdown to appear
      const menu = page.locator('[role="menu"].multi.show');
      await expect(menu).toBeVisible();

      // Verify there are PM options listed (more than just "Select All")
      const checkboxes = menu.getByRole('checkbox');
      const count = await checkboxes.count();
      expect(count).toBeGreaterThan(1); // At least Select All + one PM

      // Verify "Devashish Bhargava" is listed
      await expect(menu.getByText('Devashish Bhargava')).toBeVisible();
    });

    await test.step('Step 2: Type "Dev" and verify list is filtered', async () => {
      const menu = page.locator('[role="menu"].multi.show');

      // Type "Dev" in the search input within the dropdown
      const searchInput = menu.getByRole('textbox', { name: 'Search' });
      await searchInput.fill('Dev');

      // Wait for filtering to take effect
      await expect(menu.getByText('Devashish Bhargava')).toBeVisible();

      // Verify non-matching PMs are hidden
      await expect(menu.getByText('Derek So')).not.toBeVisible();
      await expect(menu.getByText('Young-Jin Chung')).not.toBeVisible();
      await expect(menu.getByText('Darrel Siegle')).not.toBeVisible();
    });

    await test.step('Step 3: Select filtered PM and verify multi-select', async () => {
      const menu = page.locator('[role="menu"].multi.show');
      const searchInput = menu.getByRole('textbox', { name: 'Search' });

      // Check "Devashish Bhargava"
      const devCheckbox = menu.getByRole('checkbox', { name: 'Devashish Bhargava' });
      await devCheckbox.check();
      await expect(devCheckbox).toBeChecked();

      // Clear search to show all options again
      await searchInput.fill('');
      await expect(menu.getByText('Derek So')).toBeVisible();

      // Check a second PM ("Derek So")
      const derekCheckbox = menu.getByRole('checkbox', { name: 'Derek So' });
      await derekCheckbox.check();
      await expect(derekCheckbox).toBeChecked();

      // Verify first selection is still checked (multi-select persists)
      await expect(devCheckbox).toBeChecked();
    });
  });
});
