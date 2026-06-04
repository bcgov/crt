/**
 * ============================================================================
 * 08 UI Enhancements - TC-TS-UI-03: Project status label changes — Active and Closed
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-UI-03-status-labels.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/08-ui-enhancements/tc-ts-ui-03-status-labels.spec.ts --headed
 * Headless:               npx playwright test tests/08-ui-enhancements/tc-ts-ui-03-status-labels.spec.ts
 * Debug:                  npx playwright test tests/08-ui-enhancements/tc-ts-ui-03-status-labels.spec.ts --debug
 * Specific Test:          npx playwright test tests/08-ui-enhancements/tc-ts-ui-03-status-labels.spec.ts -g "status label" --headed
 *
 * OVERVIEW:
 * Verifies that project status labels use "Active" (not "In-progress") and
 * "Closed" (not "Completed") across the application. Checks the status filter
 * dropdown options, the status column in the projects table for both active and
 * closed projects, and confirms old terminology is not present.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Status Filter Dropdown:
 *    ✅ Filter dropdown contains "Active" option
 *    ✅ Filter dropdown contains "Closed" option
 *    ✅ "In-progress" does NOT appear in filter options
 *    ✅ "Completed" does NOT appear in filter options
 *
 * 2. Active Projects in Table:
 *    ✅ Status column shows "Active" for active projects
 *    ✅ "In-progress" does NOT appear in any status cell
 *
 * 3. Closed Projects in Table:
 *    ✅ Status column shows "Closed" for closed projects
 *    ✅ "Completed" does NOT appear in any status cell
 *
 * 4. Project Details Page:
 *    ✅ Active project shows "Project Closed: No"
 *    ✅ Closed project shows "Project Closed: Yes"
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-UI-03 — Project status label changes — Active and Closed', () => {
  test.setTimeout(120_000);

  test('Status filter shows Active and Closed labels', async ({ page }) => {
    await test.step('Step 1: Navigate to Project Search page', async () => {
      await page.goto('/projects?isInProgress=true&pageNumber=1&pageSize=25');
      await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
    });

    await test.step('Step 2: Verify status filter button text contains Active/Closed', async () => {
      // The status filter button shows currently selected values (e.g., "Active, Closed")
      const statusFilterButton = page.locator('.dropdown').filter({ has: page.locator('.dropdown-menu').filter({ hasText: 'Active' }) }).locator('button').first();
      // Alternative: find the button that has "Active" in its text near the filter area
      const filterButton = page.getByRole('button', { name: /Active/ });
      await expect(filterButton).toBeVisible();
    });

    await test.step('Step 3: Open status filter dropdown and verify options', async () => {
      // Click the status filter button
      const filterButton = page.getByRole('button', { name: /Active/ });
      await filterButton.click();

      // Verify the dropdown menu is open
      const dropdownMenu = page.locator('.dropdown-menu.show');
      await expect(dropdownMenu).toBeVisible();

      // Verify "Active" checkbox is present
      await expect(page.getByRole('checkbox', { name: 'Active' })).toBeVisible();

      // Verify "Closed" checkbox is present
      await expect(page.getByRole('checkbox', { name: 'Closed' })).toBeVisible();

      // Verify old terminology does NOT appear
      await expect(dropdownMenu.getByText('In-progress')).not.toBeVisible();
      await expect(dropdownMenu.getByText('Completed')).not.toBeVisible();

      // Close the dropdown
      await page.keyboard.press('Escape');
    });

    await test.step('Step 4: Verify Active projects show "Active" status in table', async () => {
      // The default view already shows active projects
      const firstStatusCell = page.locator('table tbody tr').first().locator('td').nth(5);
      await expect(firstStatusCell).toHaveText('Active');

      // Verify old term "In-progress" is not in any status cell
      const allStatusCells = page.locator('table tbody tr td:nth-child(6)');
      const count = await allStatusCells.count();
      for (let i = 0; i < count; i++) {
        await expect(allStatusCells.nth(i)).not.toHaveText('In-progress');
      }
    });

    await test.step('Step 5: Filter to show only Closed projects', async () => {
      // Open status filter
      const filterButton = page.getByRole('button', { name: /Active/ });
      await filterButton.click();

      // Uncheck Active
      await page.getByRole('checkbox', { name: 'Active' }).uncheck();

      // Ensure Closed is checked
      const closedCheckbox = page.getByRole('checkbox', { name: 'Closed' });
      if (!(await closedCheckbox.isChecked())) {
        await closedCheckbox.check();
      }

      // Close dropdown and search
      await page.keyboard.press('Escape');
      await page.getByRole('button', { name: 'Search' }).click();

      // Wait for results to load
      await expect(page.locator('table tbody tr').first()).toBeVisible();
    });

    await test.step('Step 6: Verify Closed projects show "Closed" status in table', async () => {
      const allStatusCells = page.locator('table tbody tr td:nth-child(6)');
      const count = await allStatusCells.count();
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        await expect(allStatusCells.nth(i)).toHaveText('Closed');
      }

      // Verify old term "Completed" is not in any status cell
      for (let i = 0; i < count; i++) {
        await expect(allStatusCells.nth(i)).not.toHaveText('Completed');
      }
    });
  });

  test('Project Details shows correct status for active project', async ({ page }) => {
    await test.step('Step 1: Navigate to projects list and open an active project', async () => {
      await page.goto('/projects?isInProgress=true&pageNumber=1&pageSize=25');
      await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();

      // Click the first project link
      const firstProjectLink = page.locator('table tbody tr:first-child td:nth-child(2) a');
      await expect(firstProjectLink).toBeVisible();
      await firstProjectLink.click();

      // Verify we're on Project Details
      await expect(page.getByRole('heading', { name: 'Project Details' })).toBeVisible();
    });

    await test.step('Step 2: Verify Project Closed field shows "No" for active project', async () => {
      // Find the "Project Closed" label and its corresponding value
      const projectClosedLabel = page.getByText('Project Closed', { exact: false });
      await expect(projectClosedLabel).toBeVisible();

      // The value is in a sibling element next to the label container
      const projectClosedValue = projectClosedLabel.locator('..').locator('..').locator('> div').last();
      await expect(projectClosedValue).toHaveText(/"?No"?/);
    });
  });

  test('Project Details shows correct status for closed project', async ({ page }) => {
    await test.step('Step 1: Navigate to projects list and filter to closed projects', async () => {
      await page.goto('/projects?isInProgress=true&pageNumber=1&pageSize=25');
      await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();

      // Open status filter
      const filterButton = page.getByRole('button', { name: /Active/ });
      await filterButton.click();

      // Uncheck Active
      await page.getByRole('checkbox', { name: 'Active' }).uncheck();

      // Ensure Closed is checked
      const closedCheckbox = page.getByRole('checkbox', { name: 'Closed' });
      if (!(await closedCheckbox.isChecked())) {
        await closedCheckbox.check();
      }

      // Close dropdown and search
      await page.keyboard.press('Escape');
      await page.getByRole('button', { name: 'Search' }).click();

      // Wait for closed projects to appear
      await expect(page.locator('table tbody tr').first()).toBeVisible();
    });

    await test.step('Step 2: Open a closed project', async () => {
      const firstProjectLink = page.locator('table tbody tr:first-child td:nth-child(2) a');
      await expect(firstProjectLink).toBeVisible();
      await firstProjectLink.click();

      // Verify we're on Project Details
      await expect(page.getByRole('heading', { name: 'Project Details' })).toBeVisible();
    });

    await test.step('Step 3: Verify Project Closed field shows "Yes" for closed project', async () => {
      const projectClosedLabel = page.getByText('Project Closed', { exact: false });
      await expect(projectClosedLabel).toBeVisible();

      // The value is in a sibling element next to the label container
      const projectClosedValue = projectClosedLabel.locator('..').locator('..').locator('> div').last();
      await expect(projectClosedValue).toHaveText(/"?Yes"?/);
    });
  });
});
