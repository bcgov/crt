/**
 * ============================================================================
 * 05-Financial-Planning - TC-TS-FIN-01: Navigate to Financial Planning screen
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-FIN-01-navigate-planning-screen.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/05-financial-planning/tc-ts-fin-01-navigate-planning-screen.spec.ts --headed
 * Headless:               npx playwright test tests/05-financial-planning/tc-ts-fin-01-navigate-planning-screen.spec.ts
 * Debug:                  npx playwright test tests/05-financial-planning/tc-ts-fin-01-navigate-planning-screen.spec.ts --debug
 * Specific Test:          npx playwright test tests/05-financial-planning/tc-ts-fin-01-navigate-planning-screen.spec.ts -g "Navigate" --headed
 *
 * OVERVIEW:
 * Verifies that a user can navigate from Project Details to the Financial Planning
 * Targets screen via the "Financial Plan" sub-navigation tab, and that the fiscal
 * year filter button is visible.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Navigation:
 *    ✅ Clicking "Financial Plan" link navigates to /projects/79/projectplan
 *    ✅ "Financial Planning Targets" heading is visible
 *    ✅ "Show All Fiscal Years" button is visible
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-FIN-01 — Navigate to Financial Planning screen', () => {
  test.setTimeout(60_000);

  test('Navigate from Project Details to Financial Planning', async ({ page }) => {
    await test.step('Step 1: Start on project details page', async () => {
      await page.goto('/projects/79');
      await expect(page.getByRole('heading', { name: 'Project Details' })).toBeVisible();
    });

    await test.step('Step 2: Click Financial Plan link', async () => {
      await page.getByRole('link', { name: 'Financial Plan' }).click();
      await page.waitForURL('**/projectplan');
    });

    await test.step('Step 3: Verify Financial Planning page loaded', async () => {
      await expect(page).toHaveURL(/\/projects\/79\/projectplan/);
      await expect(page.locator('h1', { hasText: 'Financial Planning Targets' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Show All Fiscal Years' })).toBeVisible();
    });
  });
});
