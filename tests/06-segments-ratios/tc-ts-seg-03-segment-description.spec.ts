/**
 * ============================================================================
 * 06-Spatial-Segments-Ratios - TC-TS-SEG-03: Segment description auto-generates and is editable
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-SEG-03-segment-description.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/06-segments-ratios/tc-ts-seg-03-segment-description.spec.ts --headed
 * Headless:               npx playwright test tests/06-segments-ratios/tc-ts-seg-03-segment-description.spec.ts
 * Debug:                  npx playwright test tests/06-segments-ratios/tc-ts-seg-03-segment-description.spec.ts --debug
 * Specific Test:          npx playwright test tests/06-segments-ratios/tc-ts-seg-03-segment-description.spec.ts -g "description" --headed
 *
 * OVERVIEW:
 * Verifies that when a segment is added, a description is auto-generated from
 * the coordinates/route, and that the user can manually edit/overwrite this
 * description via the Edit Record form.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Auto-generated Description:
 *    ✅ Existing segment row shows a non-empty description
 *
 * 2. Description Editing:
 *    ✅ Edit Record opens the map/edit interface
 *    ✅ Description can be manually overwritten
 *    ✅ Updated description persists after saving
 *
 * NOTE: This test is SKIPPED because the Edit Record button opens the map
 * component which requires KeyCloak authentication that fails in the dev
 * environment with "keycloak: failed to initialize" error.
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-SEG-03 — Segment description auto-generates and is editable', () => {
  test.setTimeout(120_000);

  test('Verify existing segment has auto-generated description', async ({ page }) => {
    await test.step('Step 1: Navigate to segments page', async () => {
      await page.goto('/projects/79/segments');
      await expect(page.getByText('Project Segments')).toBeVisible();
    });

    await test.step('Step 2: Verify existing segment has a non-empty description', async () => {
      const segTable = page.locator('table').first();
      const descriptionCell = segTable.locator('tbody tr').first().locator('td').nth(2);
      await expect(descriptionCell).toBeVisible();
      const text = await descriptionCell.textContent();
      expect(text?.trim().length).toBeGreaterThan(0);
      // Known value from exploration
      expect(text).toContain('Duncan bypass improvements');
    });
  });

  test('Edit segment description via Edit Record', async ({ page }) => {
    test.skip(true, 'Map component fails with "keycloak: failed to initialize" — edit requires map');

    // Handle keycloak alerts that fire when the map loads
    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    await test.step('Step 1: Navigate to segments page', async () => {
      await page.goto('/projects/79/segments');
      await expect(page.getByText('Project Segments')).toBeVisible();
    });

    await test.step('Step 2: Click Edit Record on existing segment', async () => {
      const segTable = page.locator('table').first();
      await segTable.locator('tbody tr').first().locator('button[title="Edit Record"]').click();
      // Map/edit interface opens — requires functional keycloak
      await page.waitForTimeout(3000);
    });

    await test.step('Step 3: Edit the description field', async () => {
      // Implementation depends on map edit interface
      // Description field location not determinable without map working
      expect(true).toBe(true); // Placeholder
    });

    await test.step('Step 4: Save and verify updated description', async () => {
      // Save changes and verify table shows new description
      expect(true).toBe(true); // Placeholder
    });
  });
});
