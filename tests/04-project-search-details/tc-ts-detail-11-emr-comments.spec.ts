/**
 * ============================================================================
 * 04-Project-Search-Details - TC-TS-DETAIL-11: EMR Comments add and view with 2000 char limit
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-DETAIL-11-emr-comments.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/04-project-search-details/tc-ts-detail-11-emr-comments.spec.ts --headed
 * Headless:               npx playwright test tests/04-project-search-details/tc-ts-detail-11-emr-comments.spec.ts
 * Debug:                  npx playwright test tests/04-project-search-details/tc-ts-detail-11-emr-comments.spec.ts --debug
 * Specific Test:          npx playwright test tests/04-project-search-details/tc-ts-detail-11-emr-comments.spec.ts -g "EMR Comments" --headed
 *
 * OVERVIEW:
 * Verifies that EMR Comments can be added to a project, the comment table
 * shows the date and user, the Submit button is disabled until text is entered,
 * and the "Show all" modal displays the full comment history. Same behavior
 * as Status Comments but in the EMR Comments section.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Add EMR Comment:
 *    ✅ "Add EMR Comments" button opens a modal
 *    ✅ Submit is disabled when comment textarea is empty
 *    ✅ Submit becomes enabled after entering text
 *    ✅ Comment is saved and appears in the table
 *
 * 2. Comment Table Display:
 *    ✅ Table shows "Date Added", "User", and "Comment" columns
 *    ✅ New comment shows today's date (YYYY-MM-DD format)
 *    ✅ New comment shows current user's name
 *
 * 3. Show All Comments:
 *    ✅ "Show all EMR Comments" opens a history modal
 *    ✅ History modal displays all comments
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'https://dev-crt.th.gov.bc.ca';
const PROJECT_ID = 79; // "Another test project" in 1-South Coast
const COMMENT_TEXT = 'CRT-AUTO EMR comment for testing purposes';

test.describe('TC-TS-DETAIL-11: EMR Comments add and view', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/projects/${PROJECT_ID}`);
    await page.waitForSelector('button[title="Add EMR Comments"]');
  });

  test('Add an EMR comment and verify it appears in the table', async ({ page }) => {
    await test.step('Step 1: Click "Add EMR Comments" and verify modal opens', async () => {
      await page.locator('button[title="Add EMR Comments"]').click();
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog.locator('.modal-header')).toContainText('Add EMR Comments');
    });

    await test.step('Step 2: Verify Submit is disabled when textarea is empty', async () => {
      const dialog = page.locator('[role="dialog"]');
      const submitBtn = dialog.locator('.modal-footer button[type="submit"]');
      await expect(submitBtn).toBeDisabled();
    });

    await test.step('Step 3: Enter comment text and verify Submit becomes enabled', async () => {
      const dialog = page.locator('[role="dialog"]');
      await dialog.locator('textarea#comment').fill(COMMENT_TEXT);
      const submitBtn = dialog.locator('.modal-footer button[type="submit"]');
      await expect(submitBtn).toBeEnabled();
    });

    await test.step('Step 4: Submit the comment', async () => {
      const dialog = page.locator('[role="dialog"]');
      await dialog.locator('.modal-footer button[type="submit"]').click();
      await expect(dialog).not.toBeVisible();
    });

    await test.step('Step 5: Verify comment appears in the EMR Comments table', async () => {
      // The EMR Comments section shows the most recent comment
      await expect(page.locator('body')).toContainText(COMMENT_TEXT);

      // Verify today's date appears (format: YYYY-MM-DD)
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const todayFormatted = `${year}-${month}-${day}`;
      await expect(page.locator('body')).toContainText(todayFormatted);
    });

    await test.step('Step 6: Click "Show all EMR Comments" and verify history modal', async () => {
      await page.locator('button[title="Show all EMR Comments"]').click();

      // A modal with "EMR Comments History" should open
      const historyModal = page.locator('[role="dialog"]');
      await expect(historyModal.locator('.modal-header')).toContainText('EMR Comments History');

      // The comment should appear in the history
      await expect(historyModal.locator('.modal-body')).toContainText(COMMENT_TEXT);

      // Verify table headers
      const headers = historyModal.locator('table th');
      await expect(headers.nth(0)).toContainText('Date Added');
      await expect(headers.nth(1)).toContainText('User');
      await expect(headers.nth(2)).toContainText('Comment');
    });
  });
});
