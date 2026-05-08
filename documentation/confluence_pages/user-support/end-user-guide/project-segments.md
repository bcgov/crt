---
source: [3.7 Project Segments](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302904/3.7+Project+Segments)
last_updated: 2026-05-08
---

# 3.7 Project Segments

This section is used to record the project spatial location.

## Getting to project segments

- Refer to [Navigation → Project Information](https://moti-imb.atlassian.net/wiki/display/CRPDB/2+Application+components#id-2Applicationcomponents-ProjectInformation) to see how to navigate to various sections of the application.

## Adding/Viewing a segment

### View segment

- To view all segments corresponding to a project, click on the view map button at the top right of the project segments section.

<!-- IMAGE: View map button -->

- All segments added to the project will appear as highlighted sections of the highways/roads.

<!-- IMAGE: Map showing highlighted segments -->

### Add segment

- Similar to view segment, to add a new segment - click on the add segment button at the top right of the project segments section.

- This would open up the web map, where the users can provide start and, if applicable, the end coordinates for a project segment, and save the segment.

<!-- IMAGE: Web map for adding segment -->

- The new segment is added to the project.

<!-- IMAGE: New segment added -->

### Important note about highway direction

- **Note**: The web map respects the direction of the highway when trying to connect the start and end coordinates, that is if the start and end points do not conform to the direction of the highway it will either try to find a circuitous route, following the direction of the highway, or would fail to find a route all together. See example:

<!-- IMAGE: image2021-5-7_10-59-34.png - Direction issue example -->

- **Solution 1**: If the user is on the correct lane, swapping the start and end points, so that the direction of the segment aligns with the direction of the road.

<!-- IMAGE: image2021-5-7_11-2-25.png - Solution 1 swap points -->

- **Solution 2**: The user may be on the wrong lane (direction) of the highway, to resolve this - move the start and end points to the lane going in the intended direction.

<!-- IMAGE: image2021-5-7_11-14-35.png - Solution 2 change lane -->

## Edit segments

- To edit a segment, click on the edit (pencil) button at the right of the row.

<!-- IMAGE: Edit segment button -->

- This would open the web map where the user can update the segment, and save the changes.

<!-- IMAGE: Edit segment on web map -->

## Delete project segments

- To delete a segment, click on the delete (trash) button at the end of the row.

<!-- IMAGE: Delete segment button -->

- The segment will be deleted once the user confirms the action.

<!-- IMAGE: Delete confirmation -->
