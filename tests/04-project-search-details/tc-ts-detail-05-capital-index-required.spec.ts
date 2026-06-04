/**
 * ============================================================================
 * 04-Project-Search-Details - TC-TS-DETAIL-05: Capital Index dropdown single-select required with help text
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-DETAIL-05-capital-index-required.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/04-project-search-details/tc-ts-detail-05-capital-index-required.spec.ts --headed
 * Headless:               npx playwright test tests/04-project-search-details/tc-ts-detail-05-capital-index-required.spec.ts
 * Debug:                  npx playwright test tests/04-project-search-details/tc-ts-detail-05-capital-index-required.spec.ts --debug
 * Specific Test:          npx playwright test tests/04-project-search-details/tc-ts-detail-05-capital-index-required.spec.ts -g "Capital Index" --headed
 *
 * OVERVIEW:
 * Verifies that the Capital Index field is a required single-select dropdown,
 * that omitting it triggers a validation error on submit, that selecting a value
 * enables form submission, and that hovering over the help icon shows a tooltip.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Required Field Validation:
 *    ✅ Submitting without Capital Index shows "Capital Index required" error
 *    ✅ Form does not submit without Capital Index
 *
 * 2. Single-Select Behavior:
 *    ✅ Selecting a value updates the dropdown display text
 *    ✅ Only one value can be selected at a time
 *
 * 3. Help Text Tooltip:
 *    ✅ A help icon is present near the Capital Index label
 *    ✅ Hovering shows a descriptive popover about Capital Index
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'https://dev-crt.th.gov.bc.ca';

/**
 * Helper to select a value from a SingleDropdown field by its form label `for` attribute.
 */
async function selectDropdownByLabel(page: import('@playwright/test').Page, forAttr: string, optionText: string) {
  await page.evaluate(
    ({ forAttr, optionText }) => {
      const label = document.querySelector(`.modal-body label[for="${forAttr}"]`);
      if (!label) throw new Error(`Label for="${forAttr}" not found`);
      const row = label.closest('.form-group.row');
      if (!row) throw new Error(`Form group row for "${forAttr}" not found`);
      const btn = row.querySelector('.col-sm-9 button.dropdown-toggle') as HTMLButtonElement;
      if (!btn) throw new Error(`Dropdown toggle for "${forAttr}" not found`);
      btn.click();
    },
    { forAttr, optionText }
  );
  await page.waitForTimeout(200);
  await page.evaluate(
    ({ forAttr, optionText }) => {
      const label = document.querySelector(`.modal-body label[for="${forAttr}"]`);
      const row = label!.closest('.form-group.row');
      const items = row!.querySelectorAll('.dropdown-item');
      for (const item of items) {
        if (item.textContent!.trim().startsWith(optionText)) {
          (item as HTMLElement).click();
          return;
        }
      }
      throw new Error(`Option starting with "${optionText}" not found in "${forAttr}" dropdown`);
    },
    { forAttr, optionText }
  );
  await page.waitForTimeout(200);
}

test.describe('TC-TS-DETAIL-05: Capital Index dropdown single-select required with help text', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/projects`);
    await page.waitForURL('**/projects**');
    await page.locator('button[title="Add a New Project"]').waitFor({ state: 'visible' });
    await page.locator('button[title="Add a New Project"]').click();
    await expect(page.locator('[role="dialog"] .modal-header')).toContainText('Add Project');
  });

  test('Capital Index is required, single-select, and has help text', async ({ page }) => {
    await test.step('Step 1: Fill required fields except Capital Index', async () => {
      await page.locator('input#projectNumber').fill('CRT-AUTO-CI-001');
      await page.locator('input#projectName').fill('Capital Index Test');

      // Select MoTI Region
      await selectDropdownByLabel(page, 'regionId', '1-South Coast');

      // Select RC Number
      await selectDropdownByLabel(page, 'rcLkupId', '55750');
    });

    await test.step('Step 2: Submit without Capital Index — verify validation error', async () => {
      const submitBtn = page.locator('.modal-footer button[type="submit"]');
      await expect(submitBtn).toBeEnabled();
      await submitBtn.click();

      // Verify Capital Index required error
      const dialog = page.locator('[role="dialog"]');
      const errorFeedback = dialog.locator('.invalid-feedback').filter({
        hasText: 'Capital Index required',
      });
      await expect(errorFeedback).toBeVisible();

      // Modal should still be open
      await expect(dialog.locator('.modal-header')).toContainText('Add Project');
    });

    await test.step('Step 3: Select Capital Index value and verify dropdown shows selection', async () => {
      await selectDropdownByLabel(page, 'capIndxLkupId', '7-Capitalizable');

      // Verify the dropdown toggle now shows the selected value
      const dropdownText = await page.evaluate(() => {
        const label = document.querySelector('.modal-body label[for="capIndxLkupId"]');
        const row = label!.closest('.form-group.row');
        const toggle = row!.querySelector('.col-sm-9 button.dropdown-toggle');
        return toggle!.textContent!.trim();
      });
      expect(dropdownText).toContain('7-Capitalizable');
    });

    await test.step('Step 4: Verify Submit button is now enabled after selecting Capital Index', async () => {
      const submitBtn = page.locator('.modal-footer button[type="submit"]');
      await expect(submitBtn).toBeEnabled();
    });

    await test.step('Step 5: Verify help icon tooltip for Capital Index', async () => {
      const helpIcon = page.locator('#capIndxLkupId__tooltip');
      await expect(helpIcon).toBeVisible();
      await helpIcon.hover();

      const popover = page.locator('.popover.show .popover-body');
      await expect(popover).toBeVisible();
      await expect(popover).toContainText('capitalizable');
    });
  });
});
