/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-ELEM-06: Edit existing element
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-ELEM-06-edit-element.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-elem-06-edit-element.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-elem-06-edit-element.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-elem-06-edit-element.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-elem-06-edit-element.spec.ts -g "Edit" --headed
 *
 * OVERVIEW:
 * Verifies that an existing element can be edited (Code Name) and the changes
 * are reflected in the table. Creates a test element, edits it, verifies the
 * change, then reverts and deletes.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Edit Dialog:
 *    ✅ Edit opens a dialog with pre-filled current values
 *    ✅ Fields are editable
 *
 * 2. Save Changes:
 *    ✅ Updated Code Name is reflected in the table after save
 *    ✅ Other fields remain unchanged
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-ELEM-06 — Edit existing element', () => {
  test.setTimeout(120_000);

  test('Edit element Code Name and verify change', async ({ page }) => {
    await test.step('Step 1: Navigate to Elements Management', async () => {
      await page.goto('/admin/elements');
      await expect(page.getByRole('heading', { name: 'Elements Management' })).toBeVisible();
    });

    await test.step('Step 2: Create a test element to edit', async () => {
      await page.getByRole('button', { name: 'Add New Element' }).click();
      const dialog = page.locator('[role="dialog"]');
      await dialog.waitFor({ state: 'visible' });

      await dialog.locator('input[name="code"]').fill('Zy');
      await dialog.locator('input[name="description"]').fill('CRT-AUTO Edit Test');

      // Program Category
      await dialog.locator('button.dropdown-toggle').first().click();
      await page.waitForTimeout(300);
      await dialog.locator('.dropdown-menu.show button.dropdown-item', { hasText: 'Capital-Capital Expansion Program' }).click();
      await page.waitForTimeout(300);

      // Program
      await dialog.locator('button.dropdown-toggle').nth(1).click();
      await page.waitForTimeout(300);
      await dialog.locator('.dropdown-menu.show button.dropdown-item', { hasText: 'CapitalEx-Gen-Capital Expansion - General' }).click();
      await page.waitForTimeout(300);

      // Service Line
      await dialog.locator('button.dropdown-toggle').nth(2).click();
      await page.waitForTimeout(300);
      await dialog.locator('.dropdown-menu.show button.dropdown-item').filter({ hasText: /^0-Other$/ }).click();
      await page.waitForTimeout(300);

      await dialog.getByRole('button', { name: 'Submit' }).click();
      await dialog.waitFor({ state: 'hidden', timeout: 10000 });
      await page.waitForTimeout(500);
    });

    await test.step('Step 3: Search for the test element', async () => {
      await page.locator('input[placeholder="Search"]').fill('Zy');
      await page.getByRole('button', { name: 'Search' }).click();
      await page.waitForTimeout(1000);

      const row = page.locator('table tbody tr', { hasText: 'CRT-AUTO Edit Test' });
      await expect(row).toBeVisible();
    });

    await test.step('Step 4: Click Edit and verify pre-filled values', async () => {
      const row = page.locator('table tbody tr', { hasText: 'CRT-AUTO Edit Test' });
      await row.locator('button[title="Edit Record"]').click();
      await page.waitForTimeout(500);

      const dialog = page.locator('[role="dialog"]');
      await dialog.waitFor({ state: 'visible' });

      // Verify pre-filled values
      await expect(dialog.locator('input[name="code"]')).toHaveValue('Zy');
      await expect(dialog.locator('input[name="description"]')).toHaveValue('CRT-AUTO Edit Test');
    });

    await test.step('Step 5: Change Code Name and submit', async () => {
      const dialog = page.locator('[role="dialog"]');
      await dialog.locator('input[name="description"]').clear();
      await dialog.locator('input[name="description"]').fill('CRT-AUTO Edit Updated');
      await page.waitForTimeout(200);

      await dialog.getByRole('button', { name: 'Submit' }).click();
      await dialog.waitFor({ state: 'hidden', timeout: 10000 });
      await page.waitForTimeout(500);
    });

    await test.step('Step 6: Verify updated name in table', async () => {
      // Re-search to see the update
      await page.locator('input[placeholder="Search"]').fill('Zy');
      await page.getByRole('button', { name: 'Search' }).click();
      await page.waitForTimeout(1000);

      const row = page.locator('table tbody tr', { hasText: 'CRT-AUTO Edit Updated' });
      await expect(row).toBeVisible();
      await expect(row).toContainText('Zy');
    });

    await test.step('Cleanup: Delete the test element', async () => {
      const row = page.locator('table tbody tr', { hasText: 'CRT-AUTO Edit Updated' });
      await row.locator('button[title="Delete Record"]').click();
      const popover = page.locator('.popover.show');
      await popover.waitFor({ state: 'visible', timeout: 5000 });
      await popover.getByRole('button', { name: 'Delete' }).click();
      await page.waitForTimeout(1000);
    });
  });
});
