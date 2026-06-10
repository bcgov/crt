/**
 * ============================================================================
 * 05-Financial-Planning - TC-TS-QTY-02: Quantities table displays correct columns
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-QTY-02-table-columns.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/05-financial-planning/tc-ts-qty-02-table-columns.spec.ts --headed
 * Headless:               npx playwright test tests/05-financial-planning/tc-ts-qty-02-table-columns.spec.ts
 * Debug:                  npx playwright test tests/05-financial-planning/tc-ts-qty-02-table-columns.spec.ts --debug
 * Specific Test:          npx playwright test tests/05-financial-planning/tc-ts-qty-02-table-columns.spec.ts -g "Quantities table displays correct columns" --headed
 *
 * OVERVIEW:
 * Verifies that the Quantities/Accomplishments data table on the Tender page
 * displays the correct columns and that the section header has the expected
 * controls (filter buttons, + Add button).
 *
 * WHAT THE TEST VALIDATES:
 * 1. Column Headers:
 *    ✅ "Fiscal Year" column is present
 *    ✅ "Accomplishment/Quantity" column is present
 *    ✅ "Forecast" column is present
 *    ✅ "Schedule7" column is present
 *    ✅ "Actual" column is present
 *    ✅ "Comment" column is present
 *
 * 2. Section Controls:
 *    ✅ "+ Add" button is available in the section header
 *    ✅ "Show All Qty/Accmp" filter button is present
 *    ✅ "Show All Fiscal Years" filter button is present
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-QTY-02 — Quantities table displays correct columns', () => {
  test.setTimeout(60_000);

  test.beforeEach(async ({ page }) => {
    // Navigate to the first project's tender page dynamically
    await page.goto('/projects');
    await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30000 });
    const projectLink = page.locator('table tbody tr').first().locator('td:nth-child(2) a');
    const projectUrl = await projectLink.getAttribute('href');
    await page.goto(`${projectUrl}/projecttender`);
    await expect(page.locator('h1', { hasText: 'Quantities/Accomplishments' })).toBeVisible();
  });

  test('Quantities table displays correct columns', async ({ page }) => {
    await test.step('Step 1: Verify all expected column headers are present', async () => {
      // Target the Quantities/Accomplishments table (second table on page)
      const qtyTable = page.locator('table').nth(1);

      await expect(qtyTable.getByRole('columnheader', { name: 'Fiscal Year' })).toBeVisible();
      await expect(qtyTable.getByRole('columnheader', { name: 'Accomplishment/Quantity' })).toBeVisible();
      await expect(qtyTable.getByRole('columnheader', { name: 'Forecast' })).toBeVisible();
      await expect(qtyTable.getByRole('columnheader', { name: 'Schedule7' })).toBeVisible();
      await expect(qtyTable.getByRole('columnheader', { name: 'Actual' })).toBeVisible();
      await expect(qtyTable.getByRole('columnheader', { name: 'Comment' })).toBeVisible();
    });

    await test.step('Step 2: Verify section controls are present', async () => {
      // "+ Add" button for Qty/Accmp
      await expect(page.locator('button[title="Add Quantity or Accomplishment"]')).toBeVisible();

      // Filter buttons
      await expect(page.getByRole('button', { name: 'Show All Qty/Accmp' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Show All Fiscal Years' })).toBeVisible();
    });
  });
});
