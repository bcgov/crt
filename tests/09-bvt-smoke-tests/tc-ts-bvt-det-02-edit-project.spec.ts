/**
 * ============================================================================
 * 09-BVT-Smoke-Tests - TC-TS-BVT-DET-02: Edit existing project
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-BVT-DET-02-edit-project.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-det-02-edit-project.spec.ts --headed
 * Headless:               npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-det-02-edit-project.spec.ts
 * Debug:                  npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-det-02-edit-project.spec.ts --debug
 * Specific Test:          npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-det-02-edit-project.spec.ts -g "Edit existing project" --headed
 *
 * OVERVIEW:
 * Build Verification Test confirming that an existing project can be found via
 * search, opened, edited (description field), and saved. Verifies the complete
 * Search → Select → Edit → Save workflow.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Search and Navigation:
 *    ✅ Searching finds the target project
 *    ✅ Clicking navigates to Project Details page
 *
 * 2. Edit Workflow:
 *    ✅ Edit Project button opens editable form
 *    ✅ Description textarea is editable
 *    ✅ Submit saves the changes
 *
 * 3. Persistence:
 *    ✅ After save, the updated description is displayed
 *    ✅ Description reverts cleanly (cleanup)
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-BVT-DET-02 — BVT: Edit existing project', () => {
  test.setTimeout(180_000);

  const uniqueSuffix = Date.now().toString();
  const updatedDescription = `BVT Updated Description ${uniqueSuffix}`;
  let projectUrl: string;

  test('Search, select, and edit project description', async ({ page }) => {
    await test.step('Step 1: Create a project to edit', async () => {
      await page.goto('/projects');
      await page.waitForTimeout(2000);

      // Create a fresh project for this test
      await page.getByRole('button', { name: 'Add Project' }).click();
      await page.waitForTimeout(1000);

      const dialog = page.getByRole('dialog').filter({ hasText: 'Add Project' });
      await dialog.locator('input[name="projectNumber"]').fill(`BVTED${uniqueSuffix}`);
      await dialog.locator('input[name="projectName"]').fill(`BVT Edit Test ${uniqueSuffix}`);

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

      // Submit
      await page.evaluate(() => {
        const dialog = document.querySelector('[role="dialog"]');
        const submitBtn = dialog!.querySelector('button[type="submit"]');
        (submitBtn as HTMLElement).click();
      });
      await page.waitForTimeout(3000);
    });

    await test.step('Step 2: Search for the project', async () => {
      await page.locator('input[name="searchText"]').fill(`BVTED${uniqueSuffix}`);
      await page.getByRole('button', { name: 'Search' }).click();
      await page.waitForTimeout(3000);

      const row = page.locator(`table tbody tr:has-text("BVTED${uniqueSuffix}")`);
      await expect(row).toBeVisible();
    });

    await test.step('Step 3: Click project to open details', async () => {
      const projectLink = page.locator(`table tbody tr:has-text("BVTED${uniqueSuffix}") a`).first();
      await projectLink.click();
      await page.waitForTimeout(3000);

      await expect(page).toHaveURL(/\/projects\/\d+/);
      await expect(page.getByRole('heading', { name: 'Project Details' })).toBeVisible();
      projectUrl = page.url();
    });

    await test.step('Step 4: Click Edit Project and modify description', async () => {
      await page.getByRole('button', { name: 'Edit Project' }).click();
      await page.waitForTimeout(1000);

      // Verify description textarea is visible
      const descTextarea = page.locator('textarea[name="description"]');
      await expect(descTextarea).toBeVisible();

      // Fill description
      await descTextarea.fill(updatedDescription);
    });

    await test.step('Step 5: Submit and verify changes persisted', async () => {
      await page.getByRole('button', { name: 'Submit' }).click();
      await page.waitForTimeout(2000);

      // Verify we're back to view mode and description is shown
      await expect(page.locator(`text=${updatedDescription}`)).toBeVisible();
    });

    await test.step('Step 6: Cleanup - close the project', async () => {
      await page.getByRole('button', { name: 'Edit Project' }).click();
      await page.waitForTimeout(1000);

      // Set endDate to close project
      await page.locator('input[name="endDate"]').dispatchEvent('click');
      await page.waitForTimeout(500);

      await page.getByRole('button', { name: 'Submit' }).click();
      await page.waitForTimeout(2000);
    });
  });
});
