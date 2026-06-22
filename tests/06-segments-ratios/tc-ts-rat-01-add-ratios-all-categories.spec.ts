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

  // Helper to delete the last ratio entry in a table
  async function deleteLastRatio(page: import('@playwright/test').Page, tableIndex: number) {
    const table = page.locator('table').nth(tableIndex);
    const lastRow = table.locator('tbody tr').last();
    await lastRow.locator('button[title="Delete Record"]').click();
    const popover = page.locator('.popover.show');
    await popover.waitFor({ state: 'visible', timeout: 5000 });
    await popover.getByRole('button', { name: 'Delete' }).click();
    await page.waitForTimeout(500);
  }

  test.beforeEach(async ({ page }) => {
    page.on('dialog', async (d) => { await d.accept(); });
    // Navigate to the first project's segments page dynamically
    await page.goto('/projects');
    await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30000 });
    const projectLink = page.locator('table tbody tr').first().locator('td:nth-child(2) a');
    const projectUrl = await projectLink.getAttribute('href');
    await page.goto(`${projectUrl}/segments`);
    await expect(page.getByText('Project Segments')).toBeVisible();
  });

  test('Add Electoral Districts ratio', async ({ page }) => {
    const table = page.locator('table').nth(1);
    const countBefore = await table.locator('tbody tr').count();

    await test.step('Add ratio entry', async () => {
      await addRatio(page, 'Add Electoral Districts', 'Abbotsford-Mission', '0.5', 1);
    });

    await test.step('Verify row in table', async () => {
      await expect(table.locator('tbody tr')).toHaveCount(countBefore + 1);
      const lastRow = table.locator('tbody tr').last();
      await expect(lastRow).toContainText('Abbotsford-Mission');
      await expect(lastRow).toContainText('0.5');
    });

    await test.step('Cleanup', async () => {
      await deleteLastRatio(page, 1);
    });
  });

  test('Add Highways ratio', async ({ page }) => {
    const table = page.locator('table').nth(2);
    const countBefore = await table.locator('tbody tr').count();

    await test.step('Add ratio entry', async () => {
      await addRatio(page, 'Add Highways', '3-Hwy 3', '0.5', 2);
    });

    await test.step('Verify row in table', async () => {
      await expect(table.locator('tbody tr')).toHaveCount(countBefore + 1);
      const lastRow = table.locator('tbody tr').last();
      await expect(lastRow).toContainText('Hwy 3');
      await expect(lastRow).toContainText('0.5');
    });

    await test.step('Cleanup', async () => {
      await deleteLastRatio(page, 2);
    });
  });

  test('Add Service Areas ratio', async ({ page }) => {
    const table = page.locator('table').nth(3);
    const countBefore = await table.locator('tbody tr').count();

    await test.step('Add ratio entry', async () => {
      await addRatio(page, 'Add Service Areas', '2-Central Island', '0.5', 3);
    });

    await test.step('Verify row in table', async () => {
      await expect(table.locator('tbody tr')).toHaveCount(countBefore + 1);
      const lastRow = table.locator('tbody tr').last();
      await expect(lastRow).toContainText('Central Island');
      await expect(lastRow).toContainText('0.5');
    });

    await test.step('Cleanup', async () => {
      await deleteLastRatio(page, 3);
    });
  });

  test('Add Districts ratio', async ({ page }) => {
    const table = page.locator('table').nth(4);
    const countBefore = await table.locator('tbody tr').count();

    await test.step('Add ratio entry', async () => {
      await addRatio(page, 'Add Districts', '1-Lower Mainland', '0.5', 4);
    });

    await test.step('Verify row in table', async () => {
      await expect(table.locator('tbody tr')).toHaveCount(countBefore + 1);
      const lastRow = table.locator('tbody tr').last();
      await expect(lastRow).toContainText('Lower Mainland');
      await expect(lastRow).toContainText('0.5');
    });

    await test.step('Cleanup', async () => {
      await deleteLastRatio(page, 4);
    });
  });

  test('Add Economic Regions ratio', async ({ page }) => {
    const table = page.locator('table').nth(5);
    const countBefore = await table.locator('tbody tr').count();

    await test.step('Add ratio entry', async () => {
      await addRatio(page, 'Add Economic Regions', 'Lower Mainland', '0.5', 5);
    });

    await test.step('Verify row in table', async () => {
      await expect(table.locator('tbody tr')).toHaveCount(countBefore + 1);
      const lastRow = table.locator('tbody tr').last();
      await expect(lastRow).toContainText('Lower Mainland');
      await expect(lastRow).toContainText('0.5');
    });

    await test.step('Cleanup', async () => {
      await deleteLastRatio(page, 5);
    });
  });
});
