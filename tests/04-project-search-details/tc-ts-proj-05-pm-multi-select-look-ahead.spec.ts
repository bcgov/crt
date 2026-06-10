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
 *    ✅ At least one PM is listed
 *
 * 2. Type-Ahead Filtering:
 *    ✅ Typing a partial name in the search input filters list to matching PMs
 *    ✅ Non-matching PMs are hidden
 *
 * 3. Multi-Select (when multiple PMs exist):
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

      // Verify there are PM options listed (at least "Select All" + one PM)
      const checkboxes = menu.getByRole('checkbox');
      const count = await checkboxes.count();
      expect(count).toBeGreaterThan(1);
    });

    await test.step('Step 2: Type partial name and verify list is filtered', async () => {
      const menu = page.locator('[role="menu"].multi.show');

      // Get all PM labels (excluding "Select All")
      const allLabels = menu.locator('label');
      const allCount = await allLabels.count();
      const pmNames: string[] = [];
      for (let i = 0; i < allCount; i++) {
        const text = (await allLabels.nth(i).textContent())?.trim();
        if (text && text !== 'Select All') {
          pmNames.push(text);
        }
      }

      // Use the first PM's first 3 characters as the type-ahead search term
      const firstPM = pmNames[0];
      const searchTerm = firstPM.substring(0, 3);

      // Type the partial name in the search input
      const searchInput = menu.getByRole('textbox', { name: 'Search' });
      await searchInput.fill(searchTerm);

      // Verify the first PM still appears (it matches the search)
      await expect(menu.getByText(firstPM)).toBeVisible();

      // If there are other PMs that don't match the search term, verify they are hidden
      const nonMatchingPMs = pmNames.filter(
        (name) => !name.toLowerCase().startsWith(searchTerm.toLowerCase())
      );
      for (const pm of nonMatchingPMs.slice(0, 2)) {
        await expect(menu.getByText(pm)).not.toBeVisible();
      }
    });

    await test.step('Step 3: Select filtered PM and verify multi-select', async () => {
      const menu = page.locator('[role="menu"].multi.show');
      const searchInput = menu.getByRole('textbox', { name: 'Search' });

      // Get the currently visible PM labels (excluding Select All)
      const visibleLabels = menu.locator('label');
      const visibleCount = await visibleLabels.count();
      let firstVisibleName = '';
      for (let i = 0; i < visibleCount; i++) {
        const text = (await visibleLabels.nth(i).textContent())?.trim();
        if (text && text !== 'Select All') {
          firstVisibleName = text;
          break;
        }
      }

      // Check the first visible PM
      const firstCheckbox = menu.getByRole('checkbox', { name: firstVisibleName });
      await firstCheckbox.check();
      await expect(firstCheckbox).toBeChecked();

      // Clear search to show all options again
      await searchInput.fill('');

      // Get all PM names to find a second PM to select
      const allLabels = menu.locator('label');
      const allCount = await allLabels.count();
      const pmNames: string[] = [];
      for (let i = 0; i < allCount; i++) {
        const text = (await allLabels.nth(i).textContent())?.trim();
        if (text && text !== 'Select All' && text !== firstVisibleName) {
          pmNames.push(text);
        }
      }

      if (pmNames.length > 0) {
        // Check a second PM
        const secondCheckbox = menu.getByRole('checkbox', { name: pmNames[0] });
        await secondCheckbox.check();
        await expect(secondCheckbox).toBeChecked();

        // Verify first selection is still checked (multi-select persists)
        await expect(firstCheckbox).toBeChecked();
      }
    });
  });
});
