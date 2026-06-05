/**
 * ============================================================================
 * 04-Project-Search-Details - TC-TS-PROJ-04: Keyword search help text on hover
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-PROJ-04-keyword-help-text.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/04-project-search-details/tc-ts-proj-04-keyword-help-text.spec.ts --headed
 * Headless:               npx playwright test tests/04-project-search-details/tc-ts-proj-04-keyword-help-text.spec.ts
 * Debug:                  npx playwright test tests/04-project-search-details/tc-ts-proj-04-keyword-help-text.spec.ts --debug
 * Specific Test:          npx playwright test tests/04-project-search-details/tc-ts-proj-04-keyword-help-text.spec.ts -g "Keyword search help text" --headed
 *
 * OVERVIEW:
 * Verifies that the keyword search textbox on the Project Search page has
 * help text indicating it searches across Project Number, Project Name,
 * Project Description, and Project Scope. The help text is implemented as a
 * title attribute on the input field.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Help Text Present:
 *    ✅ The search textbox has a title attribute with the expected help text
 *    ✅ The title describes searching across Number, Name, Description, and Scope
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-PROJ-04 — Keyword search help text on hover', () => {
  test.setTimeout(60_000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/projects');
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
  });

  test('Keyword search help text on hover', async ({ page }) => {
    await test.step('Step 1: Verify keyword search field has help text via title attribute', async () => {
      const searchBox = page.getByPlaceholder('Number/Name/Description/Scope');
      await expect(searchBox).toBeVisible();

      // The help text is provided via the title attribute on the input element
      const titleText = await searchBox.getAttribute('title');
      expect(titleText).toBeTruthy();
      expect(titleText).toContain('Project Number');
      expect(titleText).toContain('Name');
      expect(titleText).toContain('Description');
      expect(titleText).toContain('Scope');
    });
  });
});
