/**
 * ============================================================================
 * 04-Project-Search-Details - TC-TS-PROJ-03: Keyword partial search across project fields
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-PROJ-03-keyword-partial-search.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/04-project-search-details/tc-ts-proj-03-keyword-partial-search.spec.ts --headed
 * Headless:               npx playwright test tests/04-project-search-details/tc-ts-proj-03-keyword-partial-search.spec.ts
 * Debug:                  npx playwright test tests/04-project-search-details/tc-ts-proj-03-keyword-partial-search.spec.ts --debug
 * Specific Test:          npx playwright test tests/04-project-search-details/tc-ts-proj-03-keyword-partial-search.spec.ts -g "Keyword partial search" --headed
 *
 * OVERVIEW:
 * Verifies that the keyword search on the Project Search page performs partial
 * matching across Project Number, Project Name, Project Description, and Project
 * Scope fields. Tests multiple search terms and validates the Reset button clears
 * results.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Partial Name Match:
 *    ✅ Searching "test project" returns project "Another test project"
 *
 * 2. Partial Number Match:
 *    ✅ Searching "999" returns project with number "999"
 *
 * 3. Partial Description Match:
 *    ✅ Searching "Testing" returns project with description containing "Testing testing 123"
 *
 * 4. Reset Button:
 *    ✅ Reset clears the search field and restores default results
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-PROJ-03 — Keyword partial search across project fields', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/projects');
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  test('Keyword partial search across project fields', async ({ page }) => {
    const searchBox = page.getByPlaceholder('Number/Name/Description/Scope');

    await test.step('Step 1: Search by partial project name "test project"', async () => {
      await searchBox.fill('test project');
      await page.getByRole('button', { name: 'Search' }).click();

      // Wait for results to load
      await expect(page.locator('table tbody tr').first()).toBeVisible();

      // Verify a row containing "Another test project" appears
      await expect(page.locator('table tbody tr', { hasText: 'Another test project' })).toBeVisible();
    });

    await test.step('Step 2: Reset and search by partial project number "999"', async () => {
      // Click Reset to clear
      await page.getByRole('button', { name: 'Reset' }).click();
      await expect(searchBox).toHaveValue('');
      await expect(page.locator('table tbody tr').first()).toBeVisible();

      // Search by partial number
      await searchBox.fill('999');
      await page.getByRole('button', { name: 'Search' }).click();

      // Wait for results to load
      await expect(page.locator('table tbody tr').first()).toBeVisible();

      // Verify a row containing "999" appears
      await expect(page.locator('table tbody tr', { hasText: '999' })).toBeVisible();
    });

    await test.step('Step 3: Reset and search by partial description "Testing"', async () => {
      // Click Reset to clear
      await page.getByRole('button', { name: 'Reset' }).click();
      await expect(searchBox).toHaveValue('');
      await expect(page.locator('table tbody tr').first()).toBeVisible();

      // Search by partial description
      await searchBox.fill('Testing');
      await page.getByRole('button', { name: 'Search' }).click();

      // Wait for results to load
      await expect(page.locator('table tbody tr').first()).toBeVisible();

      // Verify the project with description "Testing testing 123" appears
      // (project name "Another test project" has this description)
      await expect(page.locator('table tbody tr', { hasText: 'Another test project' })).toBeVisible();
    });

    await test.step('Step 4: Reset restores default results', async () => {
      // Click Reset
      await page.getByRole('button', { name: 'Reset' }).click();

      // Verify the search field is cleared
      await expect(searchBox).toHaveValue('');

      // Verify multiple results are shown (default unfiltered state)
      await expect(page.locator('table tbody tr').first()).toBeVisible();
      const rowCount = await page.locator('table tbody tr').count();
      expect(rowCount).toBeGreaterThan(1);
    });
  });
});
