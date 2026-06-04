/**
 * ============================================================================
 * 03-User-Management - TC-TS-USER-12: Non-admin cannot see admin tabs
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-USER-12-nonadmin-hidden.md
 *
 * STATUS: SKIPPED — requires login as a non-administrator user, which is not
 * feasible with the current single-account test configuration.
 *
 * OVERVIEW:
 * Verifies that non-administrator users cannot see the "Users" and
 * "Roles & Permissions" tabs in navigation, and that direct URL access
 * to /admin/users is blocked.
 * ============================================================================
 */
import { test } from '@playwright/test';

test.skip('TC-TS-USER-12: Non-admin cannot see admin tabs', async () => {
  // Skipped: requires non-admin login which is not available in current test environment
});
