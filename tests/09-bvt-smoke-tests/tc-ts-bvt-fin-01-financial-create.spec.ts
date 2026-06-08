/**
 * ============================================================================
 * 09-BVT-Smoke-Tests - TC-TS-BVT-FIN-01: Create project with financial details
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-BVT-FIN-01-financial-create.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-fin-01-financial-create.spec.ts --headed
 * Headless:               npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-fin-01-financial-create.spec.ts
 * Debug:                  npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-fin-01-financial-create.spec.ts --debug
 * Specific Test:          npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-fin-01-financial-create.spec.ts -g "Create project with financial" --headed
 *
 * OVERVIEW:
 * Build Verification Test confirming the full workflow: create project, navigate
 * to the Financial Plan tab, and add a financial planning entry. Validates that
 * financial data is correctly persisted and displayed in the table.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Project Creation:
 *    ✅ New project created via Add Project dialog
 *
 * 2. Financial Plan Tab:
 *    ✅ Financial Plan tab navigates to the plan page
 *    ✅ "+ Add" button opens the Add Financial Planning Targets dialog
 *
 * 3. Financial Entry Creation:
 *    ✅ All dropdowns (Fiscal Year, Phase, Element, Funding Type) selectable
 *    ✅ Amount field accepts numeric input
 *    ✅ Submit saves the entry
 *    ✅ Entry appears in the table with correct amount formatting
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-BVT-FIN-01 — BVT: Create project with financial details', () => {
  test.setTimeout(180_000);

  const uniqueSuffix = Date.now().toString();
  const projectNumber = `BVTF1${uniqueSuffix}`;
  const projectName = `BVT Financial Test ${uniqueSuffix}`;

  test('Create project and add financial planning entry', async ({ page }) => {
    await test.step('Step 1: Create a new project', async () => {
      await page.goto('/projects');
      await page.waitForTimeout(2000);

      await page.getByRole('button', { name: 'Add Project' }).click();
      await page.waitForTimeout(1000);

      const dialog = page.getByRole('dialog').filter({ hasText: 'Add Project' });
      await dialog.locator('input[name="projectNumber"]').fill(projectNumber);
      await dialog.locator('input[name="projectName"]').fill(projectName);

      // Select Region
      await page.evaluate(() => {
        const dialog = document.querySelector('[role="dialog"]');
        const dds = dialog!.querySelectorAll('button.dropdown-toggle');
        (dds[0] as HTMLElement).click();
      });
      await page.waitForTimeout(500);
      await page.evaluate(() => {
        const items = document.querySelectorAll('.dropdown-menu.show button.dropdown-item');
        for (const item of items) {
          if (item.textContent?.includes('1-South Coast')) {
            (item as HTMLElement).click();
            return;
          }
        }
        if (items.length > 0) (items[0] as HTMLElement).click();
      });
      await page.waitForTimeout(300);

      // Select RC Number
      await page.evaluate(() => {
        const dialog = document.querySelector('[role="dialog"]');
        const dds = dialog!.querySelectorAll('button.dropdown-toggle');
        (dds[2] as HTMLElement).click();
      });
      await page.waitForTimeout(500);
      await page.evaluate(() => {
        const items = document.querySelectorAll('.dropdown-menu.show button.dropdown-item');
        if (items.length > 0) (items[0] as HTMLElement).click();
      });
      await page.waitForTimeout(300);

      // Select Capital Index
      await page.evaluate(() => {
        const dialog = document.querySelector('[role="dialog"]');
        const dds = dialog!.querySelectorAll('button.dropdown-toggle');
        (dds[4] as HTMLElement).click();
      });
      await page.waitForTimeout(500);
      await page.evaluate(() => {
        const items = document.querySelectorAll('.dropdown-menu.show button.dropdown-item');
        if (items.length > 0) (items[0] as HTMLElement).click();
      });
      await page.waitForTimeout(300);

      // Submit project
      await page.evaluate(() => {
        const dialog = document.querySelector('[role="dialog"]');
        const submitBtn = dialog!.querySelector('button[type="submit"]');
        (submitBtn as HTMLElement).click();
      });
      await page.waitForTimeout(3000);
    });

    await test.step('Step 2: Search for and open the created project', async () => {
      await page.locator('input[name="searchText"]').fill(projectNumber);
      await page.getByRole('button', { name: 'Search' }).click();
      await page.waitForTimeout(3000);

      const projectLink = page.locator(`table tbody tr:has-text("${projectNumber}") a`).first();
      await expect(projectLink).toBeVisible();
      await projectLink.click();
      await page.waitForTimeout(3000);

      await expect(page).toHaveURL(/\/projects\/\d+/);
    });

    await test.step('Step 3: Navigate to Financial Plan tab', async () => {
      await page.locator('a:has-text("Financial Plan")').click();
      await page.waitForTimeout(2000);

      await expect(page).toHaveURL(/\/projects\/\d+\/projectplan/);
      await expect(page.getByRole('button', { name: '+ Add' })).toBeVisible();
    });

    await test.step('Step 4: Open Add Financial dialog and fill fields', async () => {
      await page.getByRole('button', { name: '+ Add' }).click();
      await page.waitForTimeout(1000);

      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();

      // Fiscal Year is pre-selected (default: current year)
      // Select Phase (dropdown index 1)
      await page.evaluate(() => {
        const dialog = document.querySelector('[role="dialog"]');
        const dds = dialog!.querySelectorAll('button.dropdown-toggle');
        (dds[1] as HTMLElement).click();
      });
      await page.waitForTimeout(300);
      await page.evaluate(() => {
        const items = document.querySelectorAll('.dropdown-menu.show button.dropdown-item');
        if (items.length > 0) (items[0] as HTMLElement).click();
      });
      await page.waitForTimeout(300);

      // Select Element (dropdown index 2)
      await page.evaluate(() => {
        const dialog = document.querySelector('[role="dialog"]');
        const dds = dialog!.querySelectorAll('button.dropdown-toggle');
        (dds[2] as HTMLElement).click();
      });
      await page.waitForTimeout(300);
      await page.evaluate(() => {
        const items = document.querySelectorAll('.dropdown-menu.show button.dropdown-item');
        if (items.length > 0) (items[0] as HTMLElement).click();
      });
      await page.waitForTimeout(300);

      // Select Funding Type (dropdown index 3)
      await page.evaluate(() => {
        const dialog = document.querySelector('[role="dialog"]');
        const dds = dialog!.querySelectorAll('button.dropdown-toggle');
        (dds[3] as HTMLElement).click();
      });
      await page.waitForTimeout(300);
      await page.evaluate(() => {
        const items = document.querySelectorAll('.dropdown-menu.show button.dropdown-item');
        if (items.length > 0) (items[0] as HTMLElement).click();
      });
      await page.waitForTimeout(300);

      // Fill Amount
      await dialog.getByRole('textbox', { name: 'Amount' }).fill('500000');

      // Fill Description
      await dialog.locator('textarea[name="description"]').fill('BVT Financial Entry');
    });

    await test.step('Step 5: Submit and verify entry in table', async () => {
      // Submit using evaluate to avoid dialog interception issue
      await page.evaluate(() => {
        const dialogs = document.querySelectorAll('[role="dialog"]');
        for (const d of dialogs) {
          if (d.textContent?.includes('Add Financial Planning Targets')) {
            const submitBtn = d.querySelector('button[type="submit"]');
            (submitBtn as HTMLElement).click();
            return;
          }
        }
      });
      await page.waitForTimeout(3000);

      // Verify entry appears in table
      const rows = page.locator('table tbody tr');
      await expect(rows.first()).toBeVisible();

      // Verify amount is displayed as $500,000
      await expect(page.locator('table tbody tr:has-text("$500,000")')).toBeVisible();
    });

    await test.step('Step 6: Cleanup - delete financial entry and close project', async () => {
      // Delete the financial entry
      await page.locator('button[title="Delete Record"]').first().evaluate(el => el.click());
      await page.waitForTimeout(500);

      // Confirm deletion in popover
      await page.evaluate(() => {
        const popovers = document.querySelectorAll('.popover');
        for (const p of popovers) {
          const btns = p.querySelectorAll('button');
          for (const btn of btns) {
            if (btn.textContent && btn.textContent.trim() === 'Delete') {
              btn.click();
              return;
            }
          }
        }
      });
      await page.waitForTimeout(2000);

      // Navigate to Details and close project
      const planUrl = page.url();
      const detailsUrl = planUrl.replace('/projectplan', '');
      await page.goto(detailsUrl);
      await page.waitForTimeout(2000);
      await page.getByRole('button', { name: 'Edit Project' }).click();
      await page.waitForTimeout(1000);
      await page.locator('input[name="endDate"]').dispatchEvent('click');
      await page.waitForTimeout(500);
      await page.getByRole('button', { name: 'Submit' }).click();
      await page.waitForTimeout(2000);
    });
  });
});
