/**
 * ============================================================================
 * 09-BVT-Smoke-Tests - TC-TS-BVT-FIN-03: Edit financial details
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-BVT-FIN-03-financial-edit.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-fin-03-financial-edit.spec.ts --headed
 * Headless:               npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-fin-03-financial-edit.spec.ts
 * Debug:                  npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-fin-03-financial-edit.spec.ts --debug
 * Specific Test:          npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-fin-03-financial-edit.spec.ts -g "Edit financial details" --headed
 *
 * OVERVIEW:
 * Build Verification Test confirming that existing financial planning entries
 * can be edited. Creates a project with a financial entry, then edits the
 * amount and verifies the change is persisted.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Edit Dialog:
 *    ✅ Clicking "Edit Record" opens dialog with pre-filled values
 *    ✅ Amount field shows current value
 *
 * 2. Edit Workflow:
 *    ✅ Amount can be changed to a new value
 *    ✅ Submit saves the changes
 *    ✅ Table row updates to show new amount ($750,000)
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-BVT-FIN-03 — BVT: Edit financial details', () => {
  test.setTimeout(180_000);

  const uniqueSuffix = Date.now().toString();
  const projectNumber = `BVTF3${uniqueSuffix}`;
  const projectName = `BVT Fin Edit ${uniqueSuffix}`;

  test('Edit financial planning entry amount', async ({ page }) => {
    await test.step('Step 1: Create project with financial entry', async () => {
      // Create project
      await page.goto('/projects');
      await page.waitForTimeout(2000);

      await page.getByRole('button', { name: 'Add Project' }).click();
      await page.waitForTimeout(1000);

      const projDialog = page.getByRole('dialog').filter({ hasText: 'Add Project' });
      await projDialog.locator('input[name="projectNumber"]').fill(projectNumber);
      await projDialog.locator('input[name="projectName"]').fill(projectName);

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

    await test.step('Step 2: Navigate to project Financial Plan', async () => {
      await page.locator('input[name="searchText"]').fill(projectNumber);
      await page.getByRole('button', { name: 'Search' }).click();
      await page.waitForTimeout(3000);

      const projectLink = page.locator(`table tbody tr:has-text("${projectNumber}") a`).first();
      await projectLink.click();
      await page.waitForTimeout(3000);

      await page.locator('a:has-text("Financial Plan")').click();
      await page.waitForTimeout(2000);
    });

    await test.step('Step 3: Add initial financial entry ($500,000)', async () => {
      await page.getByRole('button', { name: '+ Add' }).click();
      await page.waitForTimeout(1000);

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
      const dialog = page.getByRole('dialog');
      await dialog.getByRole('textbox', { name: 'Amount' }).fill('500000');

      // Submit
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

      // Verify entry
      await expect(page.locator('table tbody tr:has-text("$500,000")')).toBeVisible();
    });

    await test.step('Step 4: Edit the financial entry - change amount to $750,000', async () => {
      // Click Edit Record
      await page.locator('button[title="Edit Record"]').first().evaluate(el => el.click());
      await page.waitForTimeout(1500);

      const dialog = page.getByRole('dialog').filter({ hasText: 'Edit Financial' });
      await expect(dialog).toBeVisible();

      // Verify current amount is pre-filled
      const amountField = dialog.getByRole('textbox', { name: 'Amount' });
      const currentVal = await amountField.inputValue();
      expect(currentVal).toContain('500,000');

      // Clear and set new amount using triple-click + keyboard.type
      // (.fill() doesn't trigger React's currency input onChange properly)
      await amountField.click({ clickCount: 3 });
      await page.waitForTimeout(200);
      await page.keyboard.type('750000');
      await page.waitForTimeout(300);
    });

    await test.step('Step 5: Submit edit and verify updated amount', async () => {
      // Submit using evaluate
      await page.evaluate(() => {
        const dialogs = document.querySelectorAll('[role="dialog"]');
        for (const d of dialogs) {
          if (d.textContent?.includes('Edit Financial Planning Targets')) {
            const submitBtn = d.querySelector('button[type="submit"]');
            (submitBtn as HTMLElement).click();
            return;
          }
        }
      });
      await page.waitForTimeout(3000);

      // Verify the amount is updated
      await expect(page.locator('table tbody tr:has-text("$750,000")')).toBeVisible();
      // Verify old amount is gone
      await expect(page.locator('table tbody tr:has-text("$500,000")')).not.toBeVisible();
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
