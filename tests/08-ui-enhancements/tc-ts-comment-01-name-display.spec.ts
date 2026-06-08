/**
 * ============================================================================
 * 08-UI-Enhancements - TC-TS-COMMENT-01: Comments show first and last name
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-COMMENT-01-name-display.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/08-ui-enhancements/tc-ts-comment-01-name-display.spec.ts --headed
 * Headless:               npx playwright test tests/08-ui-enhancements/tc-ts-comment-01-name-display.spec.ts
 * Debug:                  npx playwright test tests/08-ui-enhancements/tc-ts-comment-01-name-display.spec.ts --debug
 * Specific Test:          npx playwright test tests/08-ui-enhancements/tc-ts-comment-01-name-display.spec.ts -g "name" --headed
 *
 * OVERVIEW:
 * Verifies that status comments display the commenting user's first and last
 * name. Adds a status comment to project 79, verifies the name shows in
 * "LastName, FirstName" format, and cleans up by deleting the comment.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Comment Creation:
 *    ✅ Add Status Comments dialog opens with textarea
 *    ✅ Comment is saved successfully
 *
 * 2. Name Display:
 *    ✅ Comment row shows user name (not IDIR username)
 *    ✅ Name appears in "LastName, FirstName" format (e.g., "Jin, Barry")
 *    ✅ Comment text is displayed correctly
 *
 * 3. Cleanup:
 *    ✅ Comment is deleted via Show all history dialog
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-COMMENT-01 — Comments show first and last name', () => {
  test.setTimeout(120_000);

  const PROJECT_ID = 79;
  const TEST_COMMENT = 'CRT-AUTO name display test comment';

  test.beforeEach(async ({ page }) => {
    await page.goto(`/projects/${PROJECT_ID}`);
    await expect(page.getByRole('heading', { name: 'Project Details' })).toBeVisible();
  });

  test('Status comment displays user first and last name', async ({ page }) => {
    await test.step('Step 1: Add a status comment', async () => {
      await page.getByRole('button', { name: 'Add Status Comments' }).click();
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await expect(dialog.getByRole('heading', { name: 'Add Status Comments' })).toBeVisible();

      await dialog.locator('textarea').fill(TEST_COMMENT);
      await expect(dialog.getByRole('button', { name: 'Submit' })).toBeEnabled();
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });
    });

    await test.step('Step 2: Verify name display in the comments table', async () => {
      // The main page table shows the most recent comment
      const commentRow = page.locator('table tbody tr', { hasText: TEST_COMMENT });
      await expect(commentRow).toBeVisible();

      // User column should show "LastName, FirstName" format (not IDIR)
      const userCell = commentRow.locator('td').nth(1);
      const userName = await userCell.textContent();

      // Verify it contains a comma (LastName, FirstName format) and not just an IDIR
      expect(userName).toContain(',');
      // Should not be an all-caps IDIR like "BARRYJIN"
      expect(userName).not.toMatch(/^[A-Z]+$/);
    });

    await test.step('Cleanup: Delete the test comment', async () => {
      await page.getByRole('button', { name: 'Show all Status Comments' }).click();
      const historyDialog = page.locator('[role="dialog"]').filter({ hasText: 'Status Comments History' });
      await expect(historyDialog).toBeVisible();

      const row = historyDialog.locator('table tbody tr', { hasText: TEST_COMMENT });
      await row.getByRole('button', { name: 'Delete Record' }).click();

      const popover = page.locator('[role="tooltip"]');
      await expect(popover).toBeVisible();
      // dispatchEvent bypasses Bootstrap modal table cell intercepting popover pointer events
      await popover.getByRole('button', { name: 'Delete' }).dispatchEvent('click');
      await expect(row).toBeHidden({ timeout: 10_000 });

      await historyDialog.getByRole('button', { name: 'Close' }).last().click();
    });
  });
});
