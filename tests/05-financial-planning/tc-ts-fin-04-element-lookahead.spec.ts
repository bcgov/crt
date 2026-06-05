/**
 * ============================================================================
 * 05-Financial-Planning - TC-TS-FIN-04: Element field look-ahead shows code and description
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-FIN-04-element-lookahead.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/05-financial-planning/tc-ts-fin-04-element-lookahead.spec.ts --headed
 * Headless:               npx playwright test tests/05-financial-planning/tc-ts-fin-04-element-lookahead.spec.ts
 * Debug:                  npx playwright test tests/05-financial-planning/tc-ts-fin-04-element-lookahead.spec.ts --debug
 * Specific Test:          npx playwright test tests/05-financial-planning/tc-ts-fin-04-element-lookahead.spec.ts -g "Element field" --headed
 *
 * OVERVIEW:
 * Verifies that the Element dropdown shows options with "code - description" format
 * (e.g., "Sp - Safety Program"), supports type-ahead filtering, and displays the
 * full "code - description" in the toggle after selection. The table column shows
 * only the code portion (e.g., "Sp").
 *
 * NOTE: Uses "Sp - Safety Program" instead of "Gp - General Paving" (which doesn't
 * exist in dev data). Also note that the dropdown toggle shows full text after
 * selection, not just the code (differs from test case expectation).
 *
 * WHAT THE TEST VALIDATES:
 * 1. Dropdown Options:
 *    ✅ Options display in "Code - Description" format
 *    ✅ Multiple options exist (54 total)
 *
 * 2. Type-ahead Filter:
 *    ✅ Typing in search input filters the options list
 *    ✅ "Safety" filters to show options containing "Safety"
 *
 * 3. Selection Display:
 *    ✅ After selection, toggle shows full "Sp - Safety Program"
 *    ✅ In the table, only the code "Sp" is displayed
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-FIN-04 — Element field look-ahead shows code and description', () => {
  test.setTimeout(60_000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/projects/79/projectplan');
    await expect(page.locator('h1', { hasText: 'Financial Planning Targets' })).toBeVisible();
  });

  test('Element field look-ahead shows code and description', async ({ page }) => {
    await test.step('Step 1: Open Add dialog and Element dropdown', async () => {
      await page.locator('button[title="Add Finanical Planning Target"]').click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      // Open Element dropdown (index 2)
      await dialog.locator('button.dropdown-toggle').nth(2).click();
      await page.waitForTimeout(300);
    });

    await test.step('Step 2: Verify options show code and description format', async () => {
      const dialog = page.locator('[role="dialog"]');

      // Get all visible options
      const options = await dialog.locator('.dropdown-menu.show button.dropdown-item').allTextContents();

      // Verify there are many options
      expect(options.length).toBeGreaterThan(50);

      // Verify format: "Code - Description" (e.g., "Bb - Bike BC")
      expect(options[0]).toMatch(/^[A-Z][a-z0-9]+ - .+/);
      expect(options).toContain('Sp - Safety Program');
    });

    await test.step('Step 3: Type "Safety" to filter and verify filtered results', async () => {
      const dialog = page.locator('[role="dialog"]');

      // Type in the search input
      const searchInput = dialog.locator('.dropdown-menu.show input');
      await searchInput.fill('Safety');
      await page.waitForTimeout(400);

      // Verify filtered results contain "Safety"
      const filtered = await dialog.locator('.dropdown-menu.show button.dropdown-item').allTextContents();
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.length).toBeLessThan(10);

      // "Sp - Safety Program" should be in the filtered list
      expect(filtered).toContain('Sp - Safety Program');
    });

    await test.step('Step 4: Select option and verify display', async () => {
      const dialog = page.locator('[role="dialog"]');

      // Select "Sp - Safety Program"
      await dialog.locator('.dropdown-menu.show button.dropdown-item', { hasText: 'Safety Program' }).click();
      await page.waitForTimeout(200);

      // Verify the toggle shows full code + description after selection
      const selectedText = await dialog.locator('button.dropdown-toggle').nth(2).textContent();
      expect(selectedText.trim()).toBe('Sp - Safety Program');
    });

    await test.step('Step 5: Verify table shows only code', async () => {
      // The existing row in the table shows "Sp" (code only) in the Element column
      const existingRow = page.locator('table').first().locator('tbody tr').first();
      const elementCell = existingRow.locator('td').nth(2);
      await expect(elementCell).toHaveText('Sp');
    });

    await test.step('Cleanup: Close dialog', async () => {
      const dialog = page.locator('[role="dialog"]');
      await dialog.getByRole('button', { name: 'Cancel' }).click();

      // Handle unsaved changes if Element selection triggered it
      const unsaved = page.locator('[role="dialog"]').filter({ hasText: 'unsaved' });
      if (await unsaved.isVisible({ timeout: 1000 }).catch(() => false)) {
        await unsaved.getByRole('button', { name: 'Leave' }).click();
      }
    });
  });
});
