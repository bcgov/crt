/**
 * ============================================================================
 * 09-BVT-Smoke-Tests - TC-TS-BVT-FIN-02: Add financial details to existing project
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-BVT-FIN-02-financial-later.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-fin-02-financial-later.spec.ts --headed
 * Headless:               npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-fin-02-financial-later.spec.ts
 * Debug:                  npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-fin-02-financial-later.spec.ts --debug
 * Specific Test:          npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-fin-02-financial-later.spec.ts -g "Add financial details" --headed
 *
 * OVERVIEW:
 * Build Verification Test confirming that financial details can be added to an
 * existing project at a later time (not during initial creation). Creates a
 * project, verifies the Financial Plan tab has no entries, then adds one.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Empty Financial Plan:
 *    ✅ New project has no financial plan entries
 *    ✅ Table is empty or shows no-data message
 *
 * 2. Add Later Workflow:
 *    ✅ "+ Add" button works on existing project
 *    ✅ Financial entry can be created
 *    ✅ Entry appears in table with correct amount ($250,000)
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-BVT-FIN-02 — BVT: Add financial details to existing project', () => {
  test.setTimeout(180_000);

  const uniqueSuffix = Date.now().toString();
  const projectNumber = `BVTF2${uniqueSuffix}`;
  const projectName = `BVT Fin Later ${uniqueSuffix}`;

  test('Add financial details to existing project later', async ({ page }) => {
    await test.step('Step 1: Create a project without financial data', async () => {
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

      await page.evaluate(() => {
        const dialog = document.querySelector('[role="dialog"]');
        const submitBtn = dialog!.querySelector('button[type="submit"]');
        (submitBtn as HTMLElement).click();
      });
      await page.waitForTimeout(3000);
    });

    await test.step('Step 2: Search and navigate to the project', async () => {
      await page.locator('input[name="searchText"]').fill(projectNumber);
      await page.getByRole('button', { name: 'Search' }).click();
      await page.waitForTimeout(3000);

      const projectLink = page.locator(`table tbody tr:has-text("${projectNumber}") a`).first();
      await projectLink.click();
      await page.waitForTimeout(3000);

      await expect(page).toHaveURL(/\/projects\/\d+/);
    });

    await test.step('Step 3: Navigate to Financial Plan and verify empty', async () => {
      await page.locator('a:has-text("Financial Plan")').click();
      await page.waitForTimeout(2000);

      await expect(page).toHaveURL(/\/projects\/\d+\/projectplan/);

      // Verify no existing financial entries
      const rows = page.locator('table tbody tr');
      const rowCount = await rows.count();
      expect(rowCount).toBe(0);
    });

    await test.step('Step 4: Add a financial planning entry', async () => {
      await page.getByRole('button', { name: '+ Add' }).click();
      await page.waitForTimeout(1000);

      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();

      // Select Phase
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

      // Select Element
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

      // Select Funding Type
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
      await dialog.getByRole('textbox', { name: 'Amount' }).fill('250000');
    });

    await test.step('Step 5: Submit and verify entry in table', async () => {
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

      // Verify entry appears with correct amount
      await expect(page.locator('table tbody tr:has-text("$250,000")')).toBeVisible();
    });

    await test.step('Step 6: Cleanup - delete entry and close project', async () => {
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

      // Close project
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
