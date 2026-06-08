/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-PM-09: Cannot delete PM assigned to project
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-PM-09-no-delete-assigned.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-pm-09-no-delete-assigned.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-pm-09-no-delete-assigned.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-pm-09-no-delete-assigned.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-pm-09-no-delete-assigned.spec.ts -g "Cannot" --headed
 *
 * OVERVIEW:
 * Verifies that a PM assigned to one or more projects cannot be deleted — only
 * the Disable button is available, not Delete. Compares with an unassigned PM
 * that shows both Edit and Delete buttons.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Assigned PM Row:
 *    ✅ Shows "Edit Record" button
 *    ✅ Shows "Disable Record" button
 *    ✅ Does NOT show "Delete Record" button
 *
 * 2. Unassigned PM Row (contrast):
 *    ✅ Shows "Edit Record" button
 *    ✅ Shows "Delete Record" button
 *    ✅ Does NOT show "Disable Record" button
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-PM-09 — Cannot delete PM assigned to project', () => {
  test.setTimeout(60_000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/codetables');
    await expect(page.locator('table tbody tr').first()).toBeVisible();

    // Select Project Manager code set
    await page.getByRole('button', { name: 'Accomplishment', exact: true }).click();
    await page.getByRole('menuitem', { name: 'Project Manager' }).click();
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page).toHaveURL(/codeSet=PROJECT_MANAGER/);
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  test('Assigned PM shows Disable only; unassigned PM shows Delete only', async ({ page }) => {
    await test.step('Step 1: Verify assigned PM has Edit + Disable but NO Delete', async () => {
      // "Devashish Bhargava" is assigned to project(s)
      const assignedRow = page.locator('table tbody tr', { hasText: 'Devashish Bhargava' });
      await expect(assignedRow).toBeVisible();
      await expect(assignedRow.getByRole('button', { name: 'Edit Record' })).toBeVisible();
      await expect(assignedRow.getByRole('button', { name: 'Disable Record' })).toBeVisible();
      await expect(assignedRow.getByRole('button', { name: 'Delete Record' })).toBeHidden();
    });

    await test.step('Step 2: Verify unassigned PM has Edit + Delete but NO Disable', async () => {
      // Create a fresh unassigned PM for comparison
      await page.getByRole('button', { name: 'Add New Project Manager' }).click();
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await dialog.locator('input[name="codeName"]').fill('CRT-AUTO Unassigned PM');
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });

      const unassignedRow = page.locator('table tbody tr', { hasText: 'CRT-AUTO Unassigned PM' });
      await expect(unassignedRow).toBeVisible();
      await expect(unassignedRow.getByRole('button', { name: 'Edit Record' })).toBeVisible();
      await expect(unassignedRow.getByRole('button', { name: 'Delete Record' })).toBeVisible();
      await expect(unassignedRow.getByRole('button', { name: 'Disable Record' })).toBeHidden();
    });

    await test.step('Cleanup: Delete the unassigned test PM', async () => {
      const row = page.locator('table tbody tr', { hasText: 'CRT-AUTO Unassigned PM' });
      await row.getByRole('button', { name: 'Delete Record' }).click();
      const popover = page.locator('[role="tooltip"]');
      await expect(popover).toBeVisible();
      await popover.getByRole('button', { name: 'Delete' }).dispatchEvent('click');
      await expect(row).toBeHidden({ timeout: 10_000 });
    });
  });
});
