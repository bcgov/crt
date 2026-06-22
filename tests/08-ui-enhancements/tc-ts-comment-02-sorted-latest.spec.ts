/**
 * ============================================================================
 * 08-UI-Enhancements - TC-TS-COMMENT-02: Comments sorted latest first
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-COMMENT-02-sorted-latest.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/08-ui-enhancements/tc-ts-comment-02-sorted-latest.spec.ts --headed
 * Headless:               npx playwright test tests/08-ui-enhancements/tc-ts-comment-02-sorted-latest.spec.ts
 * Debug:                  npx playwright test tests/08-ui-enhancements/tc-ts-comment-02-sorted-latest.spec.ts --debug
 * Specific Test:          npx playwright test tests/08-ui-enhancements/tc-ts-comment-02-sorted-latest.spec.ts -g "sorted" --headed
 *
 * OVERVIEW:
 * Verifies that comments are sorted chronologically with the most recent
 * comment displayed first. Adds two comments sequentially, then opens the
 * history dialog to confirm the second (newer) comment appears above the
 * first (older) one.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Sort Order:
 *    ✅ Most recently added comment appears first in the history
 *    ✅ Older comments follow in descending chronological order
 *
 * 2. Cleanup:
 *    ✅ Both test comments are deleted
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-COMMENT-02 — Comments sorted latest first', () => {
  test.setTimeout(120_000);

  const COMMENT_OLDER = 'CRT-AUTO first comment - older';
  const COMMENT_NEWER = 'CRT-AUTO second comment - newer';

  test.beforeEach(async ({ page }) => {
    await page.goto('/projects');
    await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30000 });
    const firstProjectLink = page.locator('table tbody tr td:nth-child(2) a').first();
    const href = await firstProjectLink.getAttribute('href');
    await page.goto(href as string);
    await expect(page.getByRole('heading', { name: 'Project Details' })).toBeVisible({ timeout: 30000 });
  });

  test('Comments are sorted newest first in history', async ({ page }) => {
    await test.step('Setup: Delete any leftover test comments from a prior run', async () => {
      const showAllBtn = page.getByRole('button', { name: 'Show all Status Comments' });
      if (await showAllBtn.isVisible()) {
        await showAllBtn.click();
        const historyDialog = page.locator('[role="dialog"]').filter({ hasText: 'Status Comments History' });
        await expect(historyDialog).toBeVisible();
        for (const commentText of [COMMENT_OLDER, COMMENT_NEWER]) {
          const leftover = historyDialog.locator('table tbody tr', { hasText: commentText });
          if (await leftover.isVisible()) {
            await leftover.getByRole('button', { name: 'Delete Record' }).click();
            const popover = page.locator('[role="tooltip"]');
            await expect(popover).toBeVisible();
            await popover.getByRole('button', { name: 'Delete' }).dispatchEvent('click');
            await expect(leftover).toBeHidden({ timeout: 10_000 });
          }
        }
        await historyDialog.getByRole('button', { name: 'Close' }).last().click();
      }
    });

    await test.step('Step 1: Add first (older) comment', async () => {
      await page.getByRole('button', { name: 'Add Status Comments' }).click();
      const dialog = page.getByRole('dialog').filter({ hasText: 'Add Status Comments' });
      await expect(dialog).toBeVisible();
      await dialog.locator('textarea').fill(COMMENT_OLDER);
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });
    });

    await test.step('Step 2: Add second (newer) comment', async () => {
      // Wait for first comment to appear in the main table — ensures a distinct server timestamp
      await expect(page.locator('table tbody tr', { hasText: COMMENT_OLDER })).toBeVisible({ timeout: 10_000 });
      await page.getByRole('button', { name: 'Add Status Comments' }).click();
      const dialog = page.getByRole('dialog').filter({ hasText: 'Add Status Comments' });
      await expect(dialog).toBeVisible();
      await dialog.locator('textarea').fill(COMMENT_NEWER);
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });
    });

    await test.step('Step 3: Verify sort order in history (newest first)', async () => {
      await page.getByRole('button', { name: 'Show all Status Comments' }).click();
      const historyDialog = page.locator('[role="dialog"]').filter({ hasText: 'Status Comments History' });
      await expect(historyDialog).toBeVisible();

      const rows = historyDialog.locator('table tbody tr');
      // Find positions of our two comments
      const count = await rows.count();
      let newerIndex = -1;
      let olderIndex = -1;

      for (let i = 0; i < count; i++) {
        const text = await rows.nth(i).locator('td').nth(2).textContent();
        if (text?.includes(COMMENT_NEWER)) newerIndex = i;
        if (text?.includes(COMMENT_OLDER)) olderIndex = i;
      }

      // Newer comment should have a lower index (appears first/above)
      expect(newerIndex).toBeGreaterThanOrEqual(0);
      expect(olderIndex).toBeGreaterThanOrEqual(0);
      expect(newerIndex).toBeLessThan(olderIndex);
    });

    await test.step('Cleanup: Delete both test comments', async () => {
      const historyDialog = page.locator('[role="dialog"]').filter({ hasText: 'Status Comments History' });

      // Delete newer comment first (it's at the top)
      const newerRow = historyDialog.locator('table tbody tr', { hasText: COMMENT_NEWER });
      await newerRow.getByRole('button', { name: 'Delete Record' }).click();
      await expect(page.locator('[role="tooltip"]')).toBeVisible();
      // dispatchEvent bypasses Bootstrap modal table cell intercepting popover pointer events
      await page.locator('[role="tooltip"]').getByRole('button', { name: 'Delete' }).dispatchEvent('click');
      await expect(newerRow).toBeHidden({ timeout: 10_000 });

      // Delete older comment
      const olderRow = historyDialog.locator('table tbody tr', { hasText: COMMENT_OLDER });
      await olderRow.getByRole('button', { name: 'Delete Record' }).click();
      await expect(page.locator('[role="tooltip"]')).toBeVisible();
      // dispatchEvent bypasses Bootstrap modal table cell intercepting popover pointer events
      await page.locator('[role="tooltip"]').getByRole('button', { name: 'Delete' }).dispatchEvent('click');
      await expect(olderRow).toBeHidden({ timeout: 10_000 });

      await historyDialog.getByRole('button', { name: 'Close' }).last().click();
    });
  });
});
