/**
 * ============================================================================
 * 04-Project-Search-Details - TC-TS-DETAIL-13: Save and Close returns to Project Search
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-DETAIL-13-save-and-close.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/04-project-search-details/tc-ts-detail-13-save-and-close.spec.ts --headed
 * Headless:               npx playwright test tests/04-project-search-details/tc-ts-detail-13-save-and-close.spec.ts
 * Debug:                  npx playwright test tests/04-project-search-details/tc-ts-detail-13-save-and-close.spec.ts --debug
 * Specific Test:          npx playwright test tests/04-project-search-details/tc-ts-detail-13-save-and-close.spec.ts -g "Save and Close" --headed
 *
 * OVERVIEW:
 * Verifies that after editing and saving a project, clicking the "Close" tab
 * in the sub-navigation returns the user to the Project Search page. The
 * "Close" link navigates to /projects.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Edit and Save:
 *    ✅ Project description is updated successfully
 *    ✅ Updated description appears on the details page
 *
 * 2. Close Navigation:
 *    ✅ "Close" tab link navigates to /projects
 *    ✅ Projects search page loads with search filters
 *
 * 3. Cleanup:
 *    ✅ Original description is restored
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'https://dev-crt.th.gov.bc.ca';
const PROJECT_ID = 79;
const UPDATED_DESCRIPTION = 'CRT-AUTO updated description for save-close test';

test.describe('TC-TS-DETAIL-13: Save and Close returns to Project Search', () => {
  test.setTimeout(120_000);

  test('Edit project, save, then navigate back via Close tab', async ({ page }) => {
    let originalDescription = '';

    await test.step('Step 1: Navigate to project details and capture original description', async () => {
      await page.goto(`${BASE_URL}/projects/${PROJECT_ID}`);
      await page.waitForSelector('button[title="Edit Project"]');

      // Capture the current description for cleanup
      originalDescription = await page.evaluate(() => {
        const body = document.body.textContent || '';
        const match = body.match(/Project Description(.+?)Project Scope/s);
        return match ? match[1].trim() : '';
      });
    });

    await test.step('Step 2: Edit project description and save', async () => {
      await page.locator('button[title="Edit Project"]').click();
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog.locator('.modal-header')).toContainText('Edit Project');
      await dialog.locator('input#projectNumber').waitFor({ state: 'visible' });

      // Update description
      await dialog.locator('textarea#description').fill(UPDATED_DESCRIPTION);

      // Submit
      const submitBtn = dialog.locator('.modal-footer button[type="submit"]');
      await expect(submitBtn).toBeEnabled();
      await submitBtn.click();
      await expect(dialog).not.toBeVisible();
    });

    await test.step('Step 3: Verify updated description appears on details page', async () => {
      await page.waitForSelector('button[title="Edit Project"]');
      await expect(page.locator('body')).toContainText(UPDATED_DESCRIPTION);
    });

    await test.step('Step 4: Click "Close" tab to return to Project Search', async () => {
      // The "Close" link in sub-navigation points to /projects
      await page.locator('a:text-is("Close")').click();
      await page.waitForURL('**/projects**');
      expect(page.url()).toContain('/projects');

      // Verify we're on the Projects search page
      await expect(page.locator('h1')).toContainText('Projects');
      await expect(page.locator('button:text("Search")')).toBeVisible();
    });

    await test.step('Step 5: Cleanup — restore original description', async () => {
      await page.goto(`${BASE_URL}/projects/${PROJECT_ID}`);
      await page.waitForSelector('button[title="Edit Project"]');
      await page.locator('button[title="Edit Project"]').click();

      const dialog = page.locator('[role="dialog"]');
      await dialog.locator('input#projectNumber').waitFor({ state: 'visible' });
      await dialog.locator('textarea#description').fill(originalDescription);

      await dialog.locator('.modal-footer button[type="submit"]').click();
      await expect(dialog).not.toBeVisible();
    });
  });
});
