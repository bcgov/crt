/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-ELEM-01: Navigate to Element management screen
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-ELEM-01-navigate-elements.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-elem-01-navigate-elements.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-elem-01-navigate-elements.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-elem-01-navigate-elements.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-elem-01-navigate-elements.spec.ts -g "Navigate" --headed
 *
 * OVERVIEW:
 * Verifies that a user with Code Read + Code Write permissions can navigate
 * to the Elements management screen via the Admin menu and that the page
 * displays the expected heading, Add button, and search input.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Navigation:
 *    ✅ Admin menu contains "Elements" link
 *    ✅ Clicking navigates to /admin/elements
 *
 * 2. Page Structure:
 *    ✅ Heading "Elements Management" is displayed
 *    ✅ "Add New Element" button is visible
 *    ✅ Search input with placeholder "Search" is available
 *    ✅ Active/Inactive filter button is present
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-ELEM-01 — Navigate to Element management screen', () => {
  test.setTimeout(60_000);

  test('Navigate to Elements via Admin menu', async ({ page }) => {
    await test.step('Step 1: Navigate to application home', async () => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
    });

    await test.step('Step 2: Click Admin menu and select Elements', async () => {
      const adminLink = page.locator('.navbar a', { hasText: 'Admin' }).first();
      await adminLink.click();
      await page.waitForTimeout(500);

      const elemLink = page.locator('.dropdown-menu a', { hasText: 'Elements' });
      await expect(elemLink).toBeVisible();
      await elemLink.click();
      await page.waitForLoadState('networkidle');
    });

    await test.step('Step 3: Verify URL contains /admin/elements', async () => {
      await expect(page).toHaveURL(/\/admin\/elements/);
    });

    await test.step('Step 4: Verify page heading', async () => {
      await expect(page.getByRole('heading', { name: 'Elements Management' })).toBeVisible();
    });

    await test.step('Step 5: Verify "Add New Element" button', async () => {
      await expect(page.getByRole('button', { name: 'Add New Element' })).toBeVisible();
    });

    await test.step('Step 6: Verify search input and Active filter', async () => {
      await expect(page.locator('input[placeholder="Search"]')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Active' })).toBeVisible();
    });
  });
});
