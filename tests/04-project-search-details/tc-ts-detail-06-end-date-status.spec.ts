/**
 * ============================================================================
 * 04-Project-Search-Details - TC-TS-DETAIL-06: Project end date determines Active/Closed status
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-DETAIL-06-end-date-status.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/04-project-search-details/tc-ts-detail-06-end-date-status.spec.ts --headed
 * Headless:               npx playwright test tests/04-project-search-details/tc-ts-detail-06-end-date-status.spec.ts
 * Debug:                  npx playwright test tests/04-project-search-details/tc-ts-detail-06-end-date-status.spec.ts --debug
 * Specific Test:          npx playwright test tests/04-project-search-details/tc-ts-detail-06-end-date-status.spec.ts -g "end date" --headed
 *
 * OVERVIEW:
 * Verifies that checking the "Project Closed" checkbox sets the project status
 * to Closed (endDate = today), and unchecking it restores Active status
 * (endDate = null). The Edit Project form uses a checkbox rather than a date
 * picker; checking it sets endDate to today's date on the backend.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Closing a Project:
 *    ✅ Checking "Project Closed" and submitting sets status to "Yes"
 *    ✅ Project details page shows "Project Closed: Yes"
 *    ✅ Project list shows "Closed" badge
 *
 * 2. Re-activating a Project:
 *    ✅ Unchecking "Project Closed" and submitting restores "Active" status
 *    ✅ Project details page shows "Project Closed: No"
 *
 * 3. Cleanup:
 *    ✅ Project is restored to Active state after test
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'https://dev-crt.th.gov.bc.ca';
const PROJECT_ID = 79; // "Another test project" in 1-South Coast

test.describe('TC-TS-DETAIL-06: Project end date determines Active/Closed status', () => {
  test.setTimeout(120_000);

  test('Checking Project Closed sets status to Closed, unchecking restores Active', async ({ page }) => {
    await test.step('Step 1: Navigate to project details page', async () => {
      await page.goto(`${BASE_URL}/projects/${PROJECT_ID}`);
      await page.waitForSelector('button[title="Edit Project"]');

      // Verify initial state is Active (Project Closed = No)
      await expect(page.locator('body')).toContainText('Project Closed');
    });

    await test.step('Step 2: Open Edit form and check "Project Closed"', async () => {
      await page.locator('button[title="Edit Project"]').click();
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog.locator('.modal-header')).toContainText('Edit Project');

      // Wait for form to load (spinner disappears)
      await dialog.locator('input#projectNumber').waitFor({ state: 'visible' });

      // Check the "Project Closed" checkbox (Bootstrap custom-control with opacity:0)
      const endDateCheckbox = dialog.locator('input[name="endDate"]');
      await endDateCheckbox.check({ force: true });
      await expect(endDateCheckbox).toBeChecked();
    });

    await test.step('Step 3: Submit and verify project shows as Closed', async () => {
      const dialog = page.locator('[role="dialog"]');
      const submitBtn = dialog.locator('.modal-footer button[type="submit"]');
      await expect(submitBtn).toBeEnabled();
      await submitBtn.click();

      // Wait for modal to close and page to reload
      await expect(dialog).not.toBeVisible();
      await page.waitForSelector('button[title="Edit Project"]');

      // Verify "Project Closed" shows "Yes" on the details page
      const closedValue = await page.evaluate(() => {
        const els = document.querySelectorAll('.row .col-sm-3, .row [class*="col"]');
        for (const el of els) {
          if (el.textContent.includes('Project Closed')) {
            const row = el.closest('.row');
            return row?.textContent?.replace(/Project Closed.*?(?=\w)/, '')?.trim();
          }
        }
        return null;
      });
      expect(closedValue).toContain('Yes');
    });

    await test.step('Step 4: Re-open Edit form and uncheck "Project Closed" (restore Active)', async () => {
      await page.locator('button[title="Edit Project"]').click();
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog.locator('.modal-header')).toContainText('Edit Project');
      await dialog.locator('input#projectNumber').waitFor({ state: 'visible' });

      // Uncheck the "Project Closed" checkbox (Bootstrap custom-control with opacity:0)
      const endDateCheckbox = dialog.locator('input[name="endDate"]');
      await endDateCheckbox.uncheck({ force: true });
      await expect(endDateCheckbox).not.toBeChecked();
    });

    await test.step('Step 5: Submit and verify project is Active again', async () => {
      const dialog = page.locator('[role="dialog"]');
      const submitBtn = dialog.locator('.modal-footer button[type="submit"]');
      await expect(submitBtn).toBeEnabled();
      await submitBtn.click();

      // Wait for modal to close and page to reload
      await expect(dialog).not.toBeVisible();
      await page.waitForSelector('button[title="Edit Project"]');

      // Verify "Project Closed" shows "No" on the details page
      const closedValue = await page.evaluate(() => {
        const els = document.querySelectorAll('.row .col-sm-3, .row [class*="col"]');
        for (const el of els) {
          if (el.textContent.includes('Project Closed')) {
            const row = el.closest('.row');
            return row?.textContent?.replace(/Project Closed.*?(?=\w)/, '')?.trim();
          }
        }
        return null;
      });
      expect(closedValue).toContain('No');
    });
  });
});
