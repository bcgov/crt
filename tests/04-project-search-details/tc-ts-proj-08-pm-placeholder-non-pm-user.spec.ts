/**
 * ============================================================================
 * 04-Project-Search-Details - TC-TS-PROJ-08: PM field shows placeholder for non-PM users
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-PROJ-08-pm-placeholder-non-pm-user.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/04-project-search-details/tc-ts-proj-08-pm-placeholder-non-pm-user.spec.ts --headed
 * Headless:               npx playwright test tests/04-project-search-details/tc-ts-proj-08-pm-placeholder-non-pm-user.spec.ts
 * Debug:                  npx playwright test tests/04-project-search-details/tc-ts-proj-08-pm-placeholder-non-pm-user.spec.ts --debug
 * Specific Test:          npx playwright test tests/04-project-search-details/tc-ts-proj-08-pm-placeholder-non-pm-user.spec.ts -g "PM field shows placeholder" --headed
 *
 * OVERVIEW:
 * Verifies that when a user without the PM flag navigates to the Projects page,
 * the Project Manager dropdown button displays the placeholder text "Project Manager"
 * rather than defaulting to any specific PM name.
 *
 * WHAT THE TEST VALIDATES:
 * 1. PM Placeholder Text:
 *    ✅ The Project Manager button text is exactly "Project Manager"
 *    ✅ No PM name is pre-selected on page load
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-PROJ-08 — PM field shows placeholder for non-PM users', () => {
  test.setTimeout(60_000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/projects');
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
  });

  test('PM field shows placeholder for non-PM users', async ({ page }) => {
    await test.step('Step 1: Verify PM button displays placeholder text "Project Manager"', async () => {
      // The PM button should show "Project Manager" placeholder, not a person's name
      const pmButton = page.getByRole('button', { name: 'Project Manager' });
      await expect(pmButton).toBeVisible();
      await expect(pmButton).toHaveText('Project Manager');
    });
  });
});
