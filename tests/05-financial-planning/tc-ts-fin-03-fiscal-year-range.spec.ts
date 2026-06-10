/**
 * ============================================================================
 * 05-Financial-Planning - TC-TS-FIN-03: Fiscal Year dropdown range 2010/2011 to 2027/2028
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-FIN-03-fiscal-year-range.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/05-financial-planning/tc-ts-fin-03-fiscal-year-range.spec.ts --headed
 * Headless:               npx playwright test tests/05-financial-planning/tc-ts-fin-03-fiscal-year-range.spec.ts
 * Debug:                  npx playwright test tests/05-financial-planning/tc-ts-fin-03-fiscal-year-range.spec.ts --debug
 * Specific Test:          npx playwright test tests/05-financial-planning/tc-ts-fin-03-fiscal-year-range.spec.ts -g "Fiscal Year" --headed
 *
 * OVERVIEW:
 * Verifies that the Fiscal Year dropdown in the Add Financial Target form contains
 * the full range from 2010/2011 to 2027/2028 (18 fiscal years) plus a "TBD" option,
 * totaling 19 options.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Dropdown Content:
 *    ✅ First option is "2010/2011"
 *    ✅ Last fiscal year is "2027/2028"
 *    ✅ "TBD" option is present
 *    ✅ Total count is 19 options (18 years + TBD)
 *    ✅ Years increment annually (2010/2011, 2011/2012, ... 2027/2028)
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-FIN-03 — Fiscal Year dropdown range 2010/2011 to 2027/2028', () => {
  test.setTimeout(60_000);

  test.beforeEach(async ({ page }) => {
    // Navigate to the first project's financial plan dynamically
    await page.goto('/projects');
    await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30000 });
    const projectLink = page.locator('table tbody tr').first().locator('td:nth-child(2) a');
    const projectUrl = await projectLink.getAttribute('href');
    await page.goto(`${projectUrl}/projectplan`);
    await expect(page.locator('h1', { hasText: 'Financial Planning Targets' })).toBeVisible();
  });

  test('Fiscal Year dropdown contains full range with TBD', async ({ page }) => {
    await test.step('Step 1: Open Add dialog', async () => {
      await page.locator('button[title="Add Finanical Planning Target"]').click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
    });

    await test.step('Step 2: Open Fiscal Year dropdown and verify options', async () => {
      const dialog = page.locator('[role="dialog"]');

      // Open the FY dropdown
      await dialog.locator('button.dropdown-toggle').first().click();
      await page.waitForTimeout(300);

      // Get all button options (skip search input)
      const options = await dialog.locator('.dropdown-menu.show button.dropdown-item').allTextContents();

      // Verify total count: 18 fiscal years + TBD = 19
      expect(options).toHaveLength(19);

      // Verify first and last fiscal years
      expect(options[0]).toBe('2010/2011');
      expect(options[17]).toBe('2027/2028');

      // Verify TBD
      expect(options[18]).toBe('TBD');

      // Verify sequential years (spot-check)
      expect(options[1]).toBe('2011/2012');
      expect(options[14]).toBe('2024/2025');
      expect(options[16]).toBe('2026/2027');
    });

    await test.step('Cleanup: Close dialog', async () => {
      const dialog = page.locator('[role="dialog"]');
      await dialog.getByRole('button', { name: 'Close' }).click();
    });
  });
});
