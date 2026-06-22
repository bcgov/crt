/**
 * ============================================================================
 * 09-BVT-Smoke-Tests - TC-TS-BVT-RAT-02: Determine ratios from segments
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-BVT-RAT-02-ratios-from-segments.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-rat-02-ratios-from-segments.spec.ts --headed
 * Headless:               npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-rat-02-ratios-from-segments.spec.ts
 * Debug:                  npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-rat-02-ratios-from-segments.spec.ts --debug
 * Specific Test:          npx playwright test tests/09-bvt-smoke-tests/tc-ts-bvt-rat-02-ratios-from-segments.spec.ts -g "Determine ratios from segments" --headed
 *
 * OVERVIEW:
 * Build Verification Test confirming that the "Determine Ratios Using Segments"
 * button appears when a project has segments, and that clicking it triggers the
 * spatial calculation flow. Creates a segment via API, verifies the button
 * appears, clicks it, and handles either success or error (spatial service may
 * be unavailable in dev).
 *
 * WHAT THE TEST VALIDATES:
 * 1. Button Visibility:
 *    ✅ "Determine Ratios Using Segments" button is hidden when no segments exist
 *    ✅ Button appears after a segment is added
 *
 * 2. Modal Interaction:
 *    ✅ Clicking button opens confirmation modal
 *    ✅ Modal shows warning about overwriting ratios
 *    ✅ "Proceed" button triggers the calculation
 *    ✅ Modal shows either success or error result
 *
 * 3. Cleanup:
 *    ✅ Segment is deleted after test
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-BVT-RAT-02 — BVT: Determine ratios from segments', () => {
  test.setTimeout(180_000);

  test('Determine ratios from segments', async ({ page }) => {
    let authToken: string | null = null;
    let projectId = 0;
    let segmentsUrl = '';

    page.on('request', (req) => {
      if (req.url().includes('/api/') && !authToken) {
        authToken = req.headers()['authorization'] || null;
      }
    });

    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    await test.step('Pre-setup: discover project with no segments and clean up any leftover test data', async () => {
      // Navigate to projects page and capture auth token via response wait
      const tokenResponsePromise = page.waitForResponse(
        (resp) => resp.url().includes('/api/') && resp.status() === 200,
        { timeout: 30_000 }
      );
      await page.goto('/projects');
      await tokenResponsePromise;
      await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30_000 });

      // Collect all project hrefs before navigating away (locators become stale after navigation)
      const links = page.locator('table tbody tr td:nth-child(2) a');
      const hrefs: string[] = [];
      const linkCount = await links.count();
      for (let i = 0; i < Math.min(linkCount, 10); i++) {
        hrefs.push((await links.nth(i).getAttribute('href')) ?? '');
      }

      // Find the first project that has no segments (works in both DEV and TST)
      for (const href of hrefs) {
        const match = href.match(/\/projects\/(\d+)/);
        if (!match) continue;

        await page.goto(`${href}/segments`);
        await expect(page.locator('h1, h2, h3').first()).toBeVisible({ timeout: 30_000 });

        // Clean up our leftover test segment if it exists on this project
        const segTable = page.locator('table').first();
        const leftoverSeg = segTable.locator('tbody tr').filter({ hasText: 'BVT Segment for Ratio Determination' });
        if (await leftoverSeg.isVisible()) {
          const edTable = page.locator('table').nth(1);
          let edRows = await edTable.locator('tbody tr').count();
          while (edRows > 0) {
            await edTable.locator('tbody tr').first().locator('button[title="Delete Record"]').click();
            const popover = page.locator('[role="tooltip"]');
            await expect(popover).toBeVisible({ timeout: 5_000 });
            await popover.getByRole('button', { name: 'Delete' }).dispatchEvent('click');
            await expect(popover).toBeHidden({ timeout: 10_000 });
            edRows = await edTable.locator('tbody tr').count();
          }
          await leftoverSeg.locator('button[title="Delete Record"]').click();
          const popover = page.locator('[role="tooltip"]');
          await expect(popover).toBeVisible({ timeout: 5_000 });
          await popover.getByRole('button', { name: 'Delete' }).dispatchEvent('click');
          await expect(leftoverSeg).toBeHidden({ timeout: 10_000 });
        }

        // Use this project only if it now has no segments
        if ((await segTable.locator('tbody tr').count()) === 0) {
          projectId = parseInt(match[1]);
          segmentsUrl = `${href}/segments`;
          break;
        }
      }

      expect(segmentsUrl).toBeTruthy();
    });

    await test.step('Step 1: Verify button is hidden when no segments exist', async () => {
      expect(authToken).not.toBeNull();
      // "Determine Ratios Using Segments" button should not be visible with no segments
      await expect(
        page.getByRole('button', { name: 'Determine Ratios Using Segments' })
      ).not.toBeVisible();
    });

    await test.step('Step 2: Create a segment via API', async () => {
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
              description: 'BVT Segment for Ratio Determination',
            }),
          });
          return { status: res.status };
        },
        { auth: authToken!, projId: projectId }
      );

      expect(response.status).toBe(201);
    });

    await test.step('Step 3: Reload and verify "Determine Ratios Using Segments" button appears', async () => {
      await page.reload();
      const determineBtn = page.getByRole('button', { name: 'Determine Ratios Using Segments' });
      await expect(determineBtn).toBeVisible({ timeout: 30_000 });
    });

    await test.step('Step 4: Click button and verify modal triggers calculation', async () => {
      const determineBtn = page.getByRole('button', { name: 'Determine Ratios Using Segments' });
      await determineBtn.click();

      // The modal opens; may show "Proceed" warning if ratios already exist, or auto-proceed
      const modal = page.getByRole('dialog').filter({ hasText: 'Determine Ratios Using Segments' });
      await expect(modal).toBeVisible({ timeout: 15_000 });

      // If "Proceed" button is visible (ratios already exist), click it
      const proceedBtn = modal.getByRole('button', { name: 'Proceed' });
      if (await proceedBtn.isVisible().catch(() => false)) {
        const modalText = await modal.textContent();
        expect(modalText).toContain('overwrite');
        await proceedBtn.click();
      }

      // Wait for the spatial service response (may succeed or fail; allow up to 30s)
      const resultLocator = page.locator(
        '.alert-success:has-text("Ratios determined"), .alert-danger:has-text("Operation Failed"), [role="dialog"]:has-text("Server Error")'
      );
      await expect(resultLocator.first()).toBeVisible({ timeout: 30_000 });
    });

    await test.step('Step 5: Verify result (success or error handled gracefully)', async () => {
      const successAlert = page.locator('.alert-success:has-text("Ratios determined")');
      const failAlert = page.locator('.alert-danger:has-text("Operation Failed")');
      const errorDialog = page.getByRole('dialog').filter({ hasText: 'Server Error' });

      const succeeded = (await successAlert.count()) > 0;
      const failedInModal = (await failAlert.count()) > 0;
      const serverError = await errorDialog.isVisible().catch(() => false);

      // At least one outcome should be present
      expect(succeeded || failedInModal || serverError).toBeTruthy();

      // Close any open modals/dialogs
      if (serverError) {
        await errorDialog.locator('button:has-text("Close")').dispatchEvent('click');
        await expect(errorDialog).toBeHidden({ timeout: 5_000 });
      }

      const determineModal = page.getByRole('dialog').filter({ hasText: 'Determine Ratios' });
      if (await determineModal.isVisible().catch(() => false)) {
        await determineModal.locator('.modal-footer button:has-text("Close")').dispatchEvent('click');
        await expect(determineModal).toBeHidden({ timeout: 5_000 });
      }
    });

    await test.step('Step 6: Cleanup - delete the segment and any auto-generated ratios', async () => {
      // Reload to get fresh state
      await page.reload();
      await expect(page.locator('h1, h2, h3').first()).toBeVisible({ timeout: 30_000 });

      // Delete any ratios that were auto-generated in the Electoral Districts table
      const edTable = page.locator('table').nth(1);
      while ((await edTable.locator('tbody tr').count()) > 0) {
        const currentCount = await edTable.locator('tbody tr').count();
        await edTable.locator('tbody tr').first().locator('button[title="Delete Record"]').click();
        const popover = page.locator('[role="tooltip"]');
        await expect(popover).toBeVisible({ timeout: 5_000 });
        await popover.getByRole('button', { name: 'Delete' }).dispatchEvent('click');
        await expect(edTable.locator('tbody tr')).toHaveCount(currentCount - 1, { timeout: 10_000 });
      }

      // Delete the segment
      const segTable = page.locator('table').first();
      while ((await segTable.locator('tbody tr').count()) > 0) {
        const currentCount = await segTable.locator('tbody tr').count();
        await segTable.locator('tbody tr').first().locator('button[title="Delete Record"]').first().click();
        const popover = page.locator('[role="tooltip"]');
        await expect(popover).toBeVisible({ timeout: 5_000 });
        await popover.getByRole('button', { name: 'Delete' }).dispatchEvent('click');
        await expect(segTable.locator('tbody tr')).toHaveCount(currentCount - 1, { timeout: 10_000 });
      }

      // Verify segment table is empty
      await expect(segTable.locator('tbody tr')).toHaveCount(0, { timeout: 10_000 });
    });
  });
});
