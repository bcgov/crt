/**
 * ============================================================================
 * 06-Spatial-Segments-Ratios - TC-TS-SEG-01: Navigate to Project Segments screen
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-SEG-01-navigate-segments.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/06-segments-ratios/tc-ts-seg-01-navigate-segments.spec.ts --headed
 * Headless:               npx playwright test tests/06-segments-ratios/tc-ts-seg-01-navigate-segments.spec.ts
 * Debug:                  npx playwright test tests/06-segments-ratios/tc-ts-seg-01-navigate-segments.spec.ts --debug
 * Specific Test:          npx playwright test tests/06-segments-ratios/tc-ts-seg-01-navigate-segments.spec.ts -g "Navigate" --headed
 *
 * OVERVIEW:
 * Verifies that a user can navigate to the Project Segments screen from the
 * project sub-navigation tabs and that the screen loads correctly with both
 * "Project Segments" and "Project Ratios" sections visible.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Navigation:
 *    ✅ Clicking "Segment" link navigates to /projects/79/segments
 *    ✅ "Project Segments" section heading is visible
 *    ✅ "+ Add Segment / View Map" button is present
 *    ✅ "Project Ratios" section heading is visible
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-SEG-01 — Navigate to Project Segments screen', () => {
  test.setTimeout(60_000);

  test('Navigate from Project Details to Segments page', async ({ page }) => {
    await test.step('Step 1: Start on project details page', async () => {
      await page.goto('/projects/79');
      await expect(page.getByRole('heading', { name: 'Project Details' })).toBeVisible();
    });

    await test.step('Step 2: Click Segment link in navigation', async () => {
      await page.getByRole('link', { name: 'Segment' }).click();
      await page.waitForURL('**/segments');
    });

    await test.step('Step 3: Verify Segments page loaded correctly', async () => {
      await expect(page).toHaveURL(/\/projects\/79\/segments/);
      await expect(page.getByText('Project Segments')).toBeVisible();
      await expect(page.getByRole('button', { name: '+ Add Segment / View Map' })).toBeVisible();
      await expect(page.getByText('Project Ratios')).toBeVisible();
    });
  });
});
