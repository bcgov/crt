/**
 * ============================================================================
 * 06-Spatial-Segments-Ratios - TC-TS-SEG-08: Highway direction mismatch handling
 * ============================================================================
 * Based on: documentation/test_cases/TC-TS-SEG-08-direction-mismatch.md
 *
 * EXECUTION COMMANDS:
 * Headed:                 npx playwright test tests/06-segments-ratios/tc-ts-seg-08-direction-mismatch.spec.ts --headed
 * Headless:               npx playwright test tests/06-segments-ratios/tc-ts-seg-08-direction-mismatch.spec.ts
 * Debug:                  npx playwright test tests/06-segments-ratios/tc-ts-seg-08-direction-mismatch.spec.ts --debug
 * Specific Test:          npx playwright test tests/06-segments-ratios/tc-ts-seg-08-direction-mismatch.spec.ts -g "direction" --headed
 *
 * OVERVIEW:
 * Verifies the system behavior when a segment is added with start/end
 * coordinates that run against the highway direction (wrong lane on a divided
 * highway). The map should either fail to find a route or return a circuitous
 * route, and the user must correct pin placement.
 *
 * WHAT THE TEST VALIDATES:
 * 1. Direction Mismatch:
 *    ✅ System handles the direction mismatch gracefully (no crash)
 *    ✅ Either no route found, or an obviously incorrect route shown
 *    ✅ User is expected to correct pin placement per §3.7
 *
 * NOTE: This test is NOT an automation candidate per the test case specification.
 * It requires visual map inspection and human judgment about route correctness.
 * It also requires functional map component (blocked by keycloak error).
 * ============================================================================
 */

import { test } from '@playwright/test';

test.describe('TC-TS-SEG-08 — Highway direction mismatch handling', () => {
  test.setTimeout(60_000);

  test('Highway direction mismatch shows invalid or no route', async ({ page }) => {
    test.skip(true, 'Not an automation candidate — requires visual map inspection and human judgment about route correctness. Also blocked by keycloak map error.');

    // This test requires:
    // 1. Functional map component (currently blocked by keycloak error)
    // 2. Knowledge of a divided highway with separate lanes in BC
    // 3. Visual inspection to determine if route is "circuitous" vs normal
    // 4. Human judgment about whether the system handled it gracefully
    //
    // Should be executed manually by a tester familiar with BC highway geography.
  });
});
