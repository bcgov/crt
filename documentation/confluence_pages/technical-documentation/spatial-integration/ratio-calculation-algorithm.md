---
source: [00 - Ratio Calculation Algorithm](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302804/00+-+Ratio+Calculation+Algorithm)
last_updated: 2026-05-08
---

# 00 - Ratio Calculation Algorithm

Assuming this is within a single project.

```
Sum the Total length of all segments = SumOfAllSegmentLengths

For each Boundary(i, where i=1..n)
  For each Segment(j where j=1..m)
    calculate the length of Segment(j) within Boundary(i)
    and add that length to the SumOfSegmentLengthsInBoundary(i)
  Ratio in Boundary(i) = SumOfSegmentLengthsInBoundary(i)/SumOfAllSegmentLengths
```

For any polygon of interest, the calculated ratio = SumOfSegmentLengthsInBoundary / SumOfAllSegmentLengths

Unfortunately, Microsoft's SQL Server has no function to return the length of a line segment, nor has it the ability to determine the length of a line within a polygon.

To work around that short-coming, MoTI's Oracle Spatial functions are exposed via MoTI's Spatial Service as described in the GeoServer Query (Post) section.

The GeoServer Query (Post) can return the length of a line segment as well as the length of a line within a given polygon.
