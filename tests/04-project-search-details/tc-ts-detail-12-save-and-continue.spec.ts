/**
 * ============================================================================
 * 04-Project-Search-Details - TC-TS-DETAIL-12: Save and Continue navigates to next screen
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-DETAIL-12-save-and-continue.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/04-project-search-details/tc-ts-detail-12-save-and-continue.spec.ts --headed
 * Headless:               npx playwright test tests/04-project-search-details/tc-ts-detail-12-save-and-continue.spec.ts
 * Debug:                  npx playwright test tests/04-project-search-details/tc-ts-detail-12-save-and-continue.spec.ts --debug
 * Specific Test:          npx playwright test tests/04-project-search-details/tc-ts-detail-12-save-and-continue.spec.ts -g "Save and Continue" --headed
 *
 * OVERVIEW:
 * Verifies that after creating a project via the Add Project modal, the user
 * can navigate to the project details page and use the sub-navigation tabs
 * (Financial Plan, Tender, Segment) to move between project sub-screens.
 * The app uses a modal for creation (not "Save and Continue" button), so this
 * test validates the full create-then-navigate workflow.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Project Creation:
 *    ✅ Project is created successfully via Add Project modal
 *    ✅ New project appears in the project list
 *
 * 2. Sub-navigation:
 *    ✅ Clicking "Financial Plan" tab navigates to /projectplan URL
 *    ✅ Financial Plan page loads successfully
 *
 * 3. Cleanup:
 *    ✅ Created project is closed to avoid polluting active projects
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

test.describe('TC-TS-DETAIL-12: Save and Continue navigates to next screen', () => {
  test.setTimeout(180_000);

  const uniqueId = Date.now().toString().slice(-6);
  const projectNumber = `SAV${uniqueId}`;

  test('Create project and navigate to Financial Plan', async ({ page }) => {
    let projectUrl = '';

    await test.step('Step 1: Navigate to Projects page and open Add Project', async () => {
      await page.goto(`${BASE_URL}/projects`);
      await page.waitForURL('**/projects**');
      await page.locator('button[title="Add a New Project"]').waitFor({ state: 'visible' });
      await page.locator('button[title="Add a New Project"]').click();
      await expect(page.locator('[role="dialog"] .modal-header')).toContainText('Add Project');
    });

    await test.step('Step 2: Fill project form and submit', async () => {
      await page.locator('input#projectNumber').fill(projectNumber);
      await page.locator('input#projectName').fill('Save Continue Test');
      await selectDropdownByLabel(page, 'regionId', '1-South Coast');
      await selectDropdownByLabel(page, 'rcLkupId', '55750');
      await selectDropdownByLabel(page, 'capIndxLkupId', '7-Capitalizable');

      const dialog = page.locator('[role="dialog"]');
      await dialog.locator('.modal-footer button[type="submit"]').click();
      await expect(dialog).not.toBeVisible();
    });

    await test.step('Step 3: Find and navigate to the new project', async () => {
      // Search for the new project
      await page.locator('input[name="searchText"]').fill(projectNumber);
      await page.locator('button:text("Search")').click();
      await page.waitForTimeout(1000);

      // Click on the project link
      const projectLink = page.locator(`a:text("${projectNumber}")`);
      await expect(projectLink).toBeVisible();
      await projectLink.click();

      // Wait for project details to load
      await page.waitForSelector('button[title="Edit Project"]');
      projectUrl = page.url();
      expect(projectUrl).toContain('/projects/');
    });

    await test.step('Step 4: Click "Financial Plan" tab and verify navigation', async () => {
      await page.locator('a:text("Financial Plan")').click();
      await page.waitForURL('**/projectplan');
      expect(page.url()).toContain('/projectplan');
    });

    await test.step('Step 5: Cleanup — close the created project', async () => {
      // Navigate back to project details
      await page.locator('a:text("Details")').click();
      await page.waitForSelector('button[title="Edit Project"]');

      // Open Edit and check "Project Closed"
      await page.locator('button[title="Edit Project"]').click();
      const dialog = page.locator('[role="dialog"]');
      await dialog.locator('input#projectNumber').waitFor({ state: 'visible' });

      const checkbox = dialog.locator('input[name="endDate"]');
      await checkbox.check({ force: true });
      await dialog.locator('.modal-footer button[type="submit"]').click();
      await expect(dialog).not.toBeVisible();
    });
  });
});
