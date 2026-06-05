/**
 * ============================================================================
 * 05-Financial-Planning - TC-TS-TEND-04: Tender form hover-over help text
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-TEND-04-help-text.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/05-financial-planning/tc-ts-tend-04-help-text.spec.ts --headed
 * Headless:               npx playwright test tests/05-financial-planning/tc-ts-tend-04-help-text.spec.ts
 * Debug:                  npx playwright test tests/05-financial-planning/tc-ts-tend-04-help-text.spec.ts --debug
 * Specific Test:          npx playwright test tests/05-financial-planning/tc-ts-tend-04-help-text.spec.ts -g "help" --headed
 *
 * OVERVIEW:
 * Verifies that hovering over the help icons (question-circle SVGs) near field
 * labels in the Add Tender form displays descriptive popover text. Tests the
 * Tender Number, Ministry Estimate, and Winning Bid help icons specifically.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Help Icon Presence:
 *    ✅ Help icons exist for Tender Number, Planned Date, Actual Date,
 *       Ministry Estimate, Winning Contractor, Winning Bid (6 total)
 *
 * 2. Popover Content:
 *    ✅ Tender Number: "Identifier for the tender"
 *    ✅ Ministry Estimate: "Estimated dollar value of contract"
 *    ✅ Winning Bid: "Dollar value of the winning bid"
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-TEND-04 — Tender form hover-over help text', () => {
  test.setTimeout(60_000);

  test('Help icons display descriptive popover text on hover', async ({ page }) => {
    await test.step('Step 1: Navigate and open Add Tender dialog', async () => {
      await page.goto('/projects/79/projecttender');
      await page.locator('button[title="Add Tender"]').click();
      const dialog = page.locator('[role="dialog"]').filter({ hasText: 'Add Tender Details' });
      await expect(dialog).toBeVisible();
    });

    await test.step('Step 2: Verify 6 help icons are present', async () => {
      const helpIcons = page.locator('[role="dialog"] svg.fa-question-circle');
      await expect(helpIcons).toHaveCount(6);
    });

    await test.step('Step 3: Hover Tender Number help icon and verify popover', async () => {
      await page.evaluate(() => {
        const svg = document.getElementById('tenderNumber__tooltip');
        svg?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        svg?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      });

      const popover = page.locator('.popover-body');
      await popover.waitFor({ state: 'visible', timeout: 5000 });
      await expect(popover).toContainText('Identifier for the tender');

      // Dismiss popover
      await page.evaluate(() => {
        document.querySelectorAll('.popover').forEach(p => p.remove());
      });
      await page.waitForTimeout(300);
    });

    await test.step('Step 4: Hover Ministry Estimate help icon and verify popover', async () => {
      await page.evaluate(() => {
        const svg = document.getElementById('tenderValue__tooltip');
        svg?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        svg?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      });

      const popover = page.locator('.popover-body');
      await popover.waitFor({ state: 'visible', timeout: 5000 });
      await expect(popover).toContainText('Estimated dollar value of contract');

      await page.evaluate(() => {
        document.querySelectorAll('.popover').forEach(p => p.remove());
      });
      await page.waitForTimeout(300);
    });

    await test.step('Step 5: Hover Winning Bid help icon and verify popover', async () => {
      await page.evaluate(() => {
        const svg = document.getElementById('bidValue__tooltip');
        svg?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        svg?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      });

      const popover = page.locator('.popover-body');
      await popover.waitFor({ state: 'visible', timeout: 5000 });
      await expect(popover).toContainText('Dollar value of the winning bid');
    });

    await test.step('Cleanup: Close dialog', async () => {
      await page.goto('/projects/79/projecttender');
    });
  });
});
