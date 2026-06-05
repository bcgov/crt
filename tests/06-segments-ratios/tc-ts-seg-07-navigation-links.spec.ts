/**
 * ============================================================================
 * 06-Spatial-Segments-Ratios - TC-TS-SEG-07: Navigation links from Segments page
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-SEG-07-navigation-links.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/06-segments-ratios/tc-ts-seg-07-navigation-links.spec.ts --headed
 * Headless:               npx playwright test tests/06-segments-ratios/tc-ts-seg-07-navigation-links.spec.ts
 * Debug:                  npx playwright test tests/06-segments-ratios/tc-ts-seg-07-navigation-links.spec.ts --debug
 * Specific Test:          npx playwright test tests/06-segments-ratios/tc-ts-seg-07-navigation-links.spec.ts -g "Details" --headed
 *
 * OVERVIEW:
 * Verifies that all sub-navigation links from the Segments page work correctly:
 * Details, Financial Plan, Tender, and Close (back to project list).
 *
 * WHAT THE TEST VALIDATES:
 * 1. Navigation Links:
 *    ✅ "Details" navigates to /projects/79 with "Project Details" heading
 *    ✅ "Financial Plan" navigates to /projects/79/projectplan
 *    ✅ "Tender" navigates to /projects/79/projecttender
 *    ✅ "Close" navigates to /projects (search page)
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-SEG-07 — Navigation links from Segments page', () => {
  test.setTimeout(60_000);

  test('Navigate to Details from Segments', async ({ page }) => {
    await test.step('Step 1: Start on segments page', async () => {
      await page.goto('/projects/79/segments');
      await expect(page.getByText('Project Segments')).toBeVisible();
    });

    await test.step('Step 2: Click Details link and verify', async () => {
      await page.getByRole('link', { name: 'Details' }).click();
      await page.waitForURL('**/projects/79');
      await expect(page).toHaveURL(/\/projects\/79$/);
      await expect(page.getByRole('heading', { name: 'Project Details' })).toBeVisible();
    });
  });

  test('Navigate to Financial Plan from Segments', async ({ page }) => {
    await test.step('Step 1: Start on segments page', async () => {
      await page.goto('/projects/79/segments');
      await expect(page.getByText('Project Segments')).toBeVisible();
    });

    await test.step('Step 2: Click Financial Plan link and verify', async () => {
      await page.getByRole('link', { name: 'Financial Plan' }).click();
      await page.waitForURL('**/projectplan');
      await expect(page).toHaveURL(/\/projects\/79\/projectplan/);
      await expect(page.getByText('Financial Planning Targets')).toBeVisible();
    });
  });

  test('Navigate to Tender from Segments', async ({ page }) => {
    await test.step('Step 1: Start on segments page', async () => {
      await page.goto('/projects/79/segments');
      await expect(page.getByText('Project Segments')).toBeVisible();
    });

    await test.step('Step 2: Click Tender link and verify', async () => {
      await page.getByRole('link', { name: 'Tender' }).click();
      await page.waitForURL('**/projecttender');
      await expect(page).toHaveURL(/\/projects\/79\/projecttender/);
      await expect(page.getByText('Project Tender Details')).toBeVisible();
    });
  });

  test('Navigate to Close (Projects search) from Segments', async ({ page }) => {
    await test.step('Step 1: Start on segments page', async () => {
      await page.goto('/projects/79/segments');
      await expect(page.getByText('Project Segments')).toBeVisible();
    });

    await test.step('Step 2: Click Close link and verify', async () => {
      await page.getByRole('link', { name: 'Close' }).click();
      await page.waitForURL('**/projects**');
      await expect(page).toHaveURL(/\/projects/);
    });
  });
});
