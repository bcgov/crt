/**
 * ============================================================================
 * 08 UI Enhancements - TC-TS-UI-04: Active project — Close tooltip and button
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-UI-04-close-tooltip.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/08-ui-enhancements/tc-ts-ui-04-close-tooltip.spec.ts --headed
 * Headless:               npx playwright test tests/08-ui-enhancements/tc-ts-ui-04-close-tooltip.spec.ts
 * Debug:                  npx playwright test tests/08-ui-enhancements/tc-ts-ui-04-close-tooltip.spec.ts --debug
 * Specific Test:          npx playwright test tests/08-ui-enhancements/tc-ts-ui-04-close-tooltip.spec.ts -g "Close tooltip" --headed
 *
 * OVERVIEW:
 * Verifies that the close/disable icon on an active project in the projects
 * list shows the correct tooltip ("Close/Activate Project") on hover, and
 * clicking it reveals a confirmation popover with a "Close Project" button.
 * The test does NOT actually close the project — it cancels the action.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Tooltip on Hover:
 *    ✅ The close/activate icon button has title "Close/Activate Project"
 *    ✅ The button is visible in the table row for an active project
 *
 * 2. Confirmation Popover:
 *    ✅ Clicking the icon shows a confirmation popover with "Are you sure?"
 *    ✅ The popover contains a "Close Project" button
 *    ✅ The popover contains a "Cancel" button
 *    ✅ Clicking Cancel dismisses the popover without closing the project
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-UI-04 — Active project — Close tooltip and button', () => {
  test.setTimeout(60_000);

  test.beforeEach(async ({ page }) => {
    // Navigate to the Projects list showing active projects
    await page.goto('/projects?isInProgress=true&pageNumber=1&pageSize=25');
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();

    // Verify at least one project row is present
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  test('Close tooltip and button on active project', async ({ page }) => {
    const closeActivateButton = page.getByRole('button', { name: 'Close/Activate Project' }).first();

    await test.step('Step 1: Verify Close/Activate icon is visible on active project row', async () => {
      await expect(closeActivateButton).toBeVisible();
    });

    await test.step('Step 2: Verify tooltip shows "Close/Activate Project" on hover', async () => {
      // The button has a title attribute that serves as the tooltip
      await expect(closeActivateButton).toHaveAttribute('title', 'Close/Activate Project');

      // Hover over the button to trigger any tooltip rendering
      await closeActivateButton.hover();
    });

    await test.step('Step 3: Click the icon and verify confirmation popover appears', async () => {
      await closeActivateButton.click();

      // A confirmation popover appears with "Are you sure?" heading
      const popover = page.getByRole('tooltip', { name: 'Are you sure?' });
      await expect(popover).toBeVisible();
      await expect(popover.getByRole('heading', { name: 'Are you sure?' })).toBeVisible();
    });

    await test.step('Step 4: Verify "Close Project" button label in popover', async () => {
      const closeProjectButton = page.getByRole('button', { name: 'Close Project' });
      await expect(closeProjectButton).toBeVisible();
    });

    await test.step('Step 5: Cancel without closing the project', async () => {
      const cancelButton = page.getByRole('button', { name: 'Cancel' });
      await expect(cancelButton).toBeVisible();
      await cancelButton.click();

      // Verify the popover is dismissed
      await expect(page.getByRole('tooltip', { name: 'Are you sure?' })).not.toBeVisible();

      // Verify the project is still Active (row still present with Active status)
      const firstRowStatus = page.locator('table tbody tr:first-child td:nth-child(6)');
      await expect(firstRowStatus).toHaveText('Active');
    });
  });
});
