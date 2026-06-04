/**
 * ============================================================================
 * 04-Project-Search-Details - TC-TS-DETAIL-14: Unsaved changes prompt on Close navigation
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-DETAIL-14-unsaved-changes-prompt.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/04-project-search-details/tc-ts-detail-14-unsaved-changes-prompt.spec.ts --headed
 * Headless:               npx playwright test tests/04-project-search-details/tc-ts-detail-14-unsaved-changes-prompt.spec.ts
 * Debug:                  npx playwright test tests/04-project-search-details/tc-ts-detail-14-unsaved-changes-prompt.spec.ts --debug
 * Specific Test:          npx playwright test tests/04-project-search-details/tc-ts-detail-14-unsaved-changes-prompt.spec.ts -g "Unsaved changes" --headed
 *
 * OVERVIEW:
 * Verifies that when a user has unsaved changes in the Edit Project modal and
 * attempts to close it (via Cancel or × button), a confirmation prompt appears
 * with "You have unsaved changes." text and "Leave" / "Go Back" buttons.
 * Clicking "Go Back" keeps the form open; clicking "Leave" discards changes.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Prompt Appears:
 *    ✅ Modifying a field and clicking Cancel triggers the prompt
 *    ✅ Prompt shows "You have unsaved changes." text
 *    ✅ Prompt has "Go Back" and "Leave" buttons
 *
 * 2. "Go Back" Behavior:
 *    ✅ Clicking "Go Back" dismisses the prompt
 *    ✅ Edit form remains open with changes intact
 *
 * 3. "Leave" Behavior:
 *    ✅ Clicking "Leave" closes the form
 *    ✅ Changes are discarded (not saved)
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'https://dev-crt.th.gov.bc.ca';
const PROJECT_ID = 79;

test.describe('TC-TS-DETAIL-14: Unsaved changes prompt on Close navigation', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/projects/${PROJECT_ID}`);
    await page.waitForSelector('button[title="Edit Project"]');
  });

  test('Unsaved changes prompt appears with Go Back and Leave options', async ({ page }) => {
    await test.step('Step 1: Open Edit form and make a change', async () => {
      await page.locator('button[title="Edit Project"]').click();
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog.locator('.modal-header')).toContainText('Edit Project');

      // Wait for form data to fully load from API (projectNumber gets populated)
      await dialog.locator('input#projectNumber').waitFor({ state: 'visible' });
      // Also wait for the description textarea to have its value populated (or be empty)
      // This ensures setInitialValues has completed and won't overwrite our change
      await page.waitForFunction(() => {
        const dialog = document.querySelector('[role="dialog"]');
        const input = dialog?.querySelector('input#projectNumber') as HTMLInputElement;
        return input && input.value.length > 0;
      });

      // Make a change to the description
      await dialog.locator('textarea#description').fill('Unsaved change test');
    });

    await test.step('Step 2: Click Cancel and verify unsaved changes prompt', async () => {
      const dialog = page.locator('[role="dialog"]').first();
      await dialog.locator('.modal-footer button:text("Cancel")').click();

      // The "You have unsaved changes" prompt should appear
      const prompt = page.locator('.modal').filter({ hasText: 'You have unsaved changes' });
      await expect(prompt).toBeVisible();
      await expect(prompt.locator('.modal-header')).toContainText('You have unsaved changes');
      await expect(prompt.locator('button:text("Go Back")')).toBeVisible();
      await expect(prompt.locator('button:text("Leave")')).toBeVisible();
    });

    await test.step('Step 3: Click "Go Back" — form stays open with changes', async () => {
      await page.locator('button:text("Go Back")').click();

      // The prompt should close but the Edit form remains open
      const dialog = page.locator('[role="dialog"]').first();
      await expect(dialog.locator('.modal-header')).toContainText('Edit Project');

      // Verify the change is still there
      await expect(dialog.locator('textarea#description')).toHaveValue('Unsaved change test');
    });

    await test.step('Step 4: Click Cancel again to trigger prompt', async () => {
      const dialog = page.locator('[role="dialog"]').first();
      await dialog.locator('.modal-footer button:text("Cancel")').click();

      const prompt = page.locator('.modal').filter({ hasText: 'You have unsaved changes' });
      await expect(prompt).toBeVisible();
    });

    await test.step('Step 5: Click "Leave" — form closes and changes are discarded', async () => {
      await page.locator('button:text("Leave")').click();

      // All modals should be closed — use .first() to avoid strict mode violation
      // (both dialog elements may remain in DOM briefly while fading out)
      await expect(page.locator('[role="dialog"]').first()).not.toBeVisible();

      // We should still be on the project details page
      await page.waitForSelector('button[title="Edit Project"]');

      // Verify changes were NOT saved (description should not be "Unsaved change test")
      const bodyText = await page.locator('body').textContent();
      expect(bodyText).not.toContain('Unsaved change test');
    });
  });
});
