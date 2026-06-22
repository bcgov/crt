/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-ELEM-11: Element appears in Financial Planning form
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-ELEM-11-element-in-dropdown.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-elem-11-element-in-dropdown.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-elem-11-element-in-dropdown.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-elem-11-element-in-dropdown.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-elem-11-element-in-dropdown.spec.ts -g "dropdown" --headed
 *
 * OVERVIEW:
 * Verifies that a newly created active element appears in the Financial Planning
 * form's Element dropdown. Creates a test element, navigates to Financial Planning,
 * and checks the dropdown filter finds the new element.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Integration:
 *    ✅ Test element created in Elements Management
 *    ✅ Element appears in Financial Planning "Element" dropdown
 *    ✅ Dropdown search filter locates element by code
 *
 * 2. Format:
 *    ✅ Element displays as "Code - Description" in dropdown
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-ELEM-11 — Element appears in Financial Planning form', () => {
  test.setTimeout(120_000);

  test('New element appears in Financial Planning dropdown', async ({ page }) => {
    page.on('dialog', async (d) => { await d.accept(); });

    await test.step('Setup: Delete any leftover Zt element from a prior run', async () => {
      await page.goto('/admin/elements');
      await expect(page.getByRole('heading', { name: 'Elements Management' })).toBeVisible();
      await page.locator('input[placeholder="Search"]').fill('Zt');
      await page.getByRole('button', { name: 'Search' }).click();
      await page.waitForTimeout(500);
      const leftover = page.locator('table tbody tr', { hasText: 'CRT-AUTO Test Element' });
      if (await leftover.isVisible()) {
        await leftover.locator('button[title="Delete Record"]').click();
        const popover = page.locator('.popover.show');
        await popover.waitFor({ state: 'visible', timeout: 5000 });
        await popover.getByRole('button', { name: 'Delete' }).click();
        await expect(leftover).toBeHidden({ timeout: 10_000 });
      }
    });

    await test.step('Step 1: Create a test element', async () => {
      await page.goto('/admin/elements');
      await expect(page.getByRole('heading', { name: 'Elements Management' })).toBeVisible();

      await page.getByRole('button', { name: 'Add New Element' }).click();
      const dialog = page.getByRole('dialog').filter({ hasText: 'Add Element' });
      await expect(dialog).toBeVisible();

      await dialog.locator('input[name="code"]').fill('Zt');
      await dialog.locator('input[name="description"]').fill('CRT-AUTO Test Element');

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
      await expect(dialog).toBeHidden({ timeout: 10_000 });
      await page.waitForTimeout(500);
    });

    await test.step('Step 2: Navigate to Financial Plan for a project', async () => {
      await page.goto('/projects');
      await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30000 });
      const firstProjectLink = page.locator('table tbody tr td:nth-child(2) a').first();
      const href = await firstProjectLink.getAttribute('href');
      await page.goto(`${href}/projectplan`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
    });

    await test.step('Step 3: Open Add dialog and check Element dropdown', async () => {
      await page.getByRole('button', { name: '+ Add' }).click();
      const dialog = page.getByRole('dialog').filter({ hasText: 'Add Financial' });
      await expect(dialog).toBeVisible();

      // Open Element dropdown (3rd dropdown, index 2)
      await dialog.locator('button.dropdown-toggle').nth(2).click();
      await page.waitForTimeout(500);
    });

    await test.step('Step 4: Filter dropdown for "Zt" and verify element appears', async () => {
      const dialog = page.getByRole('dialog').filter({ hasText: 'Add Financial' });
      const searchInput = dialog.locator('.dropdown-menu.show input[placeholder="Search"]');
      await searchInput.fill('Zt');
      await page.waitForTimeout(500);

      const option = dialog.locator('.dropdown-menu.show button.dropdown-item', { hasText: 'Zt' });
      await expect(option).toBeVisible();
      await expect(option).toContainText('CRT-AUTO Test Element');
    });

    await test.step('Cleanup: Cancel dialog and delete test element', async () => {
      const dialog = page.getByRole('dialog').filter({ hasText: 'Add Financial' });
      await dialog.getByRole('button', { name: 'Cancel' }).click();
      await page.waitForTimeout(500);

      await page.goto('/admin/elements');
      await page.waitForTimeout(500);

      await page.locator('input[placeholder="Search"]').fill('Zt');
      await page.getByRole('button', { name: 'Search' }).click();
      await page.waitForTimeout(1000);

      const row = page.locator('table tbody tr', { hasText: 'CRT-AUTO Test Element' });
      await row.locator('button[title="Delete Record"]').click();
      const popover = page.locator('.popover.show');
      await popover.waitFor({ state: 'visible', timeout: 5000 });
      await popover.getByRole('button', { name: 'Delete' }).click();
      await expect(row).toBeHidden({ timeout: 10_000 });
    });
  });
});
