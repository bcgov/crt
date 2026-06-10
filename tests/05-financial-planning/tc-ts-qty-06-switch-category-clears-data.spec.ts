/**
 * ============================================================================
 * 05-Financial-Planning - TC-TS-QTY-06: Switch category clears data with confirmation
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-QTY-06-switch-category-clears-data.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/05-financial-planning/tc-ts-qty-06-switch-category-clears-data.spec.ts --headed
 * Headless:               npx playwright test tests/05-financial-planning/tc-ts-qty-06-switch-category-clears-data.spec.ts
 * Debug:                  npx playwright test tests/05-financial-planning/tc-ts-qty-06-switch-category-clears-data.spec.ts --debug
 * Specific Test:          npx playwright test tests/05-financial-planning/tc-ts-qty-06-switch-category-clears-data.spec.ts -g "Switch category" --headed
 *
 * OVERVIEW:
 * SKIPPED — The application does NOT implement a confirmation prompt when switching
 * categories. When a user enters data for Quantity and then switches to Accomplishment,
 * the switch happens immediately without any warning. The Forecast/Actual values are
 * retained, but the Quantity type and Schedule 7 fields are cleared. This test documents
 * the expected vs actual behavior.
 *
 * WHAT THE TEST VALIDATES (if implemented):
 * 1. Category Switch:
 *    ✅ Switching categories after entering data should show confirmation prompt
 *    ✅ Prompt text: "This action will clear any data entered for the previous selection. Continue?"
 *    ✅ Confirming clears data and switches category
 *    ✅ Cancelling retains data and category
 *
 * ACTUAL BEHAVIOR (dev environment):
 *    ❌ No confirmation prompt appears when switching categories
 *    ℹ️ Category switches immediately
 *    ℹ️ Forecast/Actual values are retained (trailing zeros stripped)
 *    ℹ️ Schedule 7 field disappears when switching from Quantity to Accomplishment
 *    ℹ️ Quantity type selection is cleared
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-QTY-06 — Switch category clears data with confirmation', () => {
  test.setTimeout(120_000);

  test('Switch category clears data with confirmation', async ({ page }) => {
    test.skip(true, 'Feature not implemented: No confirmation prompt appears when switching categories. The app switches immediately without warning.');

    await page.goto('/projects');
    await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30000 });
    const projectLink = page.locator('table tbody tr').first().locator('td:nth-child(2) a');
    const projectUrl = await projectLink.getAttribute('href');
    await page.goto(`${projectUrl}/projecttender`);
    await expect(page.locator('h1', { hasText: 'Quantities/Accomplishments' })).toBeVisible();

    await page.locator('button[title="Add Quantity or Accomplishment"]').click();
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Select Quantity and enter data
    await dialog.locator('button.dropdown-toggle').nth(1).click();
    await dialog.locator('.dropdown-menu.show button.dropdown-item', { hasText: 'Quantity' }).click();
    await page.waitForTimeout(300);

    await dialog.getByRole('textbox', { name: 'Forecast' }).fill('100.500');

    // Switch to Accomplishment — expect confirmation prompt
    await dialog.locator('button.dropdown-toggle').nth(1).click();
    await dialog.locator('.dropdown-menu.show button.dropdown-item', { hasText: 'Accomplishment' }).click();

    // Expected: confirmation prompt with this text
    await expect(page.locator('text=This action will clear any data entered for the previous selection. Continue?')).toBeVisible();
  });
});
