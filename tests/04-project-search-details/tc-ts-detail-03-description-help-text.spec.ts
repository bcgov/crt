/**
 * ============================================================================
 * 04-Project-Search-Details - TC-TS-DETAIL-03: Project Description field with help text
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-DETAIL-03-description-help-text.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/04-project-search-details/tc-ts-detail-03-description-help-text.spec.ts --headed
 * Headless:               npx playwright test tests/04-project-search-details/tc-ts-detail-03-description-help-text.spec.ts
 * Debug:                  npx playwright test tests/04-project-search-details/tc-ts-detail-03-description-help-text.spec.ts --debug
 * Specific Test:          npx playwright test tests/04-project-search-details/tc-ts-detail-03-description-help-text.spec.ts -g "Project Description" --headed
 *
 * OVERVIEW:
 * Verifies that the Project Description field accepts free-text input and that
 * hovering over the help icon (FontAwesome question-circle) displays a popover
 * with descriptive help text about the field's purpose.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Text Input:
 *    ✅ Project Description textarea accepts text input
 *    ✅ Entered text is retained in the field
 *
 * 2. Help Text Tooltip:
 *    ✅ A help icon (question-circle SVG) is present near the label
 *    ✅ Hovering over the icon shows a popover with help text
 *    ✅ Popover text describes the purpose of the Description field
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'https://dev-crt.th.gov.bc.ca';

test.describe('TC-TS-DETAIL-03: Project Description field with help text', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/projects`);
    await page.waitForURL('**/projects**');
    await page.locator('button[title="Add a New Project"]').waitFor({ state: 'visible' });
    await page.locator('button[title="Add a New Project"]').click();
    await expect(page.locator('[role="dialog"] .modal-header')).toContainText('Add Project');
  });

  test('Project Description accepts text and shows help tooltip', async ({ page }) => {
    await test.step('Step 1: Verify Project Description field accepts text input', async () => {
      const descriptionField = page.locator('textarea#description');
      await descriptionField.fill('Test description for validation');
      await expect(descriptionField).toHaveValue('Test description for validation');
    });

    await test.step('Step 2: Verify help icon is present near the Description label', async () => {
      const helpIcon = page.locator('#description__tooltip');
      await expect(helpIcon).toBeVisible();
    });

    await test.step('Step 3: Hover over help icon and verify tooltip appears', async () => {
      const helpIcon = page.locator('#description__tooltip');
      await helpIcon.hover();

      // Wait for the popover to appear
      const popover = page.locator('.popover.show .popover-body');
      await expect(popover).toBeVisible();
      await expect(popover).toHaveText('Non-technical description of the project; meant for public consumption');
    });
  });
});
