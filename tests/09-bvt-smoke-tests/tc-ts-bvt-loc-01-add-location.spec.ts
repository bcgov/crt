/**
 * ============================================================================
 * 09-BVT-Smoke-Tests - TC-TS-BVT-LOC-01: Add project location segment
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-BVT-LOC-01-add-location.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-loc-01-add-location.spec.ts --headed
 * Headless:               npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-loc-01-add-location.spec.ts
 * Debug:                  npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-loc-01-add-location.spec.ts --debug
 * Specific Test:          npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-loc-01-add-location.spec.ts -g "Add project location segment" --headed
 *
 * OVERVIEW:
 * Build Verification Test confirming that a project location (segment) can be
 * added with start/end coordinate points. Since the map/TWM component requires
 * Keycloak (which fails in dev), this test creates a segment via API and
 * verifies it appears in the UI table, then deletes it.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Segment Creation:
 *    ✅ Segment can be created via API with route coordinates and description
 *    ✅ Segment appears in the Project Segments table after creation
 *
 * 2. Segment Display:
 *    ✅ Start coordinates are displayed correctly
 *    ✅ End coordinates are displayed correctly
 *    ✅ Description is displayed correctly
 *
 * 3. Segment Deletion:
 *    ✅ Delete Record button is available
 *    ✅ Popover confirmation appears
 *    ✅ Segment is removed after confirmation
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-BVT-LOC-01 — BVT: Add project location segment', () => {
  test.setTimeout(120_000);

  // projectId discovered dynamically at runtime

  test('Add project location segment', async ({ page }) => {
    let authToken: string | null = null;
    let projectId = 0;
    let segmentsUrl = '';

    // Capture Bearer token from app's API requests
    page.on('request', (req) => {
      if (req.url().includes('/api/') && !authToken) {
        authToken = req.headers()['authorization'] || null;
      }
    });

    // Auto-dismiss any Keycloak alerts
    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    await test.step('Step 1: Navigate to segments page and capture auth token', async () => {
      // Discover first project dynamically
      await page.goto('/projects');
      await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30000 });
      const href = await page.locator('table tbody tr td:nth-child(2) a').first().getAttribute('href');
      const match = href?.match(/\/projects\/(\d+)/);
      projectId = match ? parseInt(match[1]) : 0;
      expect(projectId).toBeGreaterThan(0);
      segmentsUrl = `${href}/segments`;

      // Navigate to segments page — triggers API calls that capture the auth token
      const responsePromise = page.waitForResponse(
        resp => resp.url().includes('/api/projects/') && resp.status() === 200,
        { timeout: 30000 }
      );
      await page.goto(segmentsUrl);
      await responsePromise;
      expect(authToken).not.toBeNull();

      // Defensive cleanup: remove any leftover BVT Test Segment from a prior run
      const segTable = page.locator('table').first();
      const leftover = segTable.locator('tbody tr:has-text("BVT Test Segment")');
      if (await leftover.isVisible()) {
        await leftover.locator('button[title="Delete Record"]').click();
        const popover = page.locator('[role="tooltip"]');
        await expect(popover).toBeVisible();
        await popover.getByRole('button', { name: 'Delete' }).dispatchEvent('click');
        await expect(leftover).toBeHidden({ timeout: 10_000 });
      }
    });

    await test.step('Step 2: Create segment via API', async () => {
      const response = await page.evaluate(
        async ({ auth, projId }) => {
          const res = await fetch(`/api/projects/${projId}/segments`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: auth,
            },
            body: JSON.stringify({
              route: [
                [-123.7181, 48.8169],
                [-123.6989, 48.7694],
              ],
              description: 'BVT Test Segment',
            }),
          });
          return { status: res.status };
        },
        { auth: authToken!, projId: projectId }
      );

      expect(response.status).toBe(201);
    });

    await test.step('Step 3: Reload and verify segment appears in table', async () => {
      await page.reload();

      const segTable = page.locator('table').first();
      const row = segTable.locator('tbody tr:has-text("BVT Test Segment")');
      await expect(row).toBeVisible({ timeout: 15_000 });

      // Verify start coordinates
      const rowText = await row.textContent();
      expect(rowText).toContain('48.816900,-123.718100');
      // Verify end coordinates
      expect(rowText).toContain('48.769400,-123.698900');
      // Verify description
      expect(rowText).toContain('BVT Test Segment');
    });

    await test.step('Step 4: Cleanup - delete the segment', async () => {
      const segTable = page.locator('table').first();
      const row = segTable.locator('tbody tr:has-text("BVT Test Segment")');

      await row.locator('button[title="Delete Record"]').click();

      const popover = page.locator('[role="tooltip"]');
      await expect(popover).toBeVisible();
      await popover.getByRole('button', { name: 'Delete' }).dispatchEvent('click');
      await expect(segTable.locator('tbody tr:has-text("BVT Test Segment")')).toBeHidden({ timeout: 10_000 });
    });
  });
});
