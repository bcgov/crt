/**
 * ============================================================================
 * 03 User Management - TC-TS-USER-10: Multiple region assignment
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-USER-10-multiregion.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/03-user-management/tc-ts-user-10-multiregion.spec.ts --headed
 * Headless:               npx playwright test tests/03-user-management/tc-ts-user-10-multiregion.spec.ts
 * Debug:                  npx playwright test tests/03-user-management/tc-ts-user-10-multiregion.spec.ts --debug
 * Specific Test:          npx playwright test tests/03-user-management/tc-ts-user-10-multiregion.spec.ts -g "Multiple region assignment" --headed
 *
 * OVERVIEW:
 * Verifies that a user can be assigned to multiple MoTI regions via the Edit User
 * dialog, and that the regions display in the expected format sorted by code.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Multi-Region Selection in Edit Form:
 *    ✅ MoTI Region multi-select allows checking multiple regions
 *    ✅ Regions are displayed as "<Code>-<Description>" (e.g., "1-South Coast")
 *
 * 2. Save and Display:
 *    ✅ Submitting with multiple regions updates the user
 *    ✅ The user's regions column in the table reflects the new assignment
 *    ✅ Region codes are sorted ascending by number
 *
 * 3. Cleanup:
 *    ✅ Restores the user to their original region assignment
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

// Target user: PSPRY has multiple regions assigned (varies by environment)
const TARGET_USER_IDIR = 'PSPRY';

test.describe('TC-TS-USER-10 — Multiple region assignment', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page.getByRole('heading', { name: 'User Management' })).toBeVisible();
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  test('Multiple region assignment', async ({ page }) => {
    await test.step('Step 1: Verify region options use <Code>-<Description> format', async () => {
      // Open Edit dialog for target user
      const targetRow = page.locator('table tbody tr', { hasText: TARGET_USER_IDIR });
      await expect(targetRow).toBeVisible();
      await targetRow.getByRole('button', { name: 'Edit Record' }).click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog.locator('.modal-title')).toHaveText('Edit User');

      // Verify MoTI Region multi-select is present
      await expect(dialog.locator('label:has-text("MoTI Region")')).toBeVisible();

      // Verify region labels use "<Code>-<Description>" format
      const regionSection = dialog.locator('.multi-select').nth(1);
      await expect(regionSection.locator('label:has-text("0-Headquarters")')).toBeVisible();
      await expect(regionSection.locator('label:has-text("1-South Coast")')).toBeVisible();
      await expect(regionSection.locator('label:has-text("2-Southern Interior")')).toBeVisible();
      await expect(regionSection.locator('label:has-text("3-Northern")')).toBeVisible();

      // Cancel without changes
      await dialog.getByRole('button', { name: 'Cancel' }).click();
      await expect(dialog).not.toBeVisible();
    });

    // Capture original regions before making changes
    let originalRegions = '';

    await test.step('Step 2: Add a new region (0-Headquarters) to existing regions', async () => {
      // Capture original region state from the table
      const targetRow = page.locator('table tbody tr', { hasText: TARGET_USER_IDIR });
      const regionsCell = targetRow.locator('td:nth-child(5)');
      originalRegions = (await regionsCell.textContent())!.trim();

      // Open edit dialog
      await targetRow.getByRole('button', { name: 'Edit Record' }).click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog.locator('.modal-title')).toHaveText('Edit User');

      // Find the 0-Headquarters checkbox and add it (it should be unchecked for PSPRY)
      const regionSection = dialog.locator('.multi-select').nth(1);
      const hqLabel = regionSection.locator('label:has-text("0-Headquarters")');
      await hqLabel.click();

      // Submit the changes — Submit should be enabled since we made a change
      await expect(dialog.getByRole('button', { name: 'Submit' })).toBeEnabled();
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).not.toBeVisible();
    });

    await test.step('Step 3: Verify user now has multiple regions (sorted by code)', async () => {
      // Wait for table to refresh
      await expect(page.locator('table tbody tr').first()).toBeVisible();

      // Verify the user row shows region codes including the new one, sorted ascending
      const targetRow = page.locator('table tbody tr', { hasText: TARGET_USER_IDIR });
      await expect(targetRow).toBeVisible();
      const regionsCell = targetRow.locator('td:nth-child(5)');
      const regionsText = (await regionsCell.textContent())!.trim();

      // Should contain 0 (HQ) plus all original regions
      const codes = regionsText.split(',').map((c) => parseInt(c.trim()));
      expect(codes).toContain(0);
      const originalCodes = originalRegions.split(',').map((c) => parseInt(c.trim()));
      for (const code of originalCodes) {
        expect(codes).toContain(code);
      }

      // Verify they are sorted ascending
      const sorted = [...codes].sort((a, b) => a - b);
      expect(codes).toEqual(sorted);
    });

    await test.step('Step 4: Cleanup — remove the added region (restore original)', async () => {
      // Re-open edit dialog
      const targetRow = page.locator('table tbody tr', { hasText: TARGET_USER_IDIR });
      await targetRow.getByRole('button', { name: 'Edit Record' }).click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog.locator('.modal-title')).toHaveText('Edit User');

      // Uncheck 0-Headquarters to restore original state
      const regionSection = dialog.locator('.multi-select').nth(1);
      const hqLabel = regionSection.locator('label:has-text("0-Headquarters")');
      await hqLabel.click();

      // Submit to restore
      await expect(dialog.getByRole('button', { name: 'Submit' })).toBeEnabled();
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).not.toBeVisible();

      // Verify restored to original state
      const regionsCell = targetRow.locator('td:nth-child(5)');
      await expect(regionsCell).toHaveText(originalRegions);
    });
  });
});
