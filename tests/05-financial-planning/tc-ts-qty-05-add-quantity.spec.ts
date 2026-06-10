/**
 * ============================================================================
 * 05-Financial-Planning - TC-TS-QTY-05: Add Quantity record with Schedule 7 field
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-QTY-05-add-quantity.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/05-financial-planning/tc-ts-qty-05-add-quantity.spec.ts --headed
 * Headless:               npx playwright test tests/05-financial-planning/tc-ts-qty-05-add-quantity.spec.ts
 * Debug:                  npx playwright test tests/05-financial-planning/tc-ts-qty-05-add-quantity.spec.ts --debug
 * Specific Test:          npx playwright test tests/05-financial-planning/tc-ts-qty-05-add-quantity.spec.ts -g "Add Quantity record" --headed
 *
 * OVERVIEW:
 * Verifies that a Quantity record can be added with Forecast, Schedule 7,
 * Actual, and Comment fields. The Schedule 7 field is only available when
 * "Quantity" is selected (not for Accomplishments).
 *
 * WHAT THE TEST VALIDATES:
 * 1. Add Form:
 *    ✅ Dialog opens with correct title
 *    ✅ Schedule 7 field IS present when "Quantity" is selected
 *    ✅ All numeric fields accept 3 decimal places
 *
 * 2. Created Record:
 *    ✅ Record appears in table with correct fiscal year
 *    ✅ Forecast value displays correctly (500.123)
 *    ✅ Schedule 7 value displays correctly (475.456)
 *    ✅ Actual value displays correctly (490.789)
 *    ✅ Comment displays correctly
 *
 * 3. Cleanup:
 *    ✅ Created record is deleted after verification
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-QTY-05 — Add Quantity record with Schedule 7 field', () => {
  test.setTimeout(180_000);

  test.beforeEach(async ({ page }) => {
    // Navigate to the first project's tender page dynamically
    await page.goto('/projects');
    await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30000 });
    const projectLink = page.locator('table tbody tr').first().locator('td:nth-child(2) a');
    const projectUrl = await projectLink.getAttribute('href');
    await page.goto(`${projectUrl}/projecttender`);
    await expect(page.locator('h1', { hasText: 'Quantities/Accomplishments' })).toBeVisible();
  });

  test('Add Quantity record with Schedule 7 field', async ({ page }) => {
    await test.step('Step 1: Open Add Quantities and Accomplishments dialog', async () => {
      await page.locator('button[title="Add Quantity or Accomplishment"]').click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('.modal-title')).toHaveText('Add Quantities and Accomplishments');
    });

    await test.step('Step 2: Select Fiscal Year 2024/2025', async () => {
      const dialog = page.locator('[role="dialog"]');

      // Open Fiscal Year dropdown and select 2024/2025
      await dialog.locator('button.dropdown-toggle').first().click();
      await dialog.locator('.dropdown-menu.show .dropdown-item', { hasText: '2024/2025' }).click();
    });

    await test.step('Step 3: Select "Quantity" category and verify Schedule 7 field appears', async () => {
      const dialog = page.locator('[role="dialog"]');

      // Open category dropdown and select Quantity
      await dialog.locator('button.dropdown-toggle').nth(1).click();
      await dialog.locator('.dropdown-menu.show .dropdown-item', { hasText: 'Quantity' }).click();

      // Wait for form fields to render
      await expect(dialog.locator('label, [class*="label"]', { hasText: 'Forecast' })).toBeVisible();

      // Verify Schedule 7 IS present for Quantity
      await expect(dialog.locator('label, [class*="label"]', { hasText: 'Schedule 7' })).toBeVisible();
    });

    await test.step('Step 4: Select a Quantity type from the third dropdown', async () => {
      const dialog = page.locator('[role="dialog"]');

      // The Quantity* dropdown is the third dropdown-toggle
      await dialog.locator('button.dropdown-toggle').nth(2).click();
      await page.waitForTimeout(300);

      // Select the first available quantity type (use button.dropdown-item to skip the search input)
      await dialog.locator('.dropdown-menu.show button.dropdown-item').first().click();
      await page.waitForTimeout(200);
    });

    await test.step('Step 5: Fill Forecast, Schedule 7, Actual, and Comment', async () => {
      const dialog = page.locator('[role="dialog"]');

      // Fill Forecast (use values without trailing zeros to match display)
      const forecastInput = dialog.getByRole('textbox', { name: 'Forecast' });
      await forecastInput.clear();
      await forecastInput.fill('500.123');

      // Fill Schedule 7
      const schedule7Input = dialog.getByRole('textbox', { name: 'Schedule 7' });
      await schedule7Input.clear();
      await schedule7Input.fill('475.456');

      // Fill Actual
      const actualInput = dialog.getByRole('textbox', { name: 'Actual' });
      await actualInput.clear();
      await actualInput.fill('490.789');

      // Fill Comment
      const commentInput = dialog.getByPlaceholder('Insert Comment Here');
      await commentInput.fill('CRT-AUTO quantity test entry');
    });

    await test.step('Step 6: Submit the form', async () => {
      const dialog = page.locator('[role="dialog"]');
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).not.toBeVisible();
    });

    await test.step('Step 7: Verify the record appears in the table', async () => {
      // Look for the new row in the Qty/Accmp table
      const qtyTable = page.locator('table').nth(1);
      const newRow = qtyTable.locator('tbody tr', { hasText: 'CRT-AUTO quantity test entry' });
      await expect(newRow).toBeVisible();

      // Verify values in the row (app strips trailing zeros from display)
      await expect(newRow).toContainText('2024/2025');
      await expect(newRow).toContainText('500.123');
      await expect(newRow).toContainText('475.456');
      await expect(newRow).toContainText('490.789');
    });

    await test.step('Cleanup: Delete the created record', async () => {
      const qtyTable = page.locator('table').nth(1);
      const newRow = qtyTable.locator('tbody tr', { hasText: 'CRT-AUTO quantity test entry' });

      // Click Delete button on the row
      await newRow.locator('button[title="Delete Record"]').click();

      // Wait for and click the confirmation popover's Delete button
      const deleteConfirm = page.getByRole('button', { name: 'Delete', exact: true });
      await deleteConfirm.waitFor({ state: 'visible', timeout: 5000 });
      await deleteConfirm.click();

      // Verify row is removed
      await expect(newRow).not.toBeVisible();
    });
  });
});
