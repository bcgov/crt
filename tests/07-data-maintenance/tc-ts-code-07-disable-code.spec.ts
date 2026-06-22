/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-CODE-07: Disable active used code value
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-CODE-07-disable-code.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-code-07-disable-code.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-code-07-disable-code.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-code-07-disable-code.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-code-07-disable-code.spec.ts -g "Disable" --headed
 *
 * OVERVIEW:
 * Verifies that an active code value in use can be disabled via the Disable
 * button with confirmation. Uses "Culvert <3m (lineal m)" which has a Disable
 * button (indicating it's used in data). After test, re-enables the entry.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Disable Confirmation:
 *    ✅ Clicking Disable Record shows "Are you sure?" popover
 *    ✅ Popover has "Disable" and "Cancel" buttons
 *
 * 2. Disable Effect:
 *    ✅ After confirming, entry disappears from Active view
 *    ✅ Entry appears in Inactive view
 *
 * 3. Cleanup:
 *    ✅ Re-enable the entry (Activate) to restore state
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-CODE-07 — Disable active used code value', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/codetables');
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  test('Disable an active used code value and verify it moves to Inactive', async ({ page }) => {
    let entryName: string;

    await test.step('Step 1: Find an active entry with a Disable button', async () => {
      // An entry with "Disable Record" is one referenced by project data (cannot be deleted outright)
      const row = page.locator('table tbody tr:has(button[title="Disable Record"])').first();
      await expect(row).toBeVisible({ timeout: 10_000 });
      entryName = ((await row.locator('td').nth(1).textContent()) ?? '').trim();
      expect(entryName.length).toBeGreaterThan(0);
    });

    await test.step('Step 2: Click Disable and verify confirmation popover', async () => {
      const row = page.locator('table tbody tr').filter({ hasText: entryName }).first();
      await row.getByRole('button', { name: 'Disable Record' }).click();

      const popover = page.locator('[role="tooltip"]');
      await expect(popover).toBeVisible();
      await expect(popover.locator('h3')).toHaveText('Are you sure?');
      await expect(popover.getByRole('button', { name: 'Disable' })).toBeVisible();
      await expect(popover.getByRole('button', { name: 'Cancel' })).toBeVisible();
    });

    await test.step('Step 3: Confirm disable', async () => {
      const popover = page.locator('[role="tooltip"]');
      await popover.getByRole('button', { name: 'Disable' }).click();

      // Entry should disappear from Active view
      await expect(page.locator('table tbody tr').filter({ hasText: entryName })).toBeHidden({ timeout: 10_000 });
    });

    await test.step('Step 4: Switch to Inactive and verify entry is there', async () => {
      await page.getByRole('button', { name: 'Active' }).click();
      await page.getByRole('checkbox', { name: 'Inactive' }).check();
      await page.getByRole('checkbox', { name: 'Active', exact: true }).uncheck();
      await page.getByRole('button', { name: 'Search' }).click();

      await expect(page.locator('table tbody tr').filter({ hasText: entryName }).first()).toBeVisible();
    });

    await test.step('Cleanup: Re-enable the entry', async () => {
      const row = page.locator('table tbody tr').filter({ hasText: entryName }).first();
      await row.getByRole('button', { name: 'Disable Record' }).click();

      const popover = page.locator('[role="tooltip"]');
      await expect(popover).toBeVisible();
      await popover.getByRole('button', { name: 'Activate' }).click();

      // Verify it's gone from Inactive view
      await expect(row).toBeHidden({ timeout: 10_000 });
    });
  });
});
