/**
 * ============================================================================
 * 04-Project-Search-Details - TC-TS-DETAIL-02: Project Name required validation
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-DETAIL-02-project-name-required.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/04-project-search-details/tc-ts-detail-02-project-name-required.spec.ts --headed
 * Headless:               npx playwright test tests/04-project-search-details/tc-ts-detail-02-project-name-required.spec.ts
 * Debug:                  npx playwright test tests/04-project-search-details/tc-ts-detail-02-project-name-required.spec.ts --debug
 * Specific Test:          npx playwright test tests/04-project-search-details/tc-ts-detail-02-project-name-required.spec.ts -g "Project Name required" --headed
 *
 * OVERVIEW:
 * Verifies that the Project Name field is mandatory. Filling all other required
 * fields but leaving Project Name blank and clicking Submit triggers a Yup
 * inline validation error "Project name required" and prevents form submission.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Required Field Validation:
 *    ✅ Inline error "Project name required" appears on submit attempt
 *    ✅ Form does not submit when Project Name is empty
 *    ✅ Project Name input shows invalid visual state
 *
 * 2. Form Behavior:
 *    ✅ Submit button is enabled once form is dirty (other fields filled)
 *    ✅ Modal remains open after failed validation
 *    ✅ Previously entered data remains intact
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

test.describe('TC-TS-DETAIL-02: Project Name required validation', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/projects`);
    await page.waitForURL('**/projects**');
    await page.locator('button[title="Add a New Project"]').waitFor({ state: 'visible' });
  });

  test('Submit without Project Name shows validation error', async ({ page }) => {
    await test.step('Step 1: Click Add Project button', async () => {
      await page.locator('button[title="Add a New Project"]').click();
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog.locator('.modal-header')).toContainText('Add Project');
    });

    await test.step('Step 2: Fill all required fields EXCEPT Project Name', async () => {
      // Fill Project Number
      await page.locator('input#projectNumber').fill('CRT-AUTO-VAL-001');

      // Select MoTI Region
      await selectDropdownByLabel(page, 'regionId', '1-South Coast');

      // Select RC Number
      await selectDropdownByLabel(page, 'rcLkupId', '55750');

      // Select Capital Index
      await selectDropdownByLabel(page, 'capIndxLkupId', '7-Capitalizable');
    });

    await test.step('Step 3: Verify Submit is enabled (form is dirty) and click it', async () => {
      const submitBtn = page.locator('.modal-footer button[type="submit"]');
      await expect(submitBtn).toBeEnabled();
      await submitBtn.click();
    });

    await test.step('Step 4: Verify validation error for Project Name', async () => {
      const dialog = page.locator('[role="dialog"]');
      const errorFeedback = dialog.locator('.invalid-feedback').filter({
        hasText: 'Project name required',
      });
      await expect(errorFeedback).toBeVisible();

      // Verify the modal is still open (form did not submit)
      await expect(dialog.locator('.modal-header')).toContainText('Add Project');
    });

    await test.step('Step 5: Verify Project Name input shows invalid state', async () => {
      const projectNameInput = page.locator('input#projectName');
      await expect(projectNameInput).toHaveClass(/is-invalid/);
    });

    await test.step('Step 6: Verify previously entered data is intact', async () => {
      const projectNumberInput = page.locator('input#projectNumber');
      await expect(projectNumberInput).toHaveValue('CRT-AUTO-VAL-001');
    });
  });
});
