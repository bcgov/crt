# Segment Map

## URL
`https://dev-crt.th.gov.bc.ca/projects/{id}/segments` (click "+ Add Segment / View Map" button)

## Purpose
Displays an interactive map for adding/viewing road segments associated with a project.

## Key Elements

| Element | Type | Selector | Notes |
|---------|------|----------|-------|
| + Add Segment / View Map | Button | `button:has-text("+ Add Segment / View Map")` | Opens map interface |

## Notes
- **NOT TESTABLE in current DEV environment** - throws "keycloak: failed to initialize" alert dialog
- The map component requires a separate Keycloak authentication that is not working in the Playwright session
- This feature opens a map view (likely using BC Government mapping services) for segment selection
- The segment table on the page shows columns: Segment (description), Length (km), with edit/delete actions
- Testing of this feature may need to be deferred or handled with mocked map data
