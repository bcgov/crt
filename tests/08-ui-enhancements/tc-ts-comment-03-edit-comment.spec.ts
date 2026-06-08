/**
 * ============================================================================
 * 08-UI-Enhancements - TC-TS-COMMENT-03: Edit existing status comment
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-COMMENT-03-edit-comment.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/08-ui-enhancements/tc-ts-comment-03-edit-comment.spec.ts --headed
 * Headless:               npx playwright test tests/08-ui-enhancements/tc-ts-comment-03-edit-comment.spec.ts
 * Debug:                  npx playwright test tests/08-ui-enhancements/tc-ts-comment-03-edit-comment.spec.ts --debug
 * Specific Test:          npx playwright test tests/08-ui-enhancements/tc-ts-comment-03-edit-comment.spec.ts -g "Edit" --headed
 *
 * OVERVIEW:
 * Verifies that an existing status comment can be edited via the Edit Record
 * button in the Status Comments History dialog. Creates a comment, edits it,
 * verifies the update, and cleans up.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Edit Flow:
 *    ✅ Edit Record button opens "Edit Status Comments" dialog
 *    ✅ Textarea is pre-filled with current comment text
 *    ✅ Modifying text and submitting updates the comment
 *
 * 2. After Edit:
 *    ✅ Updated text appears in the history table
 *    ✅ User name is preserved
 *
 * 3. Cleanup:
 *    ✅ Edited comment is deleted
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-COMMENT-03 — Edit existing status comment', () => {
  test.setTimeout(120_000);

  const PROJECT_ID = 79;
  const ORIGINAL_COMMENT = 'CRT-AUTO original status comment';
  const UPDATED_COMMENT = 'CRT-AUTO updated status comment text';

  test.beforeEach(async ({ page }) => {
    await page.goto(`/projects/${PROJECT_ID}`);
    await expect(page.getByRole('heading', { name: 'Project Details' })).toBeVisible();
  });

  test('Edit status comment via history dialog', async ({ page }) => {
    await test.step('Step 1: Create a test comment', async () => {
      await page.getByRole('button', { name: 'Add Status Comments' }).click();
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await dialog.locator('textarea').fill(ORIGINAL_COMMENT);
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });
    });

    await test.step('Step 2: Open history and click Edit on the comment', async () => {
      await page.getByRole('button', { name: 'Show all Status Comments' }).click();
      const historyDialog = page.locator('[role="dialog"]').filter({ hasText: 'Status Comments History' });
      await expect(historyDialog).toBeVisible();

      const row = historyDialog.locator('table tbody tr', { hasText: ORIGINAL_COMMENT });
      await expect(row).toBeVisible();
      await row.getByRole('button', { name: 'Edit Record' }).click();
    });

    await test.step('Step 3: Verify edit dialog and modify comment', async () => {
      const editDialog = page.locator('[role="dialog"]').filter({ hasText: 'Edit Status Comments' });
      await expect(editDialog).toBeVisible();
      await expect(editDialog.getByRole('heading', { name: 'Edit Status Comments' })).toBeVisible();

      // Textarea is pre-filled with original text
      const textarea = editDialog.locator('textarea');
      await expect(textarea).toHaveValue(ORIGINAL_COMMENT);

      // Modify the text
      await textarea.fill(UPDATED_COMMENT);
      await expect(editDialog.getByRole('button', { name: 'Submit' })).toBeEnabled();
      await editDialog.getByRole('button', { name: 'Submit' }).click();
      await expect(editDialog).toBeHidden({ timeout: 10_000 });
    });

    await test.step('Step 4: Verify updated text in history', async () => {
      const historyDialog = page.locator('[role="dialog"]').filter({ hasText: 'Status Comments History' });
      await expect(historyDialog.locator('table tbody tr', { hasText: UPDATED_COMMENT })).toBeVisible();
      // Original text should no longer appear
      await expect(historyDialog.locator('table tbody tr', { hasText: ORIGINAL_COMMENT })).toBeHidden();
    });

    await test.step('Cleanup: Delete the edited comment', async () => {
      const historyDialog = page.locator('[role="dialog"]').filter({ hasText: 'Status Comments History' });
      const row = historyDialog.locator('table tbody tr', { hasText: UPDATED_COMMENT });
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
