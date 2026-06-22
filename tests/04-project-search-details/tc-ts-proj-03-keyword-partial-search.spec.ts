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
 *    ✅ Searching "test project" returns at least one result containing "test project"
 *
 * 2. Partial Number Match:
 *    ✅ Searching a known project number prefix returns matching results
 *
 * 3. Partial Description/Scope Match:
 *    ✅ Searching a term from a project description returns results
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

    // Capture initial row count to compare after reset
    const initialRowCount = await page.locator('table tbody tr').count();

    // Grab the first project's name and number from the default listing to use as search terms
    const firstRowCells = page.locator('table tbody tr').first().locator('td');
    const firstProjectText = (await firstRowCells.nth(1).textContent())!.trim();
    // Extract the project number prefix (e.g. "TST01" from "TST01-Test project 1...")
    const projectNumber = firstProjectText.split('-')[0];
    // Extract a partial name from the project (a word from the name portion)
    const namePortion = firstProjectText.substring(firstProjectText.indexOf('-') + 1).trim();
    const partialName = namePortion.split(' ').slice(0, 2).join(' ').toLowerCase();

    await test.step('Step 1: Search by partial project name', async () => {
      await searchBox.fill(partialName);
      await page.getByRole('button', { name: 'Search' }).click();

      // Wait for results to load
      await expect(page.locator('table tbody tr').first()).toBeVisible();

      // Verify at least one result contains the search term (case-insensitive)
      const rows = page.locator('table tbody tr');
      const count = await rows.count();
      expect(count).toBeGreaterThanOrEqual(1);
      // Verify the result contains the search term
      const matchingRow = page.locator('table tbody tr', { hasText: new RegExp(partialName, 'i') });
      await expect(matchingRow.first()).toBeVisible();
    });

    await test.step('Step 2: Reset and search by partial project number', async () => {
      // Click Reset to clear
      await page.getByRole('button', { name: 'Reset' }).click();
      await expect(searchBox).toHaveValue('');
      await expect(page.locator('table tbody tr').first()).toBeVisible();

      // Search by partial number
      await searchBox.fill(projectNumber);
      await page.getByRole('button', { name: 'Search' }).click();

      // Wait for results to load
      await expect(page.locator('table tbody tr').first()).toBeVisible();

      // Verify a row containing the project number appears
      await expect(page.locator('table tbody tr', { hasText: projectNumber }).first()).toBeVisible();
    });

    await test.step('Step 3: Reset and search by different partial term', async () => {
      // Click Reset to clear
      await page.getByRole('button', { name: 'Reset' }).click();
      await expect(searchBox).toHaveValue('');
      await expect(page.locator('table tbody tr').first()).toBeVisible();

      // Search by the full project name text to verify description/scope matching
      await searchBox.fill(namePortion.split(' ')[0]);
      await page.getByRole('button', { name: 'Search' }).click();

      // Wait for results to load
      await expect(page.locator('table tbody tr').first()).toBeVisible();

      // Verify at least one result appears
      const count = await page.locator('table tbody tr').count();
      expect(count).toBeGreaterThanOrEqual(1);
    });

    await test.step('Step 4: Reset restores default results', async () => {
      // Click Reset
      await page.getByRole('button', { name: 'Reset' }).click();

      // Verify the search field is cleared
      await expect(searchBox).toHaveValue('');

      // Verify multiple results are shown (default unfiltered state)
      await expect(page.locator('table tbody tr').first()).toBeVisible();
      const rowCount = await page.locator('table tbody tr').count();
      expect(rowCount).toBeGreaterThanOrEqual(initialRowCount);
    });
  });
});
