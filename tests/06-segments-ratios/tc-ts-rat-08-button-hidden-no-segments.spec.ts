/**
 * ============================================================================
 * 06-Spatial-Segments-Ratios - TC-TS-RAT-08: Determine ratios button hidden without segments
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-RAT-08-button-hidden-no-segments.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/06-segments-ratios/tc-ts-rat-08-button-hidden-no-segments.spec.ts --headed
 * Headless:               npx playwright test tests/06-segments-ratios/tc-ts-rat-08-button-hidden-no-segments.spec.ts
 * Debug:                  npx playwright test tests/06-segments-ratios/tc-ts-rat-08-button-hidden-no-segments.spec.ts --debug
 * Specific Test:          npx playwright test tests/06-segments-ratios/tc-ts-rat-08-button-hidden-no-segments.spec.ts -g "hidden" --headed
 *
 * OVERVIEW:
 * Verifies that the "Determine Ratios Using Segments" button is NOT rendered when
 * the project has no segments defined. Uses project 80 which has zero segments.
 * Also verifies that the button IS visible on project 79 which has a segment.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Button Hidden:
 *    ✅ Project with no segments does not show "Determine Ratios Using Segments"
 *    ✅ Project Segments table is empty (0 rows)
 *    ✅ Project Ratios section is still visible
 *
 * 2. Button Visible (contrast):
 *    ✅ Project with segments shows "Determine Ratios Using Segments" button
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-RAT-08 — Determine ratios button hidden without segments', () => {
  test.setTimeout(60_000);

  test('Button is hidden when project has no segments', async ({ page }) => {
    page.on('dialog', async (d) => { await d.accept(); });

    await test.step('Step 1: Navigate to segments page for project with no segments (project 80)', async () => {
      await page.goto('/projects/80/segments');
      await expect(page.getByText('Project Segments')).toBeVisible();
    });

    await test.step('Step 2: Verify segments table is empty', async () => {
      const segTable = page.locator('table').first();
      const rows = await segTable.locator('tbody tr').count();
      expect(rows).toBe(0);
    });

    await test.step('Step 3: Verify "Determine Ratios Using Segments" button is NOT present', async () => {
      const btn = page.getByRole('button', { name: 'Determine Ratios Using Segments' });
      await expect(btn).toHaveCount(0);
    });

    await test.step('Step 4: Verify Project Ratios section still exists', async () => {
      await expect(page.getByText('Project Ratios')).toBeVisible();
    });
  });

  test('Button is visible when project has segments', async ({ page }) => {
    page.on('dialog', async (d) => { await d.accept(); });

    await test.step('Step 1: Navigate to segments page for project with segments (project 79)', async () => {
      await page.goto('/projects/79/segments');
      await expect(page.getByText('Project Segments')).toBeVisible();
    });

    await test.step('Step 2: Verify at least one segment exists', async () => {
      const segTable = page.locator('table').first();
      const rows = await segTable.locator('tbody tr').count();
      expect(rows).toBeGreaterThan(0);
    });

    await test.step('Step 3: Verify "Determine Ratios Using Segments" button IS visible', async () => {
      const btn = page.getByRole('button', { name: 'Determine Ratios Using Segments' });
      await expect(btn).toBeVisible();
    });
  });
});
