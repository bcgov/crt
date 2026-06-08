/**
 * ============================================================================
 * 09-BVT-Smoke-Tests - TC-TS-BVT-CODE-01: Maintain dropdown code values and elements
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-BVT-CODE-01-code-maintenance.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-code-01-code-maintenance.spec.ts --headed
 * Headless:               npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-code-01-code-maintenance.spec.ts
 * Debug:                  npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-code-01-code-maintenance.spec.ts --debug
 * Specific Test:          npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-code-01-code-maintenance.spec.ts -g "Code maintenance" --headed
 *
 * OVERVIEW:
 * Build Verification Test confirming that administrators can manage code table
 * values and elements (add, edit, delete) after deployment. Covers the full
 * CRUD lifecycle for both Code Tables (Accomplishment) and Elements management.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Code Table Management:
 *    ✅ Add a new code value (Accomplishment)
 *    ✅ Edit the code value name
 *    ✅ Delete the code value
 *
 * 2. Elements Management:
 *    ✅ Add a new element with required fields
 *    ✅ Delete the element
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-BVT-CODE-01 — BVT: Maintain dropdown code values and elements', () => {
  test.setTimeout(180_000);

  const uniqueSuffix = Date.now().toString();
  const codeName = `BVT Test Value ${uniqueSuffix}`;
  const codeNameEdited = `BVT Test Edited ${uniqueSuffix}`;
  const elementCode = `BV${uniqueSuffix.slice(-4)}`;
  const elementDesc = `BVT Element ${uniqueSuffix}`;

  test('Code table and element CRUD lifecycle', async ({ page }) => {
    // === CODE TABLES ===

    await test.step('Step 1: Navigate to Code Table Management', async () => {
      await page.goto('/admin/codetables');
      await page.waitForTimeout(2000);
      await expect(page.locator('button.dropdown-toggle:has-text("Accomplishment")')).toBeVisible();
    });

    await test.step('Step 2: Add a new Accomplishment code value', async () => {
      await page.getByRole('button', { name: 'Add New Accomplishment' }).click();
      await page.waitForTimeout(1000);

      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();

      // Fill Code Name (required) and Order Number (required)
      await dialog.locator('input[name="codeName"]').fill(codeName);
      await dialog.locator('input[name="displayOrder"]').fill('999');

      // Submit
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await page.waitForTimeout(2000);

      // Verify dialog closed
      await expect(dialog).not.toBeVisible();
    });

    await test.step('Step 3: Verify the new code value appears in the table', async () => {
      // Search for the value - may need to go to last page or search
      // Let's use the search if available or just check the table
      await page.waitForTimeout(1000);

      // The newly added item should be visible (sorted by display order or added to end)
      // Navigate to last page if needed
      const lastPageBtn = page.locator('button:has-text("»Last")');
      if (await lastPageBtn.isEnabled()) {
        await lastPageBtn.click();
        await page.waitForTimeout(2000);
      }

      await expect(page.locator(`table tbody tr:has-text("${codeName}")`)).toBeVisible();
    });

    await test.step('Step 4: Edit the code value name', async () => {
      // Find the row and click Edit Record
      const row = page.locator(`table tbody tr:has-text("${codeName}")`);
      await row.locator('button[title="Edit Record"]').evaluate(el => el.click());
      await page.waitForTimeout(1000);

      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();

      // Clear and update Code Name
      await dialog.locator('input[name="codeName"]').fill(codeNameEdited);

      // Submit
      await dialog.getByRole('button', { name: 'Submit' }).click();
      await page.waitForTimeout(2000);

      await expect(dialog).not.toBeVisible();
    });

    await test.step('Step 5: Verify edited name in table', async () => {
      await expect(page.locator(`table tbody tr:has-text("${codeNameEdited}")`)).toBeVisible();
    });

    await test.step('Step 6: Delete the code value', async () => {
      const row = page.locator(`table tbody tr:has-text("${codeNameEdited}")`);
      await row.locator('button[title="Delete Record"]').evaluate(el => el.click());
      await page.waitForTimeout(500);

      // Confirm deletion in the popover
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

      // Verify the row is gone
      await expect(page.locator(`table tbody tr:has-text("${codeNameEdited}")`)).not.toBeVisible();
    });

    // === ELEMENTS ===

    await test.step('Step 7: Navigate to Elements Management', async () => {
      await page.goto('/admin/elements');
      await page.waitForTimeout(2000);
      await expect(page.getByRole('button', { name: 'Add New Element' })).toBeVisible();
    });

    await test.step('Step 8: Add a new Element', async () => {
      await page.getByRole('button', { name: 'Add New Element' }).click();
      await page.waitForTimeout(1000);

      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();

      // Fill required fields
      await dialog.locator('input[name="code"]').fill(elementCode);
      await dialog.locator('input[name="description"]').fill(elementDesc);
      await dialog.locator('input[name="displayOrder"]').fill('999');

      // Select Program Category dropdown (first dropdown in dialog)
      await page.evaluate(() => {
        const dialog = document.querySelector('[role="dialog"]');
        const dds = dialog!.querySelectorAll('button.dropdown-toggle');
        (dds[0] as HTMLElement).click();
      });
      await page.waitForTimeout(300);
      await page.evaluate(() => {
        const items = document.querySelectorAll('.dropdown-menu.show button.dropdown-item');
        if (items.length > 0) (items[0] as HTMLElement).click();
      });
      await page.waitForTimeout(300);

      // Select Program dropdown (second dropdown)
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

      // Select Service Line dropdown (third dropdown)
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

      // Submit
      await page.evaluate(() => {
        const dialog = document.querySelector('[role="dialog"]');
        const submitBtn = dialog!.querySelector('button[type="submit"]');
        (submitBtn as HTMLElement).click();
      });
      await page.waitForTimeout(2000);
    });

    await test.step('Step 9: Verify element appears in table', async () => {
      // Navigate to last page if paginated
      const lastPageBtn = page.locator('button:has-text("»Last")');
      if (await lastPageBtn.isVisible() && await lastPageBtn.isEnabled()) {
        await lastPageBtn.click();
        await page.waitForTimeout(2000);
      }

      await expect(page.locator(`table tbody tr:has-text("${elementDesc}")`)).toBeVisible();
    });

    await test.step('Step 10: Delete the element (cleanup)', async () => {
      const row = page.locator(`table tbody tr:has-text("${elementDesc}")`);
      await row.locator('button[title="Delete Record"]').evaluate(el => el.click());
      await page.waitForTimeout(500);

      // Confirm deletion in the popover
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

      // Verify removed
      await expect(page.locator(`table tbody tr:has-text("${elementDesc}")`)).not.toBeVisible();
    });
  });
});
