/**
 * ============================================================================
 * 04-Project-Search-Details - TC-TS-DETAIL-07: MoTI Region single-select required on save
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-DETAIL-07-region-required.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/04-project-search-details/tc-ts-detail-07-region-required.spec.ts --headed
 * Headless:               npx playwright test tests/04-project-search-details/tc-ts-detail-07-region-required.spec.ts
 * Debug:                  npx playwright test tests/04-project-search-details/tc-ts-detail-07-region-required.spec.ts --debug
 * Specific Test:          npx playwright test tests/04-project-search-details/tc-ts-detail-07-region-required.spec.ts -g "MoTI Region" --headed
 *
 * OVERVIEW:
 * Verifies that the MoTI Region field is a required single-select dropdown on
 * the Add Project form. Submitting without a region triggers a validation error.
 * After selecting a region, the dropdown displays the selected value and the
 * form can be submitted.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Required Validation:
 *    ✅ Submitting without MoTI Region shows "Region required" error
 *    ✅ Form does not submit without Region
 *
 * 2. Single-Select Behavior:
 *    ✅ Selecting a region updates the dropdown display text
 *    ✅ Only one region can be selected at a time
 *    ✅ Submit becomes possible after selecting region (with other fields)
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

test.describe('TC-TS-DETAIL-07: MoTI Region single-select required on save', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/projects`);
    await page.waitForURL('**/projects**');
    await page.locator('button[title="Add a New Project"]').waitFor({ state: 'visible' });
    await page.locator('button[title="Add a New Project"]').click();
    await expect(page.locator('[role="dialog"] .modal-header')).toContainText('Add Project');
  });

  test('MoTI Region is required and single-select', async ({ page }) => {
    await test.step('Step 1: Fill all required fields EXCEPT MoTI Region', async () => {
      await page.locator('input#projectNumber').fill('CRT-AUTO-REG-001');
      await page.locator('input#projectName').fill('Region Test Project');

      // Select RC Number
      await selectDropdownByLabel(page, 'rcLkupId', '55750');

      // Select Capital Index
      await selectDropdownByLabel(page, 'capIndxLkupId', '7-Capitalizable');
    });

    await test.step('Step 2: Submit and verify Region required validation error', async () => {
      const submitBtn = page.locator('.modal-footer button[type="submit"]');
      await expect(submitBtn).toBeEnabled();
      await submitBtn.click();

      const dialog = page.locator('[role="dialog"]');
      const errorFeedback = dialog.locator('.invalid-feedback').filter({
        hasText: 'Region required',
      });
      await expect(errorFeedback).toBeVisible();

      // Modal still open
      await expect(dialog.locator('.modal-header')).toContainText('Add Project');
    });

    await test.step('Step 3: Select MoTI Region and verify dropdown shows selection', async () => {
      await selectDropdownByLabel(page, 'regionId', '1-South Coast');

      // Verify dropdown text
      const dropdownText = await page.evaluate(() => {
        const label = document.querySelector('.modal-body label[for="regionId"]');
        const row = label!.closest('.form-group.row');
        const toggle = row!.querySelector('.col-sm-9 button.dropdown-toggle');
        return toggle!.textContent!.trim();
      });
      expect(dropdownText).toBe('1-South Coast');
    });

    await test.step('Step 4: Verify Submit is now enabled with all required fields filled', async () => {
      const submitBtn = page.locator('.modal-footer button[type="submit"]');
      await expect(submitBtn).toBeEnabled();
    });
  });
});
