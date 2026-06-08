/**
 * ============================================================================
 * 09-BVT-Smoke-Tests - TC-TS-BVT-DET-01: Create new project
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-BVT-DET-01-create-project.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-det-01-create-project.spec.ts --headed
 * Headless:               npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-det-01-create-project.spec.ts
 * Debug:                  npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-det-01-create-project.spec.ts --debug
 * Specific Test:          npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-det-01-create-project.spec.ts -g "Create new project" --headed
 *
 * OVERVIEW:
 * Build Verification Test confirming that a new project can be created end-to-end.
 * Verifies the Add Project dialog workflow, required field submission, and that
 * the project is persisted and accessible from the search results.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Add Project Dialog:
 *    ✅ Clicking "Add Project" opens the project creation dialog
 *    ✅ Required fields (Project Number, Name, Region, RC Number, Capital Index) can be filled
 *    ✅ Submit creates the project successfully
 *
 * 2. Project Persistence:
 *    ✅ Created project appears in search results
 *    ✅ Clicking project opens the Project Details page
 *    ✅ Project details match what was entered
 *
 * 3. Cleanup:
 *    ✅ Project is closed/deactivated after test
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-BVT-DET-01 — BVT: Create new project', () => {
  test.setTimeout(180_000);

  const uniqueSuffix = Date.now().toString();
  const projectNumber = `BVT${uniqueSuffix}`;
  const projectName = `BVT Smoke Test Project ${uniqueSuffix}`;

  test('Create new project end-to-end', async ({ page }) => {
    await test.step('Step 1: Navigate to Project Search page', async () => {
      await page.goto('/projects');
      await page.waitForTimeout(2000);
      await expect(page.getByRole('button', { name: 'Add Project' })).toBeVisible();
    });

    await test.step('Step 2: Open Add Project dialog and fill required fields', async () => {
      await page.getByRole('button', { name: 'Add Project' }).click();
      await page.waitForTimeout(1000);

      const dialog = page.getByRole('dialog').filter({ hasText: 'Add Project' });
      await expect(dialog).toBeVisible();

      // Fill Project Number and Project Name
      await dialog.locator('input[name="projectNumber"]').fill(projectNumber);
      await dialog.locator('input[name="projectName"]').fill(projectName);

      // Select MoTI Region (dropdown 0) - "1-South Coast"
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

      // Select RC Number (dropdown 2) - first available
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

      // Select Capital Index (dropdown 4) - first available
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
    });

    await test.step('Step 3: Submit the project', async () => {
      const dialog = page.getByRole('dialog').filter({ hasText: 'Add Project' });
      const submitBtn = dialog.getByRole('button', { name: 'Submit' });
      await expect(submitBtn).toBeEnabled();
      await submitBtn.click();
      await page.waitForTimeout(3000);

      // After submit, should return to project list
      await expect(page).toHaveURL(/\/projects/);
    });

    await test.step('Step 4: Search for the created project', async () => {
      await page.locator('input[name="searchText"]').fill(projectNumber);
      await page.getByRole('button', { name: 'Search' }).click();
      await page.waitForTimeout(3000);

      // Verify project appears in results
      const row = page.locator(`table tbody tr:has-text("${projectNumber}")`);
      await expect(row).toBeVisible();
    });

    await test.step('Step 5: Open project details and verify', async () => {
      const projectLink = page.locator(`table tbody tr:has-text("${projectNumber}") a`).first();
      await projectLink.click();
      await page.waitForTimeout(3000);

      // Verify on project details page
      await expect(page).toHaveURL(/\/projects\/\d+/);
      await expect(page.getByRole('heading', { name: 'Project Details' })).toBeVisible();

      // Verify project number and name
      await expect(page.locator(`strong:has-text("${projectNumber}")`)).toBeVisible();
      await expect(page.locator(`strong:has-text("${projectName}")`)).toBeVisible();
    });

    await test.step('Step 6: Cleanup - close the project', async () => {
      // Click Edit Project
      await page.getByRole('button', { name: 'Edit Project' }).click();
      await page.waitForTimeout(1000);

      // Check the "Project Closed" checkbox to set end date
      await page.locator('input[name="endDate"]').dispatchEvent('click');
      await page.waitForTimeout(500);

      // Submit
      await page.getByRole('button', { name: 'Submit' }).click();
      await page.waitForTimeout(2000);
    });
  });
});
