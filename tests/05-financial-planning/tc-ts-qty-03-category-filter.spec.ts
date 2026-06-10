/**
 * ============================================================================
 * 05-Financial-Planning - TC-TS-QTY-03: Category filter Qty/Accmp/All
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-QTY-03-category-filter.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/05-financial-planning/tc-ts-qty-03-category-filter.spec.ts --headed
 * Headless:               npx playwright test tests/05-financial-planning/tc-ts-qty-03-category-filter.spec.ts
 * Debug:                  npx playwright test tests/05-financial-planning/tc-ts-qty-03-category-filter.spec.ts --debug
 * Specific Test:          npx playwright test tests/05-financial-planning/tc-ts-qty-03-category-filter.spec.ts -g "Category filter" --headed
 *
 * OVERVIEW:
 * Verifies that the Quantities/Accomplishments section can be filtered by
 * category: "Show All Qty/Accmp" (default), "Accomplishment" only, or
 * "Quantity" only. The dropdown provides these three options.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Default State:
 *    ✅ "Show All Qty/Accmp" is the default button text
 *
 * 2. Filter Options:
 *    ✅ Dropdown contains "Show All Qty/Accmp", "Accomplishment", and "Quantity"
 *    ✅ Selecting "Accomplishment" changes the button text
 *    ✅ Selecting "Quantity" changes the button text
 *    ✅ Selecting "Show All Qty/Accmp" restores default
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-QTY-03 — Category filter Qty/Accmp/All', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    // Navigate to the first project's tender page dynamically
    await page.goto('/projects');
    await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30000 });
    const projectLink = page.locator('table tbody tr').first().locator('td:nth-child(2) a');
    const projectUrl = await projectLink.getAttribute('href');
    await page.goto(`${projectUrl}/projecttender`);
    await expect(page.locator('h1', { hasText: 'Quantities/Accomplishments' })).toBeVisible();
  });

  test('Category filter Qty/Accmp/All', async ({ page }) => {
    await test.step('Step 1: Verify default button text is "Show All Qty/Accmp"', async () => {
      const filterButton = page.getByRole('button', { name: 'Show All Qty/Accmp' });
      await expect(filterButton).toBeVisible();
      await expect(filterButton).toHaveText('Show All Qty/Accmp');
    });

    await test.step('Step 2: Open dropdown and verify all three options present', async () => {
      await page.getByRole('button', { name: 'Show All Qty/Accmp' }).click();

      const dropdown = page.locator('.dropdown-menu.show').filter({ has: page.getByText('Accomplishment') });
      await expect(dropdown).toBeVisible();

      await expect(dropdown.locator('.dropdown-item', { hasText: 'Show All Qty/Accmp' })).toBeVisible();
      await expect(dropdown.locator('.dropdown-item', { hasText: 'Accomplishment' })).toBeVisible();
      await expect(dropdown.locator('.dropdown-item', { hasText: 'Quantity' })).toBeVisible();
    });

    await test.step('Step 3: Select "Accomplishment" filter', async () => {
      const dropdown = page.locator('.dropdown-menu.show');
      await dropdown.locator('.dropdown-item', { hasText: /^Accomplishment$/ }).click();

      // Button text should change to indicate the filter
      const filterButton = page.locator('button', { hasText: /Accomplishment/ }).first();
      await expect(filterButton).toBeVisible();
    });

    await test.step('Step 4: Switch to "Quantity" filter', async () => {
      // Re-open the dropdown (button text may have changed)
      const filterButton = page.locator('button.dropdown-toggle', { hasText: /Accomplishment|Quantity|Qty/ }).first();
      await filterButton.click();

      const dropdown = page.locator('.dropdown-menu.show').filter({ has: page.getByText('Quantity') });
      await expect(dropdown).toBeVisible();
      await dropdown.locator('.dropdown-item', { hasText: /^Quantity$/ }).click();

      // Button text should update
      const updatedButton = page.locator('button.dropdown-toggle', { hasText: /Quantity/ }).first();
      await expect(updatedButton).toBeVisible();
    });

    await test.step('Step 5: Reset to "Show All Qty/Accmp"', async () => {
      // Re-open the dropdown
      const filterButton = page.locator('button.dropdown-toggle', { hasText: /Quantity|Accomplishment|Qty/ }).first();
      await filterButton.click();

      const dropdown = page.locator('.dropdown-menu.show');
      await expect(dropdown).toBeVisible();
      await dropdown.locator('.dropdown-item', { hasText: 'Show All Qty/Accmp' }).click();

      // Button text should be back to default
      await expect(page.getByRole('button', { name: 'Show All Qty/Accmp' })).toBeVisible();
    });
  });
});
