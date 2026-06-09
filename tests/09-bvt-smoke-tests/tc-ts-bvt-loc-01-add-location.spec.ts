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

  // Use project 81 (existing BVT test project)
  const projectId = 81;

  test('Add project location segment', async ({ page }) => {
    let authToken: string | null = null;

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
      await page.goto(`/projects/${projectId}/segments`);
      await page.waitForTimeout(3000);

      // Ensure auth token is captured
      expect(authToken).not.toBeNull();
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
      await page.waitForTimeout(3000);

      const segTable = page.locator('table').first();
      const row = segTable.locator('tbody tr:has-text("BVT Test Segment")');
      await expect(row).toBeVisible();

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

      // Click Delete Record
      await row.locator('button[title="Delete Record"]').evaluate((el) => el.click());
      await page.waitForTimeout(500);

      // Confirm deletion in popover
      await page.evaluate(() => {
        const popovers = document.querySelectorAll('.popover');
        for (const p of popovers) {
          const btns = p.querySelectorAll('button');
          for (const btn of btns) {
            if (btn.textContent && btn.textContent.trim() === 'Delete') {
              btn.click();
              return;
            }
          }
        }
      });
      await page.waitForTimeout(2000);

      // Verify deleted
      await expect(segTable.locator('tbody tr:has-text("BVT Test Segment")')).not.toBeVisible();
    });
  });
});
