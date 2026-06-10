/**
 * ============================================================================
 * 05-Financial-Planning - TC-TS-QTY-09: Navigation Back/Continue/Close from Qty page
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-QTY-09-navigation.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/05-financial-planning/tc-ts-qty-09-navigation.spec.ts --headed
 * Headless:               npx playwright test tests/05-financial-planning/tc-ts-qty-09-navigation.spec.ts
 * Debug:                  npx playwright test tests/05-financial-planning/tc-ts-qty-09-navigation.spec.ts --debug
 * Specific Test:          npx playwright test tests/05-financial-planning/tc-ts-qty-09-navigation.spec.ts -g "Navigation" --headed
 *
 * OVERVIEW:
 * Verifies the navigation links from the Tender/Quantities page: navigating back
 * to Financial Plan, forward to Segments, and Close to return to Project Search.
 * Uses the sub-navigation tabs (Details, Financial Plan, Tender, Segment, Close).
 *
 * WHAT THE TEST VALIDATES:
 * 1. Financial Plan (Back):
 *    ✅ Clicking "Financial Plan" navigates to /projects/79/projectplan
 *    ✅ Financial Planning Targets heading is visible
 *
 * 2. Segment (Continue):
 *    ✅ Clicking "Segment" navigates to /projects/79/segments
 *    ✅ Project Segments heading is visible
 *
 * 3. Close (Return to Search):
 *    ✅ Clicking "Close" navigates to /projects
 *    ✅ Projects heading is visible
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-QTY-09 — Navigation Back/Continue/Close from Qty page', () => {
  test.setTimeout(60_000);

  /** Helper: navigate to the first project's tender page */
  async function goToProjectTender(page: any) {
    await page.goto('/projects');
    await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30000 });
    const projectLink = page.locator('table tbody tr').first().locator('td:nth-child(2) a');
    const projectUrl = await projectLink.getAttribute('href');
    await page.goto(`${projectUrl}/projecttender`);
    await expect(page.locator('h1', { hasText: 'Quantities/Accomplishments' })).toBeVisible();
  }

  test('Navigate Back to Financial Plan', async ({ page }) => {
    await goToProjectTender(page);

    await test.step('Click Financial Plan link and verify navigation', async () => {
      await page.getByRole('link', { name: 'Financial Plan' }).click();
      await page.waitForURL('**/projectplan');

      await expect(page).toHaveURL(/\/projects\/\d+\/projectplan/);
      await expect(page.locator('h1', { hasText: 'Financial Planning Targets' })).toBeVisible();
    });
  });

  test('Navigate Forward to Segment', async ({ page }) => {
    await goToProjectTender(page);

    await test.step('Click Segment link and verify navigation', async () => {
      await page.getByRole('link', { name: 'Segment' }).click();
      await page.waitForURL('**/segments');

      await expect(page).toHaveURL(/\/projects\/\d+\/segments/);
      await expect(page.locator('h1', { hasText: 'Project Segments' })).toBeVisible();
    });
  });

  test('Navigate Close to Project Search', async ({ page }) => {
    await goToProjectTender(page);

    await test.step('Click Close link and verify navigation', async () => {
      await page.getByRole('link', { name: 'Close' }).click();
      await page.waitForURL('**/projects**');

      await expect(page).toHaveURL(/\/projects/);
      await expect(page.locator('h1', { hasText: 'Projects' })).toBeVisible();
    });
  });
});
