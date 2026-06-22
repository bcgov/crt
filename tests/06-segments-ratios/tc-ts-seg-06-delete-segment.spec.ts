/**
 * ============================================================================
 * 06-Spatial-Segments-Ratios - TC-TS-SEG-06: Delete segment with confirmation
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-SEG-06-delete-segment.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/06-segments-ratios/tc-ts-seg-06-delete-segment.spec.ts --headed
 * Headless:               npx playwright test tests/06-segments-ratios/tc-ts-seg-06-delete-segment.spec.ts
 * Debug:                  npx playwright test tests/06-segments-ratios/tc-ts-seg-06-delete-segment.spec.ts --debug
 * Specific Test:          npx playwright test tests/06-segments-ratios/tc-ts-seg-06-delete-segment.spec.ts -g "Delete" --headed
 *
 * OVERVIEW:
 * Verifies that deleting a segment requires confirmation via an "Are you sure?"
 * prompt. Tests that Cancel retains the segment. The confirm-delete test is
 * skipped because the segment cannot be recreated without the map component.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Delete Confirmation:
 *    ✅ Clicking Delete Record shows "Are you sure?" popover
 *    ✅ Popover has "Delete" and "Cancel" buttons
 *    ✅ Cancel dismisses the popover and retains the segment row
 *
 * 2. Confirm Delete (skipped):
 *    ✅ Confirm removes the segment from the table
 *
 * NOTE: The confirm-delete test is SKIPPED because the segment cannot be
 * recreated without the map component (which fails with "keycloak: failed
 * to initialize" in dev environment).
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('TC-TS-SEG-06 — Delete segment with confirmation', () => {
  test.setTimeout(60_000);

  test('Cancel delete retains segment in table', async ({ page }) => {
    // Handle potential keycloak alerts
    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    await test.step('Step 1: Navigate to segments page for a project with segments', async () => {
      await page.goto('/projects');
      await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30000 });

      const projectLinks = page.locator('table tbody tr td:nth-child(2) a');
      const count = await projectLinks.count();
      const hrefs: (string | null)[] = [];
      for (let i = 0; i < count; i++) {
        hrefs.push(await projectLinks.nth(i).getAttribute('href'));
      }

      let found = false;
      for (let i = 0; i < hrefs.length && !found; i++) {
        await page.goto(`${hrefs[i]}/segments`);
        await expect(page.getByText('Project Segments')).toBeVisible();
        const segTable = page.locator('table').first();
        const segRows = await segTable.locator('tbody tr').count();
        if (segRows > 0) {
          found = true;
        }
      }

      expect(found, 'Could not find a project with segments').toBe(true);
    });

    const segTable = page.locator('table').first();
    const row = segTable.locator('tbody tr').first();
    let rowText: string;

    await test.step('Step 2: Click Delete Record on segment row', async () => {
      await expect(row).toBeVisible();
      rowText = (await row.textContent()) || '';
      await row.locator('button[title="Delete Record"]').click();
    });

    await test.step('Step 3: Verify confirmation popover appears', async () => {
      const popover = page.locator('.popover.show');
      await popover.waitFor({ state: 'visible', timeout: 5000 });
      await expect(popover).toContainText('Are you sure?');
      await expect(popover.getByRole('button', { name: 'Delete' })).toBeVisible();
      await expect(popover.getByRole('button', { name: 'Cancel' })).toBeVisible();
    });

    await test.step('Step 4: Click Cancel and verify segment is retained', async () => {
      const popover = page.locator('.popover.show');
      await popover.getByRole('button', { name: 'Cancel' }).click();

      // Row is still visible with same content
      await expect(row).toBeVisible();
      const afterText = await row.textContent();
      expect(afterText).toBe(rowText);
    });
  });

  test('Confirm delete removes segment from table', async ({ page }) => {
    test.skip(true, 'Segment cannot be recreated without map component (keycloak error blocks map)');

    // Handle potential keycloak alerts
    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    await test.step('Step 1: Navigate to segments page', async () => {
      await page.goto('/projects');
      await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30000 });

      const projectLinks = page.locator('table tbody tr td:nth-child(2) a');
      const count = await projectLinks.count();
      const hrefs: (string | null)[] = [];
      for (let i = 0; i < count; i++) {
        hrefs.push(await projectLinks.nth(i).getAttribute('href'));
      }

      let found = false;
      for (let i = 0; i < hrefs.length && !found; i++) {
        await page.goto(`${hrefs[i]}/segments`);
        await expect(page.getByText('Project Segments')).toBeVisible();
        const segTable = page.locator('table').first();
        const segRows = await segTable.locator('tbody tr').count();
        if (segRows > 0) {
          found = true;
        }
      }

      expect(found, 'Could not find a project with segments').toBe(true);
    });

    const segTable = page.locator('table').first();
    const row = segTable.locator('tbody tr').first();

    await test.step('Step 2: Click Delete Record and confirm', async () => {
      await row.locator('button[title="Delete Record"]').click();
      const popover = page.locator('.popover.show');
      await popover.waitFor({ state: 'visible', timeout: 5000 });
      await popover.getByRole('button', { name: 'Delete' }).click();
      await page.waitForTimeout(500);
    });

    await test.step('Step 3: Verify segment is removed from table', async () => {
      await expect(row).not.toBeVisible();
    });
  });
});
