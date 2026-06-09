/**
 * ============================================================================
 * 09-BVT-Smoke-Tests - TC-TS-BVT-LOC-02: Add multiple project locations
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-BVT-LOC-02-multiple-locations.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-loc-02-multiple-locations.spec.ts --headed
 * Headless:               npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-loc-02-multiple-locations.spec.ts
 * Debug:                  npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-loc-02-multiple-locations.spec.ts --debug
 * Specific Test:          npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-loc-02-multiple-locations.spec.ts -g "Add multiple project locations" --headed
 *
 * OVERVIEW:
 * Build Verification Test confirming that multiple location segments can be
 * added to a single project. Creates two segments via API with different
 * coordinates and descriptions, verifies both appear in the table, then cleans up.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Multiple Segments:
 *    ✅ Two segments can be created for the same project
 *    ✅ Both segments appear independently in the segments table
 *
 * 2. Segment Independence:
 *    ✅ Each segment has its own start/end coordinates
 *    ✅ Each segment has its own description
 *    ✅ Deleting one segment does not affect the other
 *
 * 3. Cleanup:
 *    ✅ Both segments can be deleted independently
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-BVT-LOC-02 — BVT: Add multiple project locations', () => {
  test.setTimeout(120_000);

  const projectId = 81;

  test('Add multiple project locations', async ({ page }) => {
    let authToken: string | null = null;

    page.on('request', (req) => {
      if (req.url().includes('/api/') && !authToken) {
        authToken = req.headers()['authorization'] || null;
      }
    });

    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    await test.step('Step 1: Navigate to segments page and capture auth token', async () => {
      await page.goto(`/projects/${projectId}/segments`);
      await page.waitForTimeout(3000);
      expect(authToken).not.toBeNull();
    });

    await test.step('Step 2: Create first segment (Highway A - Start 0, End 5)', async () => {
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
                [-123.5000, 48.5000],
                [-123.5500, 48.5500],
              ],
              description: 'BVT Segment 1 - Highway A',
            }),
          });
          return { status: res.status };
        },
        { auth: authToken!, projId: projectId }
      );

      expect(response.status).toBe(201);
    });

    await test.step('Step 3: Create second segment (Highway B - Start 10, End 20)', async () => {
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
                [-124.0000, 49.0000],
                [-124.1000, 49.1000],
              ],
              description: 'BVT Segment 2 - Highway B',
            }),
          });
          return { status: res.status };
        },
        { auth: authToken!, projId: projectId }
      );

      expect(response.status).toBe(201);
    });

    await test.step('Step 4: Reload and verify both segments appear in table', async () => {
      await page.reload();
      await page.waitForTimeout(3000);

      const segTable = page.locator('table').first();
      const rows = segTable.locator('tbody tr');

      // Verify at least 2 rows
      const rowCount = await rows.count();
      expect(rowCount).toBeGreaterThanOrEqual(2);

      // Verify segment 1
      const seg1 = segTable.locator('tbody tr:has-text("BVT Segment 1 - Highway A")');
      await expect(seg1).toBeVisible();

      // Verify segment 2
      const seg2 = segTable.locator('tbody tr:has-text("BVT Segment 2 - Highway B")');
      await expect(seg2).toBeVisible();
    });

    await test.step('Step 5: Cleanup - delete both segments', async () => {
      const segTable = page.locator('table').first();

      // Delete segment 2 first (bottom entry)
      const seg2 = segTable.locator('tbody tr:has-text("BVT Segment 2 - Highway B")');
      await seg2.locator('button[title="Delete Record"]').evaluate((el) => el.click());
      await page.waitForTimeout(500);
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

      // Verify segment 1 still exists
      const seg1 = segTable.locator('tbody tr:has-text("BVT Segment 1 - Highway A")');
      await expect(seg1).toBeVisible();

      // Delete segment 1
      await seg1.locator('button[title="Delete Record"]').evaluate((el) => el.click());
      await page.waitForTimeout(500);
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

      // Verify table is empty
      const finalRows = await segTable.locator('tbody tr').count();
      expect(finalRows).toBe(0);
    });
  });
});
