/**
 * ============================================================================
 * 04-Project-Search-Details - TC-TS-DETAIL-08: PM dropdown available with options
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-DETAIL-08-pm-dependent-on-region.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/04-project-search-details/tc-ts-detail-08-pm-dependent-on-region.spec.ts --headed
 * Headless:               npx playwright test tests/04-project-search-details/tc-ts-detail-08-pm-dependent-on-region.spec.ts
 * Debug:                  npx playwright test tests/04-project-search-details/tc-ts-detail-08-pm-dependent-on-region.spec.ts --debug
 * Specific Test:          npx playwright test tests/04-project-search-details/tc-ts-detail-08-pm-dependent-on-region.spec.ts -g "PM dropdown" --headed
 *
 * OVERVIEW:
 * Verifies that the Project Manager dropdown on the Add Project form is
 * available, shows searchable PM options, and allows single-value selection.
 * Note: In the current implementation the PM dropdown is NOT disabled based
 * on region selection — it is always enabled with all PMs available.
 *
 * WHAT THE TEST VALIDATES:
 * 1. PM Dropdown Availability:
 *    ✅ PM dropdown is enabled on the Add Project form
 *    ✅ PM dropdown contains at least one project manager option
 *    ✅ PM dropdown is searchable (has search input)
 *
 * 2. Selection Behavior:
 *    ✅ Selecting a PM updates the dropdown display text
 *    ✅ PM is a single-select field (one value shown)
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'https://dev-crt.th.gov.bc.ca';

test.describe('TC-TS-DETAIL-08: PM dropdown available with options', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/projects`);
    await page.waitForURL('**/projects**');
    await page.locator('button[title="Add a New Project"]').waitFor({ state: 'visible' });
    await page.locator('button[title="Add a New Project"]').click();
    await expect(page.locator('[role="dialog"] .modal-header')).toContainText('Add Project');
  });

  test('PM dropdown is available and shows project manager options', async ({ page }) => {
    await test.step('Step 1: Verify PM dropdown is enabled', async () => {
      const pmDisabled = await page.evaluate(() => {
        const label = document.querySelector('.modal-body label[for="projectMgrLkupId"]');
        const row = label!.closest('.form-group.row');
        const dropdown = row!.querySelector('.form-control.form-input');
        return dropdown!.classList.contains('disabled');
      });
      expect(pmDisabled).toBe(false);
    });

    await test.step('Step 2: Open PM dropdown and verify it has options', async () => {
      await page.evaluate(() => {
        const label = document.querySelector('.modal-body label[for="projectMgrLkupId"]');
        const row = label!.closest('.form-group.row');
        row!.querySelector<HTMLButtonElement>('.col-sm-9 button.dropdown-toggle')!.click();
      });
      await page.waitForTimeout(200);

      const pmOptions = await page.evaluate(() => {
        const label = document.querySelector('.modal-body label[for="projectMgrLkupId"]');
        const row = label!.closest('.form-group.row');
        const items = row!.querySelectorAll('.dropdown-item');
        return Array.from(items)
          .map((i) => i.textContent!.trim())
          .filter((t) => t.length > 0);
      });

      expect(pmOptions.length).toBeGreaterThan(0);
      expect(pmOptions).toContain('Devashish Bhargava');
    });

    await test.step('Step 3: Verify PM dropdown is searchable', async () => {
      const hasSearch = await page.evaluate(() => {
        const label = document.querySelector('.modal-body label[for="projectMgrLkupId"]');
        const row = label!.closest('.form-group.row');
        return !!row!.querySelector('.dropdown-menu input[type="textbox"]');
      });
      expect(hasSearch).toBe(true);
    });

    await test.step('Step 4: Select a PM and verify dropdown text updates', async () => {
      await page.evaluate(() => {
        const label = document.querySelector('.modal-body label[for="projectMgrLkupId"]');
        const row = label!.closest('.form-group.row');
        const items = row!.querySelectorAll('.dropdown-item');
        for (const item of items) {
          if (item.textContent!.trim() === 'Devashish Bhargava') {
            (item as HTMLElement).click();
            return;
          }
        }
      });
      await page.waitForTimeout(200);

      const selectedText = await page.evaluate(() => {
        const label = document.querySelector('.modal-body label[for="projectMgrLkupId"]');
        const row = label!.closest('.form-group.row');
        return row!.querySelector('.col-sm-9 button.dropdown-toggle')!.textContent!.trim();
      });
      expect(selectedText).toBe('Devashish Bhargava');
    });
  });
});
