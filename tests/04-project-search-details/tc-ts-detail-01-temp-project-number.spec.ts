/**
 * ============================================================================
 * 04-Project-Search-Details - TC-TS-DETAIL-01: Temporary project number assignment on save without number
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-DETAIL-01-temp-project-number.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/04-project-search-details/tc-ts-detail-01-temp-project-number.spec.ts --headed
 * Headless:               npx playwright test tests/04-project-search-details/tc-ts-detail-01-temp-project-number.spec.ts
 * Debug:                  npx playwright test tests/04-project-search-details/tc-ts-detail-01-temp-project-number.spec.ts --debug
 * Specific Test:          npx playwright test tests/04-project-search-details/tc-ts-detail-01-temp-project-number.spec.ts -g "Temporary project number" --headed
 *
 * OVERVIEW:
 * Verifies that when a user attempts to submit the Add Project form without
 * providing a Project Number, the system displays an inline validation error
 * prompting them to assign a temporary value. The form does not submit until
 * a Project Number is provided.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Validation Error Display:
 *    ✅ Inline error appears for empty Project Number on submit attempt
 *    ✅ Error text mentions assigning a temporary value
 *    ✅ Form does not submit (modal remains open)
 *
 * 2. Submit Button Behavior:
 *    ✅ Submit is enabled when form is dirty (other fields filled)
 *    ✅ Clicking Submit triggers validation and shows error
 *    ✅ Project Number field shows invalid state
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
  // Wait for dropdown to open
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

test.describe('TC-TS-DETAIL-01: Temporary project number assignment on save without number', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/projects`);
    await page.waitForURL('**/projects**');
    await page.locator('button[title="Add a New Project"]').waitFor({ state: 'visible' });
  });

  test('Submit without Project Number shows validation error', async ({ page }) => {
    await test.step('Step 1: Click Add Project button', async () => {
      await page.locator('button[title="Add a New Project"]').click();
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog.locator('.modal-header')).toContainText('Add Project');
    });

    await test.step('Step 2: Fill all required fields EXCEPT Project Number', async () => {
      // Fill Project Name
      await page.locator('input#projectName').fill('CRT-AUTO-TEMP-001');

      // Select MoTI Region
      await selectDropdownByLabel(page, 'regionId', '1-South Coast');

      // Select RC Number
      await selectDropdownByLabel(page, 'rcLkupId', '55750');

      // Select Capital Index
      await selectDropdownByLabel(page, 'capIndxLkupId', '7-Capitalizable');
    });

    await test.step('Step 3: Verify Submit button is enabled (form is dirty)', async () => {
      const submitBtn = page.locator('.modal-footer button[type="submit"]');
      await expect(submitBtn).toBeEnabled();
    });

    await test.step('Step 4: Click Submit and verify validation error for Project Number', async () => {
      await page.locator('.modal-footer button[type="submit"]').click();

      // Verify inline validation error appears
      const dialog = page.locator('[role="dialog"]');
      const errorFeedback = dialog.locator('.invalid-feedback').filter({
        hasText: 'Project number required',
      });
      await expect(errorFeedback).toBeVisible();
      await expect(errorFeedback).toContainText('temporary value');

      // Verify the modal is still open (form did not submit)
      await expect(dialog.locator('.modal-header')).toContainText('Add Project');
    });

    await test.step('Step 5: Verify Project Number input shows invalid state', async () => {
      const projectNumberInput = page.locator('input#projectNumber');
      await expect(projectNumberInput).toHaveClass(/is-invalid/);
    });
  });
});
