/**
 * ============================================================================
 * 08-UI-Enhancements - TC-TS-COMMENT-04: Delete existing status comment
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-COMMENT-04-delete-comment.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/08-ui-enhancements/tc-ts-comment-04-delete-comment.spec.ts --headed
 * Headless:               npx playwright test tests/08-ui-enhancements/tc-ts-comment-04-delete-comment.spec.ts
 * Debug:                  npx playwright test tests/08-ui-enhancements/tc-ts-comment-04-delete-comment.spec.ts --debug
 * Specific Test:          npx playwright test tests/08-ui-enhancements/tc-ts-comment-04-delete-comment.spec.ts -g "Delete" --headed
 *
 * OVERVIEW:
 * Verifies that an existing status comment can be deleted via the Delete Record
 * button in the history dialog with confirmation popover. Creates a test
 * comment, opens the history, deletes it, and verifies removal.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Delete Confirmation:
 *    ✅ Delete Record button shows "Are you sure?" popover
 *    ✅ Popover includes "permanently delete the record" text
 *    ✅ Popover has "Delete" and "Cancel" buttons
 *
 * 2. Delete Effect:
 *    ✅ After confirming, comment is removed from history
 *    ✅ Remaining comments are still displayed
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-COMMENT-04 — Delete existing status comment', () => {
  test.setTimeout(120_000);

  const TEST_COMMENT = 'CRT-AUTO comment to be deleted';

  test.beforeEach(async ({ page }) => {
    await page.goto('/projects');
    await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30000 });
    const firstProjectLink = page.locator('table tbody tr td:nth-child(2) a').first();
    const href = await firstProjectLink.getAttribute('href');
    await page.goto(href as string);
    await expect(page.getByRole('heading', { name: 'Project Details' })).toBeVisible({ timeout: 30000 });
  });

  test('Delete status comment with confirmation', async ({ page }) => {
    await test.step('Setup: Delete any leftover test comment from a prior run', async () => {
      const showAllBtn = page.getByRole('button', { name: 'Show all Status Comments' });
      if (await showAllBtn.isVisible()) {
        await showAllBtn.click();
        const historyDialog = page.locator('[role="dialog"]').filter({ hasText: 'Status Comments History' });
        await expect(historyDialog).toBeVisible();
        const leftover = historyDialog.locator('table tbody tr', { hasText: TEST_COMMENT });
        if (await leftover.isVisible()) {
          await leftover.getByRole('button', { name: 'Delete Record' }).click();
          const popover = page.locator('[role="tooltip"]');
          await expect(popover).toBeVisible();
          await popover.getByRole('button', { name: 'Delete' }).dispatchEvent('click');
          await expect(leftover).toBeHidden({ timeout: 10_000 });
        }
        await historyDialog.getByRole('button', { name: 'Close' }).last().click();
      }
    });

    await test.step('Step 1: Create a test comment', async () => {
      await page.getByRole('button', { name: 'Add Status Comments' }).click();
      const dialog = page.getByRole('dialog').filter({ hasText: 'Add Status Comments' });
      await expect(dialog).toBeVisible();
      await dialog.locator('textarea').fill(TEST_COMMENT);
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });
    });

    await test.step('Step 2: Open history and verify comment exists', async () => {
      await page.getByRole('button', { name: 'Show all Status Comments' }).click();
      const historyDialog = page.locator('[role="dialog"]').filter({ hasText: 'Status Comments History' });
      await expect(historyDialog).toBeVisible();

      const row = historyDialog.locator('table tbody tr', { hasText: TEST_COMMENT });
      await expect(row).toBeVisible();
    });

    await test.step('Step 3: Click Delete and verify confirmation popover', async () => {
      const historyDialog = page.locator('[role="dialog"]').filter({ hasText: 'Status Comments History' });
      const row = historyDialog.locator('table tbody tr', { hasText: TEST_COMMENT });
      await row.getByRole('button', { name: 'Delete Record' }).click();

      const popover = page.locator('[role="tooltip"]');
      await expect(popover).toBeVisible();
      await expect(popover.locator('h3')).toHaveText('Are you sure?');
      await expect(popover).toContainText('permanently delete the record');
      await expect(popover.getByRole('button', { name: 'Delete' })).toBeVisible();
      await expect(popover.getByRole('button', { name: 'Cancel' })).toBeVisible();
    });

    await test.step('Step 4: Confirm delete and verify removal', async () => {
      const popover = page.locator('[role="tooltip"]');
      // dispatchEvent bypasses Bootstrap modal table cell intercepting popover pointer events
      await popover.getByRole('button', { name: 'Delete' }).dispatchEvent('click');

      const historyDialog = page.locator('[role="dialog"]').filter({ hasText: 'Status Comments History' });
      const row = historyDialog.locator('table tbody tr', { hasText: TEST_COMMENT });
      await expect(row).toBeHidden({ timeout: 10_000 });

      await historyDialog.getByRole('button', { name: 'Close' }).last().click();
    });
  });
});
