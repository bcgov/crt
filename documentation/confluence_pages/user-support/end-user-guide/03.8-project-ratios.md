---
source: [3.8 Project Ratios](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302906/3.8+Project+Ratios)
last_updated: 2026-05-08
---

# 3.8 Project Ratios

## Getting to project ratios

- Refer to [Navigation → Project Information](https://moti-imb.atlassian.net/wiki/display/CRPDB/2+Application+components#id-2Applicationcomponents-ProjectInformation) to see how to navigate to various sections of the application.

## Adding ratios

User can add ratios in one of two ways:

### Add ratios manually

- To manually add ratio, click on the add (+) button for the corresponding ratio type (District, Electoral region, Service Area, Highway, Economic region).

<!-- IMAGE: Add ratio buttons by type -->

- Add ratio and save the ratio information.

<!-- IMAGE: Add ratio form -->

### Add ratio using segments

User can add ratios using segment information provided, at least one project segment must be added.

- Click on the "determine ratios using segments" button.

<!-- IMAGE: Determine ratios using segments button -->

- This will determine ratios for all ratio types.

<!-- IMAGE: Determined ratios result -->

## Edit ratio

Ratios can be updated in two ways.

### Update ratios manually

- To edit a ratio, click on the edit (pencil) button for the corresponding row of a ratio type.

<!-- IMAGE: Edit ratio button -->

- Update the ratio information in the form and save (Submit) the ratio information.

<!-- IMAGE: Edit ratio form -->

### Update ratios using segments

- To update ratio using segments follow the same process as that for [adding ratios using segments](#add-ratio-using-segments).

## Delete Ratios

- To delete a ratio, click on the delete (trash) button, this would ask user for the confirmation of their action.

<!-- IMAGE: Delete ratio confirmation -->

## Important Notes

### For determining ratios using segments

This approach automatically identifies various ratios types and calculates ratios based on segment information available for a project. Key points of consideration:

- The ratios boundaries determined and the values calculated through this method may not be 100% accurate, they should be considered as suggested values. The determined values should be verified by the user and, if required, the values should be updated/added.
- The ratios determined using this method are geographical and *may not reflect true financial distribution of the project*.
- If new segments are added to the project, the user will need to click the button again to trigger a redetermination of ratio for all ratio types.
- If a row exists for any ratio type, then this method will re-determine and overwrite the current value. That is why if any ratio value(s) exist user will be prompted to confirm their action.

<!-- IMAGE: image2021-5-7_15-26-58.png - Overwrite confirmation -->

### For ratio values

- As long as there is at least one row added for a ratio type (Electoral district, District, Economic regions, Service areas, Highways), it is an expectation that the sum of all ratio values for that ratio type would be 1, if the ratio values do not add to 1 - the user will see a warning icon.

<!-- IMAGE: image2021-5-7_15-7-44.png - Warning icon for ratio sum -->

- However, if a ratio type has no rows added to it - warnings are not presented.
