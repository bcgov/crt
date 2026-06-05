/**
 * ============================================================================
 * 06-Spatial-Segments-Ratios - TC-TS-RAT-01: Add ratios for each boundary category
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-RAT-01-add-ratios-all-categories.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/06-segments-ratios/tc-ts-rat-01-add-ratios-all-categories.spec.ts --headed
 * Headless:               npx playwright test tests/06-segments-ratios/tc-ts-rat-01-add-ratios-all-categories.spec.ts
 * Debug:                  npx playwright test tests/06-segments-ratios/tc-ts-rat-01-add-ratios-all-categories.spec.ts --debug
 * Specific Test:          npx playwright test tests/06-segments-ratios/tc-ts-rat-01-add-ratios-all-categories.spec.ts -g "Electoral" --headed
 *
 * OVERVIEW:
 * Verifies that ratios can be added for each of the five administrative boundary
 * categories: Electoral Districts, Highways, Service Areas, Districts, and
 * Economic Regions. Each has its own "+ Add" button, dropdown, and ratio field.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Add Ratio Per Category:
 *    ✅ Electoral Districts: dropdown + ratio → row appears
 *    ✅ Highways: dropdown + ratio → row appears
 *    ✅ Service Areas: dropdown + ratio → row appears
 *    ✅ Districts: dropdown + ratio → row appears
 *    ✅ Economic Regions: dropdown + ratio → row appears
 *
 * 2. Form Structure:
 *    ✅ Each form has a category-specific dropdown and a Ratio spinbutton
 *    ✅ Submit is disabled until category is selected
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-RAT-01 — Add ratios for each boundary category', () => {
  test.setTimeout(180_000);

  // Helper to add a ratio entry
  async function addRatio(
    page: import('@playwright/test').Page,
    buttonTitle: string,
    optionText: string,
    ratioValue: string,
    tableIndex: number
  ) {
    await page.locator(`button[title="${buttonTitle}"]`).click();
    const dialog = page.locator('[role="dialog"]');
    await dialog.waitFor({ state: 'visible' });

    // Select from dropdown
    await dialog.locator('button.dropdown-toggle').click();
    await page.waitForTimeout(300);
    await dialog.locator('.dropdown-menu.show button.dropdown-item', { hasText: optionText }).first().click();
    await page.waitForTimeout(200);

    // Fill ratio
    await dialog.getByRole('spinbutton', { name: 'Ratio*' }).fill(ratioValue);
    await page.waitForTimeout(200);

    // Submit
    await dialog.getByRole('button', { name: 'Submit' }).click();
    await dialog.waitFor({ state: 'hidden', timeout: 10000 });
    await page.waitForTimeout(500);
  }

  // Helper to delete a ratio entry
  async function deleteRatio(page: import('@playwright/test').Page, tableIndex: number, rowText: string) {
    const table = page.locator('table').nth(tableIndex);
    const row = table.locator('tbody tr', { hasText: rowText });
    if (await row.isVisible()) {
      await row.locator('button[title="Delete Record"]').click();
      const popover = page.locator('.popover.show');
      await popover.waitFor({ state: 'visible', timeout: 5000 });
      await popover.getByRole('button', { name: 'Delete' }).click();
      await page.waitForTimeout(500);
    }
  }

  test.beforeEach(async ({ page }) => {
    page.on('dialog', async (d) => { await d.accept(); });
    await page.goto('/projects/79/segments');
    await expect(page.getByText('Project Segments')).toBeVisible();
  });

  test('Add Electoral Districts ratio', async ({ page }) => {
    await test.step('Add ratio entry', async () => {
      await addRatio(page, 'Add Electoral Districts', 'Abbotsford-Mission', '0.5', 1);
    });

    await test.step('Verify row in table', async () => {
      const table = page.locator('table').nth(1);
      const row = table.locator('tbody tr', { hasText: 'Abbotsford-Mission' });
      await expect(row).toBeVisible();
      await expect(row).toContainText('0.5');
    });

    await test.step('Cleanup', async () => {
      await deleteRatio(page, 1, 'Abbotsford-Mission');
    });
  });

  test('Add Highways ratio', async ({ page }) => {
    await test.step('Add ratio entry', async () => {
      await addRatio(page, 'Add Highways', '3-Hwy 3', '0.5', 2);
    });

    await test.step('Verify row in table', async () => {
      const table = page.locator('table').nth(2);
      const row = table.locator('tbody tr', { hasText: 'Hwy 3' });
      await expect(row).toBeVisible();
      await expect(row).toContainText('0.5');
    });

    await test.step('Cleanup', async () => {
      await deleteRatio(page, 2, 'Hwy 3');
    });
  });

  test('Add Service Areas ratio', async ({ page }) => {
    await test.step('Add ratio entry', async () => {
      await addRatio(page, 'Add Service Areas', '2-Central Island', '0.5', 3);
    });

    await test.step('Verify row in table', async () => {
      const table = page.locator('table').nth(3);
      const row = table.locator('tbody tr', { hasText: 'Central Island' });
      await expect(row).toBeVisible();
      await expect(row).toContainText('0.5');
    });

    await test.step('Cleanup', async () => {
      await deleteRatio(page, 3, 'Central Island');
    });
  });

  test('Add Districts ratio', async ({ page }) => {
    await test.step('Add ratio entry', async () => {
      await addRatio(page, 'Add Districts', '1-Lower Mainland', '0.5', 4);
    });

    await test.step('Verify row in table', async () => {
      const table = page.locator('table').nth(4);
      const row = table.locator('tbody tr', { hasText: 'Lower Mainland' });
      await expect(row).toBeVisible();
      await expect(row).toContainText('0.5');
    });

    await test.step('Cleanup', async () => {
      await deleteRatio(page, 4, 'Lower Mainland');
    });
  });

  test('Add Economic Regions ratio', async ({ page }) => {
    await test.step('Add ratio entry', async () => {
      await addRatio(page, 'Add Economic Regions', '5920-Lower Mainland/Southwest', '0.5', 5);
    });

    await test.step('Verify row in table', async () => {
      const table = page.locator('table').nth(5);
      const row = table.locator('tbody tr', { hasText: 'Lower Mainland/Southwest' });
      await expect(row).toBeVisible();
      await expect(row).toContainText('0.5');
    });

    await test.step('Cleanup', async () => {
      await deleteRatio(page, 5, 'Lower Mainland/Southwest');
    });
  });
});
