/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-ELEM-03: Add new element with required fields
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-ELEM-03-add-element.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-elem-03-add-element.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-elem-03-add-element.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-elem-03-add-element.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-elem-03-add-element.spec.ts -g "Add new" --headed
 *
 * OVERVIEW:
 * Verifies that a new element can be added with Code Value, Code Name,
 * Program Category, Program, Service Line, and Order Number, and that it
 * appears in search results after creation.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Add Dialog:
 *    ✅ "Add New Element" opens an "Add Element" dialog
 *    ✅ Submit is disabled until required fields are filled
 *
 * 2. Element Creation:
 *    ✅ Element is created with correct Code, Description, and dropdowns
 *    ✅ Created element appears in search results
 *
 * 3. Cleanup:
 *    ✅ Test element is deleted after verification
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-ELEM-03 — Add new element with required fields', () => {
  test.setTimeout(120_000);

  test('Add new element and verify in table', async ({ page }) => {
    await test.step('Step 1: Navigate to Elements Management', async () => {
      await page.goto('/admin/elements');
      await expect(page.getByRole('heading', { name: 'Elements Management' })).toBeVisible();
    });

    await test.step('Step 2: Click "Add New Element" and verify dialog', async () => {
      await page.getByRole('button', { name: 'Add New Element' }).click();
      const dialog = page.locator('[role="dialog"]');
      await dialog.waitFor({ state: 'visible' });
      await expect(dialog.locator('.modal-title, h5').first()).toHaveText('Add Element');
      await expect(dialog.getByRole('button', { name: 'Submit' })).toBeDisabled();
    });

    await test.step('Step 3: Fill required fields', async () => {
      const dialog = page.locator('[role="dialog"]');

      // Code Value
      await dialog.locator('input[name="code"]').fill('Zt');
      await page.waitForTimeout(200);

      // Code Name (Description) — required
      await dialog.locator('input[name="description"]').fill('CRT-AUTO Test Element');
      await page.waitForTimeout(200);

      // Program Category dropdown
      await dialog.locator('button.dropdown-toggle').first().click();
      await page.waitForTimeout(300);
      await dialog.locator('.dropdown-menu.show button.dropdown-item', { hasText: 'Capital-Capital Expansion Program' }).click();
      await page.waitForTimeout(300);

      // Program dropdown
      await dialog.locator('button.dropdown-toggle').nth(1).click();
      await page.waitForTimeout(300);
      await dialog.locator('.dropdown-menu.show button.dropdown-item', { hasText: 'CapitalEx-Gen-Capital Expansion - General' }).click();
      await page.waitForTimeout(300);

      // Service Line dropdown
      await dialog.locator('button.dropdown-toggle').nth(2).click();
      await page.waitForTimeout(300);
      await dialog.locator('.dropdown-menu.show button.dropdown-item').filter({ hasText: /^0-Other$/ }).click();
      await page.waitForTimeout(300);

      // Order Number — clear default and set to 999
      await dialog.locator('input[name="displayOrder"]').clear();
      await dialog.locator('input[name="displayOrder"]').fill('999');
      await page.waitForTimeout(200);
    });

    await test.step('Step 4: Submit and verify dialog closes', async () => {
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog.getByRole('button', { name: 'Submit' })).toBeEnabled();
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await dialog.waitFor({ state: 'hidden', timeout: 10000 });
    });

    await test.step('Step 5: Search for the new element', async () => {
      await page.locator('input[placeholder="Search"]').fill('Zt');
      await page.getByRole('button', { name: 'Search' }).click();
      await page.waitForTimeout(1000);
    });

    await test.step('Step 6: Verify element appears in table', async () => {
      const table = page.locator('table');
      const row = table.locator('tbody tr', { hasText: 'CRT-AUTO Test Element' });
      await expect(row).toBeVisible();
      await expect(row).toContainText('Zt');
      await expect(row).toContainText('Capital');
    });

    await test.step('Cleanup: Delete the test element', async () => {
      const row = page.locator('table tbody tr', { hasText: 'CRT-AUTO Test Element' });
      await row.locator('button[title="Delete Record"]').click();
      const popover = page.locator('.popover.show');
      await popover.waitFor({ state: 'visible', timeout: 5000 });
      await popover.getByRole('button', { name: 'Delete' }).click();
      await page.waitForTimeout(1000);
    });
  });
});
