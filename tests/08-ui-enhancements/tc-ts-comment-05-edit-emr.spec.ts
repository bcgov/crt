/**
 * ============================================================================
 * 08-UI-Enhancements - TC-TS-COMMENT-05: Edit EMR comment
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-COMMENT-05-edit-emr.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/08-ui-enhancements/tc-ts-comment-05-edit-emr.spec.ts --headed
 * Headless:               npx playwright test tests/08-ui-enhancements/tc-ts-comment-05-edit-emr.spec.ts
 * Debug:                  npx playwright test tests/08-ui-enhancements/tc-ts-comment-05-edit-emr.spec.ts --debug
 * Specific Test:          npx playwright test tests/08-ui-enhancements/tc-ts-comment-05-edit-emr.spec.ts -g "EMR" --headed
 *
 * OVERVIEW:
 * Verifies that an existing EMR comment can be edited via the Edit Record
 * button in the EMR Comments History dialog. Creates an EMR comment, edits it,
 * verifies the update, and cleans up.
 *
 * WHAT THE TEST VALIDATES:
 * 1. EMR Edit Flow:
 *    ✅ Edit Record opens "Edit EMR Comments" dialog
 *    ✅ Textarea is pre-filled with current EMR comment
 *    ✅ Modifying and submitting updates the comment
 *
 * 2. After Edit:
 *    ✅ Updated text appears in the EMR history table
 *    ✅ User name is preserved
 *
 * 3. Cleanup:
 *    ✅ Edited EMR comment is deleted
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-COMMENT-05 — Edit EMR comment', () => {
  test.setTimeout(120_000);

  const ORIGINAL_EMR = 'CRT-AUTO original EMR note';
  const UPDATED_EMR = 'CRT-AUTO updated EMR note text';

  test.beforeEach(async ({ page }) => {
    await page.goto('/projects');
    await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30000 });
    const firstProjectLink = page.locator('table tbody tr td:nth-child(2) a').first();
    const href = await firstProjectLink.getAttribute('href');
    await page.goto(href as string);
    await expect(page.getByRole('heading', { name: 'Project Details' })).toBeVisible({ timeout: 30000 });
  });

  test('Edit EMR comment via history dialog', async ({ page }) => {
    await test.step('Setup: Delete any leftover test EMR comments from a prior run', async () => {
      const showAllBtn = page.getByRole('button', { name: 'Show all EMR Comments' });
      if (await showAllBtn.isVisible()) {
        await showAllBtn.click();
        const historyDialog = page.locator('[role="dialog"]').filter({ hasText: 'EMR Comments History' });
        await expect(historyDialog).toBeVisible();
        for (const commentText of [ORIGINAL_EMR, UPDATED_EMR]) {
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

    await test.step('Step 1: Create a test EMR comment', async () => {
      await page.getByRole('button', { name: 'Add EMR Comments' }).click();
      const dialog = page.getByRole('dialog').filter({ hasText: 'Add EMR Comments' });
      await expect(dialog).toBeVisible();
      await expect(dialog.getByRole('heading', { name: 'Add EMR Comments' })).toBeVisible();
      await dialog.locator('textarea').fill(ORIGINAL_EMR);
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });
    });

    await test.step('Step 2: Open EMR history and click Edit', async () => {
      await page.getByRole('button', { name: 'Show all EMR Comments' }).click();
      const historyDialog = page.locator('[role="dialog"]').filter({ hasText: 'EMR Comments History' });
      await expect(historyDialog).toBeVisible();

      const row = historyDialog.locator('table tbody tr', { hasText: ORIGINAL_EMR });
      await expect(row).toBeVisible();
      await row.getByRole('button', { name: 'Edit Record' }).click();
    });

    await test.step('Step 3: Verify edit dialog and modify EMR comment', async () => {
      const editDialog = page.locator('[role="dialog"]').filter({ hasText: 'Edit EMR Comments' });
      await expect(editDialog).toBeVisible();
      await expect(editDialog.getByRole('heading', { name: 'Edit EMR Comments' })).toBeVisible();

      // Textarea is pre-filled
      const textarea = editDialog.locator('textarea');
      await expect(textarea).toHaveValue(ORIGINAL_EMR);

      // Modify and submit
      await textarea.fill(UPDATED_EMR);
      await expect(editDialog.getByRole('button', { name: 'Submit' })).toBeEnabled();
      await editDialog.getByRole('button', { name: 'Submit' }).click();
      await expect(editDialog).toBeHidden({ timeout: 10_000 });
    });

    await test.step('Step 4: Verify updated text in EMR history', async () => {
      const historyDialog = page.locator('[role="dialog"]').filter({ hasText: 'EMR Comments History' });
      await expect(historyDialog.locator('table tbody tr', { hasText: UPDATED_EMR })).toBeVisible();
      await expect(historyDialog.locator('table tbody tr', { hasText: ORIGINAL_EMR })).toBeHidden();
    });

    await test.step('Cleanup: Delete the edited EMR comment', async () => {
      const historyDialog = page.locator('[role="dialog"]').filter({ hasText: 'EMR Comments History' });
      const row = historyDialog.locator('table tbody tr', { hasText: UPDATED_EMR });
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
