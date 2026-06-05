/**
 * ============================================================================
 * 05-Financial-Planning - TC-TS-FIN-08: Public Project Information edit and help text
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-FIN-08-public-project-info.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/05-financial-planning/tc-ts-fin-08-public-project-info.spec.ts --headed
 * Headless:               npx playwright test tests/05-financial-planning/tc-ts-fin-08-public-project-info.spec.ts
 * Debug:                  npx playwright test tests/05-financial-planning/tc-ts-fin-08-public-project-info.spec.ts --debug
 * Specific Test:          npx playwright test tests/05-financial-planning/tc-ts-fin-08-public-project-info.spec.ts -g "Public Project" --headed
 *
 * OVERVIEW:
 * Verifies that the Public Project Information section on the Financial Plan page
 * can be edited. Currency fields (Announcement Value, C-035 Value) accept integer
 * values and display with $ formatting. Help text popovers appear on hover.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Edit Form:
 *    ✅ Edit button opens "Edit Announcement Details" dialog
 *    ✅ Announcement Value accepts integer currency (displays as $250,000)
 *    ✅ C-035 Value accepts integer currency (displays as $175,000)
 *    ✅ Announcement Comment (Annoucement Notes) accepts free text
 *
 * 2. Display After Save:
 *    ✅ Announcement Value shows "$250,000"
 *    ✅ C-035 Value shows "$175,000"
 *    ✅ Announcement Comment shows the entered text
 *
 * 3. Help Text:
 *    ✅ Announcement Value icon shows popover on hover
 *    ✅ Popover contains descriptive help text
 *
 * 4. Cleanup:
 *    ✅ Values reverted to original state
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-FIN-08 — Public Project Information edit and help text', () => {
  test.setTimeout(120_000);

  // Store original values for cleanup
  let originalAnnouncementValue: string;
  let originalC035Value: string;
  let originalComment: string;

  test.beforeEach(async ({ page }) => {
    await page.goto('/projects/79/projectplan');
    await expect(page.locator('h1', { hasText: 'Public Project Information' })).toBeVisible();
  });

  test('Edit Public Project Information and verify help text', async ({ page }) => {
    await test.step('Step 1: Open Edit Public Project Information dialog and capture originals', async () => {
      await page.getByRole('button', { name: 'Edit Public Project Information' }).click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('.modal-title')).toHaveText('Edit Announcement Details');

      // Capture original values for cleanup
      originalAnnouncementValue = await dialog.getByRole('textbox', { name: 'Announcement Value' }).inputValue();
      originalC035Value = await dialog.getByRole('textbox', { name: 'C-035 Value' }).inputValue();
      originalComment = await dialog.getByRole('textbox', { name: 'Annoucement Notes' }).inputValue();

      // Close without saving
      await dialog.getByRole('button', { name: 'Cancel' }).click();
      await expect(dialog).not.toBeVisible();
    });

    await test.step('Step 2: Edit fields with new values', async () => {
      await page.getByRole('button', { name: 'Edit Public Project Information' }).click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      // Fill Announcement Value
      const annValue = dialog.getByRole('textbox', { name: 'Announcement Value' });
      await annValue.fill('');
      await annValue.fill('250000');
      await expect(annValue).toHaveValue('$250,000');

      // Fill C-035 Value
      const c035 = dialog.getByRole('textbox', { name: 'C-035 Value' });
      await c035.fill('');
      await c035.fill('175000');
      await expect(c035).toHaveValue('$175,000');

      // Fill Announcement Comment
      const comment = dialog.getByRole('textbox', { name: 'Annoucement Notes' });
      await comment.fill('CRT-AUTO public info test comment');
    });

    await test.step('Step 3: Submit and verify displayed values', async () => {
      const dialog = page.locator('[role="dialog"]');
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).not.toBeVisible();

      // Verify Announcement Value displays correctly
      const announcementSection = page.locator('text=Announcement Value').locator('..').locator('..');
      await expect(announcementSection).toContainText('$250,000');

      // Verify C-035 Value displays correctly
      const c035Section = page.locator('text=C-035 Value').locator('..').locator('..');
      await expect(c035Section).toContainText('$175,000');

      // Verify Announcement Comment displays correctly
      await expect(page.locator('p', { hasText: 'CRT-AUTO public info test comment' })).toBeVisible();
    });

    await test.step('Step 4: Verify help text popover on hover', async () => {
      // Hover over the Announcement Value help icon (force: true to bypass layout issues)
      await page.locator('#project-details__anncmentValue').hover({ force: true });
      await page.waitForTimeout(1500);

      // Verify popover with help text appears
      const popover = page.locator('.popover-body');
      await expect(popover).toBeVisible();
      await expect(popover).toContainText('announcement');
    });

    await test.step('Cleanup: Revert Public Project Information to original values', async () => {
      // Move mouse away to dismiss popover
      await page.mouse.move(0, 0);
      await page.waitForTimeout(500);

      await page.getByRole('button', { name: 'Edit Public Project Information' }).click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      // Revert Announcement Value
      const annValue = dialog.getByRole('textbox', { name: 'Announcement Value' });
      await annValue.fill('');
      if (originalAnnouncementValue && originalAnnouncementValue !== '$0') {
        // Extract numeric value from formatted string (e.g., "$100,000" -> "100000")
        const numericValue = originalAnnouncementValue.replace(/[$,]/g, '');
        await annValue.fill(numericValue);
      } else {
        await annValue.fill('0');
      }

      // Revert C-035 Value
      const c035 = dialog.getByRole('textbox', { name: 'C-035 Value' });
      await c035.fill('');
      if (originalC035Value && originalC035Value !== '$0') {
        const numericValue = originalC035Value.replace(/[$,]/g, '');
        await c035.fill(numericValue);
      } else {
        await c035.fill('0');
      }

      // Revert Comment
      const comment = dialog.getByRole('textbox', { name: 'Annoucement Notes' });
      await comment.fill(originalComment || '');

      await dialog.getByRole('button', { name: 'Submit' }).click();
      await expect(dialog).not.toBeVisible();
    });
  });
});
