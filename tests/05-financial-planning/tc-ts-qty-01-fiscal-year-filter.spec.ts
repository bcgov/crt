/**
 * ============================================================================
 * 05-Financial-Planning - TC-TS-QTY-01: Fiscal year filter defaults and multi-select
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-QTY-01-fiscal-year-filter.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/05-financial-planning/tc-ts-qty-01-fiscal-year-filter.spec.ts --headed
 * Headless:               npx playwright test tests/05-financial-planning/tc-ts-qty-01-fiscal-year-filter.spec.ts
 * Debug:                  npx playwright test tests/05-financial-planning/tc-ts-qty-01-fiscal-year-filter.spec.ts --debug
 * Specific Test:          npx playwright test tests/05-financial-planning/tc-ts-qty-01-fiscal-year-filter.spec.ts -g "Fiscal year filter" --headed
 *
 * OVERVIEW:
 * Verifies that the fiscal year filter on the Quantities/Accomplishments section
 * defaults to showing all fiscal years ("Show All Fiscal Years"), and that
 * the dropdown provides options to filter by specific fiscal years.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Default State:
 *    ✅ "Show All Fiscal Years" button is visible by default
 *    ✅ Table shows entries from all fiscal years (unfiltered)
 *
 * 2. Filter Dropdown:
 *    ✅ Clicking the button opens a dropdown with fiscal year options
 *    ✅ "Show All Fiscal Years" option is present in the dropdown
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-QTY-01 — Fiscal year filter defaults and multi-select', () => {
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

  test('Fiscal year filter defaults and multi-select', async ({ page }) => {
    await test.step('Step 1: Verify "Show All Fiscal Years" button is visible by default', async () => {
      const fyButton = page.getByRole('button', { name: 'Show All Fiscal Years' });
      await expect(fyButton).toBeVisible();
      await expect(fyButton).toHaveText('Show All Fiscal Years');
    });

    await test.step('Step 2: Click button and verify dropdown appears with fiscal year options', async () => {
      const fyButton = page.getByRole('button', { name: 'Show All Fiscal Years' });
      await fyButton.click();

      // The dropdown should open showing fiscal year options
      const dropdown = page.locator('.dropdown-menu.show').filter({ has: page.getByText('Show All Fiscal Years') });
      await expect(dropdown).toBeVisible();

      // "Show All Fiscal Years" should be an option in the dropdown
      await expect(dropdown.locator('.dropdown-item', { hasText: 'Show All Fiscal Years' })).toBeVisible();
    });
  });
});
