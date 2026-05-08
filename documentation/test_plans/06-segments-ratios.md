# Test Plan: Project Segments & Project Ratios

## 1. Introduction
Validates segment CRUD with web map integration and highway direction handling (3.7), and ratio CRUD with manual entry, segment-based determination, and ratio sum validation (3.8).
**Reference Docs**: [3.7 Project Segments](../confluence_pages/user-support/end-user-guide/project-segments.md), [3.8 Project Ratios](../confluence_pages/user-support/end-user-guide/project-ratios.md)

## 2. Scope
- **In Scope**: Segment add/edit/delete via web map, view map, highway direction handling, ratio manual add/edit/delete, determine ratios using segments, ratio sum validation warning
- **Out of Scope**: GIS service internals, map tile rendering, other project sections

## 3. Test Strategy
- **Test Levels**: E2E (Playwright), Manual (for map interactions)
- **Environment**: UAT
- **Note**: Map-based tests may require manual verification due to GIS component interaction complexity.

## 4. Test Scenarios

### SEG - Project Segments (3.7)

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-SEG-01 | Verify view all segments on map | 1. Navigate to project with existing segments<br>2. Click "View Map" button | Web map opens; all project segments are displayed as highlighted sections on the road network | High | Functional |
| TS-SEG-02 | Verify add segment with valid coordinates | 1. Click "Add Segment" button<br>2. Provide valid start and end coordinates on the web map<br>3. Save the segment | New segment is created; segment appears in the segment list and on the map | High | Functional |
| TS-SEG-03 | Verify add segment with single point (start only) | 1. Click "Add Segment"<br>2. Provide only a start coordinate (no end)<br>3. Save | Segment is created as a point; behavior is documented | Medium | Edge Case |
| TS-SEG-04 | Verify highway direction - correct alignment | 1. Click "Add Segment"<br>2. Place start and end points aligned with highway direction<br>3. Save | Route is drawn correctly along the highway | High | Functional |
| TS-SEG-05 | Verify highway direction - reverse alignment | 1. Click "Add Segment"<br>2. Place start and end points against highway direction | System either finds a circuitous route or fails to find a route; user is informed | High | Edge Case |
| TS-SEG-06 | Verify highway direction - Solution 1 (swap points) | 1. Encounter a reverse-direction issue<br>2. Swap start and end points so direction aligns | Route is drawn correctly after swapping | Medium | Functional |
| TS-SEG-07 | Verify highway direction - Solution 2 (change lane) | 1. Encounter a reverse-direction issue<br>2. Move points to the opposing lane/direction | Route is drawn correctly on the correct lane | Medium | Functional |
| TS-SEG-08 | Verify edit segment | 1. Click edit (pencil) on an existing segment row<br>2. Modify start or end coordinates on the web map<br>3. Save | Segment is updated; new route is reflected in the list and on the map | High | Functional |
| TS-SEG-09 | Verify delete segment with confirmation | 1. Click delete (trash) on a segment row<br>2. Confirm deletion | Segment is removed from the list and the map | High | Functional |
| TS-SEG-10 | Verify delete segment cancelled | 1. Click delete (trash)<br>2. Cancel confirmation | Segment is not deleted | Medium | Negative |
| TS-SEG-11 | Verify view map with no segments | 1. Navigate to project with no segments<br>2. Click "View Map" | Map opens with no highlighted segments; no errors | Low | Edge Case |
| TS-SEG-12 | Verify read-only access | 1. Log in as Project Read only user<br>2. Navigate to Segments | View Map may be available; Add Segment, edit, delete buttons are hidden/disabled | High | Negative |

### RAT - Project Ratios (3.8)

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-RAT-01 | Verify add ratio manually (District) | 1. Navigate to Project Ratios<br>2. Click add (+) for District ratio type<br>3. Enter ratio value<br>4. Save | New District ratio row is created | High | Functional |
| TS-RAT-02 | Verify add ratio manually (Electoral Region) | 1. Click add (+) for Electoral Region<br>2. Enter ratio value<br>3. Save | New Electoral Region ratio row is created | High | Functional |
| TS-RAT-03 | Verify add ratio manually (all types) | 1. Repeat add for Service Area, Highway, and Economic Region types | Rows are created for each ratio type | Medium | Functional |
| TS-RAT-04 | Verify determine ratios using segments | 1. Ensure at least one project segment exists<br>2. Click "Determine ratios using segments" button | Ratios are auto-calculated for all ratio types (District, Electoral, Service Area, Highway, Economic Region) based on segment data | High | Functional |
| TS-RAT-05 | Verify determine ratios - no segments | 1. Navigate to ratios for project with no segments<br>2. Click "Determine ratios using segments" | System informs user that segments are required, or button is disabled | Medium | Negative |
| TS-RAT-06 | Verify determine ratios overwrites existing values | 1. Manually add ratio values for a ratio type<br>2. Click "Determine ratios using segments" | Confirmation prompt appears warning about overwrite; upon confirmation, existing values are replaced | High | Functional |
| TS-RAT-07 | Verify determine ratios overwrite cancelled | 1. Manually add ratio values<br>2. Click "Determine ratios using segments"<br>3. Cancel the confirmation prompt | Existing ratio values are preserved | Medium | Negative |
| TS-RAT-08 | Verify edit ratio manually | 1. Click edit (pencil) on a ratio row<br>2. Modify the ratio value<br>3. Save | Ratio is updated | High | Functional |
| TS-RAT-09 | Verify delete ratio with confirmation | 1. Click delete (trash) on a ratio row<br>2. Confirm deletion | Ratio row is removed | High | Functional |
| TS-RAT-10 | Verify ratio sum = 1 (no warning) | 1. Add ratio rows for a type (e.g., District)<br>2. Ensure all ratio values sum to exactly 1.0 | No warning icon is displayed for that ratio type | High | Functional |
| TS-RAT-11 | Verify ratio sum ≠ 1 (warning displayed) | 1. Add ratio rows for a type<br>2. Set values that do NOT sum to 1.0 (e.g., 0.6 + 0.3 = 0.9) | Warning icon is displayed for that ratio type | High | Functional |
| TS-RAT-12 | Verify no warning for empty ratio type | 1. Ensure a ratio type (e.g., Highway) has no rows at all | No warning icon is displayed for that empty ratio type | Medium | Edge Case |
| TS-RAT-13 | Verify ratio value boundary - 0 | 1. Add a ratio with value 0<br>2. Save | System accepts or rejects per business rules; behavior is consistent | Medium | Edge Case |
| TS-RAT-14 | Verify ratio value boundary - negative | 1. Attempt to enter a negative ratio value<br>2. Save | Validation prevents negative values | Medium | Negative |
| TS-RAT-15 | Verify ratio value boundary - greater than 1 | 1. Enter a single ratio value > 1.0<br>2. Save | System accepts or rejects; if accepted, warning icon is displayed | Medium | Edge Case |
| TS-RAT-16 | Verify re-determine ratios after adding new segment | 1. Add a new segment to the project<br>2. Click "Determine ratios using segments" | Ratios are recalculated to include the new segment | High | Functional |
| TS-RAT-17 | Verify segment-determined ratios accuracy disclaimer | 1. Determine ratios using segments<br>2. Review calculated values | Values are geographical approximations; user understands they may not reflect true financial distribution | Low | Functional |
| TS-RAT-18 | Verify read-only access | 1. Log in as Project Read only user<br>2. Navigate to Ratios | Add, edit, delete, and determine buttons are hidden/disabled | High | Negative |

## 5. Risks and Mitigation
- **Risk**: Web map / GIS service dependency; segment creation requires live map integration.
  - **Mitigation**: Ensure GIS services are available in test environment; provide manual verification fallback for map-based tests.
- **Risk**: "Determine ratios using segments" accuracy is approximate per documentation.
  - **Mitigation**: Test for consistency (same input produces same output) rather than absolute accuracy; verify warning icon behavior.
- **Risk**: Highway direction edge cases are complex and depend on road network data.
  - **Mitigation**: Prepare known test coordinates for highways with clear directionality; document coordinates in test data setup.
- **Risk**: Floating-point precision may affect ratio sum = 1 validation.
  - **Mitigation**: Test with exact decimal values (0.5 + 0.5) and imprecise ones (0.33 + 0.33 + 0.34) to verify tolerance handling.
