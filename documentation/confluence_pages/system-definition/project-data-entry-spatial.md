---
source: [Project data entry-spatial](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302714/Project+data+entry-spatial)
last_updated: 2026-05-08
---

# Project data entry-spatial

## History

| Release Version | Description | Section Updated by | Feature Release Date | Developer |
|----------------|-------------|-------------------|---------------------|-----------|
| 1.0 | Initial release | Devashish Bhargava | May 26, 2021 | Young-Jin Chung/ Derek So/ Darrel Siegle |

## Goals (functions/sub-features)

| # | Goal / Function | Description | Story | Importance |
|---|----------------|-------------|-------|------------|
| 1 | Project Segments | Projects happen over segment(s) of the road, the spatial data for these segments need to be recorded. | CRPDB-51 | High |
| 2 | Project Ratios | Projects may occur over multiple administrative boundaries, the proportion of project, as it falls within each administrative boundary, needs to be recorded. | CRPDB-52, CRPDB-125 | High |

## Questions

| Question | Outcome |
|----------|---------|
| What types of geometry (point, line, polygon) are appropriate for CRT projects? | Lines would be appropriate for the CRT project. |
| Is there a requirement to keep historical data, such as what electoral boundaries were in place at the time? | Yes |
| What is the relationship of Project Segments to Project? | One project may have a one or more lines representing it. |

## Feedback/Future Considerations

| # | Title | Description | Priority | Related JIRA Stories/Bugs | Created User Story | Comments |
|---|-------|-------------|----------|--------------------------|-------------------|----------|
| 1 | Set coordinates to lat then long - when dropping a pin on the map | By default the coordinates show up as longitude, latitude (X,Y), display them as latitude, longitude | Low | CRPDB-51 | CRPDB-194 | |
| 2 | Additional ratios | Business would like to be able to see additional ratio options - structures, district regions | Low | CRPDB-52 | CRPDB-109 | |

## User Interface

(See page for UI wireframe details)
