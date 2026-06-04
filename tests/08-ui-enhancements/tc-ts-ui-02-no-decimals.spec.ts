/**
 * ============================================================================
 * 08 UI Enhancements - TC-TS-UI-02: No decimals on financial amounts
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-UI-02-no-decimals.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/08-ui-enhancements/tc-ts-ui-02-no-decimals.spec.ts --headed
 * Headless:               npx playwright test tests/08-ui-enhancements/tc-ts-ui-02-no-decimals.spec.ts
 * Debug:                  npx playwright test tests/08-ui-enhancements/tc-ts-ui-02-no-decimals.spec.ts --debug
 * Specific Test:          npx playwright test tests/08-ui-enhancements/tc-ts-ui-02-no-decimals.spec.ts -g "no decimals" --headed
 *
 * OVERVIEW:
 * Verifies that decimal values are not allowed on financial amount fields across
 * the application. Tests the Financial Plan Amount, Tender Ministry Estimate,
 * Tender Winning Bid, and Public Project Information value fields (Announcement,
 * C-035, Estimated Value) to confirm that digits after a decimal point are rejected.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Financial Plan Amount Field:
 *    ✅ Whole numbers are accepted and formatted with $ and commas
 *    ✅ Digits after decimal point are not accepted
 *    ✅ Trailing period is removed on blur
 *
 * 2. Tender Ministry Estimate and Winning Bid Fields:
 *    ✅ Digits after decimal point are not accepted
 *    ✅ Trailing period is removed on blur
 *    ✅ Whole numbers are accepted
 *
 * 3. Public Project Information (Announcement/C-035/Estimated Value):
 *    ✅ Digits after decimal point are not accepted
 *    ✅ Trailing period is removed on blur
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-UI-02 — No decimals on financial amounts', () => {
  // Use a longer timeout for multi-step UI tests
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    // Navigate to the Projects list and open the first available project
    await page.goto('/projects?isInProgress=true&pageNumber=1&pageSize=25');
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();

    // Click the first project link in the table
    const firstProjectLink = page.locator('table tbody tr:first-child td:nth-child(2) a');
    await expect(firstProjectLink).toBeVisible();
    await firstProjectLink.click();

    // Verify we're on the Project Details page
    await expect(page.getByRole('heading', { name: 'Project Details' })).toBeVisible();
  });

  /**
   * Helper: Types a decimal value into a currency field and verifies the
   * decimal digits are rejected. Then blurs and checks the trailing period is removed.
   */
  async function verifyDecimalRejected(
    page: import('@playwright/test').Page,
    fieldLocator: import('@playwright/test').Locator,
    decimalInput: string,
    expectedWhileTyping: RegExp,
    expectedAfterBlur: RegExp
  ) {
    // Clear the field
    await fieldLocator.click();
    await page.keyboard.press('Control+a');
    await page.keyboard.press('Delete');

    // Type the decimal value character by character
    await fieldLocator.pressSequentially(decimalInput);

    // Verify: digits after decimal are rejected (field ends with period or has no decimal digits)
    await expect(fieldLocator).toHaveValue(expectedWhileTyping);

    // Blur the field by pressing Tab
    await page.keyboard.press('Tab');

    // After blur, trailing period should be removed - just the whole number remains
    await expect(fieldLocator).toHaveValue(expectedAfterBlur);
  }

  /**
   * Helper: Types a whole number into a currency field and verifies it is accepted.
   */
  async function verifyWholeNumberAccepted(
    page: import('@playwright/test').Page,
    fieldLocator: import('@playwright/test').Locator,
    wholeInput: string,
    expectedValue: RegExp
  ) {
    // Clear the field
    await fieldLocator.click();
    await page.keyboard.press('Control+a');
    await page.keyboard.press('Delete');

    // Type the whole number
    await fieldLocator.pressSequentially(wholeInput);

    // Verify: whole number is accepted and properly formatted
    await expect(fieldLocator).toHaveValue(expectedValue);
  }

  test('No decimals on Financial Plan Amount field', async ({ page }) => {
    await test.step('Step 1: Navigate to Financial Plan page', async () => {
      await page.getByRole('link', { name: 'Financial Plan' }).click();
      await expect(page).toHaveURL(/\/projectplan$/);
    });

    await test.step('Step 2: Open Add Financial Planning Targets dialog', async () => {
      await page.getByRole('button', { name: '+ Add' }).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Add Financial Planning Targets' })).toBeVisible();
    });

    const amountField = page.getByRole('textbox', { name: 'Amount' });

    await test.step('Step 3: Verify decimal input "1000.50" is rejected', async () => {
      await verifyDecimalRejected(
        page,
        amountField,
        '1000.50',
        /^\$1,000\.$/,   // While typing: period accepted, but "50" after it rejected
        /^\$1,000$/      // After blur: trailing period removed
      );
    });

    await test.step('Step 4: Verify whole number "1000" is accepted', async () => {
      await verifyWholeNumberAccepted(
        page,
        amountField,
        '1000',
        /^\$1,000$/
      );
    });

    await test.step('Step 5: Cancel dialog without saving', async () => {
      await page.getByRole('button', { name: 'Cancel' }).click();
    });
  });

  test('No decimals on Tender monetary fields', async ({ page }) => {
    await test.step('Step 1: Navigate to Tender page', async () => {
      await page.getByRole('link', { name: 'Tender' }).click();
      await expect(page).toHaveURL(/\/projecttender$/);
    });

    await test.step('Step 2: Open Add Tender Details dialog', async () => {
      // Click the first "+ Add" button (Project Tender Details section)
      await page.getByRole('button', { name: '+ Add' }).first().click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Add Tender Details' })).toBeVisible();
    });

    const ministryEstimate = page.getByRole('textbox', { name: 'Ministry Estimate' });
    const winningBid = page.getByRole('textbox', { name: 'Winning Bid' });

    await test.step('Step 3: Verify decimal "500.99" rejected on Ministry Estimate', async () => {
      await verifyDecimalRejected(
        page,
        ministryEstimate,
        '500.99',
        /^\$500\.$/,
        /^\$500$/
      );
    });

    await test.step('Step 4: Verify whole number "500" accepted on Ministry Estimate', async () => {
      await verifyWholeNumberAccepted(
        page,
        ministryEstimate,
        '500',
        /^\$500$/
      );
    });

    await test.step('Step 5: Verify decimal "250.75" rejected on Winning Bid', async () => {
      await verifyDecimalRejected(
        page,
        winningBid,
        '250.75',
        /^\$250\.$/,
        /^\$250$/
      );
    });

    await test.step('Step 6: Verify whole number "250" accepted on Winning Bid', async () => {
      await verifyWholeNumberAccepted(
        page,
        winningBid,
        '250',
        /^\$250$/
      );
    });

    await test.step('Step 7: Cancel dialog without saving', async () => {
      await page.getByRole('button', { name: 'Cancel' }).click();
    });
  });

  test('No decimals on Public Project Information value fields', async ({ page }) => {
    await test.step('Step 1: Navigate to Financial Plan page', async () => {
      await page.getByRole('link', { name: 'Financial Plan' }).click();
      await expect(page).toHaveURL(/\/projectplan$/);
    });

    await test.step('Step 2: Open Edit Announcement Details dialog', async () => {
      await page.getByRole('button', { name: 'Edit Public Project Information' }).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Edit Announcement Details' })).toBeVisible();
    });

    const announcementValue = page.getByRole('textbox', { name: 'Announcement Value' });
    const c035Value = page.getByRole('textbox', { name: 'C-035 Value' });
    const estimatedValue = page.getByRole('textbox', { name: 'Estimated Value' });

    await test.step('Step 3: Verify decimal rejected on Announcement Value', async () => {
      await verifyDecimalRejected(
        page,
        announcementValue,
        '2000.50',
        /^\$2,000\.$/,
        /^\$2,000$/
      );
    });

    await test.step('Step 4: Verify decimal rejected on C-035 Value', async () => {
      await verifyDecimalRejected(
        page,
        c035Value,
        '750.25',
        /^\$750\.$/,
        /^\$750$/
      );
    });

    await test.step('Step 5: Verify decimal rejected on Estimated Value', async () => {
      await verifyDecimalRejected(
        page,
        estimatedValue,
        '999.99',
        /^\$999\.$/,
        /^\$999$/
      );
    });

    await test.step('Step 6: Cancel dialog without saving', async () => {
      await page.getByRole('button', { name: 'Cancel' }).click();
      // Handle unsaved changes prompt if it appears
      const leaveButton = page.getByRole('button', { name: 'Leave' });
      if (await leaveButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await leaveButton.click();
      }
    });
  });
});
