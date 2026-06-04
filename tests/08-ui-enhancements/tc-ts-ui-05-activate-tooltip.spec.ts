/**
 * ============================================================================
 * 08 UI Enhancements - TC-TS-UI-05: Closed project — Activate tooltip and button
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-UI-05-activate-tooltip.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/08-ui-enhancements/tc-ts-ui-05-activate-tooltip.spec.ts --headed
 * Headless:               npx playwright test tests/08-ui-enhancements/tc-ts-ui-05-activate-tooltip.spec.ts
 * Debug:                  npx playwright test tests/08-ui-enhancements/tc-ts-ui-05-activate-tooltip.spec.ts --debug
 * Specific Test:          npx playwright test tests/08-ui-enhancements/tc-ts-ui-05-activate-tooltip.spec.ts -g "Activate tooltip" --headed
 *
 * OVERVIEW:
 * Verifies that the greyed-out close/activate icon on a closed project in the
 * projects list shows the correct tooltip ("Close/Activate Project") on hover,
 * and clicking it reveals a confirmation popover with an "Activate Project"
 * button. The test does NOT actually activate the project — it cancels the action.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Tooltip on Hover:
 *    ✅ The close/activate icon button has title "Close/Activate Project"
 *    ✅ The button is visible in the table row for a closed project
 *
 * 2. Confirmation Popover:
 *    ✅ Clicking the icon shows a confirmation popover with "Are you sure?"
 *    ✅ The popover contains an "Activate Project" button
 *    ✅ The popover contains a "Cancel" button
 *    ✅ Clicking Cancel dismisses the popover without activating the project
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-UI-05 — Closed project — Activate tooltip and button', () => {
  test.setTimeout(60_000);

  test.beforeEach(async ({ page }) => {
    // Navigate to the Projects list filtered to show only Closed projects
    await page.goto('/projects?isInProgress=false&pageNumber=1&pageSize=25');
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();

    // Verify at least one closed project row is present
    await expect(page.locator('table tbody tr').first()).toBeVisible();
    await expect(page.locator('table tbody tr:first-child td:nth-child(6)')).toHaveText('Closed');
  });

  test('Activate tooltip and button on closed project', async ({ page }) => {
    const closeActivateButton = page.getByRole('button', { name: 'Close/Activate Project' }).first();

    await test.step('Step 1: Verify Close/Activate icon is visible on closed project row', async () => {
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

    await test.step('Step 4: Verify "Activate Project" button label in popover', async () => {
      const activateProjectButton = page.getByRole('button', { name: 'Activate Project', exact: true });
      await expect(activateProjectButton).toBeVisible();
    });

    await test.step('Step 5: Cancel without activating the project', async () => {
      const cancelButton = page.getByRole('button', { name: 'Cancel' });
      await expect(cancelButton).toBeVisible();
      await cancelButton.click();

      // Verify the popover is dismissed
      await expect(page.getByRole('tooltip', { name: 'Are you sure?' })).not.toBeVisible();

      // Verify the project is still Closed (row still present with Closed status)
      const firstRowStatus = page.locator('table tbody tr:first-child td:nth-child(6)');
      await expect(firstRowStatus).toHaveText('Closed');
    });
  });
});
