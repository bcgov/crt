# 6. Project Spatial – Segments & Ratios

> **Preconditions for this file**: Tester is logged in as `{{IDIR_VALID_USER}}`. A project (`{{PROJECT_NUMBER_EXISTING}}`) exists and is reachable from the Project Search screen. Map provider is reachable from the test browser. See [00-conventions-glossary.md](00-conventions-glossary.md).

## [CRPDB-162] Project Spatial - Location Segments

**User Story**: As an Application User, I want to record project location segments using map coordinates.

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-SEG-01 | Navigate to Project Segments | 1. Select project<br>2. Navigate to Segments screen | Segments screen loads | High | Functional |
| TS-SEG-02 | Add new segment via map | 1. Click "Add Segment/View Map"<br>2. Review instructions<br>3. Add start/end locations (pin drop, keywords, or current location) | Pins placed on map for start and end coordinates | High | Functional |
| TS-SEG-03 | Segment description | 1. Add segment<br>2. Check auto-generated description<br>3. Manually edit description | Description auto-generates; can be manually overwritten | Medium | Functional |
| TS-SEG-04 | Save segment | 1. Add valid start/end coordinates<br>2. Save | Segment saved with sequential number, coordinates, description | High | Functional |
| TS-SEG-05 | Edit segment | 1. Click Edit on segment<br>2. Move start/end pins<br>3. Save | Segment updated with new coordinates | Medium | Functional |
| TS-SEG-06 | Delete segment | 1. Click Delete on segment<br>2. Confirm "Are you sure?" | Segment removed; Cancel returns to screen | Medium | Functional |
| TS-SEG-07 | Navigation links | 1. Click Close<br>2. Click Tender<br>3. Click Details<br>4. Click Financial Plan | Each navigates to correct screen | Medium | Functional |
| TS-SEG-08 | Highway direction mismatch | 1. Add a segment with start/end coordinates that run **against** the highway direction (e.g., on the wrong lane) | Web map either fails to find a route or returns a circuitous route; per end-user guide §3.7, user must either swap start/end points or move pins to the correct lane | Medium | Edge Case |

---

## [CRPDB-163] Project Ratios

**User Story**: As an Application User, I want to record project ratios across administrative boundaries.

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-RAT-01 | Add ratios for each boundary category | 1. Add ratios for Electoral Districts, Districts, Highways, Economic Regions, Service Area | Add form displays correct dropdowns for each category | High | Functional |
| TS-RAT-02 | Ratios sum to 1 (valid) | 1. Enter ratios that sum to exactly 1 | No warning message | High | Functional |
| TS-RAT-03 | Ratios do not sum to 1 (warning) | 1. Add at least one ratio row for a ratio type<br>2. Enter values that sum to a value other than 1 | Yellow info icon appears on that ratio type; clicking shows: `"The sum of the ratios should be 1"` | High | Negative |
| TS-RAT-04 | Edit ratio | 1. Click Edit<br>2. Change ratio value<br>3. Submit | Ratio updated; warning if sum ≠ 1 | Medium | Functional |
| TS-RAT-05 | Delete ratio | 1. Click Delete<br>2. Confirm prompt | Ratio removed; warning recalculated for remaining entries; if no rows remain for that ratio type, no warning is shown | Medium | Functional |

---

## [CRPDB-218] Project Ratios - Determine Ratios Using Segments

**User Story**: As an Application User, I want to auto-calculate ratios from segment data.

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-RAT-06 | Determine ratios (no existing data) | 1. Navigate to Ratios screen (no existing ratios)<br>2. Click "Determine Using Segments" | Success message: "Ratios determined. These calculated values are suggestions…" | High | Functional |
| TS-RAT-07 | Determine ratios (existing data overwrite) | 1. Add manual ratio<br>2. Click "Determine Using Segments" | Warning: "This action will overwrite the current project ratios…"; Confirm overwrites | High | Edge Case |
| TS-RAT-08 | Button hidden without segments | 1. Navigate to project with no segments | "Determine Using Segments" button not shown | Medium | Functional |
| TS-RAT-09 | Redetermine ratios after adding new segment | 1. Add segments and determine ratios<br>2. Add a new segment to the project<br>3. Click "Determine Using Segments" again<br>4. Confirm overwrite | Ratios recalculated to include new segment; all ratio types updated | Medium | Functional |
