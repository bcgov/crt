/**
 * ============================================================================
 * 08 UI Enhancements - TC-TS-UI-01: Top navigation buttons visible
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-UI-01-top-nav.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/08-ui-enhancements/tc-ts-ui-01-top-nav.spec.ts --headed
 * Headless:               npx playwright test tests/08-ui-enhancements/tc-ts-ui-01-top-nav.spec.ts
 * Debug:                  npx playwright test tests/08-ui-enhancements/tc-ts-ui-01-top-nav.spec.ts --debug
 * Specific Test:          npx playwright test tests/08-ui-enhancements/tc-ts-ui-01-top-nav.spec.ts -g "Top navigation buttons visible" --headed
 *
 * OVERVIEW:
 * Verifies that navigation buttons are visible at the top of every project
 * sub-screen (Details, Financial Plan, Tender, Segment). Ensures users can
 * directly navigate between project tabs without scrolling.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Navigation Visibility on Project Details:
 *    ✅ All navigation tabs are visible in the viewport
 *    ✅ Navigation includes Details, Financial Plan, Tender, Segment, Close
 *
 * 2. Navigation Visibility on Financial Plan:
 *    ✅ Navigation tabs remain visible after navigating to Financial Plan
 *    ✅ All expected tab links are present
 *
 * 3. Navigation Visibility on Tender Details:
 *    ✅ Navigation tabs remain visible after navigating to Tender
 *    ✅ All expected tab links are present
 *
 * 4. Navigation Visibility on Segments:
 *    ✅ Navigation tabs remain visible after navigating to Segments
 *    ✅ All expected tab links are present
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

// Navigation tab labels expected on every project sub-screen
const EXPECTED_NAV_TABS = [
  { name: 'Details', accessible: 'Go to Project Details' },
  { name: 'Financial Plan', accessible: 'Go to Project Plan' },
  { name: 'Tender', accessible: 'Go to Project Tenders' },
  { name: 'Segment', accessible: 'Go to Project Segments' },
  { name: 'Close', accessible: 'Return to Project Search' },
];

test.describe('TC-TS-UI-01 — Top navigation buttons visible', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the Projects list and open the first available project
    await page.goto('/projects?isInProgress=true&pageNumber=1&pageSize=25');
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();

    // Click the first project link in the table
    const firstProjectLink = page.locator('table tbody tr:first-child td:nth-child(2) a');
    await expect(firstProjectLink).toBeVisible();
    await firstProjectLink.click();

    // Verify we're on the Project Details page
    await expect(page.getByRole('heading', { name: 'Project Details' })).toBeVisible();
  });

  /**
   * Helper to verify all navigation tabs are visible in the viewport.
   */
  async function verifyNavigationTabsVisible(page: import('@playwright/test').Page) {
    for (const tab of EXPECTED_NAV_TABS) {
      const tabItem = page.getByRole('listitem', { name: tab.accessible });
      await expect(tabItem).toBeVisible();
      await expect(tabItem).toBeInViewport();
    }
  }

  test('Top navigation buttons visible on all project sub-screens', async ({ page }) => {
    await test.step('Step 1: Verify navigation buttons on Project Details page', async () => {
      await verifyNavigationTabsVisible(page);
    });

    await test.step('Step 2: Navigate to Financial Plan and verify navigation buttons', async () => {
      await page.getByRole('link', { name: 'Financial Plan' }).click();
      await expect(page).toHaveURL(/\/projectplan$/);
      await verifyNavigationTabsVisible(page);
    });

    await test.step('Step 3: Navigate to Tender and verify navigation buttons', async () => {
      await page.getByRole('link', { name: 'Tender' }).click();
      await expect(page).toHaveURL(/\/projecttender$/);
      await verifyNavigationTabsVisible(page);
    });

    await test.step('Step 4: Navigate to Segment and verify navigation buttons', async () => {
      await page.getByRole('link', { name: 'Segment' }).click();
      await expect(page).toHaveURL(/\/segments$/);
      await verifyNavigationTabsVisible(page);
    });
  });
});
