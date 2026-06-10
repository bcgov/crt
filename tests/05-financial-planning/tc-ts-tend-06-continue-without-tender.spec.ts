/**
 * ============================================================================
 * 05-Financial-Planning - TC-TS-TEND-06: Continue without adding tender
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-TEND-06-continue-without-tender.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/05-financial-planning/tc-ts-tend-06-continue-without-tender.spec.ts --headed
 * Headless:               npx playwright test tests/05-financial-planning/tc-ts-tend-06-continue-without-tender.spec.ts
 * Debug:                  npx playwright test tests/05-financial-planning/tc-ts-tend-06-continue-without-tender.spec.ts --debug
 * Specific Test:          npx playwright test tests/05-financial-planning/tc-ts-tend-06-continue-without-tender.spec.ts -g "Continue" --headed
 *
 * OVERVIEW:
 * Verifies that a user can proceed to the Segments page from the Tender page
 * without adding any tender records, confirming that tender data is optional
 * and the user is not blocked from navigating forward in the project workflow.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Navigation Without Tender:
 *    ✅ Clicking "Segment" link navigates to the project's segments page
 *    ✅ "Project Segments" heading is visible
 *    ✅ No error message or validation alert is displayed
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-TEND-06 — Continue without adding tender', () => {
  test.setTimeout(60_000);

  test('Navigate to Segments without adding tender records', async ({ page }) => {
    await test.step('Step 1: Navigate to tender page', async () => {
      await page.goto('/projects');
      await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30000 });
      const projectLink = page.locator('table tbody tr').first().locator('td:nth-child(2) a');
      const projectUrl = await projectLink.getAttribute('href');
      await page.goto(`${projectUrl}/projecttender`);
      await expect(page.locator('text=Project Tender Details')).toBeVisible();
    });

    await test.step('Step 2: Click Segment link in navigation', async () => {
      await page.getByRole('link', { name: 'Segment' }).click();
      await page.waitForURL('**/segments');
    });

    await test.step('Step 3: Verify Segments page loaded without errors', async () => {
      await expect(page).toHaveURL(/\/projects\/\d+\/segments/);
      await expect(page.getByRole('heading', { name: /Project Segments/ })).toBeVisible();

      // Verify no error messages are displayed
      const errorAlert = page.locator('[role="alert"], .alert-danger, .error-message');
      await expect(errorAlert).toHaveCount(0);
    });
  });
});
