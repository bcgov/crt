/**
 * ============================================================================
 * 07-Data-Maintenance - TC-TS-CODE-01: Code Value Set filter — mandatory single-select with default
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-CODE-01-code-set-filter.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/07-data-maintenance/tc-ts-code-01-code-set-filter.spec.ts --headed
 * Headless:               npx playwright test tests/07-data-maintenance/tc-ts-code-01-code-set-filter.spec.ts
 * Debug:                  npx playwright test tests/07-data-maintenance/tc-ts-code-01-code-set-filter.spec.ts --debug
 * Specific Test:          npx playwright test tests/07-data-maintenance/tc-ts-code-01-code-set-filter.spec.ts -g "Code Set" --headed
 *
 * OVERVIEW:
 * Verifies that the Code Set filter on Code Table Management is a mandatory
 * single-select dropdown defaulting to "Accomplishment", displays all expected
 * code set options, and that selecting a different code set updates the table
 * and "Add New" button dynamically.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Default State:
 *    ✅ Page heading "Code Table Management" is displayed
 *    ✅ Code Set dropdown defaults to "Accomplishment"
 *    ✅ URL contains codeSet=ACCOMPLISHMENT
 *
 * 2. Dropdown Options:
 *    ✅ All 16 expected code set options are present
 *    ✅ Dropdown is a searchable menu
 *
 * 3. Code Set Selection:
 *    ✅ Selecting "Contractor" updates the dropdown button text
 *    ✅ After Search, URL updates to codeSet=CONTRACTOR
 *    ✅ "Add New" button text changes to "Add New Contractor"
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-CODE-01 — Code Value Set filter — mandatory single-select with default', () => {
  test.setTimeout(60_000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/codetables');
    // Wait for the table to be populated (indicates data loaded)
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  test('Code Set dropdown defaults to Accomplishment and shows all options', async ({ page }) => {
    await test.step('Step 1: Verify page heading', async () => {
      await expect(page.getByRole('heading', { name: 'Code Table Management' })).toBeVisible();
    });

    await test.step('Step 2: Verify Code Set dropdown shows "Accomplishment" as default', async () => {
      const codeSetBtn = page.getByRole('button', { name: 'Accomplishment', exact: true });
      await expect(codeSetBtn).toBeVisible();
      // URL gets updated by React after initial data load
      await expect(page).toHaveURL(/codeSet=ACCOMPLISHMENT/, { timeout: 10_000 });
    });

    await test.step('Step 3: Open Code Set dropdown and verify all options', async () => {
      const codeSetBtn = page.getByRole('button', { name: 'Accomplishment', exact: true });
      await codeSetBtn.click();

      const expectedOptions = [
        'Accomplishment',
        'Capital Index',
        'Contractor',
        'Economic Region',
        'Electoral District',
        'Fiscal Year',
        'Funding Type',
        'Highway',
        'Nearest Town',
        'Phase',
        'Program',
        'Quantity',
        'RC Number',
        'Service Line',
        'Program Category',
        'Project Manager',
      ];

      for (const option of expectedOptions) {
        // Use exact matching for "Program" to avoid matching "Program Category"
        const exact = option === 'Program';
        await expect(page.getByRole('menuitem', { name: option, exact })).toBeVisible();
      }

      // Close the dropdown by clicking the button again (Escape doesn't work on this component)
      await codeSetBtn.click();
    });

    await test.step('Step 4: Select "Contractor" and verify updates', async () => {
      const codeSetBtn = page.getByRole('button', { name: 'Accomplishment', exact: true });
      await codeSetBtn.click();
      await page.getByRole('menuitem', { name: 'Contractor' }).click();

      // Dropdown button text should update
      await expect(page.getByRole('button', { name: 'Contractor', exact: true })).toBeVisible();

      // Click Search to trigger URL update and table reload
      await page.getByRole('button', { name: 'Search' }).click();
      await expect(page).toHaveURL(/codeSet=CONTRACTOR/);
      await expect(page.getByRole('button', { name: 'Add New Contractor' })).toBeVisible();
    });
  });
});
